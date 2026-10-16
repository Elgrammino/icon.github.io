// Magic of the iOS 26 view: a copy of magic.js changed for this view.
// magic.js itself stays original, the classic view (old/) uses it
let magicHistory = "";
let magicHistoryBuffer = "";
let magicHistoryCurrent = "";
// the hidden history peek (long press on "=") is replaced by the visible history (clock key):
// its notifications are always off, a flag left on by the classic view is cleared
let isMagicHistoryEnabled = false;
localStorage.removeItem("isMagicHistoryEnabled");
let isMagicMemoryEnabled = !!localStorage.getItem("isMagicMemoryEnabled");
let magicToxicResult = isMagicMemoryEnabled ? localStorage.getItem("magicToxicResult") || "" : "";
let magicDDFResult = isMagicMemoryEnabled ? localStorage.getItem("magicDDFResult") || "" : "";
let isMagicDDFAuto = false;
let isMagicDDFManualTimeout = false;
// DDF stays armed through "=" until its digits are typed: the audience sees the sum first,
// then "+" and hold "0" add the forced number to it
let isMagicDDFUsed = false;
let overlayDDFEl = document.getElementById("overlayDDF");

overlayDDFEl.onpointerdown = _ => {
    if (magicDDFResult) {
        isMagicDDFUsed = true;
        if (!isMagicDDFAuto && !isMagicDDFManualTimeout) {
            isMagicDDFManualTimeout = true;
            setTimeout(_ => {
                feedback(true);
                showAlert(i18next.t("ddForceManualDisabled"), false);
                overlayDDFEl.classList.add("hidden");
                isMagicDDFAuto = true;
                isMagicDDFManualTimeout = false;
            }, 10000);
        }
        clearPushedOperation();
        resetEl.innerText = "C";
        isDigitsTyping = true;
        let forceValueNumber = Number(magicDDFResult);
        if (forceValueNumber >= 0 && forceValueNumber <= 9) {
            let forceTime = new Date(((new Date()).getTime() + 60000 * (forceValueNumber === 0 ? 1 : forceValueNumber)));
            magicDDFResult = forceTime.getDate().toLocaleString(navigator.language, { minimumIntegerDigits: 2 })
                + (forceTime.getMonth() + 1).toLocaleString(navigator.language, { minimumIntegerDigits: 2 })
                + forceTime.getHours().toLocaleString(navigator.language, { minimumIntegerDigits: 2 })
                + forceTime.getMinutes().toLocaleString(navigator.language, { minimumIntegerDigits: 2 });
            forceValueNumber = Number(magicDDFResult);
        }
        let forceValue;
        // × and ÷ go before + and −: with a mixed expression (a + b × ?) the number is counted
        // from the pending sum (calcSum) and term (calcTerm) of calculator.js
        let mixedValue = calcSum !== 0 && forceValueNumber !== calcSum
            ? roundValue(operation === "x" ? (forceValueNumber - calcSum) / calcTerm : calcTerm / (forceValueNumber - calcSum))
            : Number.NaN;
        let isMixed = (operation === "x" || operation === "÷") && Number.isFinite(mixedValue);
        switch (operation) {
            case "+":
                forceValue = (forceValueNumber - resultValue).toString();
                break;
            case "-":
                forceValue = (resultValue - forceValueNumber).toString();
                break;
            case "x":
                forceValue = isMixed ? mixedValue.toString() : (forceValueNumber / resultValue).toString();
                break;
            case "÷":
                forceValue = isMixed ? mixedValue.toString() : (resultValue / forceValueNumber).toString();
                break;
            default:
                forceValue = magicDDFResult;
                break;
        }
        if (forceValue !== magicDDFResult && !isNotificationPossible()) {
            inputValue = forceValue;
        } else if (inputValue !== forceValue) {
            let fakeTouchBtnId = null;
            if (forceValue.startsWith(inputValue)) {
                inputValue += forceValue[inputValue.length];
            } else {
                if (forceValue[0] === "-") {
                    if (inputValue[0] === forceValue[1]) {
                        inputValue = "-" + inputValue;
                        fakeTouchBtnId = "+-";
                    } else {
                        inputValue = forceValue[1];
                    }
                } else {
                    inputValue = forceValue[0];
                }
            }
            doFakeTouchButton(fakeTouchBtnId || inputValue[inputValue.length - 1]);
            if (isNotificationPossible()) {
                pushNotification("dd", forceValue.length - inputValue.length);
            }
        } else {
            return;
        }
        displayValue(inputValue);
        add2MagicHistory(inputValue);
        feedback();
    }
};
permissionRequestActions.push(_ => {
    // iOS 13+
    if (!window.DeviceOrientationEvent || !DeviceOrientationEvent.requestPermission || isDeviceOrientationGranted) {
        permissionRequestActions = [];
    } else if (magicDDFResult) {
        DeviceOrientationEvent.requestPermission();
    }
});
window.ondeviceorientation = (e) => {
    isDeviceOrientationGranted = e.alpha != null && e.beta != null && e.gamma != null;
    if (isDeviceOrientationGranted && magicDDFResult && isMagicDDFAuto) {
        if ((e.beta > 160 || e.beta < -160) && e.gamma > -15 && e.gamma < 15) {
            overlayDDFEl.classList.remove("hidden");
        } else {
            overlayDDFEl.classList.add("hidden");
        }
    }
};
setTimeout(_ => {
    if (isMagicMemoryEnabled) {
        if (magicToxicResult) {
            applyToxic(magicToxicResult);
        }
        if (magicDDFResult) {
            applyDDForce(magicDDFResult);
        }
    }
}, 1000);

function add2MagicHistory(value) {
    if (!isClientMode() && isRCEnabled()) {
        return;
    }
    if (isLE(value) && magicHistoryBuffer.length > 0) {
        magicHistory = getMagicHistory();
        magicHistoryBuffer = "";
        magicHistoryCurrent = "";
    } else if (isOperation(value) && isNumber(magicHistoryCurrent) || isNumber(value) && isOperation(magicHistoryCurrent)) {
        magicHistoryBuffer += getMagicHistoryCurrent();
        magicHistoryCurrent = value;
    } else if (!isLE(value) && magicHistoryCurrent !== value && (value === "0" && isDigitsTyping || value !== "0")) {
        magicHistoryCurrent = value;
    } else {
        return;
    }

    if (isMagicHistoryEnabled && isNotificationPossible()) {
        pushNotification("history", getMagicHistory());
    }
}

function getMagicHistoryCurrent() {
    return magicHistoryCurrent.startsWith("-") && magicHistoryCurrent.length > 1 ? "(" + magicHistoryCurrent + ")" : magicHistoryCurrent;
}

function getMagicHistory() {
    let currentHistory = magicHistoryBuffer + getMagicHistoryCurrent();
    return currentHistory + (currentHistory.length > 0 ? ";" : "") + (magicHistory.length > 0 && magicHistory !== "\n" ? "\n" + magicHistory : "");
}

function magic(target) {
    if (isClientMode() && target.id !== "c") {
        return;
    }
    switch (target.id) {
        case "c":
            // reload
            loadingEl.classList.remove("hidden");
            document.location.reload();
            break;
        case "+-":
            // remote control
            toggleRC();
            break;
        case "%":
            // numerology: top is the plain sum of the digits (12345678 → 45), bottom is 9 − (sum mod 9)
            let digitSum = getVisibleValue().match(/\d/g).reduce((a, b) => a + Number(b), 0);
            target.innerHTML = "<sup>" + digitSum + "</sup>⁄<sub>" + (9 - digitSum % 9) + "</sub>";
            setTimeout(_ => target.innerText = "%", 1000);
            break;
        case "x":
            applyBirthday();
            break;
        case "÷":
            applyNumberMemory();
            break;
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
            applyPreset(target.id);
            break;
        case "0":
            // display down force manually
            if (isRCEnabled()) {
                sendRCData({ type: "0" });
            } else {
                apply0();
            }
            break;
        case "-":
            // display down force
            disableMagic();
            if (isRCEnabled()) {
                sendRCData({ type: "-", payload: getVisibleValue() });
            } else {
                applyDDForce(getVisibleValue());
            }
            reset();
            break;
        case "+":
            // toxic
            disableMagic();
            if (isRCEnabled()) {
                sendRCData({ type: "+", payload: getVisibleValue() });
            } else {
                applyToxic(getVisibleValue());
            }
            reset();
            break;
        case ".":
            // memory
            if (isRCEnabled()) {
                sendRCData({ type: "." });
            } else {
                applyMemory();
            }
            break;
        case "=":
            // history
            if (isRCEnabled()) {
                sendRCData({ type: "=" });
            } else {
                if (isNotificationPossible()) {
                    applyHistory();
                } else {
                    showAlert(getMagicHistory());
                }
            }
            break;
    }
}

function onReceiveRCData(data) {
    switch (data.type) {
        case "0":
            apply0(data.payload);
            break;
        case "-":
            applyDDForce(data.payload);
            break;
        case "+":
            applyToxic(data.payload);
            break;
        case ".":
            applyMemory(data.payload);
            break;
        case "=":
            applyHistory(data.payload);
            break;
        default:
            pushNotification(data.type, data.payload);
            break;
    }
}

function apply0() {
    if (magicDDFResult) {
        restorePushedBtn();
        isMagicDDFAuto = false;
        overlayDDFEl.classList.remove("hidden");
        showAlert(i18next.t("ddForceManualIsEnabled"), false);
    }
}

function applyDDForce(value) {
    setMagicDDFResult(value);
    isMagicDDFAuto = true;
    isMagicDDFUsed = false;
    if (isDeviceOrientationGranted) {
        showAlert(i18next.t("ddForceIsEnabled"), false);
    } else {
        showAlert(i18next.t("orientationIsNotAvailable"));
    }
}

function applyToxic(value) {
    setMagicToxicResult(value);
    showAlert(i18next.t("toxicForceIsEnabled"), false);
}

function applyMemory() {
    restorePushedBtn();
    disableMagic();
    isMagicMemoryEnabled = !isMagicMemoryEnabled;
    isMagicMemoryEnabled ? localStorage.setItem("isMagicMemoryEnabled", true) : localStorage.removeItem("isMagicMemoryEnabled");
    showAlert(i18next.t(isMagicMemoryEnabled ? "magicMemoryIsEnabled" : "magicMemoryIsDisabled"));
}

function applyHistory() {
    isMagicHistoryEnabled = !isMagicHistoryEnabled;
    isMagicHistoryEnabled ? localStorage.setItem("isMagicHistoryEnabled", true) : localStorage.removeItem("isMagicHistoryEnabled");
    showAlert(i18next.t(isMagicHistoryEnabled ? "magicHistoryIsEnabled" : "magicHistoryIsDisabled"));
}

function applyPostMagic(targetId) {
    if (targetId === "=") {
        if (isClientMode() || !isRCEnabled()) {
            if (magicToxicResult) {
                resultValue = Number(magicToxicResult);
            }
        }
        if (!isMagicMemoryEnabled) {
            if (isMagicDDFUsed || !magicDDFResult) {
                disableMagic();
            } else {
                setMagicToxicResult("");
            }
        }
        isMagicDDFUsed = false;
    }
}

// one tap on the calculator key with a typed number = hold "−" and then hold "0":
// the number becomes the DD force, the screen goes back to 0 and the next touches type it digit by digit.
// Set up directly instead of applyDDForce(): its "no orientation access" pop-up is not needed in manual mode.
// A preset passes the value: the 2 s hold has already flashed the clock, so it does not flash a second time
function armDDFManual(value) {
    if (isClientMode() || value === undefined && !isDigitsTyping) {
        return;
    }
    let isPreset = value !== undefined;
    value = value ?? getVisibleValue();
    disableMagic();
    if (isRCEnabled()) {
        sendRCData({ type: "-", payload: value });
        sendRCData({ type: "0" });
    } else {
        setMagicDDFResult(value);
        isMagicDDFAuto = false;
        isMagicDDFManualTimeout = false;
        isMagicDDFUsed = false;
        overlayDDFEl.classList.remove("hidden");
    }
    reset();
    if (!isPreset) {
        feedback(true);
    }
}

function disableMagic() {
    setMagicDDFResult("");
    setMagicToxicResult("");
    isMagicDDFAuto = false;
}

function restorePushedBtn() {
    if (!isDigitsTyping && operation !== "=") {
        doFakeTouchButton(operation);
    }
}

function setMagicToxicResult(value) {
    magicToxicResult = value;
    if (isMagicMemoryEnabled) {
        localStorage.setItem("magicToxicResult", value);
    }
}

function setMagicDDFResult(value) {
    magicDDFResult = value;
    if (isMagicMemoryEnabled) {
        localStorage.setItem("magicDDFResult", value);
    }
}

// ---------- presets (settings page): a saved number on a digit key ----------
// holding the digit does what holding "+" (toxic), "−" (DDF) or a tap on the calculator key (DDF manual) does
// with a typed number, so the number does not have to be typed every time
function loadPresets() {
    try {
        let presets = JSON.parse(localStorage.getItem("presets"));
        return Array.isArray(presets) ? presets : [];
    } catch (e) {
        return [];
    }
}

function applyPreset(key) {
    let preset = loadPresets().find(p => p.key === key && /^\d+$/.test(p.value || ""));
    if (!preset) {
        return;
    }
    switch (preset.mode) {
        case "toxic":
            disableMagic();
            if (isRCEnabled()) {
                sendRCData({ type: "+", payload: preset.value });
            } else {
                applyToxic(preset.value);
            }
            reset();
            break;
        case "ddf":
            disableMagic();
            if (isRCEnabled()) {
                sendRCData({ type: "-", payload: preset.value });
            } else {
                applyDDForce(preset.value);
            }
            reset();
            break;
        case "ddfManual":
            armDDFManual(preset.value);
            break;
    }
}

// ---------- numbers typed by hand: birthday (hold ×) and number memory (hold ÷) ----------
// both are armed on a 0 screen, follow the numbers typed after that and survive a reload and a cleared history

function loadMagicState(key) {
    try {
        return JSON.parse(localStorage.getItem(key)) || null;
    } catch (e) {
        return null;
    }
}

function saveMagicState(key, state) {
    try {
        state ? localStorage.setItem(key, JSON.stringify(state)) : localStorage.removeItem(key);
    } catch (e) { }
}

function isZeroScreen() {
    return !isOperationPending() && displayEl.innerText === formatValue("0");
}

// calculator.js: a typed number is finished (an operation or "=" follows it)
function noteTypedNumber(value) {
    let memory = loadMagicState("magicNumberMemory");
    if (memory && memory.value === undefined) {
        memory.count++;
        if (memory.count === getNumberMemoryIndex()) {
            memory.value = value;
        }
        saveMagicState("magicNumberMemory", memory);
    }
    let birthday = loadMagicState("magicBirthday");
    if (birthday && !birthday.date) {
        birthday.numbers.push(value);
        saveMagicState("magicBirthday", birthday);
    }
}

// calculator.js: "=" pressed; the first three numbers of the example are DD + MM + YYYY
function noteEquals() {
    let birthday = loadMagicState("magicBirthday");
    if (birthday && !birthday.date) {
        let [day, month, year] = birthday.numbers.map(Number);
        if (birthday.numbers.length >= 3 && isValidDate(day, month, year)) {
            birthday.date = [day, month, year];
        }
        birthday.numbers = [];
        saveMagicState("magicBirthday", birthday);
    }
}

function isValidDate(day, month, year) {
    return [day, month, year].every(Number.isInteger) && year >= 1900 && year <= new Date().getFullYear()
        && month >= 1 && month <= 12 && day >= 1 && day <= new Date(year, month, 0).getDate();
}

// on a 0 screen: arm; once the date is typed: show "Libra · 45 · Sun" instead of the example for 3.5 s and switch off
function applyBirthday() {
    let birthday = loadMagicState("magicBirthday");
    if (!birthday) {
        if (isZeroScreen()) {
            saveMagicState("magicBirthday", { numbers: [] });
        }
    } else if (birthday.date) {
        saveMagicState("magicBirthday", null);
        peekText(expressionEl, getBirthdayInfo(...birthday.date));
    }
}

function getBirthdayInfo(day, month, year) {
    // tropical zodiac: the sign starts on this day of the month (Capricorn from Dec 22 again)
    const starts = [20, 19, 21, 20, 21, 21, 23, 23, 23, 23, 22, 22];
    let sign = day >= starts[month - 1] ? month : month - 1;
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    // Feb 29 in a common year falls on Mar 1
    let next = new Date(today.getFullYear(), month - 1, day);
    if (next < today) {
        next = new Date(today.getFullYear() + 1, month - 1, day);
    }
    let days = Math.round((next - today) / 86400000);
    let weekday = new Date(year, month - 1, day).toLocaleDateString(i18next.language, { weekday: "short" }).replace(".", "");
    weekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);
    return i18next.t("zodiac", { returnObjects: true })[sign % 12] + " · " + days + " · " + weekday;
}

function getNumberMemoryIndex() {
    let index = Number(localStorage.getItem("numberMemoryIndex"));
    return index >= 1 && index <= 9 ? index : 3;
}

// on a 0 screen: arm; once the N-th typed number is known: show it instead of 0 for 3.5 s,
// add it to the history and switch off. Earlier holds do nothing, it keeps waiting
function applyNumberMemory() {
    let memory = loadMagicState("magicNumberMemory");
    if (!memory) {
        if (isZeroScreen()) {
            saveMagicState("magicNumberMemory", { count: 0 });
        }
        return;
    }
    let value = memory.value;
    // the N-th number is still being typed
    if (value === undefined && isDigitsTyping && memory.count + 1 === getNumberMemoryIndex()) {
        value = inputValue;
    }
    if (value !== undefined) {
        saveMagicState("magicNumberMemory", null);
        let entries = loadHistory();
        entries.unshift({ t: Date.now(), e: "", r: value });
        saveHistory(entries);
        peekText(displayEl, formatValue(value), "displayS1");
        for (let size = 2; size <= 12 && displayEl.scrollWidth > displayEl.clientWidth; size++) {
            displayEl.className = "displayS" + size;
        }
    }
}

// shows text in place for 3.5 s, then puts back what was there unless a key changed it meanwhile
let peeks = new Map();

function peekText(el, text, className) {
    let peek = peeks.get(el);
    if (peek) {
        clearTimeout(peek.timer);
    } else {
        peek = { text: el.innerText, className: el.className };
        peeks.set(el, peek);
    }
    el.innerText = text;
    el.className = className || "";
    let shown = el.innerText;
    peek.timer = setTimeout(_ => {
        peeks.delete(el);
        if (el.innerText === shown) {
            el.innerText = peek.text;
            el.className = peek.className;
        }
    }, 3500);
}
