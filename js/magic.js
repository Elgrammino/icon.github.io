let magicHistory = "";
let magicHistoryBuffer = "";
let magicHistoryCurrent = "";
let isMagicHistoryEnabled = !!localStorage.getItem("isMagicHistoryEnabled");
let isMagicMemoryEnabled = !!localStorage.getItem("isMagicMemoryEnabled");
let magicToxicResult = isMagicMemoryEnabled ? localStorage.getItem("magicToxicResult") || "" : "";
let magicDDFResult = isMagicMemoryEnabled ? localStorage.getItem("magicDDFResult") || "" : "";
let isMagicDDFAuto = false;
let isMagicDDFManualTimeout = false;
let overlayDDFEl = document.getElementById("overlayDDF");

overlayDDFEl.onpointerdown = _ => {
    if (magicDDFResult) {
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
        switch (operation) {
            case "+":
                forceValue = (forceValueNumber - resultValue).toString();
                break;
            case "-":
                forceValue = (resultValue - forceValueNumber).toString();
                break;
            case "x":
                forceValue = (forceValueNumber / resultValue).toString();
                break;
            case "÷":
                forceValue = (resultValue / forceValueNumber).toString();
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
            // numerology
            let remainder = getVisibleValue().match(/\d/g).reduce((a, b) => a + Number(b), 0) % 9;
            target.innerHTML = "<sup>" + (remainder || 9) + "</sup>⁄<sub>" + (9 - remainder) + "</sub>";
            setTimeout(_ => target.innerText = "%", 1000);
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
            disableMagic();
        }
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