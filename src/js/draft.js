// --- 2. DRAFT (CSAPATÖSSZEÁLLÍTÓ) FÁZIS ---

function setupDraft(teamIds, itemIds) {
    iAmReady = false;
    oppIsReady = false;
    myDraftTeam = teamIds;
    myItemIds = itemIds || [];
    document.getElementById('lobby-screen').style.display = 'none';
    document.getElementById('victory-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('draft-screen').style.display = 'flex';

    // Elrejtjük a Google bejelentkezést Test módban
    const authContainer = document.getElementById('auth-container');
    if (authContainer) {
        authContainer.style.display = isTestMode ? 'none' : 'flex';
    }

    const readyBtn = document.getElementById('ready-btn');
    if (readyBtn) {
        readyBtn.disabled = false;
        readyBtn.innerText = "Harcra fel!";
    }
    document.getElementById('draft-status').innerText = "";
    
    const nameHeader = document.querySelector('.player-names-header');
    if (nameHeader) nameHeader.style.display = 'none';

    renderDraft();
}

function renderDraft() {
    const container = document.getElementById('my-draft-team');
    container.innerHTML = '';
    
    myDraftTeam.forEach((id, index) => {
        const cardData = cardDatabase.find(c => c.id === id);
        
        const cardEl = document.createElement('div');
        cardEl.className = 'draft-card card tooltip-bottom';
        cardEl.draggable = true;
        cardEl.dataset.index = index;
        
        let attacksHtml = '';
        if (cardData.attacks) {
            cardData.attacks.forEach(attack => {
                let icon = "⚔️";
                if (attack.type === 'heal') icon = "🧪";
                if (attack.type === 'shield') icon = "🛡️";
                
                let dmgText = "---";
                let hitText = "---";
                let effectText = "";

                if (attack.type === 'dmg') {
                    const hits = attack.hits || 1;
                    const acc = Math.round((attack.accuracy !== undefined ? attack.accuracy : 1.0) * 100);
                    dmgText = `💥${attack.dmg} DMG`;
                    hitText = `🎯${hits}x | 🎲${acc}%`;
                    if (attack.effect === 'burn') { effectText = "🔥 ÉGÉS"; icon = "🔥"; }
                    else if (attack.effect === 'paralyze') { effectText = "⚡ BÉNÍT"; icon = "⚡"; }
                    else if (attack.effect === 'poison') { effectText = "☠️ MÉREG"; icon = "☠️"; }
                    else if (attack.effect === 'mark') { effectText = "🎯 JELÖL"; icon = "🎯"; }
                    else if (attack.effect === 'lifesteal') { effectText = "🦇 VÁMPÍR"; icon = "🦇"; }
                    else if (attack.effect === 'counter') { effectText = "⚔️ COUNTER"; icon = "⚔️"; }
                    if (attack.synergy === 'mark') { effectText += " (🎯+50%)"; }
                } else if (attack.type === 'heal') {
                    dmgText = `💚+${attack.healAmount} HP`;
                    hitText = "🧪 GYÓGYUL";
                    effectText = "🧪 REGEN";
                } else if (attack.type === 'shield') {
                    dmgText = "🛡️ VÉD";
                    hitText = "🛡️ AKTÍV";
                    effectText = "🛡️ PAJZS";
                }

                attacksHtml += `<button style="pointer-events:none;"><div class="btn-title"><span class="truncate-text">${icon} ${attack.name}</span></div><div class="btn-row"><span>${dmgText}</span><span>${hitText}</span></div><div class="btn-row"><span>⚡${attack.cost} AP</span><span class="btn-eff">${effectText}</span></div></button>`;
            });
            for(let i = cardData.attacks.length; i < 4; i++) {
                 attacksHtml += `<button disabled style="pointer-events:none;">--- <span>Üres slot</span></button>`;
            }
        }

        cardEl.innerHTML = `
            <div class="card-body" style="pointer-events: none;">
                <div class="hp-bar" style="pointer-events: none;"><div class="hp-fill" style="width: 100%; background-color: #2ecc71;"></div></div>
                <div class="card-body-stats">
                    <div class="stat-hp">❤️ <span>${cardData.maxHp}</span></div>
                    <div class="stat-ap">⚡ <span>2</span></div>
                </div>
                <img src="${cardData.image}" class="card-image" style="display: block;">
            </div>
            <div class="attacks" style="pointer-events: none;">
                ${attacksHtml}
            </div>
        `;

        container.appendChild(cardEl);

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
    if (!loggedInUser && !isTestMode) {
        alert("A játékhoz (PVP és PVE) kötelező bejelentkezni a Google fiókoddal a ranglista miatt!");
        return;
    }
    
    myNickname = loggedInUser ? loggedInUser.displayName : "Ismeretlen";
    iAmReady = true;
    document.getElementById('ready-btn').disabled = true;
    document.getElementById('ready-btn').innerText = "Készen állsz!";
    
    if (isPvEMode || isTestMode) {
        oppIsReady = true;
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
        document.getElementById('game-screen').style.display = 'flex';
        
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
