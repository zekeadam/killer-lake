// --- 5. TEST MÓD (AI vs AI) ---

// Test gomb létrehozása és injektálása
const testBtn = document.createElement('button');
testBtn.innerText = 'Test';
testBtn.className = 'test-btn';
testBtn.onclick = () => {
    const menu = document.createElement('div');
    menu.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        background: rgba(10, 10, 20, 0.6); padding: 30px; border-radius: 20px;
        border: 2px solid #e94560; z-index: 10001; display: flex; flex-direction: column;
        gap: 15px; box-shadow: 0 0 50px rgba(0,0,0,0.9); backdrop-filter: blur(10px);
        min-width: 250px;
    `;

    const title = document.createElement('div');
    title.innerText = "DEBUG MENÜ";
    title.style.cssText = "color: #f1c40f; font-weight: bold; text-align: center; margin-bottom: 10px; letter-spacing: 2px;";
    menu.appendChild(title);

    const btnAI = document.createElement('button');
    btnAI.innerText = "🤖 AI vs AI SZIMULÁCIÓ";
    btnAI.style.cssText = "padding: 12px; background: #e94560; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; transition: 0.2s;";
    btnAI.onclick = () => { menu.remove(); startTestMode(); };
    menu.appendChild(btnAI);

    const btnTable = document.createElement('button');
    btnTable.innerText = "📊 KÁRTYA TÁBLÁZAT";
    btnTable.style.cssText = "padding: 12px; background: #3498db; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; transition: 0.2s;";
    btnTable.onclick = () => { menu.remove(); window.open('pages/test_cards.html', '_blank'); };
    menu.appendChild(btnTable);

    const btnSim = document.createElement('button');
    btnSim.innerText = "📊 BATCH AI SZIMULÁCIÓ";
    btnSim.style.cssText = "padding: 12px; background: #9b59b6; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; transition: 0.2s;";
    btnSim.onclick = () => { menu.remove(); window.open('pages/simulate.html', '_blank'); };
    menu.appendChild(btnSim);

    const btnClose = document.createElement('button');
    btnClose.innerText = "BEZÁRÁS";
    btnClose.style.cssText = "padding: 8px; background: transparent; color: #555; border: 1px solid #333; border-radius: 8px; cursor: pointer; font-size: 0.8rem; margin-top: 10px;";
    btnClose.onclick = () => menu.remove();
    menu.appendChild(btnClose);

    document.body.appendChild(menu);
};
document.body.appendChild(testBtn);

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
