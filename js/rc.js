const currentPeerId = localStorage.getItem("currentPeerId") || crypto.randomUUID();
let currentPeer = null;
let connection = null;
if (isClientMode()) {
    createPeer();
    setInterval(_ => {
        if (isClientMode() && isRCEnabled() && !isRCConnectionOpen()) {
            createConnection();
        }
    }, 1000);
}

function toggleRC() {
    if (isRCEnabled()) {
        offRC();
    } else {
        createPeer();
    }
}

function offRC() {
    feedback("rcLoose");
    loadingEl.classList.remove("hidden");
    document.location.reload();
}

function isRCConnectionOpen() {
    return !!connection && connection.open;
}

function isRCEnabled() {
    return currentPeer?.open;
}

function createPeer() {
    if (!isClientMode()) {
        loadingEl.classList.remove("hidden");
    }
    let timeoutId = setTimeout(_ => {
        if (!isRCEnabled()) {
            offRC();
        }
    }, 5000);
    if (currentPeer) {
        currentPeer.destroy();
    }
    currentPeer = new Peer(currentPeerId, {
        config: {
            'iceServers': [
                { url: 'stun:stun.l.google.com:19302' },
                {
                    url: 'turn:turn.bistri.com:80',
                    credential: 'homeo',
                    username: 'homeo'
                },
            ],
            'sdpSemantics': 'unified-plan'
        }
    });
    currentPeer.on("open", _ => {
        clearTimeout(timeoutId);
        feedback("rcWait");
        disableMagic();
        reset();
        localStorage.setItem("currentPeerId", currentPeerId);
        loadingEl.classList.add("hidden");
    });
    currentPeer.on("close", _ => {
        clearTimeout(timeoutId);
        if (isClientMode()) {
            createPeer();
        } else {
            offRC();
        }
    });
    currentPeer.on("error", err => console.error(err));
    currentPeer.on("disconnected", _ => currentPeer.reconnect());
    currentPeer.on("connection", createConnection);
}

function createConnection(newConnection) {
    connection?.close();
    connection = newConnection || currentPeer.connect(hostPeerId);
    connection.on('open', _ => feedback("rcReady"));
    connection.on('close', _ => feedback("rcWait"));
    connection.on('error', err => console.error(err));
    connection.on('data', onReceiveRCData);
}

function sendRCData(data) {
    if (isRCConnectionOpen()) {
        connection.send(data);
    }
}