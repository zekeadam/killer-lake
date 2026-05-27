let peer;
let conn;
let myRole = null; // 'p1' (Host) vagy 'p2' (Guest)
let gameState;

// --- 1. HÁLÓZATI ÉS LOBBY LOGIKA ---

// Inicializálás a PeerJS ingyenes signaling szerverével
peer = new Peer();

peer.on('open', (id) => {
    document.getElementById('my-peer-id').innerText = id;
    document.getElementById('connection-status').innerText = "Várakozás az ellenfélre...";
});

// Amikor a Hosthoz csatlakozik valaki
peer.on('connection', (connection) => {
    if (conn) return; // Csak egy ellenfelet fogadunk be
    conn = connection;
    myRole = 'p1'; // A Host mindig az 1. Játékos (Lángoló Tok)
    setupConnection();
});

// Amikor a Guest kezdeményezi a csatlakozást
function connectToPeer() {
    const targetId = document.getElementById('opponent-id-input').value.trim();
    if (!targetId) {
        alert("Kérlek, írj be egy érvényes kódot!");
        return;
    }
    
    document.getElementById('connection-status').innerText = "Kapcsolódás...";
    conn = peer.connect(targetId);
    myRole = 'p2'; // A csatlakozó mindig a 2. Játékos (Chin-Gaze)
    setupConnection();
}

// Közös hálózati eseménykezelők beállítása
function setupConnection() {
    conn.on('open', () => {
        document.getElementById('lobby-screen').style.display = 'none';
        document.getElementById('game-screen').style.display = 'block';
        initGame();
    });

    conn.on('data', (data) => {
        if (data.type === 'MOVE') {
            receiveMove(data);
        }
    });

    conn.on('close', () => {
        alert("Az ellenfél lecsatlakozott.");
        location.reload();
    });
}

// --- 2. JÁTÉK MOTOR ÉS LOGIKA ---

function initGame() {
    gameState = {
        activePlayer: 'p1',
        gameOver: false,
        p1: {
            name: "Lángoló Tok", maxHp: 350, hp: 350, ap: 2,
            isParalyzed: false, burnTurns: 0, hasShield: false,
            attacks: [
                { name: "Dühös Lángcsapás", type: "dmg", dmg: 40, cost: 1 },
                { name: "Plazma-Orkán", type: "dmg", dmg: 100, cost: 3 },
                { name: "Lángpajzs", type: "shield", cost: 1 },
                { name: "Perzselő Tekintet", type: "dmg", dmg: 20, cost: 2, effect: "burn" }
            ]
        },
        p2: {
            name: "Chin-Gaze", maxHp: 350, hp: 350, ap: 2,
            isParalyzed: false, burnTurns: 0, hasShield: false,
            attacks: [
                { name: "Kozmikus Sugár", type: "dmg", dmg: 45, cost: 1 },
                { name: "Duzzogó Arc-ütés", type: "dmg", dmg: 30, cost: 2, effect: "paralyze" },
                { name: "Pszicho-Menedék", type: "heal", healAmount: 80, cost: 2 },
                { name: "Kozmikus Pajzs", type: "shield", cost: 1 }
            ]
        }
    };
    
    document.getElementById('log').innerHTML = "";
    logMessage("A hálózati harc elkezdődött! 1. Játékos kezd.");
    updateUI();
}

function logMessage(msg) {
    const logDiv = document.getElementById('log');
    logDiv.innerHTML += `<div class="log-entry">${msg}</div>`;
    logDiv.scrollTop = logDiv.scrollHeight;
}

function triggerAnimation(elementId, animClass, duration) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.classList.remove(animClass); 
    void el.offsetWidth; 
    el.classList.add(animClass);
    setTimeout(() => { el.classList.remove(animClass); }, duration);
}

function updateUI() {
    ['p1', 'p2'].forEach(player => {
        const p = gameState[player];
        const cardElem = document.getElementById(`${player}-card`);
        
        document.getElementById(`${player}-hp`).innerText = Math.max(0, p.hp);
        document.getElementById(`${player}-ap`).innerText = p.ap;
        
        const pct = Math.max(0, (p.hp / p.maxHp) * 100);
        document.getElementById(`${player}-hp-fill`).style.width = `${pct}%`;

        document.getElementById(`${player}-para`).style.display = p.isParalyzed ? 'block' : 'none';
        document.getElementById(`${player}-burn`).style.display = p.burnTurns > 0 ? 'block' : 'none';
        document.getElementById(`${player}-shield`).style.display = p.hasShield ? 'block' : 'none';

        cardElem.classList.toggle('status-shield', p.hasShield);
        cardElem.classList.toggle('status-burn', p.burnTurns > 0);
        cardElem.classList.toggle('status-para', p.isParalyzed);

        const isCurrentTurn = gameState.activePlayer === player;
        cardElem.classList.toggle('active-card', isCurrentTurn);

        // HÁLÓZATI MÓDOSÍTÁS: Csak akkor engedélyezzük a gombot, ha a saját körünk van
        const isMyTurn = (myRole === player) && isCurrentTurn;

        const buttons = document.querySelectorAll(`#${player}-card .attacks button`);
        buttons.forEach((btn, idx) => {
            if (btn.classList.contains('charge-btn')) {
                btn.disabled = (!isMyTurn || gameState.gameOver);
            } else {
                btn.disabled = (!isMyTurn || p.ap < p.attacks[idx].cost || gameState.gameOver);
            }
        });
    });

    if (!gameState.gameOver) {
        const activeName = gameState[gameState.activePlayer].name;
        const turnPrefix = gameState.activePlayer === myRole ? "A Te köröd" : "Az ellenfél köre";
        document.getElementById('turn-indicator').innerText = `${turnPrefix} (${activeName})`;
    }
}

function checkWin() {
    if (gameState.p1.hp <= 0 || gameState.p2.hp <= 0) {
        gameState.gameOver = true;
        const winner = gameState.p1.hp > 0 ? gameState.p1.name : gameState.p2.name;
        logMessage(`<span class="success">Mérkőzés vége! ${winner} győzött!</span>`);
        document.getElementById('turn-indicator').innerText = "Vége";
        
        document.getElementById('victory-winner-text').innerHTML = `MÉRKŐZÉS VÉGE!<br><br><span style="color: #fff;">${winner}</span><br>GYŐZÖTT!`;
        setTimeout(() => { document.getElementById('victory-screen').style.display = 'flex'; }, 800);
        
        updateUI();
        return true;
    }
    return false;
}

// --- 3. AKCIÓK ÉS SZINKRONIZÁCIÓ ---

// Saját gombnyomás indítása
function executeMove(playerId, attackIndex) {
    if (gameState.gameOver || myRole !== playerId) return;

    const attacker = gameState[playerId];
    let payload = {
        type: 'MOVE',
        attackIndex: attackIndex,
        isEvaded: Math.random() < 0.10,
        isCrit: Math.random() < 0.15,
        coinFlip: Math.random() >= 0.5 ? "FEJ" : "ÍRÁS",
        finalDmg: 0
    };

    if (attackIndex !== 'charge') {
        const move = attacker.attacks[attackIndex];
        if (move.type === "dmg") {
            let variance = move.dmg * 0.2;
            payload.finalDmg = Math.floor(move.dmg + (Math.random() * variance * 2) - variance);
        }
    }

    // Elküldjük a kiszámított nyers adatokat a partnernek
    conn.send(payload);

    // Végrehajtjuk a saját képernyőnkön is
    applyMove(playerId, payload);
}

// Ellenféltől érkező adatok feldolgozása
function receiveMove(payload) {
    const oppId = myRole === 'p1' ? 'p2' : 'p1';
    applyMove(oppId, payload);
}

// Közös logikai végrehajtó mag (mindkét oldalon ugyanazokkal az adatokkal fut le)
function applyMove(playerId, data) {
    const attacker = gameState[playerId];
    const oppId = playerId === 'p1' ? 'p2' : 'p1';
    const opp = gameState[oppId];

    if (data.attackIndex === 'charge') {
        attacker.ap = Math.min(10, attacker.ap + 1);
        logMessage(`⚡ <b>${attacker.name}</b> erőt gyűjt! (Kör kihagyása, extra AP)`);
        triggerAnimation(`${playerId}-card`, 'anim-charge', 600);
        endTurnPhase(playerId);
        return;
    }

    const move = attacker.attacks[data.attackIndex];
    attacker.ap -= move.cost;
    logMessage(`<b>${attacker.name}</b> használja: <i>${move.name}</i>`);

    triggerAnimation(`${playerId}-card`, 'anim-attack', 300);

    setTimeout(() => {
        if (move.type === "dmg") {
            if (data.isEvaded) {
                logMessage(`> <span class="status-effect">${opp.name} kitért a támadás elől!</span> (0 sebzés)`);
            } else {
                let damage = data.finalDmg;
                if (data.isCrit) {
                    damage = Math.floor(damage * 1.5);
                    triggerAnimation('container', 'screen-shake', 300);
                }
                if (opp.hasShield) {
                    damage = Math.floor(damage / 2);
                    logMessage(`> ${opp.name} pajzsa felfogta a sebzés felét!`);
                    opp.hasShield = false;
                }

                opp.hp -= damage;
                triggerAnimation(`${oppId}-card`, 'anim-damage', 400);

                let critText = data.isCrit ? `<span class="crit">Kritikus Találat!</span> ` : "";
                logMessage(`> ${critText}Célpont sebződött: ${damage} ponttal.`);

                if (move.effect === "paralyze" && opp.hp > 0) {
                    logMessage(`> Érmedobás: <b>${data.coinFlip}</b>!`);
                    if (data.coinFlip === "FEJ") {
                        opp.isParalyzed = true;
                        logMessage(`> <span class="status-effect">${opp.name} megbénult!</span>`);
                    }
                } else if (move.effect === "burn" && opp.hp > 0) {
                    opp.burnTurns = 3;
                    logMessage(`> <span class="crit">${opp.name} meggyulladt!</span>`);
                }
            }
        } else if (move.type === "heal") {
            attacker.hp = Math.min(attacker.maxHp, attacker.hp + move.healAmount);
            triggerAnimation(`${playerId}-card`, 'anim-heal', 600);
            logMessage(`> <span class="heal">${attacker.name} visszatöltött ${move.healAmount} Életerőt!</span>`);
        } else if (move.type === "shield") {
            attacker.hasShield = true;
            logMessage(`> ${attacker.name} felhúzott egy pajzsot.`);
        }

        if (checkWin()) return;
        endTurnPhase(playerId);
    }, 150);
}

function endTurnPhase(currentPlayerId) {
    const oppId = currentPlayerId === 'p1' ? 'p2' : 'p1';
    const pInfo = gameState[currentPlayerId];
    
    if (pInfo.burnTurns > 0) {
        pInfo.hp -= 20;
        pInfo.burnTurns--;
        triggerAnimation(`${currentPlayerId}-card`, 'anim-damage', 400);
        logMessage(`<span class="crit">${pInfo.name} égési sérülést szenvedett (20 DMG).</span>`);
        if (pInfo.burnTurns === 0) logMessage(`> ${pInfo.name} már nem ég.`);
        if (checkWin()) return;
    }

    const nextPInfo = gameState[oppId];
    if (nextPInfo.isParalyzed) {
        nextPInfo.isParalyzed = false;
        logMessage(`-- <span class="status-effect">${nextPInfo.name} bénult!</span> Kimarad a köre (Nem kap AP-t). --`);
        updateUI();
        setTimeout(() => endTurnPhase(oppId), 1500); 
        return;
    }

    gameState.activePlayer = oppId;
    nextPInfo.ap = Math.min(10, nextPInfo.ap + 1); 
    updateUI();
}