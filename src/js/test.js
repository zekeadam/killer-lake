// --- 5. TEST MÓD (AI vs AI) ---

// Ellenőrzés: helyi (local) környezetben futunk-e
const isLocalhost = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' || 
                    window.location.protocol === 'file:';

if (isLocalhost) {
    // Debug menü létrehozása és elhelyezése a jobb felső sarokba alapértelmezetten
    const menu = document.createElement('div');
    menu.id = 'debug-menu-panel';
    menu.style.cssText = `
        position: fixed; top: 15px; right: 15px;
        background: rgba(10, 10, 20, 0.75); padding: 15px; border-radius: 14px;
        border: 1px solid rgba(233, 69, 96, 0.5); z-index: 9999; display: flex; flex-direction: column;
        gap: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.6); backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px); min-width: 200px;
    `;

    const title = document.createElement('div');
    title.innerText = "DEBUG MENÜ";
    title.style.cssText = "color: #f1c40f; font-weight: bold; text-align: center; margin-bottom: 5px; font-size: 0.8rem; letter-spacing: 2px;";
    menu.appendChild(title);

    const btnAI = document.createElement('button');
    btnAI.innerText = "🤖 AI vs AI SZIMULÁCIÓ";
    btnAI.style.cssText = "padding: 8px 12px; background: #e94560; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 0.75rem; transition: background 0.2s;";
    btnAI.onmouseover = () => btnAI.style.background = '#ff4d6d';
    btnAI.onmouseout = () => btnAI.style.background = '#e94560';
    btnAI.onclick = () => { startTestMode(); };
    menu.appendChild(btnAI);

    const btnTable = document.createElement('button');
    btnTable.innerText = "📊 KÁRTYA TÁBLÁZAT";
    btnTable.style.cssText = "padding: 8px 12px; background: #3498db; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 0.75rem; transition: background 0.2s;";
    btnTable.onmouseover = () => btnTable.style.background = '#4fa9e3';
    btnTable.onmouseout = () => btnTable.style.background = '#3498db';
    btnTable.onclick = () => { window.location.href = 'pages/cards.html'; };
    menu.appendChild(btnTable);

    const btnSim = document.createElement('button');
    btnSim.innerText = "📊 BATCH AI SZIMULÁCIÓ";
    btnSim.style.cssText = "padding: 8px 12px; background: #9b59b6; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 0.75rem; transition: background 0.2s;";
    btnSim.onmouseover = () => btnSim.style.background = '#af72ca';
    btnSim.onmouseout = () => btnSim.style.background = '#9b59b6';
    btnSim.onclick = () => { window.open('pages/simulate.html', '_blank'); };
    menu.appendChild(btnSim);



    document.body.appendChild(menu);
}

function startTestMode() {
    isTestMode = true;
    myRole = 'p1'; // Szimulált szerep
    myNickname = "AI 1";
    oppNickname = "AI 2";
    
    document.getElementById('lobby-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'flex';
    
    const p1Team = getRandomTeam();
    const p2Team = getRandomTeam();
    const p1Items = getRandomItems();
    const p2Items = getRandomItems();
    
    initGame(p1Team, p2Team, p1Items, p2Items);
    logMessage("--- TEST MÓD AKTIVÁLVA: AI vs AI ---", "log-system");
    
    setTimeout(runAITestMove, 1000);
}

function startPvEMode() {
    isPvEMode = true;
    myRole = 'p1'; // A játékos mindig p1 PvE módban
    myNickname = "Játékos"; 
    oppNickname = "Gonosz AI";
    
    const p1Team = getRandomTeam();
    oppDraftTeam = getRandomTeam(); // Az AI csapata előre legenerálva
    const p1Items = getRandomItems();
    oppItemIds = getRandomItems();  // Az AI tárgyai előre legenerálva
    
    // Nem a játékot indítjuk, hanem a draft (sorrendező) képernyőt
    setupDraft(p1Team, p1Items);
    oppIsReady = true; // Az AI azonnal "készen áll" (setupDraft után, mert az reseteli)
    
    logMessage("--- PVE MÓD: Állítsd be a kezdőcsapatod sorrendjét! ---", "log-system");
    // P1 kezd, így nem indítjuk el azonnal az AI-t
}

function runAITestMove() {
    if (gameState.gameOver) return;

    // Szigorú lezárás ellenőrzés: ha animáció vagy K.O. van folyamatban, várjunk 100ms-ot és próbáljuk újra
    if (isActionLocked) {
        setTimeout(runAITestMove, 100);
        return;
    }

    // Ellenőrizzük, hogy az ai.js betöltött-e
    if (typeof getAIMove !== 'function') {
        console.error("AI logika (getAIMove) nem található! Ellenőrizd az ai.js-t.");
        return;
    }
    
    const pId = gameState.activePlayer;
    const oppId = pId === 'p1' ? 'p2' : 'p1';
    const moveResult = getAIMove(gameState[pId], gameState[oppId]);

    if (moveResult === null) {
        endTurnPhase(pId);
        return;
    }

    if (typeof moveResult === 'object' && moveResult.type === 'item') {
        const payload = {
            type: 'USE_ITEM',
            itemIndex: moveResult.itemIndex
        };
        applyItem(pId, payload);
        setTimeout(runAITestMove, isTestMode ? 250 : 1500); 
        return;
    }
    
    const moveIdx = moveResult;
    const attackerCard = gameState[pId].team[gameState[pId].activeIndex];
    const move = moveIdx !== 'charge' ? attackerCard.attacks[moveIdx] : null;
    
    let isMiss = false;
    let damagePerHit = 0;

    if (move) {
        const hitChance = move.accuracy !== undefined ? move.accuracy : 1.0;
        isMiss = Math.random() > hitChance;

        if (move.type === "dmg") {
            let hitCount = move.hits || 1;
            let baseDmgPerHit = move.dmg / hitCount;
            let variance = baseDmgPerHit * 0.2;
            damagePerHit = Math.floor(baseDmgPerHit + (Math.random() * variance * 2) - variance);
        }
    }

    const payload = {
        type: 'MOVE',
        attackIndex: moveIdx,
        isMiss: isMiss,
        isCrit: Math.random() < 0.15,
        damagePerHit: damagePerHit
    };

    applyMove(pId, payload);
}
