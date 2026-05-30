// --- 1. HÁLÓZATI ÉS LOBBY LOGIKA ---

peer = new Peer();

peer.on('open', (id) => {
    const titleEl = document.querySelector('.lobby-box h2');
    if (titleEl) {
        titleEl.innerText = 
`█▄▀ █ █ █ █▀▀ █▀█  █░░ ▄▀█ █▄▀ █▀▀
█░█ █ █▄▄ █▄▄ █▄▄ █▀▄  █▄▄ █▀█ █░█ █▄▄`;
    }

    // Automatikus csatlakozás ha van link
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('join')) {
        const targetId = urlParams.get('join');
            document.getElementById('connection-status').innerText = "Kapcsolódás a barátodhoz...";
            conn = peer.connect(targetId);
            myRole = 'p2'; 
            isPvEMode = false;
            isTestMode = false;
            setupConnection();
    }
});

peer.on('connection', (connection) => {
    if (conn) return;
    conn = connection;
    myRole = 'p1'; 
    isPvEMode = false;
    isTestMode = false;
    setupConnection();
});

function getRandomTeam() {
    let team = [];
    const charCards = cardDatabase.filter(c => !c.type || c.type === 'character');
    let available = [...charCards];
    for (let i = 0; i < 5; i++) {
        if (available.length === 0) break;
        const randIdx = Math.floor(Math.random() * available.length);
        team.push(available[randIdx].id);
        available.splice(randIdx, 1);
    }
    return team;
}

function getRandomItems() {
    let items = [];
    const itemCards = cardDatabase.filter(c => c.type === 'item' || c.type === 'supporter');
    let available = [...itemCards];
    if (available.length > 0) {
        for (let i = 0; i < 3; i++) {
            if (available.length === 0) break;
            const randIdx = Math.floor(Math.random() * available.length);
            items.push(available[randIdx].id);
            available.splice(randIdx, 1);
        }
    }
    return items;
}

function setupConnection() {
    const startSession = () => {
        if (myRole === 'p1') {
            // A Host generál két teljesen különálló ID listát
            const p1TeamIds = getRandomTeam();
            const p2TeamIds = getRandomTeam();
            const p1ItemIds = getRandomItems();
            const p2ItemIds = getRandomItems();
            
            conn.send({ type: 'INIT', p1TeamIds: p1TeamIds, p2TeamIds: p2TeamIds, p1ItemIds: p1ItemIds, p2ItemIds: p2ItemIds });
            setupDraft(p1TeamIds, p1ItemIds); 
        } else {
            document.getElementById('connection-status').innerText = "Várakozás a kártyákra...";
        }
    };

    if (conn.open) {
        startSession();
    } else {
        conn.on('open', startSession);
    }

    conn.on('data', (data) => {
        if (data.type === 'INIT') {
            setupDraft(data.p2TeamIds, data.p2ItemIds);
        } else if (data.type === 'READY') {
            oppIsReady = true;
            oppDraftTeam = data.team;
            oppItemIds = data.items;
            oppNickname = data.name || (myRole === 'p1' ? "Játékos 2" : "Játékos 1");
            checkStartGame();
        } else if (data.type === 'MOVE') {
            receiveMove(data);
        } else if (data.type === 'USE_ITEM') {
            const oppId = myRole === 'p1' ? 'p2' : 'p1';
            applyItem(oppId, data);
        } else if (data.type === 'REMATCH_OFFER') {
            logMessage("Az ellenfél visszavágót kér!", "log-system");
            const btn = document.getElementById('rematch-btn');
            if (btn) btn.innerText = "Visszavágó elfogadása";
        }
    });

    conn.on('close', () => {
        alert("Az ellenfél lecsatlakozott.");
        location.reload();
    });
}
