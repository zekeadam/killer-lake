let peer;
let conn;
let myRole = null; // 'p1' (Host) vagy 'p2' (Guest)
let gameState;
let isTestMode = false;
let isPvEMode = false;
let isActionLocked = false; // Spam-védelem az auto-clicker ellen

let battleStats = {
    p1: { damageDealt: 0, healingDone: 0, attacksLanded: 0, itemsUsed: 0 },
    p2: { damageDealt: 0, healingDone: 0, attacksLanded: 0, itemsUsed: 0 },
    turns: 0
};

let myNickname = "Játékos 1";
let oppNickname = "Játékos 2";

// --- ÚJ: HANG RENDSZER (Online MP3 streamelés) ---
// Ide bármilyen weben található hang linkjét berakhatod! (Nem kell letölteni fájlokat)
const soundURLs = {
    damage_normal: "https://www.myinstants.com/media/sounds/sword-hit-with-blood.mp3", // MEGSZÓLAL: Amikor a karakter ténylegesen sebet kap (nem pajzsot).
    damage_burn: "https://www.myinstants.com/media/sounds/fireball-incoming.mp3",    // MEGSZÓLAL: Égési sérülés elszenvedésekor (találatkor vagy kör végén).
    damage_paralyze: "https://www.myinstants.com/media/sounds/electricity_us849kj.mp3",// MEGSZÓLAL: Bénító sebzés (villám) becsapódásakor.
    shield_break: "https://www.myinstants.com/media/sounds/metal-pipe-sound.mp3", // MEGSZÓLAL: Amikor egy pajzs megsemmisül.
    miss: "https://www.myinstants.com/media/sounds/woosh_s21KzKN.mp3",        // MEGSZÓLAL: Amikor a támadás célt téveszt vagy kikerülik.
    shield: "https://www.myinstants.com/media/sounds/energy-generator-bounce.mp3",     // MEGSZÓLAL: Amikor a karakter pajzsot (Shield) kap (saját támadásból vagy itemből).
    heal: "https://www.myinstants.com/media/sounds/health-potion.mp3",        // MEGSZÓLAL: Életerő (HP) visszatöltésekor, legyen az képesség vagy gyógyító item.
    charge: "https://www.myinstants.com/media/sounds/z-charge.mp3"       // MEGSZÓLAL: Amikor a játékos az "ENERGIA TÖLTÉS" (+1 AP, kör kimaradása) gombra kattint.
};

const audioCache = {};
// Előre betöltjük a böngészőbe a linkeket, hogy azonnal szóljanak
for (const [key, url] of Object.entries(soundURLs)) {
    audioCache[key] = new Audio(url);
    audioCache[key].volume = 0.5; // Hangerő 50%
}

function playSound(type) {
    if (audioCache[type]) {
        // A cloneNode() teszi lehetővé, hogy a hang akár átfedésben is megszólaljon (gyors kattintásnál)
        const soundClone = audioCache[type].cloneNode();
        soundClone.volume = audioCache[type].volume;
        soundClone.play().catch(e => {
            // A böngészők blokkolhatják az első kattintás előtti lejátszást
        });
    }
}

// --- OPTIMALIZÁLT ADATOK BETÖLTÉSE ---
const optScript = document.createElement('script');
optScript.src = 'optimized_cards.js';
optScript.onload = () => {
    if (typeof optimizedCardOverrides !== 'undefined') {
        cardDatabase.forEach(card => {
            const override = optimizedCardOverrides[card.id];
            if (override) {
                if (override.maxHp !== undefined) card.maxHp = override.maxHp;
                if (override.attacks) {
                    card.attacks.forEach((atk, i) => {
                        if (override.attacks[i]) Object.assign(atk, override.attacks[i]);
                    });
                }
            }
        });
    }
};
document.head.appendChild(optScript);

// --- DRAFT VÁLTOZÓK ---
let myDraftTeam = [];
let oppDraftTeam = [];
let myItemIds = [];
let oppItemIds = [];
let iAmReady = false;
let oppIsReady = false;
let draggedIndex = null;

// --- 1. HÁLÓZATI ÉS LOBBY LOGIKA ---

/**
 * Segédfüggvény: Csak akkor ad tooltipet az elemnek, ha a szöveg tényleg csonkolva van.
 */
function setTooltipIfOverflows(container, textElement, fullText) {
    container.classList.remove('has-tooltip');
    container.removeAttribute('data-tooltip');
    // Megvárjuk, amíg a böngésző kirajzolja az elemet (layout), így pontosak lesznek a szélességek
    requestAnimationFrame(() => {
        if (textElement.scrollWidth > textElement.clientWidth) {
            container.classList.add('has-tooltip');
            container.setAttribute('data-tooltip', fullText);
        }
    });
}

peer = new Peer();

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
    btnTable.onclick = () => { menu.remove(); window.open('test_cards.html', '_blank'); };
    menu.appendChild(btnTable);

    const btnSim = document.createElement('button');
    btnSim.innerText = "📊 BATCH AI SZIMULÁCIÓ";
    btnSim.style.cssText = "padding: 12px; background: #9b59b6; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; transition: 0.2s;";
    btnSim.onclick = () => { menu.remove(); window.open('simulate.html', '_blank'); };
    menu.appendChild(btnSim);

    const btnClose = document.createElement('button');
    btnClose.innerText = "BEZÁRÁS";
    btnClose.style.cssText = "padding: 8px; background: transparent; color: #555; border: 1px solid #333; border-radius: 8px; cursor: pointer; font-size: 0.8rem; margin-top: 10px;";
    btnClose.onclick = () => menu.remove();
    menu.appendChild(btnClose);

    document.body.appendChild(menu);
};
document.body.appendChild(testBtn);

peer.on('open', (id) => {
    const titleEl = document.querySelector('.lobby-box h2');
    if (titleEl) {
        titleEl.innerText = 
`█▄▀ █ █ █ █▀▀ █▀█  █░░ ▄▀█ █▄▀ █▀▀
█░█ █ █▄▄ █▄▄ █▄▄ █▀▄  █▄▄ █▀█ █░█ █▄▄`;
    }

    document.getElementById('my-peer-id').innerText = id;

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
    isPvEMode = false;
    isTestMode = false;
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
    isPvEMode = false;
    isTestMode = false;
    setupConnection();
}

function getRandomTeam() {
    let team = [];
    const charCards = cardDatabase.filter(c => !c.type || c.type === 'character');
    for (let i = 0; i < 5; i++) {
        const randomCard = charCards[Math.floor(Math.random() * charCards.length)];
        team.push(randomCard.id);
    }
    return team;
}

function getRandomItems() {
    let items = [];
    const itemCards = cardDatabase.filter(c => c.type === 'item' || c.type === 'supporter');
    if (itemCards.length > 0) {
        for (let i = 0; i < 3; i++) {
            const randomCard = itemCards[Math.floor(Math.random() * itemCards.length)];
            items.push(randomCard.id);
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

// --- 2. DRAFT (CSAPATÖSSZEÁLLÍTÓ) FÁZIS ---

function setupDraft(teamIds, itemIds) {
    iAmReady = false;
    oppIsReady = false;
    myDraftTeam = teamIds;
    myItemIds = itemIds || [];
    document.getElementById('lobby-screen').style.display = 'none';
    document.getElementById('victory-screen').style.display = 'none';
    document.getElementById('draft-screen').style.display = 'flex';
    renderDraft();
}

function renderDraft() {
    const container = document.getElementById('my-draft-team');
    container.innerHTML = '';
    
    myDraftTeam.forEach((id, index) => {
        const cardData = cardDatabase.find(c => c.id === id);
        
        const cardEl = document.createElement('div');
        cardEl.className = 'draft-card tooltip-bottom';
        cardEl.draggable = true;
        cardEl.dataset.index = index;
        
        cardEl.innerHTML = `
            <div class="order-badge">${index + 1}.</div>
            <img src="${cardData.image}">
            <div class="draft-name"><span class="truncate-text">${cardData.name}</span></div>
        `;

        container.appendChild(cardEl);
        
        // Tooltip ellenőrzése
        const nameSpan = cardEl.querySelector('.truncate-text');
        setTooltipIfOverflows(cardEl, nameSpan, cardData.name);

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
    });
}

function confirmTeamOrder() {
    const nickInput = document.getElementById('nickname-input').value.trim();
    if (!nickInput && !isPvEMode) {
        alert("PVP módban kötelező megadni egy nicknevet!");
        return;
    }
    myNickname = nickInput || "Játékos";
    iAmReady = true;
    document.getElementById('ready-btn').disabled = true;
    document.getElementById('ready-btn').innerText = "Készen állsz!";
    
    if (isPvEMode) {
        checkStartGame();
    } else {
        document.getElementById('draft-status').innerText = "Várakozás az ellenfélre...";
        if (conn) conn.send({ type: 'READY', team: myDraftTeam, items: myItemIds, name: myNickname });
        checkStartGame();
    }
}

function checkStartGame() {
    if (iAmReady && oppIsReady) {
        document.getElementById('draft-screen').style.display = 'none';
        document.getElementById('game-screen').style.display = 'block';
        
        let finalP1, finalP2, itemsP1, itemsP2;

        // Explicit meghatározás: ki az egyes és ki a kettes játékos
        if (myRole === 'p1') {
            finalP1 = [...myDraftTeam];  // Én vagyok a Host (p1)
            finalP2 = [...oppDraftTeam]; // Az ellenfél a Guest (p2)
            itemsP1 = [...myItemIds];
            itemsP2 = [...oppItemIds];
        } else {
            finalP1 = [...oppDraftTeam]; // Az ellenfél a Host (p1)
            finalP2 = [...myDraftTeam];  // Én vagyok a Guest (p2)
            itemsP1 = [...oppItemIds];
            itemsP2 = [...myItemIds];
        }

        initGame(finalP1, finalP2, itemsP1, itemsP2);
    }
}

// --- 3. JÁTÉK MOTOR ÉS LOGIKA ---

function buildTeamObjects(teamIds) {
    return teamIds.map(id => {
        const cardData = cardDatabase.find(c => c.id === id);
        let card = JSON.parse(JSON.stringify(cardData));
        card.hp = card.maxHp;
        card.isParalyzed = false;
        card.paraImmune = false;
        card.burnTurns = 0;
        card.burnStacks = 0;
        card.shields = 0;
        card.isMarked = false;
        card.hasCounter = false;
        card.poisonStacks = 0;
        card.poisonTurns = 0;
        return card;
    });
}

function initGame(p1TeamIds, p2TeamIds, p1ItemIds, p2ItemIds) {
    gameState = {
        activePlayer: 'p1',
        gameOver: false,
        p1: { team: buildTeamObjects(p1TeamIds), activeIndex: 0, ap: 2, items: p1ItemIds || [], itemUsedThisTurn: false },
        p2: { team: buildTeamObjects(p2TeamIds), activeIndex: 0, ap: 2, items: p2ItemIds || [], itemUsedThisTurn: false }
    };
    
    battleStats = {
        p1: { damageDealt: 0, healingDone: 0, attacksLanded: 0, itemsUsed: 0 },
        p2: { damageDealt: 0, healingDone: 0, attacksLanded: 0, itemsUsed: 0 },
        turns: 0
    };

    document.getElementById('log').innerHTML = "";
    
    // Nevek beállítása és megjelenítése a fejlécben
    const name1 = myRole === 'p1' ? myNickname : oppNickname;
    const name2 = myRole === 'p2' ? myNickname : oppNickname;
    
    const p1El = document.getElementById('p1-name-display');
    p1El.innerHTML = `<span class="truncate-text">${name1}</span>`;
    p1El.className = 'player-name tooltip-bottom';
    setTooltipIfOverflows(p1El, p1El.querySelector('.truncate-text'), name1);

    const p2El = document.getElementById('p2-name-display');
    p2El.innerHTML = `<span class="truncate-text">${name2}</span>`;
    p2El.className = 'player-name tooltip-bottom';
    setTooltipIfOverflows(p2El, p2El.querySelector('.truncate-text'), name2);

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
            void proj.offsetWidth; // Kényszerített újrarajzolás a kezdőpozíció rögzítéséhez

            const trailInterval = setInterval(() => {
                const r = proj.getBoundingClientRect();
                if (r.top === 0 && r.left === 0) return;
                spawnParticles(r.left + 25, r.top + 25, color, isMulti ? 2 : 6, isMulti ? 15 : 35);
            }, 25);

            setTimeout(() => {
                proj.style.transform = `translate(${targetX - startX}px, ${targetY - startY}px) rotate(${360 + Math.random() * 360}deg)`;
            }, 20);

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
        
        const h2Elem = document.querySelector(`#${player}-card h2`);
        h2Elem.innerHTML = `<span class="truncate-text">${activeCard.name}</span>`;
        h2Elem.className = 'tooltip-bottom';
        setTooltipIfOverflows(h2Elem, h2Elem.querySelector('.truncate-text'), activeCard.name);
        
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

    // Segédfüggvény új dinamikus jelvények létrehozására
    function ensureBadge(p, type, icon) {
        let el = document.getElementById(`${p}-${type}`);
        if (!el) {
            const cont = document.querySelector(`#${p}-card .status-container`);
            if (cont) {
                el = document.createElement('div');
                el.id = `${p}-${type}`;
                el.className = `status-badge badge-${type}`;
                el.innerHTML = icon;
                cont.appendChild(el);
            }
        }
        return el;
    }

        // Flex használata a block helyett, hogy a CSS-ben lévő igazítások működjenek
        document.getElementById(`${player}-para`).style.display = activeCard.isParalyzed ? 'flex' : 'none';
        const immuneBadge = ensureBadge(player, 'immune', '🛡️⚡');
        if (immuneBadge) immuneBadge.style.display = activeCard.paraImmune ? 'flex' : 'none';

        const burnBadge = document.getElementById(`${player}-burn`);
        if (burnBadge) {
            burnBadge.style.display = activeCard.burnTurns > 0 ? 'flex' : 'none';
            burnBadge.innerHTML = activeCard.burnStacks > 1 ? `🔥x${activeCard.burnStacks}` : `🔥`;
        }
        
        const shieldBadge = document.getElementById(`${player}-shield`);
        if (activeCard.shields > 0) {
            shieldBadge.style.display = 'flex';
            shieldBadge.innerHTML = '🛡️'.repeat(activeCard.shields);
        } else {
            shieldBadge.style.display = 'none';
        }

    const poisonBadge = ensureBadge(player, 'poison', '☠️');
    if (poisonBadge) {
        poisonBadge.style.display = activeCard.poisonTurns > 0 ? 'flex' : 'none';
        poisonBadge.innerHTML = activeCard.poisonStacks > 1 ? `☠️x${activeCard.poisonStacks}` : `☠️`;
    }
    const markBadge = ensureBadge(player, 'mark', '🎯');
    if (markBadge) markBadge.style.display = activeCard.isMarked ? 'flex' : 'none';
    const counterBadge = ensureBadge(player, 'counter', '⚔️');
    if (counterBadge) counterBadge.style.display = activeCard.hasCounter ? 'flex' : 'none';

        cardElem.classList.toggle('status-shield', activeCard.shields > 0);
        cardElem.classList.toggle('status-burn', activeCard.burnTurns > 0);
        cardElem.classList.toggle('status-para', activeCard.isParalyzed);
    cardElem.classList.toggle('status-poison', activeCard.poisonTurns > 0);
    cardElem.classList.toggle('status-mark', activeCard.isMarked);
    cardElem.classList.toggle('status-counter', activeCard.hasCounter);

        const isCurrentTurn = gameState.activePlayer === player;
        cardElem.classList.toggle('active-card', isCurrentTurn);

        const isMyTurn = (myRole === player) && isCurrentTurn && !isActionLocked;

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
                    const acc = Math.round((move.accuracy !== undefined ? move.accuracy : 1.0) * 100);
                    dmgText = `💥${move.dmg} DMG`;
                    hitText = `🎯${hits}x | 🎲${acc}%`;
                    if (move.effect === "burn") { effectText = "🔥 ÉGÉS"; icon = "🔥"; }
                    else if (move.effect === "paralyze") { effectText = "⚡ BÉNÍT"; icon = "⚡"; }
                else if (move.effect === "poison") { effectText = "☠️ MÉREG"; icon = "☠️"; }
                else if (move.effect === "mark") { effectText = "🎯 JELÖL"; icon = "🎯"; }
                else if (move.effect === "lifesteal") { effectText = "🦇 VÁMPÍR"; icon = "🦇"; }
                else if (move.effect === "counter") { effectText = "⚔️ COUNTER"; icon = "⚔️"; }
                
                if (move.synergy === "mark") { effectText += " (🎯+50%)"; }
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

            btn.innerHTML = `<div class="btn-title"><span class="truncate-text">${icon} ${move.name}</span></div><div class="btn-row"><span>${dmgText}</span><span>${hitText}</span></div><div class="btn-row"><span>⚡${move.cost} AP</span><span class="btn-eff">${effectText}</span></div>`;
            setTooltipIfOverflows(btn, btn.querySelector('.truncate-text'), move.name);

            const isShieldFull = move.type === "shield" && activeCard.shields >= 2;
            btn.disabled = (!isMyTurn || pState.ap < move.cost || gameState.gameOver || isShieldFull);
                btn.onclick = () => executeMove(player, currentAttackIdx);
                attackBtnIdx++;
            }
        });

        // Elemek (Items/Supporters) megjelenítése
        const itemContainerId = `${player}-items`;
        let itemContainer = document.getElementById(itemContainerId);
        if (!itemContainer) {
            itemContainer = document.createElement('div');
            itemContainer.id = itemContainerId;
            itemContainer.className = 'item-container';
            document.getElementById(`${player}-card`).parentElement.appendChild(itemContainer);
        }
        itemContainer.innerHTML = '';
        pState.items.forEach((itemId, idx) => {
            const cardData = cardDatabase.find(c => c.id === itemId);
            const action = cardData.action || {};
            const btn = document.createElement('button');
            btn.className = 'item-btn';
            
            let icon = "🎴";
            let dmgText = "---";
            let hitText = "---";
            let effectText = "";

            if (action.type === "dmg") {
                icon = action.effect === "paralyze" ? "⚡" : "⚔️";
                dmgText = `💥${action.dmg} DMG`;
                hitText = `🎯ITEM`;
                effectText = action.effect === "paralyze" ? "⚡ BÉNÍT" : "";
            } else if (action.type === "heal") {
                icon = "🧪";
                dmgText = `💚+${action.healAmount} HP`;
                hitText = "🧪 REGEN";
                effectText = "🧪 GYÓGYUL";
            } else if (action.type === "shield") {
                icon = "🛡️";
                dmgText = "🛡️ VÉD";
                hitText = `🛡️+${action.amount}`;
                effectText = "🛡️ PAJZS";
            } else if (action.type === "status") {
                icon = "🔥";
                dmgText = "🔥 ÉGÉS";
                hitText = "☣️ STÁTUSZ";
                effectText = "🔥 ÉGÉS";
            } else if (action.type === "ap_drain") {
                icon = "⚡";
                dmgText = `⚡-${action.amount} AP`;
                hitText = "⚡ ELVONÁS";
                effectText = "⚡ DRAIN";
            }

            btn.innerHTML = `
                <img src="${cardData.image}" class="item-img"> 
            <div class="btn-title"><span class="truncate-text">${icon} ${cardData.name}</span></div>
                <div class="btn-row"><span>${dmgText}</span><span>${hitText}</span></div>
                <div class="btn-row"><span>✨ INGYENES</span><span class="btn-eff">${effectText}</span></div>
            `;
        setTooltipIfOverflows(btn, btn.querySelector('.truncate-text'), cardData.name);

        const isItemShieldFull = action.type === "shield" && activeCard.shields >= 2;
        btn.disabled = (!isMyTurn || gameState.gameOver || isItemShieldFull || pState.itemUsedThisTurn);
            btn.onclick = () => executeItem(player, idx);
            itemContainer.appendChild(btn);
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
        const winnerId = gameState.p1.activeIndex < 5 ? 'p1' : 'p2';
        const loserId = winnerId === 'p1' ? 'p2' : 'p1';
        const winnerName = winnerId === myRole ? myNickname : oppNickname;
        const loserName = loserId === myRole ? myNickname : oppNickname;
        
        // --- Módosítva: Most már az AI vs AI (Test Mode) és a PvE győzelmeket is mentjük a ranglistára ---
        updateGlobalStats(winnerName, true, battleStats[winnerId].damageDealt);
        updateGlobalStats(loserName, false, battleStats[loserId].damageDealt);

        logMessage(`Mérkőzés vége! ${winnerName} megnyerte a csatát!`, "success");
        document.getElementById('turn-indicator').innerText = "Vége";
        
        document.getElementById('victory-winner-text').innerHTML = `CSAPAT MEGSEMMISÍTVE!<br><br><span style="color: #fff;">${winnerName}</span><br>GYŐZÖTT!`;
        
        const statsHtml = `
            <div class="stat-row"><span class="stat-label">Körök száma:</span> <span class="stat-value">${Math.ceil((battleStats.turns || 0) / 2)}</span></div>
            <div class="stat-row"><span class="stat-label">Kiosztott sebzés:</span> <span class="stat-value">${battleStats[winnerId].damageDealt} vs ${battleStats[loserId].damageDealt}</span></div>
            <div class="stat-row"><span class="stat-label">Gyógyítás:</span> <span class="stat-value">${battleStats[winnerId].healingDone} vs ${battleStats[loserId].healingDone}</span></div>
            <div class="stat-row"><span class="stat-label">Használt tárgyak:</span> <span class="stat-value">${battleStats[winnerId].itemsUsed} vs ${battleStats[loserId].itemsUsed}</span></div>
        `;
        document.getElementById('victory-stats').innerHTML = statsHtml;

        const rematchBtn = document.getElementById('rematch-btn');
        if (rematchBtn) {
            if (isTestMode) {
                rematchBtn.style.display = 'none';
            } else {
                rematchBtn.style.display = 'inline-block';
                rematchBtn.innerText = "Visszavágó";
                rematchBtn.disabled = false;
            }
        }
        
        const copyLogBtn = document.getElementById('copy-log-btn');
        if (copyLogBtn) {
            copyLogBtn.style.display = isTestMode ? 'inline-block' : 'none';
            copyLogBtn.style.display = 'inline-block';
        }

        setTimeout(() => { 
            document.getElementById('victory-screen').style.display = 'flex'; 
        }, 800);
        
        updateUI();
        return true;
    }
    return false;
}

function handleVictoryButtonClick() {
    if (isPvEMode || isTestMode) {
        location.reload();
        return;
    }

    if (myRole === 'p1') {
        // A Host új generálást indít
        const p1TeamIds = getRandomTeam();
        const p2TeamIds = getRandomTeam();
        const p1ItemIds = getRandomItems();
        const p2ItemIds = getRandomItems();
        
        conn.send({ type: 'INIT', p1TeamIds: p1TeamIds, p2TeamIds: p2TeamIds, p1ItemIds: p1ItemIds, p2ItemIds: p2ItemIds });
        setupDraft(p1TeamIds, p1ItemIds);
    } else {
        // A Guest jelzi a visszavágó szándékát a Hostnak
        conn.send({ type: 'REMATCH_OFFER' });
        const btn = document.getElementById('rematch-btn');
        if (btn) {
            btn.innerText = "Várakozás...";
            btn.disabled = true;
        }
    }
}

// --- 4. AKCIÓK ÉS SZINKRONIZÁCIÓ ---

function executeMove(playerId, attackIndex) {
    // Szigorú ellenőrzés: Ne lehessen kattintani, ha nem a te köröd van, vagy már folyamatban van egy akció
    if (gameState.gameOver || myRole !== playerId || gameState.activePlayer !== playerId || isActionLocked) return;

    const attackerState = gameState[playerId];
    const attackerCard = attackerState.team[attackerState.activeIndex];

    // Dupla védelem a negatív AP ellen
    if (attackIndex !== 'charge') {
        const move = attackerCard.attacks[attackIndex];
        if (attackerState.ap < move.cost) return; 
    }

    // Akció lezárása és UI azonnali letiltása
    isActionLocked = true;
    updateUI();

    let isMiss = false;
    let damagePerHit = 0;

    if (attackIndex !== 'charge') {
        const move = attackerCard.attacks[attackIndex];
        
        // Rejtett pontosság (Hit Chance) kiszámítása
        const hitChance = move.accuracy !== undefined ? move.accuracy : 1.0;
        isMiss = Math.random() > hitChance;
        
        if (move.type === "dmg") {
            let variance = move.dmg * 0.2;
            damagePerHit = Math.floor(move.dmg + (Math.random() * variance * 2) - variance);
        }
    }

    let payload = {
        type: 'MOVE',
        attackIndex: attackIndex,
        isMiss: isMiss,
        isCrit: Math.random() < 0.15,
        damagePerHit: damagePerHit
    };

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

    const wasFullHP = (oppCard.hp >= oppCard.maxHp);

    if (data.attackIndex === 'charge') {
        attackerState.ap = Math.min(10, attackerState.ap + 1);
        logMessage(`⚡ <b>${attackerCard.name}</b> erőt gyűjt! (Kör kihagyása, extra AP)`, "log-ap");
        triggerAnimation(`${playerId}-card`, 'anim-charge', 600);
        playSound('charge');
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
        if (data.isMiss) {
            logMessage(`> A támadás célt tévesztett (Miss)!`, "status-effect");
            playSound('miss');
            if (checkWin()) return;
            endTurnPhase(playerId);
            return;
        }

        if (move.type === "dmg") {
            const hitCount = move.hits || 1;
            let dmgPerHit = data.damagePerHit;
            if (data.isCrit) {
                dmgPerHit = Math.floor(dmgPerHit * 1.5);
                triggerAnimation('container', 'screen-shake', 300);
            }

            if (oppCard.isMarked && move.synergy === 'mark') {
                dmgPerHit = Math.floor(dmgPerHit * 1.5);
                oppCard.isMarked = false; // Feléli a jelet
                logMessage(`> 🎯 KIVÉGZÉS! A célpont extra sebzést kapott a jelölés miatt!`, "crit");
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
                    if (battleStats && battleStats[playerId]) battleStats[playerId].damageDealt += dmgPerHit;
                }
            }
            
            if (oppCard.hasCounter && hitsLanded > 0) {
                attackerCard.hp -= 20; // 20 fix sebzés a visszatámadásból
                if (battleStats && battleStats[oppId]) battleStats[oppId].damageDealt += 20;
                logMessage(`> ⚔️ Visszatámadás! ${attackerCard.name} 20 sebzést kapott!`, "log-dmg");
                triggerAnimation(`${playerId}-card`, 'anim-damage', 400);
            }

            if (shieldsBroken > 0) {
                logMessage(`> ${oppCard.name} pajzsa elnyelt ${shieldsBroken} ütést! (${oppCard.shields} maradt)`, "log-shield");
            }

            const totalDamage = hitsLanded * dmgPerHit;
            triggerAnimation(`${oppId}-card`, 'anim-damage', 400);
            if (shieldsBroken > 0) playSound('shield_break');
            if (hitsLanded > 0) {
                if (move.effect === "burn") playSound('damage_burn');
                else if (move.effect === "paralyze") playSound('damage_paralyze');
                else playSound('damage_normal');
            }

            if (wasFullHP && oppCard.hp <= 0) {
                oppCard.hp = Math.max(1, Math.floor(oppCard.maxHp * 0.01));
                logMessage(`> 🛡️ KITARTÁS! One-shot védelem: ${oppCard.name} 1% élettel túlélte!`, "status-effect");
            }

            let critText = data.isCrit ? `<span class="crit">Kritikus Találat!</span> ` : "";
            if (hitsLanded > 0) {
                logMessage(`> ${critText}${hitsLanded} találat érte a célpontot: ${totalDamage} sebzéssel.`, "log-dmg");
            }
            
            if (move.effect === 'lifesteal' && totalDamage > 0) {
                const healAmtBase = Math.floor(totalDamage * 0.5);
                const actualHeal = Math.min(attackerCard.maxHp - attackerCard.hp, healAmtBase);
                attackerCard.hp += actualHeal;
                if (battleStats && battleStats[playerId]) battleStats[playerId].healingDone += actualHeal;
                logMessage(`> 🦇 Vámpír Csapás: ${attackerCard.name} visszaszívott ${actualHeal} HP-t!`, "log-heal");
                triggerAnimation(`${playerId}-card`, 'anim-heal', 600);
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
                if (move.effect === "paralyze" || move.effect === "burn" || move.effect === "poison" || move.effect === "mark") {
                    if (oppCard.shields > 0) {
                        oppCard.shields--;
                        logMessage(`> ${oppCard.name} pajzsa kivédte a státusz effektet!`, "log-shield");
                        playSound('shield_break');
                        triggerShieldScan(oppId);
                    } else {
                        if (move.effect === "paralyze") {
                            if (oppCard.paraImmune) {
                                logMessage(`> ${oppCard.name} ellenállt a bénításnak!`, "status-effect");
                            } else {
                                oppCard.isParalyzed = true;
                                logMessage(`> ${oppCard.name} megbénult!`, "status-effect");
                            }
                        } else if (move.effect === "burn") {
                            oppCard.burnStacks = Math.min(3, (oppCard.burnStacks || 0) + 1);
                            oppCard.burnTurns = 3;
                            logMessage(`> ${oppCard.name} meggyulladt! (Szint: ${oppCard.burnStacks})`, "crit");
                        } else if (move.effect === "poison") {
                            oppCard.poisonStacks = Math.min(3, (oppCard.poisonStacks || 0) + 1);
                            oppCard.poisonTurns = 3;
                            logMessage(`> ${oppCard.name} megmérgeződött! (Szint: ${oppCard.poisonStacks})`, "status-effect");
                        } else if (move.effect === "mark") {
                            oppCard.isMarked = true;
                            logMessage(`> ${oppCard.name} Célkeresztbe került (Megjelölve)!`, "status-effect");
                        }
                    }
                }
            }
        } else if (move.type === "heal") {
            const actualHeal = Math.min(attackerCard.maxHp - attackerCard.hp, move.healAmount);
            attackerCard.hp += actualHeal;
            if (battleStats && battleStats[playerId]) battleStats[playerId].healingDone += actualHeal;
            const rect = document.getElementById(`${playerId}-card`).getBoundingClientRect();
            spawnParticles(rect.left + rect.width/2, rect.top + rect.height/2, "#2ecc71", 45, 150);
            triggerAnimation(`${playerId}-card`, 'anim-heal', 600);
            playSound('heal');
            logMessage(`> ${attackerCard.name} visszatöltött ${actualHeal} Életerőt!`, "log-heal");
        } else if (move.type === "shield") {
            attackerCard.shields = Math.min(2, attackerCard.shields + 1);
            triggerShieldScan(playerId);
            playSound('shield');
            const rect = document.getElementById(`${playerId}-card`).getBoundingClientRect();
            spawnParticles(rect.left + rect.width/2, rect.top + rect.height/2, "#3498db", 45, 150);
            logMessage(`> ${attackerCard.name} felhúzott egy pajzsot.`, "log-shield");
        }
        
        if (move.effect === "counter") {
            attackerCard.hasCounter = true;
            logMessage(`> ${attackerCard.name} Visszatámadó (Counter) állásba lépett!`, "status-effect");
        }

        // Ha a visszatámadás (Counter) miatt az aktuális támadó meghalt
        if (attackerCard.hp <= 0) {
            logMessage(`> ${attackerCard.name} belehalt a visszatámadásba (K.O.)!`, "crit");
            attackerState.activeIndex++;
            if (attackerState.activeIndex < 5) {
                const nextCard = attackerState.team[attackerState.activeIndex];
                logMessage(`> <b>${nextCard.name}</b> lép a pályára!`, "log-system");
                triggerAnimation(`${playerId}-card`, 'anim-heal', 600);
            }
        }

        if (checkWin()) return;
        endTurnPhase(playerId);
    }, 450 + (move.hits || 1) * 70); // Időzítés igazítása az ütésszámhoz
}

function endTurnPhase(currentPlayerId) {
    const pState = gameState[currentPlayerId];
    let pCard = pState.team[pState.activeIndex];
    const oppId = currentPlayerId === 'p1' ? 'p2' : 'p1';

    if (pCard && pCard.poisonTurns > 0) {
        const pDmg = pCard.poisonStacks * 10;
        pCard.hp -= pDmg;
        if (battleStats && battleStats[oppId]) battleStats[oppId].damageDealt += pDmg;
        pCard.poisonTurns--;
        logMessage(`${pCard.name} mérgezést szenvedett (${pDmg} DMG).`, "status-effect");
        triggerAnimation(`${currentPlayerId}-card`, 'anim-damage', 400);
        if (pCard.poisonTurns === 0) pCard.poisonStacks = 0;
        
        if (pCard.hp <= 0) {
            logMessage(`> ${pCard.name} belehalt a méregbe (K.O.)!`, "crit");
            pState.activeIndex++;
            if (pState.activeIndex < 5) {
                pCard = pState.team[pState.activeIndex];
                logMessage(`> <b>${pCard.name}</b> lép a pályára!`, "log-system");
                triggerAnimation(`${currentPlayerId}-card`, 'anim-heal', 600);
            }
        } else if (pCard.poisonTurns === 0) {
            logMessage(`> ${pCard.name} szervezete legyőzte a mérget.`);
        }
        if (checkWin()) return;
    }
    
    if (pCard && pCard.burnTurns > 0) {
        if (pCard.shields > 0) {
            pCard.shields--;
            pCard.burnTurns--;
            logMessage(`${pCard.name} pajzsa elnyelte az égést! (1 pajzs elveszett)`, "log-shield");
            playSound('shield_break');
            triggerShieldScan(currentPlayerId);
        } else {
            const bDmg = pCard.burnStacks * 20;
            pCard.hp -= bDmg;
            if (battleStats && battleStats[oppId]) battleStats[oppId].damageDealt += bDmg;
            pCard.burnTurns--;
            triggerAnimation(`${currentPlayerId}-card`, 'anim-damage', 400);
            playSound('damage_burn');
            logMessage(`${pCard.name} égési sérülést szenvedett (${bDmg} DMG).`, "crit");
        }
        
        if (pCard.hp <= 0) {
            logMessage(`> ${pCard.name} elégett és elájult (K.O.)!`, "crit");
            pState.activeIndex++;
            if (pState.activeIndex < 5) {
                pCard = pState.team[pState.activeIndex];
                logMessage(`> <b>${pCard.name}</b> lép a pályára!`, "log-system");
                triggerAnimation(`${currentPlayerId}-card`, 'anim-heal', 600);
            }
        } else if (pCard.burnTurns === 0) {
            logMessage(`> ${pCard.name} tüze kialudt.`);
        }
        
        if (pCard.burnTurns === 0) pCard.burnStacks = 0;
        
        if (checkWin()) return;
    }

    const nextPState = gameState[oppId];
    const nextPCard = nextPState.team[nextPState.activeIndex];

    if (nextPCard && nextPCard.isParalyzed) {
        nextPCard.isParalyzed = false;
        nextPCard.paraImmune = true; // Védettséget kap a következő körig
        logMessage(`-- ${nextPCard.name} bénult! Kimarad a köre (Nem kap AP-t). --`, "status-effect");
        updateUI();
        setTimeout(() => endTurnPhase(oppId), 1500); 
        return;
    } else if (nextPCard) {
        nextPCard.paraImmune = false; // Ha rendes köre van, lejárt a védettség
    }

    gameState.activePlayer = oppId;
    nextPState.ap = Math.min(10, nextPState.ap + 1); 
    nextPState.itemUsedThisTurn = false; // Új kör, újra lehet használni lapot
    if (nextPCard) {
        nextPCard.hasCounter = false; // Visszatámadó állás lejárt a saját kör elején
    }
    isActionLocked = false; // Akció zár feloldása a következő játékosnak
    updateUI();

    if (battleStats) battleStats.turns++;

    if ((isTestMode || (isPvEMode && oppId === 'p2')) && !gameState.gameOver) {
        setTimeout(runAITestMove, isTestMode ? 250 : 1000);
    }
}

function executeItem(playerId, itemIndex) {
    // Itt is lezárjuk az akciót, hogy ne lehessen 10ms alatt mind a 3 tárgyat ellőni
    if (gameState.gameOver || myRole !== playerId || gameState.activePlayer !== playerId || isActionLocked || gameState[playerId].itemUsedThisTurn) return;

    isActionLocked = true;
    updateUI();

    let payload = {
        type: 'USE_ITEM',
        itemIndex: itemIndex
    };

    if (conn) conn.send(payload);
    applyItem(playerId, payload);
}

function applyItem(playerId, data) {
    const pState = gameState[playerId];
    const itemId = pState.items[data.itemIndex];
    if (!itemId) return;

    pState.itemUsedThisTurn = true; // Jelöljük, hogy ebben a körben már használt lapot

    const cardData = cardDatabase.find(c => c.id === itemId);
    const action = cardData.action;

    const oppId = playerId === 'p1' ? 'p2' : 'p1';
    const oppState = gameState[oppId];
    const oppCard = oppState.team[oppState.activeIndex];
    const myCard = pState.team[pState.activeIndex];

    if (battleStats && battleStats[playerId]) battleStats[playerId].itemsUsed += 1;

    const wasFullHP = (oppCard.hp >= oppCard.maxHp);

    logMessage(`🎴 <b>${cardData.name}</b> kijátszva!`, "log-system");

    if (action.type === 'dmg') {
        let dmgToApply = action.dmg;
        if (oppCard.shields > 0) {
            oppCard.shields--;
            dmgToApply = 0; // A pajzs elnyeli a tárgy sebzését
            logMessage(`> ${oppCard.name} pajzsa elnyelte a tárgy sebzését!`, "log-shield");
            playSound('shield_break');
            triggerShieldScan(oppId);
        } else {
            oppCard.hp -= dmgToApply;
            if (battleStats && battleStats[playerId]) battleStats[playerId].damageDealt += dmgToApply;
            logMessage(`> ${cardData.name} sebzett ${dmgToApply}-t!`, "log-dmg");
            if (action.effect === "burn") playSound('damage_burn');
            else if (action.effect === "paralyze") playSound('damage_paralyze');
            else playSound('damage_normal');
        }

        triggerAnimation(`${oppId}-card`, 'anim-damage', 400);
        if (action.effect === 'paralyze') {
            if (oppCard.shields > 0) {
                oppCard.shields--;
                logMessage(`> ${oppCard.name} pajzsa kivédte a bénítást!`, "log-shield");
                playSound('shield_break');
                triggerShieldScan(oppId);
            } else {
                if (oppCard.paraImmune) {
                    logMessage(`> ${oppCard.name} ellenállt a bénításnak!`, "status-effect");
                } else {
                    oppCard.isParalyzed = true;
                    logMessage(`> ${oppCard.name} megbénult!`, "status-effect");
                }
            }
        }
    } else if (action.type === 'heal') {
        const actualHeal = Math.min(myCard.maxHp - myCard.hp, action.healAmount);
        myCard.hp += actualHeal;
        if (battleStats && battleStats[playerId]) battleStats[playerId].healingDone += actualHeal;
        logMessage(`> ${myCard.name} visszatöltött ${actualHeal} HP-t!`, "log-heal");
        triggerAnimation(`${playerId}-card`, 'anim-heal', 600);
        playSound('heal');
    } else if (action.type === 'shield') {
        const gained = Math.min(action.amount, 2 - myCard.shields);
        myCard.shields += gained;
        logMessage(`> ${myCard.name} kapott ${gained} pajzsot!`, "log-shield");
        triggerShieldScan(playerId);
        playSound('shield');
    } else if (action.type === 'status') {
        if (action.effect === 'burn') {
            if (oppCard.shields > 0) {
                oppCard.shields--;
                logMessage(`> ${oppCard.name} pajzsa kivédte az égést!`, "log-shield");
                playSound('shield_break');
                triggerShieldScan(oppId);
            } else {
                oppCard.burnStacks = Math.min(3, (oppCard.burnStacks || 0) + 1);
                oppCard.burnTurns = 3;
                logMessage(`> ${oppCard.name} meggyulladt! (Szint: ${oppCard.burnStacks})`, "crit");
            }
        }
    } else if (action.type === 'ap_drain') {
        oppState.ap = Math.max(0, oppState.ap - action.amount);
        logMessage(`> ${cardData.name} elszívott ${action.amount} AP-t!`, "status-effect");
    }

    pState.items.splice(data.itemIndex, 1);

    if (wasFullHP && oppCard.hp <= 0) {
        oppCard.hp = Math.max(1, Math.floor(oppCard.maxHp * 0.01));
        logMessage(`> 🛡️ KITARTÁS! ${oppCard.name} túlélte a tárgyat 1% élettel!`, "status-effect");
    }
    
    if (oppCard.hp <= 0) {
        logMessage(`> ${oppCard.name} elájult az itemtől (K.O.)!`, "crit");
        oppState.activeIndex++;
        if (oppState.activeIndex < 5) {
            const nextCard = oppState.team[oppState.activeIndex];
            logMessage(`> <b>${nextCard.name}</b> lép a pályára!`, "log-system");
            triggerAnimation(`${oppId}-card`, 'anim-heal', 600);
        }
    }

    if (checkWin()) return;
    isActionLocked = false; // Item kijátszása után újra lehet kattintani (mivel az item nem fejezi be a kört)
    updateUI();
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
            let variance = move.dmg * 0.2;
            damagePerHit = Math.floor(move.dmg + (Math.random() * variance * 2) - variance);
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

function copyBattleLog() {
    const logEl = document.getElementById('log');
    if (!logEl) return;
    
    const lines = Array.from(logEl.children)
        .map(el => el.innerText)
        .reverse()
        .join('\n');
        
    navigator.clipboard.writeText(lines).then(() => {
        const btn = document.getElementById('copy-log-btn');
        const origText = btn.innerText;
        btn.innerText = "Napló másolva!";
        setTimeout(() => btn.innerText = origText, 2000);
    });
}

function downloadBattleLog() {
    const logEl = document.getElementById('log');
    if (!logEl) return;
    
    const lines = Array.from(logEl.children)
        .map(el => el.innerText)
        .reverse()
        .join('\n');
        
    const blob = new Blob([lines], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `killer_lake_log_${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// --- ÚJ: GLOBÁLIS RANGLISTA (LEADERBOARD) LOGIKA (Firebase) ---

// IDE MÁSOLD BE A SAJÁT FIREBASE LINKEDET! (Ne felejtsd el a végét: /leaderboard)
const LEADERBOARD_API_URL = 'https://killer-lake-default-rtdb.europe-west1.firebasedatabase.app/leaderboard';

async function updateGlobalStats(playerName, isWinner, damageDealt) {
    if (!playerName) return;
    
    const safeName = playerName.replace(/[.#$\[\]/]/g, '').trim();
    
    try {
        const res = await fetch(`${LEADERBOARD_API_URL}/${encodeURIComponent(safeName)}.json`);
        let stats = await res.json() || { wins: 0, losses: 0, matches: 0, damage: 0 };
        
        // Ha régi formátumú adat (csak egy szám) volt ott, alakítsuk át
        if (typeof stats === 'number') {
            stats = { wins: stats, losses: 0, matches: stats, damage: 0 };
        }

        stats.matches += 1;
        stats.damage += (damageDealt || 0);
        if (isWinner) stats.wins += 1;
        else stats.losses += 1;
        
        await fetch(`${LEADERBOARD_API_URL}/${encodeURIComponent(safeName)}.json`, {
            method: 'PUT',
            body: JSON.stringify(stats)
        });
    } catch (error) {
        console.error('Nem sikerült menteni a szerverre:', error);
    }
}

async function showLeaderboard() {
    const modal = document.getElementById('leaderboard-modal');
    const list = document.getElementById('leaderboard-list');
    
    // Mutatunk egy töltőképernyőt, amíg az internetről jön az adat
    list.innerHTML = '<p style="color: #aaa; padding: 20px; text-align: center;">Várakozás a szerverre...</p>';
    modal.style.display = 'flex';
    
    try {
        const res = await fetch(`${LEADERBOARD_API_URL}.json`);
        let leaderboard = await res.json() || {};
        
        // Rendezés: Elsősorban Wins, másodsorban összes sebzés
        const sorted = Object.entries(leaderboard).sort((a, b) => {
            const aWins = typeof a[1] === 'object' ? a[1].wins : a[1];
            const bWins = typeof b[1] === 'object' ? b[1].wins : b[1];
            if (bWins !== aWins) return bWins - aWins;
            return (b[1].damage || 0) - (a[1].damage || 0);
        });
        
        list.innerHTML = '';
        if (sorted.length === 0) {
            list.innerHTML = '<p style="color: #aaa; padding: 20px; text-align: center;">Még nincsenek győzelmek rögzítve globálisan.</p>';
        } else {
            // Fejléc hozzáadása
            list.innerHTML = `
                <div class="leaderboard-entry leaderboard-header">
                    <span class="rank">#</span>
                    <span class="name">Név</span>
                    <span class="stat">W</span>
                    <span class="stat">L</span>
                    <span class="stat">M</span>
                    <span class="stat">Dmg</span>
                </div>`;

            sorted.forEach(([name, data], index) => {
                const s = typeof data === 'object' ? data : { wins: data, losses: 0, matches: data, damage: 0 };
                list.innerHTML += `
                    <div class="leaderboard-entry">
                        <span class="rank">#${index + 1}</span>
                        <span class="name truncate-text">${name}</span>
                        <span class="wins">${s.wins}</span>
                        <span class="stat">${s.losses || 0}</span>
                        <span class="stat">${s.matches || s.wins}</span>
                        <span class="dmg">${(s.damage || 0).toLocaleString()}</span>
                    </div>
                `;
            });
        }
    } catch (error) {
        list.innerHTML = '<p style="color: #e74c3c; padding: 20px; text-align: center;">Hiba a hálózati kapcsolatban.</p>';
    }
}

function closeLeaderboard() {
    document.getElementById('leaderboard-modal').style.display = 'none';
}