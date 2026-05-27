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
            // Host generálja a két random 5-ös csapatot
            const p1TeamIds = getRandomTeam();
            const p2TeamIds = getRandomTeam();
            
            conn.send({ type: 'INIT', p1TeamIds: p1TeamIds, p2TeamIds: p2TeamIds });
            setupDraft(p1TeamIds); // A Host a sajátját kapja
        } else {
            document.getElementById('connection-status').innerText = "Kártyák szinkronizálása...";
        }
    });

    conn.on('data', (data) => {
        if (data.type === 'INIT') {
            // A Guest megkapja a neki szánt csapatot
            setupDraft(data.p2TeamIds);
        } else if (data.type === 'READY') {
            // Az ellenfél végzett a rendezéssel
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
    document.getElementById('draft-screen').style.display = 'block';
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

        // Drag & Drop események
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
                // Elem áthelyezése a tömbben
                const movedItem = myDraftTeam.splice(draggedIndex, 1)[0];
                myDraftTeam.splice(targetIndex, 0, movedItem);
                renderDraft(); // Újrarajzolás
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
        
        // Szerepek alapján leosztjuk a végleges sorrendet
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
    logMessage("Mindkét játékos készen áll! A 5v5 mérkőzés elkezdődött. 1. Játékos kezd.");
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
        updateRoster(player); // Mini ikonok frissítése
        
        if (pState.activeIndex >= 5) return;

        const activeCard = pState.team[pState.activeIndex];
        const cardElem = document.getElementById(`${player}-card`);
        
        document.querySelector(`#${player}-card h2`).innerText = activeCard.name;
        document.querySelector(`#${player}-card .card-image`).src = activeCard.image;
        document.querySelector(`#${player}-card .card-image`).style.display = 'block';

        document.getElementById(`${player}-hp`).innerText = Math.max(0, activeCard.hp);
        document.getElementById(`${player}-ap`).innerText = pState.ap;