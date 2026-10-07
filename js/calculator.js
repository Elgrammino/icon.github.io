// TEST: redirect to the original site is off. Uncomment these 3 lines before publishing on michaelstark.github.io
// if (window.location.origin !== "https://michaelstark.github.io") {
//     window.location.replace("https://michaelstark.github.io/calculator/");
// }
// home screen app: 100% height is short by the status bar, use the whole screen
if (navigator.standalone) {
    document.documentElement.style.setProperty("--app-height", screen.height + "px");
}
let swr;
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").then(registration => { // enable PWA, works offline
        registration.addEventListener("updatefound", _ => {
            const worker = registration.installing;
            worker?.addEventListener("statechange", _ => {
                if (worker.state === "installed" && navigator.serviceWorker.controller && confirm(i18next.t("updateAvailable"))) {
                    window.location.reload();
                }
            });
        });
    });
    navigator.serviceWorker.ready.then(registration => swr = registration);
}
window.ontouchend = _ => false; // disable long press vibration ! do not disable context menu
document.getElementById(".").innerText = .1.toLocaleString().slice(1, 2); // set dot depend on locale

// i18n
i18next.use(i18nextBrowserLanguageDetector).init(i18n);

// permissions
let isNotificationGranted = window.Notification && Notification.permission === "granted";
let isDeviceOrientationGranted = false;

// notification
if (navigator.permissions) {
    navigator.permissions.query({ name: "notifications" }).then(status => status.onchange = _ => isNotificationGranted = window.Notification && Notification.permission === "granted");
}

// requests
let permissionRequestActions = [];
window.onpointerup = e => {
    if (window.Notification && Notification.permission === "default") {
        Notification.requestPermission();
    }
    permissionRequestActions.forEach(action => {
        action(e);
    });
};

// client/host mode detection
const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});
const hostPeerId = params.hostPeerId || localStorage.getItem("hostPeerId");
if (isClientMode()) {
    localStorage.setItem("hostPeerId", hostPeerId);
}

// version
const currentVersion = localStorage.getItem("currentVersion");
if (!currentVersion || currentVersion !== version) {
    if (!isClientMode() && !!currentVersion) {
        alert(i18next.t("newVersionAvailable") + currentVersion);
    }
    localStorage.setItem("currentVersion", version);
}

// vars & consts
const formatter = new Intl.NumberFormat(navigator.language, { maximumFractionDigits: 20 });
const loadingEl = document.getElementById("loading");
const calcEl = document.getElementById("calc");
const displayEl = document.getElementById("display");
const resetEl = document.getElementById("c");
const buttonElList = document.getElementsByClassName("button");
const digitElList = document.getElementsByClassName("digit");
const operationElList = document.getElementsByClassName("operation");
let pushedBtnsCount = 0;
let longPressTarget;
let longPressTimer;
let resultValue = 0;
let inputValue = "0";
let operation = "";
let isDigitsTyping = false;
let alertBuffer = "";

// iOS 26 look: expression line and decorative keys
const expressionEl = document.getElementById("expression");
const operationSymbols = { "+": "+", "-": "−", "x": "×", "÷": "÷" };
let expressionText = "";
let calcSum = 0;
let calcTerm = 0;
let lastOperand = 0;
let repeatOperation = "";
let repeatOperand = 0;
let undoState = null;

displayEl.addEventListener("pointerdown", startBtnHandler);
displayEl.addEventListener("pointerup", endBtnHandler);
displayEl.addEventListener("pointercancel", cancelBtnHandler);
for (el of buttonElList) {
    el.addEventListener("pointerdown", startBtnHandler);
    el.addEventListener("pointerup", endBtnHandler);
    el.addEventListener("pointercancel", cancelBtnHandler);
}

// keys without function: only the glass press animation
for (el of [document.getElementById("historyKey"), document.getElementById("modeKey")]) {
    el.addEventListener("pointerdown", e => {
        e.currentTarget.classList.remove("pushOff");
        e.currentTarget.classList.add("pushDigit");
        e.currentTarget.setPointerCapture(e.pointerId);
    });
    for (type of ["pointerup", "pointercancel"]) {
        el.addEventListener(type, e => {
            e.currentTarget.classList.remove("pushDigit");
            e.currentTarget.classList.add("pushOff");
            if (e.type === "pointerup") {
                feedback();
            }
        });
    }
}

// DDF with a mixed expression (a + b × ?): magic.js counts left to right, so for the duration
// of its tap the pending part is shown to it as "+" with a left value giving the same final result
let ddfPendingOperation = null;
window.addEventListener("pointerdown", e => {
    if (e.target.id !== "overlayDDF" || !magicDDFResult || !(operation === "x" || operation === "÷") || calcSum === 0) {
        return;
    }
    convertDDFTimeForce();
    let force = Number(magicDDFResult);
    if (!Number.isFinite(force) || force === calcSum) {
        return;
    }
    let operand = roundValue(operation === "x" ? (force - calcSum) / calcTerm : calcTerm / (force - calcSum));
    if (!Number.isFinite(operand)) {
        return;
    }
    ddfPendingOperation = operation;
    operation = "+";
    resultValue = force - operand;
}, true);
window.addEventListener("pointerdown", _ => {
    if (ddfPendingOperation) {
        operation = ddfPendingOperation;
        ddfPendingOperation = null;
        syncResultValue();
    }
});

// same conversion magic.js does on the first tap: force 0..9 means date and time in N minutes
function convertDDFTimeForce() {
    let forceValueNumber = Number(magicDDFResult);
    if (forceValueNumber >= 0 && forceValueNumber <= 9) {
        let forceTime = new Date(((new Date()).getTime() + 60000 * (forceValueNumber === 0 ? 1 : forceValueNumber)));
        magicDDFResult = forceTime.getDate().toLocaleString(navigator.language, { minimumIntegerDigits: 2 })
            + (forceTime.getMonth() + 1).toLocaleString(navigator.language, { minimumIntegerDigits: 2 })
            + forceTime.getHours().toLocaleString(navigator.language, { minimumIntegerDigits: 2 })
            + forceTime.getMinutes().toLocaleString(navigator.language, { minimumIntegerDigits: 2 });
    }
}

// AC/C state lives in the text of the key (used by the scripts); after "=" iOS shows "AC"
new MutationObserver(updateResetKey).observe(resetEl, { childList: true, characterData: true, subtree: true });

function updateResetKey() {
    resetEl.classList.toggle("showAC", resetEl.innerText === "C" && operation === "=");
}

function isClientMode() {
    return !!hostPeerId;
}

function isNotificationPossible() {
    return isNotificationGranted && swr || isClientMode();
}

function pushNotification(tag, msg) {
    if (isClientMode()) {
        sendRCData({ type: tag, payload: msg });
    } else if (isNotificationGranted && swr) {
        swr.getNotifications({ tag }).then((notifications) => {
            notifications.forEach(notification => notification.close());
            swr.showNotification(i18next.t(tag), {
                tag, //not working on iOS
                icon: "./images/icon-512.png",
                body: msg,
                silent: true
            });
        });
    }
}

function showAlert(text, isImportant = true) {
    alertBuffer = "• " + text + "\n" + alertBuffer;
    if (isClientMode()) {
        sendRCData({ type: "alert", payload: alertBuffer });
    } else {
        if (isNotificationPossible()) {
            pushNotification("alert", alertBuffer);
        } else if (isImportant) {
            alert(text);
        }
    }
}

function feedback(isMagic) {
    if (isMagic && !isClientMode()) {
        let isRemoveNeeded = true;
        if (isMagic === true) {
            isMagic = "magicAlarm";
        } else if (isRCEnabled()) {
            document.body.className = "";
            isRemoveNeeded = false;
        }
        document.body.classList.add(isMagic);
        if (isRemoveNeeded) {
            setTimeout(_ => document.body.classList.remove(isMagic), 200);
        }
    }
    if (navigator.vibrate) {
        if (isMagic) {
            if (!isClientMode()) {
                navigator.vibrate(200);
            }
        } else {
            navigator.vibrate(1);
        }
    }
}

function doFakeTouchButton(id) {
    if (!!id && id !== "") {
        clearPushedOperation();
        let target = document.getElementById(id);
        target.classList.remove("pushOff");
        target.classList.add(getPushClass(target.classList));
        if (target.classList.contains("operation") && target.id !== "=") {
            target.classList.add("pushedOperation");
        }
        setTimeout(_ => {
            target.classList.remove(getPushClass(target.classList));
            target.classList.add("pushOff");
        }, 100);
    }
}

function getPushClass(classList) {
    if (classList.contains("digit")) {
        return "pushDigit";
    } else if (classList.contains("operation")) {
        return "pushOperation";
    } else {
        return "pushUtil";
    }
}

function clearPushedOperation() {
    for (el of operationElList) {
        el.classList.remove("pushedOperation");
    }
}

function startBtnHandler(e) {
    pushedBtnsCount++;
    let target = e.target.closest("div");
    if (target !== displayEl) {
        target.classList.remove("pushOff");
        clearPushedOperation();
        target.classList.add(getPushClass(target.classList));
    }
    target.setPointerCapture(e.pointerId); // fix for mouse leave
    if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
        longPressTarget = null;
    }
    if (pushedBtnsCount === 1) {
        longPressTimer = setTimeout(_ => {
            feedback(true);
            longPressTarget = target;
        }, 2000);
    }
}

function endBtnHandler(e) {
    cancelBtnHandler(e);
    let target = e.target.closest("div");
    if (longPressTarget === target) {
        longPressTarget = null;
        target.classList.remove("pushedOperation");
        if (target === displayEl && !isClientMode()) {
            window.location.assign("./readme.html");
        } else {
            magic(target);
        }
    } else {
        feedback();
        btnHandler(target);
    }
}

function cancelBtnHandler(e) {
    pushedBtnsCount--;
    let target = e.target.closest("div");
    if (target !== displayEl) {
        target.classList.remove(getPushClass(target.classList));
        clearPushedOperation();
        target.classList.add("pushOff");
        if (target.classList.contains("operation") && target.id !== "=") {
            target.classList.add("pushedOperation");
        }
    }
    if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
    }
}

function btnHandler(target) {
    if (target === displayEl) {
        deleteLastDigit();
    } else if (digitElList.namedItem(target.id)) {
        // max 13 digits and only one decimal dot and do not edit exponential notation
        if (inputValue.replace(/\D/g, "").length < 13 && !inputValue.includes("e") && (target.id !== "." || !inputValue.includes("."))) {
            // prevent containing just zeros or starts with zero
            if (inputValue === "0" && target.id !== ".") {
                inputValue = "";
            }
            resetEl.innerText = "C";
            isDigitsTyping = true;
            inputValue += target.id;
            displayValue(inputValue);
            if (operation === "=") {
                add2MagicHistory("\n");
                operation = "";
                setExpressionLine("");
            }
            add2MagicHistory(inputValue);
        }
    } else {
        switch (target.id) {
            case "c":
                if (target.innerText === "AC" || operation === "=") {
                    reset();
                } else {
                    // C: clear the current number, the expression stays
                    resetEl.innerText = "AC";
                    inputValue = "0";
                    if (!isDigitsTyping && operation !== "=") {
                        doFakeTouchButton(operation);
                    }
                    if (isDigitsTyping) {
                        add2MagicHistory(inputValue);
                    }
                    if (isOperationPending()) {
                        isDigitsTyping = false;
                    }
                    displayValue(inputValue);
                }
                break;
            case "del":
                if (operation === "=" && !isDigitsTyping) {
                    break;
                }
                if (isDigitsTyping) {
                    // iOS 26 ⌫: delete last digit
                    deleteLastDigit();
                    if (inputValue === "0") {
                        if (operation === "") {
                            resetEl.innerText = "AC";
                        } else {
                            isDigitsTyping = false;
                            displayValue(inputValue);
                        }
                    }
                } else if (isOperationPending() && undoState) {
                    // iOS 26 ⌫ right after an operator: remove the operator, the number becomes editable again
                    ({ calcSum, calcTerm, operation, expressionText } = undoState);
                    undoState = null;
                    if (operation === "=") {
                        operation = "";
                    }
                    inputValue = lastOperand.toString();
                    isDigitsTyping = true;
                    syncResultValue();
                    resetEl.innerText = "C";
                    displayValue(inputValue);
                    add2MagicHistory(inputValue);
                }
                break;
            case "%":
                takeResultAsInput();
                if (inputValue.length && inputValue !== "0" && !inputValue.includes("e")) {
                    let percent = Number(inputValue) / 100;
                    if (operation === "+" || operation === "-") {
                        percent = resultValue * percent;
                    }
                    inputValue = Number(percent.toFixed(12)).toString();
                    displayValue(inputValue);
                    add2MagicHistory(inputValue);
                }
                break;
            case "+-":
                takeResultAsInput();
                if (Number(inputValue) !== 0) {
                    if (Number(inputValue) > 0) {
                        inputValue = "-" + inputValue;
                    } else {
                        inputValue = inputValue.slice(1);
                    }
                    displayValue(inputValue);
                    add2MagicHistory(inputValue);
                }
                break;
            default:
                if (operation === "" || isDigitsTyping || target.id !== "=" || operation !== "=") {
                    add2MagicHistory(target.id);
                }
                let expressionLine = target.id === "=" ? calculateEquals() : calculateOperation(target.id);
                let calculatedValue = resultValue;
                applyPostMagic(target.id);
                if (target.id === "=") {
                    add2MagicHistory(resultValue.toString());
                    if (!Object.is(calculatedValue, resultValue)) {
                        // forced result: continue from it, the line above shows it as a typed number
                        calcSum = resultValue;
                        expressionLine = formatOperand(resultValue.toString());
                    }
                    if (expressionLine !== null) {
                        setExpressionLine(expressionLine);
                    }
                } else {
                    setExpressionLine("");
                }
                resetEl.innerText = "C";
                isDigitsTyping = false;
                inputValue = "0";
                operation = target.id;
                displayValue(resultValue.toString());
                break;
        }
    }
}

// ---------- iOS calculation: × and ÷ before + and − ----------
// state: calcSum + calcTerm ⊙ (next number); resultValue is what magic reads:
// the left value for + and −, the pending term for × and ÷

function roundValue(value) {
    value = Number(value.toFixed(12));
    return Math.abs(value) > Number.MAX_SAFE_INTEGER ? Number.NaN : value;
}

function applyOperand(value, nextOperation) {
    let term;
    switch (operation) {
        case "+":
            term = value;
            break;
        case "-":
            term = -value;
            break;
        case "x":
            term = calcTerm * value;
            break;
        case "÷":
            term = calcTerm / value;
            break;
        default:
            calcSum = 0;
            term = value;
            break;
    }
    term = roundValue(term);
    if (nextOperation === "x" || nextOperation === "÷") {
        calcTerm = term;
    } else {
        calcSum = roundValue(calcSum + term);
    }
}

function syncResultValue() {
    resultValue = operation === "x" || operation === "÷" ? calcTerm : calcSum;
}

// returns the line shown above the result, null keeps the current one
function calculateEquals() {
    let line = null;
    if (isOperationPending()) {
        let operandText = isDigitsTyping ? inputValue : lastOperand.toString();
        let value = Number(operandText);
        line = expressionText + formatOperand(operandText);
        repeatOperation = operation;
        repeatOperand = value;
        lastOperand = value;
        applyOperand(value, "=");
    } else if (isDigitsTyping || operation === "") {
        calcSum = roundValue(Number(inputValue));
        lastOperand = calcSum;
        line = formatOperand(inputValue);
    } else if (repeatOperation) {
        // repeated "=" repeats the last operation
        line = formatOperand(calcSum.toString()) + operationSymbols[repeatOperation] + formatOperand(repeatOperand.toString());
        switch (repeatOperation) {
            case "+":
                calcSum = calcSum + repeatOperand;
                break;
            case "-":
                calcSum = calcSum - repeatOperand;
                break;
            case "x":
                calcSum = calcSum * repeatOperand;
                break;
            case "÷":
                calcSum = calcSum / repeatOperand;
                break;
        }
        calcSum = roundValue(calcSum);
    }
    undoState = null;
    resultValue = calcSum;
    return line;
}

function calculateOperation(nextOperation) {
    if (isOperationPending() && !isDigitsTyping) {
        // operator changed: replay the last number with the new operator
        if (undoState) {
            ({ calcSum, calcTerm, operation, expressionText } = undoState);
            applyOperand(lastOperand, nextOperation);
            expressionText += formatOperand(lastOperand.toString());
        } else {
            expressionText = expressionText.slice(0, -1);
        }
        expressionText += operationSymbols[nextOperation];
    } else {
        let isStart = !isOperationPending();
        // DDF armed and "+" on an untouched 0: no "0+" on screen, forced digits look freshly typed
        let isSilentStart = !!magicDDFResult && nextOperation === "+" && operation === "" && !isDigitsTyping && inputValue === "0";
        let operandText = isDigitsTyping || operation === "" ? inputValue : calcSum.toString();
        let value = Number(operandText);
        undoState = { calcSum, calcTerm, operation, expressionText: isStart ? "" : expressionText };
        applyOperand(value, nextOperation);
        lastOperand = value;
        expressionText = isSilentStart ? ""
            : (isStart ? "" : expressionText) + formatOperand(operandText) + operationSymbols[nextOperation];
    }
    let pendingOperation = operation;
    operation = nextOperation;
    syncResultValue();
    operation = pendingOperation;
    return null;
}

// iOS: ± and % also work on the result after "="
function takeResultAsInput() {
    if (operation === "=" && !isDigitsTyping && Number.isFinite(resultValue)) {
        inputValue = resultValue.toString();
        isDigitsTyping = true;
        operation = "";
        resetEl.innerText = "C";
    }
}

function isNumber(value) {
    return value.length > 0 && value !== "+" && value !== "-" && value !== "x" && value !== "÷" && value !== "=" && !isLE(value);
}

function isOperation(value) {
    return value === "+" || value === "-" || value === "x" || value === "÷" || value === "=";
}

function isLE(value) {
    return value === "\n";
}

function formatValue(value, showAsIs = false) {
    // fix formatter if last symbol is 0 or .
    let isNeedZeroFormatFix = value.includes(".") && (value[value.length - 1] === "0" || value[value.length - 1] === ".");
    if (isNeedZeroFormatFix) {
        value += "1";
    }
    if (value === "NaN" || value.includes("Infinity")) {
        return i18next.t("error");
    }
    let text = showAsIs || value.includes("e") ? value : formatter.format(value);
    return isNeedZeroFormatFix ? text.slice(0, -1) : text;
}

function formatOperand(value) {
    let text = formatValue(value);
    return text.startsWith("-") ? "(" + text + ")" : text;
}

function isOperationPending() {
    return operation !== "" && operation !== "=";
}

function deleteLastDigit() {
    // do not remove last zero or if exponential notation
    if (inputValue.length && inputValue !== "0" && !inputValue.includes("e")) {
        inputValue = inputValue.slice(0, -1);
        // remove negative sign if value is 0
        if (inputValue.startsWith("-") && Number(inputValue) === 0) {
            inputValue = inputValue.slice(1);
        }
        // set value to 0 if removed last digit
        if (!inputValue.length || inputValue === "-") {
            inputValue = "0";
        }
        displayValue(inputValue);
        add2MagicHistory(inputValue);
    }
}

function displayValue(value, showAsIs = false) {
    if (isOperationPending()) {
        // iOS: the expression keeps full size, its start is cut off with a fade
        displayEl.innerText = expressionText + (isDigitsTyping ? formatOperand(value) : "") || "0";
        displayEl.className = "displayS1";
        displayEl.classList.toggle("clipped", isTextOverflowing(displayEl));
        return;
    }
    displayEl.innerText = formatValue(value, showAsIs);
    // calculate font
    let sizeIndex = 1;
    do {
        displayEl.className = "displayS" + sizeIndex;
    } while (sizeIndex++ < 12 && displayEl.scrollWidth > displayEl.clientWidth);
}

function setExpressionLine(text) {
    expressionEl.innerText = text;
    expressionEl.classList.remove("clipped");
    expressionEl.classList.toggle("clipped", isTextOverflowing(expressionEl));
}

function isTextOverflowing(el) {
    let range = document.createRange();
    range.selectNodeContents(el);
    return range.getBoundingClientRect().width > el.clientWidth + 1;
}

function getVisibleValue() {
    return isDigitsTyping ? inputValue : resetEl.innerText === "AC" ? inputValue : resultValue.toString();
}

function reset() {
    resetEl.innerText = "AC";
    resultValue = 0;
    inputValue = "0";
    operation = "";
    isDigitsTyping = false;
    expressionText = "";
    setExpressionLine("");
    calcSum = 0;
    calcTerm = 0;
    lastOperand = 0;
    repeatOperation = "";
    repeatOperand = 0;
    undoState = null;
    displayValue(inputValue);
    add2MagicHistory(inputValue);
    add2MagicHistory("\n");
}