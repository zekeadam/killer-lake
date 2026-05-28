let peer;
let conn;
let myRole = null; // 'p1' (Host) vagy 'p2' (Guest)
let gameState;

// --- DRAFT VÁLTOZÓK ---
let myDraftTeam = [];
let oppDraftTeam = [];
let iAmReady = false;
let oppIsReady = false;
let draggedIndex = null;

// --- 1. HÁLÓZATI ÉS LOBBY LOGIKA ---

peer = new Peer();

peer.on('open', (id) => {
    document.getElementById('my-peer-id').innerText = id;
    document.getElementById('connection-status').innerText = "Várakozás az ellenfélre...";
});

peer.on('connection', (connection) => {
    if (conn) return;
    conn = connection;
    myRole = 'p1'; 
    setupConnection();
});

function connectToPeer() {
    const targetId = document.getElementById('opponent-id-input').value.trim();
    if (!targetId) {
        alert("Kérlek, írj be egy érvényes kódot!");
        return;
    }
    
    document.getElementById('connection-status').innerText = "Kapcsolódás...";
    conn = peer.connect(targetId);
    myRole = 'p2'; 
    setupConnection();
}

function getRandomTeam() {
    let team = [];
    for (let i = 0; i < 5; i++) {
        const randomCard = cardDatabase[Math.floor(Math.random() * cardDatabase.length)];
        team.push(randomCard.id);
    }
    return team;
}

function setupConnection() {
    conn.on('open', () => {
        if (myRole === 'p1') {
            const p1TeamIds = getRandomTeam();
            const p2TeamIds = getRandomTeam();
            
            conn.send({ type: 'INIT', p1TeamIds: p1TeamIds, p2TeamIds: p2TeamIds });
            setupDraft(p1TeamIds); 
        } else {
            document.getElementById('connection-status').innerText = "Kártyák szinkronizálása...";
        }
    });

    conn.on('data', (data) => {
        if (data.type === 'INIT') {
            setupDraft(data.p2TeamIds);
        } else if (data.type === 'READY') {
            oppIsReady = true;
            oppDraftTeam = data.team;
            checkStartGame();
        } else if (data.type === 'MOVE') {
            receiveMove(data);
        }
    });

    conn.on('close', () => {
        alert("Az ellenfél lecsatlakozott.");
        location.reload();
    });
}

// --- 2. DRAFT (CSAPATÖSSZEÁLLÍTÓ) FÁZIS ---

function setupDraft(teamIds) {
    myDraftTeam = teamIds;
    document.getElementById('lobby-screen').style.display = 'none';
    document.getElementById('draft-screen').style.display = 'flex';
    renderDraft();
}

function renderDraft() {
    const container = document.getElementById('my-draft-team');
    container.innerHTML = '';
    
    myDraftTeam.forEach((id, index) => {
        const cardData = cardDatabase.find(c => c.id === id);
        
        const cardEl = document.createElement('div');
        cardEl.className = 'draft-card';
        cardEl.draggable = true;
        cardEl.dataset.index = index;
        
        cardEl.innerHTML = `
            <div class="order-badge">${index + 1}.</div>
            <img src="${cardData.image}">
            <div class="draft-name">${cardData.name}</div>
        `;

        cardEl.addEventListener('dragstart', function(e) {
            draggedIndex = parseInt(this.dataset.index);
            setTimeout(() => this.style.opacity = '0.5', 0);
        });
        
        cardEl.addEventListener('dragend', function() {
            this.style.opacity = '1';
        });

        cardEl.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('drag-over');
        });

        cardEl.addEventListener('dragleave', function() {
            this.classList.remove('drag-over');
        });

        cardEl.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('drag-over');
            const targetIndex = parseInt(this.dataset.index);
            
            if (draggedIndex !== null && draggedIndex !== targetIndex) {
                const movedItem = myDraftTeam.splice(draggedIndex, 1)[0];
                myDraftTeam.splice(targetIndex, 0, movedItem);
                renderDraft(); 
            }
        });

        container.appendChild(cardEl);
    });
}

function confirmTeamOrder() {
    iAmReady = true;
    document.getElementById('ready-btn').disabled = true;
    document.getElementById('ready-btn').innerText = "Készen állsz!";
    document.getElementById('draft-status').innerText = "Várakozás az ellenfélre...";
    
    conn.send({ type: 'READY', team: myDraftTeam });
    checkStartGame();
}

function checkStartGame() {
    if (iAmReady && oppIsReady) {
        document.getElementById('draft-screen').style.display = 'none';
        document.getElementById('game-screen').style.display = 'block';
        
        let finalP1 = myRole === 'p1' ? myDraftTeam : oppDraftTeam;
        let finalP2 = myRole === 'p2' ? myDraftTeam : oppDraftTeam;
        
        initGame(finalP1, finalP2);
    }
}

// --- 3. JÁTÉK MOTOR ÉS LOGIKA ---

function buildTeamObjects(teamIds) {
    return teamIds.map(id => {
        const cardData = cardDatabase.find(c => c.id === id);
        let card = JSON.parse(JSON.stringify(cardData));
        card.hp = card.maxHp;
        card.isParalyzed = false;
        card.burnTurns = 0;
        card.hasShield = false;
        return card;
    });
}

function initGame(p1TeamIds, p2TeamIds) {
    gameState = {
        activePlayer: 'p1',
        gameOver: false,
        p1: { team: buildTeamObjects(p1TeamIds), activeIndex: 0, ap: 2 },
        p2: { team: buildTeamObjects(p2TeamIds), activeIndex: 0, ap: 2 }
    };
    
    document.getElementById('log').innerHTML = "";
    logMessage("Mindkét játékos összeállította a csapatát! A harc megkezdődött.");
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

function updateRoster(player) {
    const rosterEl = document.getElementById(`${player}-roster`);
    rosterEl.innerHTML = '';
    const pState = gameState[player];
    
    pState.team.forEach((card, idx) => {
        const dot = document.createElement('div');
        dot.className = 'roster-dot';
        if (card.hp <= 0) dot.classList.add('ko');
        else if (idx === pState.activeIndex) dot.classList.add('active-battler');
        else dot.classList.add('alive');
        rosterEl.appendChild(dot);
    });
}

function updateUI() {
    ['p1', 'p2'].forEach(player => {
        const pState = gameState[player];
        updateRoster(player); 
        
        if (pState.activeIndex >= 5) return;

        const activeCard = pState.team[pState.activeIndex];
        const cardElem = document.getElementById(`${player}-card`);
        
        document.querySelector(`#${player}-card h2`).innerText = activeCard.name;
        document.querySelector(`#${player}-card .card-image`).src = activeCard.image;
        document.querySelector(`#${player}-card .card-image`).style.display = 'block';

        document.getElementById(`${player}-hp`).innerText = Math.max(0, activeCard.hp);
        document.getElementById(`${player}-ap`).innerText = pState.ap;
        
        const pct = Math.max(0, (activeCard.hp / activeCard.maxHp) * 100);
        document.getElementById(`${player}-hp-fill`).style.width = `${pct}%`;

        document.getElementById(`${player}-para`).style.display = activeCard.isParalyzed ? 'block' : 'none';
        document.getElementById(`${player}-burn`).style.display = activeCard.burnTurns > 0 ? 'block' : 'none';
        document.getElementById(`${player}-shield`).style.display = activeCard.hasShield ? 'block' : 'none';

        cardElem.classList.toggle('status-shield', activeCard.hasShield);
        cardElem.classList.toggle('status-burn', activeCard.burnTurns > 0);
        cardElem.classList.toggle('status-para', activeCard.isParalyzed);

        const isCurrentTurn = gameState.activePlayer === player;
        cardElem.classList.toggle('active-card', isCurrentTurn);

        const isMyTurn = (myRole === player) && isCurrentTurn;

        const buttons = document.querySelectorAll(`#${player}-card .attacks button`);
        buttons.forEach((btn, idx) => {
            if (btn.classList.contains('charge-btn')) {
                btn.disabled = (!isMyTurn || gameState.gameOver);
            } else {
                const move = activeCard.attacks[idx];
                let subText = "";
                if (move.type === "dmg") {
                    subText = `${move.dmg} DMG`;
                    if (move.effect === "burn") subText += " + Égés";
                    if (move.effect === "paralyze") subText += " + Bénítás";
                } else if (move.type === "heal") {
                    subText = `+${move.healAmount} HP`;
                } else if (move.type === "shield") {
                    subText = "-50% Sebzés";
                }
                btn.innerHTML = `${move.name} <span>${subText} [${move.cost} AP]</span>`;
                btn.disabled = (!isMyTurn || pState.ap < move.cost || gameState.gameOver);
            }
        });
    });

    if (!gameState.gameOver) {
        const turnPrefix = gameState.activePlayer === myRole ? "A Te köröd" : "Az ellenfél köre";
        const activeName = gameState[gameState.activePlayer].team[gameState[gameState.activePlayer].activeIndex].name;
        document.getElementById('turn-indicator').innerText = `${turnPrefix} (${activeName})`;
    }
}

function checkWin() {
    if (gameState.p1.activeIndex >= 5 || gameState.p2.activeIndex >= 5) {
        gameState.gameOver = true;
        const winnerText = gameState.p1.activeIndex < 5 ? "1. JÁTÉKOS" : "2. JÁTÉKOS";
        logMessage(`<span class="success">Mérkőzés vége! A ${winnerText} megnyerte a csatát!</span>`);
        document.getElementById('turn-indicator').innerText = "Vége";
        
        document.getElementById('victory-winner-text').innerHTML = `CSAPAT MEGSEMMISÍTVE!<br><br><span style="color: #fff;">${winnerText}</span><br>GYŐZÖTT!`;
        setTimeout(() => { document.getElementById('victory-screen').style.display = 'flex'; }, 800);
        
        updateUI();
        return true;
    }
    return false;
}

// --- 4. AKCIÓK ÉS SZINKRONIZÁCIÓ ---

function executeMove(playerId, attackIndex) {
    if (gameState.gameOver || myRole !== playerId) return;

    const attackerState = gameState[playerId];
    const attackerCard = attackerState.team[attackerState.activeIndex];

    let payload = {
        type: 'MOVE',
        attackIndex: attackIndex,
        isEvaded: Math.random() < 0.10,
        isCrit: Math.random() < 0.15,
        coinFlip: Math.random() >= 0.5 ? "FEJ" : "ÍRÁS",
        finalDmg: 0
    };

    if (attackIndex !== 'charge') {
        const move = attackerCard.attacks[attackIndex];
        if (move.type === "dmg") {
            let variance = move.dmg * 0.2;
            payload.finalDmg = Math.floor(move.dmg + (Math.random() * variance * 2) - variance);
        }
    }

    conn.send(payload);
    applyMove(playerId, payload);
}

function receiveMove(payload) {
    const oppId = myRole === 'p1' ? 'p2' : 'p1';
    applyMove(oppId, payload);
}

function applyMove(playerId, data) {
    const attackerState = gameState[playerId];
    const attackerCard = attackerState.team[attackerState.activeIndex];
    
    const oppId = playerId === 'p1' ? 'p2' : 'p1';
    const oppState = gameState[oppId];
    const oppCard = oppState.team[oppState.activeIndex];

    if (data.attackIndex === 'charge') {
        attackerState.ap = Math.min(10, attackerState.ap + 1);
        logMessage(`⚡ <b>${attackerCard.name}</b> erőt gyűjt! (Kör kihagyása, extra AP)`);
        triggerAnimation(`${playerId}-card`, 'anim-charge', 600);
        endTurnPhase(playerId);
        return;
    }

    const move = attackerCard.attacks[data.attackIndex];
    attackerState.ap -= move.cost;
    logMessage("---------------------------------------------");
    logMessage(`<b>${attackerCard.name}</b> használja: <i>${move.name}</i>`);

    triggerAnimation(`${playerId}-card`, 'anim-attack', 300);

    setTimeout(() => {
        if (move.type === "dmg") {
            if (data.isEvaded) {
                logMessage(`> <span class="status-effect">${oppCard.name} kitért a támadás elől!</span> (0 sebzés)`);
            } else {
                let damage = data.finalDmg;
                if (data.isCrit) {
                    damage = Math.floor(damage * 1.5);
                    triggerAnimation('container', 'screen-shake', 300);
                }
                if (oppCard.hasShield) {
                    damage = Math.floor(damage / 2);
                    logMessage(`> ${oppCard.name} pajzsa felfogta a sebzés felét!`);
                    oppCard.hasShield = false;
                }

                oppCard.hp -= damage;
                triggerAnimation(`${oppId}-card`, 'anim-damage', 400);

                let critText = data.isCrit ? `<span class="crit">Kritikus Találat!</span> ` : "";
                logMessage(`> ${critText}Célpont sebződött: ${damage} ponttal.`);

                if (oppCard.hp <= 0) {
                    logMessage(`<span class="crit">> ${oppCard.name} elájult (K.O.)!</span>`);
                    oppState.activeIndex++;
                    if (oppState.activeIndex < 5) {
                        const nextCard = oppState.team[oppState.activeIndex];
                        logMessage(`> <b>${nextCard.name}</b> lép a pályára!`);
                        triggerAnimation(`${oppId}-card`, 'anim-heal', 600);
                    }
                } else {
                    if (move.effect === "paralyze") {
                        logMessage(`> Érmedobás: <b>${data.coinFlip}</b>!`);
                        if (data.coinFlip === "FEJ") {
                            oppCard.isParalyzed = true;
                            logMessage(`> <span class="status-effect">${oppCard.name} megbénult!</span>`);
                        }
                    } else if (move.effect === "burn") {
                        oppCard.burnTurns = 3;
                        logMessage(`> <span class="crit">${oppCard.name} meggyulladt!</span>`);
                    }
                }
            }
        } else if (move.type === "heal") {
            attackerCard.hp = Math.min(attackerCard.maxHp, attackerCard.hp + move.healAmount);
            triggerAnimation(`${playerId}-card`, 'anim-heal', 600);
            logMessage(`> <span class="heal">${attackerCard.name} visszatöltött ${move.healAmount} Életerőt!</span>`);
        } else if (move.type === "shield") {
            attackerCard.hasShield = true;
            logMessage(`> ${attackerCard.name} felhúzott egy pajzsot.`);
        }

        if (checkWin()) return;
        endTurnPhase(playerId);
    }, 150);
}

function endTurnPhase(currentPlayerId) {
    const pState = gameState[currentPlayerId];
    const pCard = pState.team[pState.activeIndex];
    const oppId = currentPlayerId === 'p1' ? 'p2' : 'p1';
    
    if (pCard && pCard.burnTurns > 0) {
        pCard.hp -= 20;
        pCard.burnTurns--;
        triggerAnimation(`${currentPlayerId}-card`, 'anim-damage', 400);
        logMessage(`<span class="crit">${pCard.name} égési sérülést szenvedett (20 DMG).</span>`);
        
        if (pCard.hp <= 0) {
            logMessage(`<span class="crit">> ${pCard.name} elégett és elájult (K.O.)!</span>`);
            pState.activeIndex++;
            if (pState.activeIndex < 5) {
                const nextCard = pState.team[pState.activeIndex];
                logMessage(`> <b>${nextCard.name}</b> lép a pályára!`);
                triggerAnimation(`${currentPlayerId}-card`, 'anim-heal', 600);
            }
        } else if (pCard.burnTurns === 0) {
            logMessage(`> ${pCard.name} tüze kialudt.`);
        }
        
        if (checkWin()) return;
    }

    const nextPState = gameState[oppId];
    const nextPCard = nextPState.team[nextPState.activeIndex];

    if (nextPCard && nextPCard.isParalyzed) {
        nextPCard.isParalyzed = false;
        logMessage(`-- <span class="status-effect">${nextPCard.name} bénult!</span> Kimarad a köre (Nem kap AP-t). --`);
        updateUI();
        setTimeout(() => endTurnPhase(oppId), 1500); 
        return;
    }

    gameState.activePlayer = oppId;
    nextPState.ap = Math.min(10, nextPState.ap + 1); 
    updateUI();
}