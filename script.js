let peer;
let conn;
let myRole = null; // 'p1' (Host) vagy 'p2' (Guest)
let gameState;
let isTestMode = false;
let isPvEMode = false;

let myNickname = "Játékos 1";
let oppNickname = "Játékos 2";

// --- DRAFT VÁLTOZÓK ---
let myDraftTeam = [];
let oppDraftTeam = [];
let iAmReady = false;
let oppIsReady = false;
let draggedIndex = null;

// --- 1. HÁLÓZATI ÉS LOBBY LOGIKA ---

peer = new Peer();

// Test gomb létrehozása és injektálása
const testBtn = document.createElement('button');
testBtn.innerText = 'Test';
testBtn.className = 'test-btn';
testBtn.onclick = () => {
    if (confirm("Indulhat az automatizált AI teszt kör?")) startTestMode();
};
document.body.appendChild(testBtn);

peer.on('open', (id) => {
    document.getElementById('my-peer-id').innerText = id;
    document.getElementById('connection-status').innerText = "Várakozás az ellenfélre...";

    // Automatikus csatlakozás ha van link
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('join')) {
        const targetId = urlParams.get('join');
        document.getElementById('opponent-id-input').value = targetId;
        setTimeout(() => connectToPeer(), 500);
    }
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
    const startSession = () => {
        if (myRole === 'p1') {
            // A Host generál két teljesen különálló ID listát
            const p1TeamIds = getRandomTeam();
            const p2TeamIds = getRandomTeam();
            
            conn.send({ type: 'INIT', p1TeamIds: p1TeamIds, p2TeamIds: p2TeamIds });
            setupDraft(p1TeamIds); 
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
            setupDraft(data.p2TeamIds);
        } else if (data.type === 'READY') {
            oppIsReady = true;
            oppDraftTeam = data.team;
            oppNickname = data.name || (myRole === 'p1' ? "Játékos 2" : "Játékos 1");
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
    const nickInput = document.getElementById('nickname-input').value.trim();
    if (!nickInput) {
        alert("PVP módban kötelező megadni egy nicknevet!");
        return;
    }
    myNickname = nickInput;
    iAmReady = true;
    document.getElementById('ready-btn').disabled = true;
    document.getElementById('ready-btn').innerText = "Készen állsz!";
    document.getElementById('draft-status').innerText = "Várakozás az ellenfélre...";
    
    conn.send({ type: 'READY', team: myDraftTeam, name: myNickname });
    checkStartGame();
}

function checkStartGame() {
    if (iAmReady && oppIsReady) {
        document.getElementById('draft-screen').style.display = 'none';
        document.getElementById('game-screen').style.display = 'block';
        
        let finalP1, finalP2;

        // Explicit meghatározás: ki az egyes és ki a kettes játékos
        if (myRole === 'p1') {
            finalP1 = [...myDraftTeam];  // Én vagyok a Host (p1)
            finalP2 = [...oppDraftTeam]; // Az ellenfél a Guest (p2)
        } else {
            finalP1 = [...oppDraftTeam]; // Az ellenfél a Host (p1)
            finalP2 = [...myDraftTeam];  // Én vagyok a Guest (p2)
        }

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
        card.shields = 0;
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
    
    // Nevek beállítása és megjelenítése a fejlécben
    const name1 = myRole === 'p1' ? myNickname : oppNickname;
    const name2 = myRole === 'p2' ? myNickname : oppNickname;
    document.getElementById('p1-name-display').innerText = name1;
    document.getElementById('p2-name-display').innerText = name2;

    const nameHeader = document.querySelector('.player-names-header');
    if (nameHeader) nameHeader.style.display = 'flex';

    logMessage("Mindkét játékos összeállította a csapatát! A harc megkezdődött.", "log-system");
    updateUI();
}

function logMessage(msg, typeClass = "") {
    const logDiv = document.getElementById('log');
    const className = typeClass ? `log-entry ${typeClass}` : 'log-entry';
    logDiv.insertAdjacentHTML('afterbegin', `<div class="${className}">${msg}</div>`);
    logDiv.scrollTop = 0;
}

function triggerAnimation(elementId, animClass, duration) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.classList.remove(animClass); 
    void el.offsetWidth; 
    el.classList.add(animClass);
    setTimeout(() => { el.classList.remove(animClass); }, duration);
}

function spawnParticles(x, y, color, count = 20, spread = 60) {
    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = Math.random() * 10 + 4;
        p.style.left = x + 'px';
        p.style.top = y + 'px';
        p.style.backgroundColor = color;
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.boxShadow = `0 0 10px ${color}`;
        p.style.animationDuration = (Math.random() * 0.4 + 0.4) + 's';
        
        const tx = (Math.random() - 0.5) * spread * 2;
        const ty = (Math.random() - 0.5) * spread * 2;
        p.style.setProperty('--x', `${tx}px`);
        p.style.setProperty('--y', `${ty}px`);
        
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 600);
    }
}

function screenFlash(color) {
    const flash = document.createElement('div');
    flash.className = 'screen-flash';
    flash.style.backgroundColor = color;
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 250);
}

function createImpactEffect(x, y, color, isSmall = false) {
    const impact = document.createElement('div');
    impact.className = 'impact-effect';
    impact.style.left = x + 'px';
    impact.style.top = y + 'px';
    impact.style.borderColor = color;
    impact.style.boxShadow = `0 0 ${isSmall ? 10 : 30}px ${color}`;
    document.body.appendChild(impact);
    
    // Több hullámban érkező robbanás
    spawnParticles(x, y, color, isSmall ? 25 : 60, isSmall ? 80 : 200);
    spawnParticles(x, y, "#fff", isSmall ? 10 : 30, isSmall ? 40 : 100); // Fehér mag a robbanáshoz
    
    setTimeout(() => impact.remove(), 400);
}

function triggerShieldScan(playerId) {
    const cardBody = document.querySelector(`#${playerId}-card .card-body`);
    if (!cardBody) return;
    const scan = document.createElement('div');
    scan.className = 'shield-scanline';
    cardBody.appendChild(scan);
    setTimeout(() => scan.remove(), 800);
}

function createProjectile(fromId, toId, effectType, hitCount = 1) {
    const fromEl = document.getElementById(fromId);
    const toEl = document.getElementById(toId);
    if (!fromEl || !toEl) return;

    const fromRect = fromEl.getBoundingClientRect();
    const toRect = toEl.getBoundingClientRect();

    const projectileCount = hitCount;
    const isMulti = hitCount > 1;

    for (let i = 0; i < projectileCount; i++) {
        setTimeout(() => {
            const startX = fromRect.left + fromRect.width / 2 + (Math.random() * 40 - 20);
            const startY = fromRect.top + fromRect.height / 2 + (Math.random() * 40 - 20);
            const targetX = toRect.left + toRect.width / 2;
            const targetY = toRect.top + toRect.height / 2;

            const proj = document.createElement('div');
            proj.className = 'projectile';
            
            let icon = "☄️";
            let color = "#39a2db"; 
            if (effectType === "burn") { icon = "🔥"; color = "#ff4500"; }
            if (effectType === "paralyze") { icon = "⚡"; color = "#ffff00"; }

            proj.innerText = icon;
            proj.style.filter = `drop-shadow(0 0 20px ${color}) brightness(1.5)`;
            proj.style.left = `${startX - 25}px`;
            proj.style.top = `${startY - 25}px`;
            proj.style.fontSize = (isMulti ? 1.5 + Math.random() * 0.5 : 3.5 + Math.random() * 0.5) + "rem";
            
            document.body.appendChild(proj);

            const trailInterval = setInterval(() => {
                const r = proj.getBoundingClientRect();
                if (r.top === 0 && r.left === 0) return;
                spawnParticles(r.left + 25, r.top + 25, color, isMulti ? 2 : 6, isMulti ? 15 : 35);
            }, 25);

            setTimeout(() => {
                proj.style.transform = `translate(${targetX - startX}px, ${targetY - startY}px) rotate(${360 + Math.random() * 360}deg)`;
            }, 10);

            setTimeout(() => {
                clearInterval(trailInterval);
                if (i === projectileCount - 1) { // Csak az utolsó robbanjon nagyot
                    screenFlash(color);
                    createImpactEffect(targetX, targetY, color, isMulti);
                } else {
                    spawnParticles(targetX, targetY, color, isMulti ? 10 : 25, isMulti ? 40 : 80);
                }
                proj.remove();
            }, 450);
        }, i * (isMulti ? 70 : 0));
    }
}

function updateRoster(player) {
    const rosterEl = document.getElementById(`${player}-roster`);
    rosterEl.innerHTML = '';
    const pState = gameState[player];
    
    pState.team.forEach((card, idx) => {
        const dot = document.createElement('div');
        dot.className = 'roster-dot';
        dot.innerHTML = `<div class="roster-img" style="background-image: url('${card.image}')"></div>`;
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
        const hpFill = document.getElementById(`${player}-hp-fill`);
        hpFill.style.width = `${pct}%`;

        if (pct < 33) {
            hpFill.style.backgroundColor = '#e74c3c'; // Piros 33% alatt
        } else if (pct < 66) {
            hpFill.style.backgroundColor = '#f1c40f'; // Sárga 66% alatt
        } else {
            hpFill.style.backgroundColor = '#2ecc71'; // Zöld alapértelmezetten
        }

        // Flex használata a block helyett, hogy a CSS-ben lévő igazítások működjenek
        document.getElementById(`${player}-para`).style.display = activeCard.isParalyzed ? 'flex' : 'none';
        document.getElementById(`${player}-burn`).style.display = activeCard.burnTurns > 0 ? 'flex' : 'none';
        
        const shieldBadge = document.getElementById(`${player}-shield`);
        if (activeCard.shields > 0) {
            shieldBadge.style.display = 'flex';
            shieldBadge.innerHTML = '🛡️'.repeat(activeCard.shields);
        } else {
            shieldBadge.style.display = 'none';
        }

        cardElem.classList.toggle('status-shield', activeCard.shields > 0);
        cardElem.classList.toggle('status-burn', activeCard.burnTurns > 0);
        cardElem.classList.toggle('status-para', activeCard.isParalyzed);

        const isCurrentTurn = gameState.activePlayer === player;
        cardElem.classList.toggle('active-card', isCurrentTurn);

        const isMyTurn = (myRole === player) && isCurrentTurn;

        const buttons = document.querySelectorAll(`#${player}-card .attacks button`);
        let attackBtnIdx = 0;
        buttons.forEach((btn) => {
            if (btn.classList.contains('charge-btn')) {
                btn.innerHTML = `🔋 ENERGIA TÖLTÉS (+1 AP)`;
                btn.disabled = (!isMyTurn || gameState.gameOver);
                btn.onclick = () => executeMove(player, 'charge');
            } else {
                const move = activeCard.attacks[attackBtnIdx];
                if (!move) {
                    btn.innerHTML = "--- <span>Üres slot</span>";
                    btn.disabled = true;
                    attackBtnIdx++;
                    return;
                }
                
                const currentAttackIdx = attackBtnIdx;
                let icon = "⚔️";
                let dmgText = "---";
                let hitText = "---";
                let effectText = "";

                if (move.type === "dmg") {
                    const hits = move.hits || 1;
                    dmgText = `💥${move.dmg} DMG`;
                    hitText = `🎯${hits} HIT`;
                    if (move.effect === "burn") { effectText = "🔥 ÉGÉS"; icon = "🔥"; }
                    else if (move.effect === "paralyze") { effectText = "⚡ BÉNÍT"; icon = "⚡"; }
                } else if (move.type === "heal") {
                    dmgText = `💚+${move.healAmount} HP`;
                    hitText = "🧪 GYÓGYUL";
                    effectText = "🧪 REGEN";
                    icon = "🧪";
                } else if (move.type === "shield") {
                    dmgText = "🛡️ VÉD";
                    hitText = "🛡️ AKTÍV";
                    effectText = "🛡️ PAJZS";
                    icon = "🛡️";
                }

                btn.innerHTML = `<div class="btn-title">${icon}${move.name}</div><div class="btn-row"><span>${dmgText}</span><span>${hitText}</span></div><div class="btn-row"><span>⚡${move.cost} AP</span><span class="btn-eff">${effectText}</span></div>`;

                btn.disabled = (!isMyTurn || pState.ap < move.cost || gameState.gameOver);
                btn.onclick = () => executeMove(player, currentAttackIdx);
                attackBtnIdx++;
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
        logMessage(`Mérkőzés vége! A ${winnerText} megnyerte a csatát!`, "success");
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
        damagePerHit: 0
    };

    if (attackIndex !== 'charge') {
        const move = attackerCard.attacks[attackIndex];
        if (move.type === "dmg") {
            let variance = move.dmg * 0.2;
            payload.damagePerHit = Math.floor(move.dmg + (Math.random() * variance * 2) - variance);
        }
    }

    if (conn) conn.send(payload);
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
        logMessage(`⚡ <b>${attackerCard.name}</b> erőt gyűjt! (Kör kihagyása, extra AP)`, "log-ap");
        triggerAnimation(`${playerId}-card`, 'anim-charge', 600);
        endTurnPhase(playerId);
        return;
    }

    const move = attackerCard.attacks[data.attackIndex];
    attackerState.ap -= move.cost;
    logMessage(`<b>${attackerCard.name}</b> használja: <i>${move.name}</i>`);

    triggerAnimation(`${playerId}-card`, 'anim-attack', 300);

    if (move.type === "dmg") {
        createProjectile(`${playerId}-card`, `${oppId}-card`, move.effect, move.hits || 1);
    }

    setTimeout(() => {
        if (move.type === "dmg") {
            if (data.isEvaded) {
                logMessage(`> ${oppCard.name} kitért a támadás elől! (0 sebzés)`, "status-effect");
            } else {
                // FIX: Ha a támadás szerencse alapú (luck) vagy bármilyen effektje van, érmedobás dönt a találatról
                if (move.luck || move.effect) {
                    logMessage(`> Érmedobás: <b>${data.coinFlip}</b>!`);
                    if (data.coinFlip === "ÍRÁS") {
                        logMessage(`> A támadás célt tévesztett! (0 sebzés)`, "status-effect");
                        if (checkWin()) return;
                        endTurnPhase(playerId);
                        return;
                    }
                }

                const hitCount = move.hits || 1;
                let dmgPerHit = data.damagePerHit;
                if (data.isCrit) {
                    dmgPerHit = Math.floor(dmgPerHit * 1.5);
                    triggerAnimation('container', 'screen-shake', 300);
                }

                let hitsLanded = 0;
                let shieldsBroken = 0;

                for (let i = 0; i < hitCount; i++) {
                    if (oppCard.hp <= 0) break;
                    if (oppCard.shields > 0) {
                        oppCard.shields--;
                        shieldsBroken++;
                    } else {
                        oppCard.hp -= dmgPerHit;
                        hitsLanded++;
                    }
                }

                if (shieldsBroken > 0) {
                    logMessage(`> ${oppCard.name} pajzsa elnyelt ${shieldsBroken} ütést! (${oppCard.shields} maradt)`, "log-shield");
                }

                const totalDamage = hitsLanded * dmgPerHit;
                triggerAnimation(`${oppId}-card`, 'anim-damage', 400);

                let critText = data.isCrit ? `<span class="crit">Kritikus Találat!</span> ` : "";
                if (hitsLanded > 0) {
                    logMessage(`> ${critText}${hitsLanded} találat érte a célpontot: ${totalDamage} sebzéssel.`, "log-dmg");
                }

                if (oppCard.hp <= 0) {
                    logMessage(`> ${oppCard.name} elájult (K.O.)!`, "crit");
                    oppState.activeIndex++;
                    if (oppState.activeIndex < 5) {
                        const nextCard = oppState.team[oppState.activeIndex];
                        logMessage(`> <b>${nextCard.name}</b> lép a pályára!`, "log-system");
                        triggerAnimation(`${oppId}-card`, 'anim-heal', 600);
                    }
                } else {
                    if (move.effect === "paralyze") {
                        oppCard.isParalyzed = true;
                        logMessage(`> ${oppCard.name} megbénult!`, "status-effect");
                    } else if (move.effect === "burn") {
                        oppCard.burnTurns = 3;
                        logMessage(`> ${oppCard.name} meggyulladt!`, "crit");
                    }
                }
            }
        } else if (move.type === "heal") {
            attackerCard.hp = Math.min(attackerCard.maxHp, attackerCard.hp + move.healAmount);
            const rect = document.getElementById(`${playerId}-card`).getBoundingClientRect();
            spawnParticles(rect.left + rect.width/2, rect.top + rect.height/2, "#2ecc71", 45, 150);
            triggerAnimation(`${playerId}-card`, 'anim-heal', 600);
            logMessage(`> ${attackerCard.name} visszatöltött ${move.healAmount} Életerőt!`, "log-heal");
        } else if (move.type === "shield") {
            attackerCard.shields++;
            triggerShieldScan(playerId);
            const rect = document.getElementById(`${playerId}-card`).getBoundingClientRect();
            spawnParticles(rect.left + rect.width/2, rect.top + rect.height/2, "#3498db", 45, 150);
            logMessage(`> ${attackerCard.name} felhúzott egy pajzsot.`, "log-shield");
        }

        if (checkWin()) return;
        endTurnPhase(playerId);
    }, 450 + (move.hits || 1) * 70); // Időzítés igazítása az ütésszámhoz
}

function endTurnPhase(currentPlayerId) {
    const pState = gameState[currentPlayerId];
    const pCard = pState.team[pState.activeIndex];
    const oppId = currentPlayerId === 'p1' ? 'p2' : 'p1';
    
    if (pCard && pCard.burnTurns > 0) {
        pCard.hp -= 20;
        pCard.burnTurns--;
        triggerAnimation(`${currentPlayerId}-card`, 'anim-damage', 400);
        logMessage(`${pCard.name} égési sérülést szenvedett (20 DMG).`, "crit");
        
        if (pCard.hp <= 0) {
            logMessage(`> ${pCard.name} elégett és elájult (K.O.)!`, "crit");
            pState.activeIndex++;
            if (pState.activeIndex < 5) {
                const nextCard = pState.team[pState.activeIndex];
                logMessage(`> <b>${nextCard.name}</b> lép a pályára!`, "log-system");
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
        logMessage(`-- ${nextPCard.name} bénult! Kimarad a köre (Nem kap AP-t). --`, "status-effect");
        updateUI();
        setTimeout(() => endTurnPhase(oppId), 1500); 
        return;
    }

    gameState.activePlayer = oppId;
    nextPState.ap = Math.min(10, nextPState.ap + 1); 
    updateUI();

    if ((isTestMode || (isPvEMode && oppId === 'p2')) && !gameState.gameOver) {
        setTimeout(runAITestMove, 1000);
    }
}

// --- 5. TEST MÓD (AI vs AI) ---

function startTestMode() {
    isTestMode = true;
    myRole = 'p1'; // Szimulált szerep
    myNickname = "AI 1";
    oppNickname = "AI 2";
    
    document.getElementById('lobby-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    
    const p1Team = getRandomTeam();
    const p2Team = getRandomTeam();
    
    initGame(p1Team, p2Team);
    logMessage("--- TEST MÓD AKTIVÁLVA: AI vs AI ---", "log-system");
    
    setTimeout(runAITestMove, 1000);
}

function startPvEMode() {
    isPvEMode = true;
    myRole = 'p1'; // A játékos mindig p1 PvE módban
    myNickname = "Játékos"; 
    oppNickname = "Gonosz AI";
    
    document.getElementById('lobby-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    
    const p1Team = getRandomTeam();
    const p2Team = getRandomTeam();
    
    initGame(p1Team, p2Team);
    logMessage("--- PVE MÓD AKTIVÁLVA: Játék az AI ellen ---", "log-system");
    // P1 kezd, így nem indítjuk el azonnal az AI-t
}

function runAITestMove() {
    if (gameState.gameOver) return;

    // Ellenőrizzük, hogy az ai.js betöltött-e
    if (typeof getAIMove !== 'function') {
        console.error("AI logika (getAIMove) nem található! Ellenőrizd az ai.js-t.");
        return;
    }
    
    const pId = gameState.activePlayer;
    const oppId = pId === 'p1' ? 'p2' : 'p1';
    const moveIdx = getAIMove(gameState[pId], gameState[oppId]);

    // Ha az AI null-t ad vissza (pl. bénult), kényszerítsük a kör váltást, hogy ne álljon meg a játék
    if (moveIdx === null) {
        endTurnPhase(pId);
        return;
    }
    
    const attackerCard = gameState[pId].team[gameState[pId].activeIndex];
    const move = moveIdx !== 'charge' ? attackerCard.attacks[moveIdx] : null;
    
    const payload = {
        type: 'MOVE',
        attackIndex: moveIdx,
        isEvaded: Math.random() < 0.10,
        isCrit: Math.random() < 0.15,
        coinFlip: Math.random() >= 0.5 ? "FEJ" : "ÍRÁS",
        damagePerHit: 0
    };

    if (move && move.type === "dmg") {
            let variance = move.dmg * 0.2;
            payload.finalDmg = Math.floor(move.dmg + (Math.random() * variance * 2) - variance);
    }

    applyMove(pId, payload);
}

function copyInviteLink() {
    const id = document.getElementById('my-peer-id').innerText;
    if (!id || id === "Generálás folyamatban...") return;
    
    const url = new URL(window.location.href);
    url.searchParams.set('join', id);
    
    navigator.clipboard.writeText(url.toString()).then(() => {
        const btn = document.getElementById('copy-link-btn');
        const originalText = btn.innerText;
        btn.innerText = "Link másolva!";
        setTimeout(() => btn.innerText = originalText, 2000);
    });
}