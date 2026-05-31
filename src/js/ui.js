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

function getCardImageCenter(playerId) {
    const cleanId = playerId.endsWith('-card') ? playerId : `${playerId}-card`;
    const cardEl = document.getElementById(cleanId);
    if (!cardEl) return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    
    const img = cardEl.querySelector('.card-image');
    let rect = null;
    if (img && img.style.display !== 'none' && img.offsetWidth > 0) {
        rect = img.getBoundingClientRect();
    } else {
        rect = cardEl.getBoundingClientRect();
    }
    
    let x = rect.left + rect.width / 2;
    let y = rect.top + rect.height / 2;
    
    // Biztonsági ellenőrzés ha a koordináták érvénytelenek (pl. 0 vagy NaN)
    if (isNaN(x) || x <= 0 || isNaN(y) || y <= 0) {
        const cardRect = cardEl.getBoundingClientRect();
        x = cardRect.left + cardRect.width / 2;
        y = cardRect.top + cardRect.height / 2;
        
        if (isNaN(x) || x <= 0) {
            x = window.innerWidth / 2;
            y = window.innerHeight / 2;
        }
    }
    
    return { x, y };
}

function spawnFloatingText(elementId, text, type, isCrit = false) {
    const center = getCardImageCenter(elementId);
    const x = center.x + (Math.random() * 60 - 30);
    const y = center.y + (Math.random() * 40 - 20) - 20;

    const f = document.createElement('div');
    f.className = `floating-text ${type}`;
    if (isCrit) f.classList.add('crit');
    f.innerText = text;
    f.style.left = `${x}px`;
    f.style.top = `${y}px`;

    document.body.appendChild(f);
    setTimeout(() => f.remove(), 1200);
}

function spawnBloodParticles(x, y, count = 18) {
    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'particle blood';
        const size = Math.random() * 8 + 6;
        const colors = ['#8b0000', '#ff0000', '#b22222', '#5c0000'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        p.style.left = x + 'px';
        p.style.top = y + 'px';
        p.style.backgroundColor = color;
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.boxShadow = `0 0 6px ${color}`;
        p.style.animationDuration = (Math.random() * 0.4 + 0.4) + 's';
        
        const tx = (Math.random() - 0.5) * 140; 
        const ty = Math.random() * 80 + 100;
        p.style.setProperty('--x', `${tx}px`);
        p.style.setProperty('--y', `${ty}px`);
        
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 800);
    }
}

function spawnShieldShatterParticles(x, y, count = 22) {
    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'particle shield-shard';
        const size = Math.random() * 12 + 6; 
        const colors = ['#3498db', '#00d2d3', '#00a8ff', '#ffffff'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        p.style.left = x + 'px';
        p.style.top = y + 'px';
        p.style.backgroundColor = color;
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.boxShadow = `0 0 10px ${color}`;
        p.style.animationDuration = (Math.random() * 0.3 + 0.4) + 's';
        
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 120 + 60;
        const tx = Math.cos(angle) * dist;
        const ty = Math.sin(angle) * dist;
        p.style.setProperty('--x', `${tx}px`);
        p.style.setProperty('--y', `${ty}px`);
        
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 700);
    }
}

function spawnStatusParticles(x, y, type, count = 12) {
    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'particle status-spark';
        const size = Math.random() * 8 + 4;
        
        let colors = [];
        if (type === 'burn') {
            colors = ['#ff4500', '#ff7f50', '#ff4757', '#ffa502'];
        } else if (type === 'poison') {
            colors = ['#2ecc71', '#8e44ad', '#9b59b6', '#2ed573'];
        } else if (type === 'paralyze') {
            colors = ['#ffff50', '#ffffff', '#eccc68'];
        } else {
            colors = ['#ffffff'];
        }
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        p.style.left = x + 'px';
        p.style.top = y + 'px';
        p.style.backgroundColor = color;
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.boxShadow = `0 0 8px ${color}`;
        p.style.animationDuration = (Math.random() * 0.4 + 0.4) + 's';
        
        const tx = (Math.random() - 0.5) * 60;
        const ty = -(Math.random() * 80 + 30);
        p.style.setProperty('--x', `${tx}px`);
        p.style.setProperty('--y', `${ty}px`);
        
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 850);
    }
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

    const startCenter = getCardImageCenter(fromId);
    const targetCenter = getCardImageCenter(toId);

    const projectileCount = hitCount;
    const isMulti = hitCount > 1;

    for (let i = 0; i < projectileCount; i++) {
        setTimeout(() => {
            const startX = startCenter.x + (Math.random() * 40 - 20);
            const startY = startCenter.y + (Math.random() * 40 - 20);
            const targetX = targetCenter.x;
            const targetY = targetCenter.y;

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

            let trailActive = true;
            const spawnTrail = () => {
                if (!trailActive) return;
                const r = proj.getBoundingClientRect();
                if (r.top !== 0 || r.left !== 0) {
                    spawnParticles(r.left + 25, r.top + 25, color, isMulti ? 1 : 3, isMulti ? 15 : 35);
                }
                requestAnimationFrame(spawnTrail);
            };
            requestAnimationFrame(spawnTrail);

            setTimeout(() => {
                proj.style.transform = `translate(${targetX - startX}px, ${targetY - startY}px) rotate(${360 + Math.random() * 360}deg)`;
            }, 20);

            setTimeout(() => {
                trailActive = false;
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

function getSpellIconPath(move) {
    if (!move) return 'assets/spell/strike.png';
    if (move.type === 'shield') return 'assets/spell/shield.png';
    if (move.type === 'heal') return 'assets/spell/heal.png';
    if (move.effect === 'counter') return 'assets/spell/counter.png';
    if (move.effect === 'lifesteal') return 'assets/spell/lifesteal.png';
    if (move.effect === 'mark') return 'assets/spell/mark.png';
    if (move.effect === 'poison') return 'assets/spell/poison.png';
    if (move.effect === 'paralyze') return 'assets/spell/paralyze.png';
    if (move.effect === 'burn') return 'assets/spell/burn.png';
    return 'assets/spell/strike.png';
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

        const paraBadge = document.getElementById(`${player}-para`);
        if (paraBadge) {
            paraBadge.style.display = activeCard.isParalyzed ? 'flex' : 'none';
            paraBadge.innerHTML = `<img src="assets/status/paralyze.png" class="status-img-icon">`;
        }

        const immuneBadge = ensureBadge(player, 'immune', '');
        if (immuneBadge) {
            immuneBadge.style.display = activeCard.paraImmune ? 'flex' : 'none';
            immuneBadge.innerHTML = `<img src="assets/status/immune.png" class="status-img-icon">`;
        }

        const burnBadge = document.getElementById(`${player}-burn`);
        if (burnBadge) {
            burnBadge.style.display = activeCard.burnTurns > 0 ? 'flex' : 'none';
            burnBadge.innerHTML = `
                <img src="assets/status/burn.png" class="status-img-icon">
                ${activeCard.burnStacks > 1 ? `<div class="status-stack">${activeCard.burnStacks}</div>` : ''}
            `;
        }
        
        const shieldBadge = document.getElementById(`${player}-shield`);
        if (activeCard.shields > 0) {
            shieldBadge.style.display = 'flex';
            shieldBadge.innerHTML = '🛡️'.repeat(activeCard.shields);
        } else {
            shieldBadge.style.display = 'none';
        }

        const poisonBadge = ensureBadge(player, 'poison', '');
        if (poisonBadge) {
            poisonBadge.style.display = activeCard.poisonTurns > 0 ? 'flex' : 'none';
            poisonBadge.innerHTML = `
                <img src="assets/status/poison.png" class="status-img-icon">
                ${activeCard.poisonStacks > 1 ? `<div class="status-stack">${activeCard.poisonStacks}</div>` : ''}
            `;
        }
        const markBadge = ensureBadge(player, 'mark', '');
        if (markBadge) {
            markBadge.style.display = activeCard.isMarked ? 'flex' : 'none';
            markBadge.innerHTML = `<img src="assets/status/mark.png" class="status-img-icon">`;
        }
        const counterBadge = ensureBadge(player, 'counter', '');
        if (counterBadge) {
            counterBadge.style.display = activeCard.hasCounter ? 'flex' : 'none';
            counterBadge.innerHTML = `<img src="assets/status/counter.png" class="status-img-icon">`;
        }

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
                btn.innerHTML = `
                    <img src="assets/spell/charge.png" class="spell-icon">
                    <div class="btn-text-content" style="align-items: center !important;">
                        <div class="btn-title" style="border-bottom: none !important; margin: 0 !important; padding: 0 !important; justify-content: center !important; text-align: center !important; width: 100% !important;">
                            🔋 ENERGIA TÖLTÉS (+1 AP)
                        </div>
                    </div>
                `;
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
                    else if (move.effect === "pierce") { effectText = "🗡️ PIERCE"; icon = "🗡️"; }
                    else if (move.effect === "ap_steal") { effectText = "⚡ AP LOPÁS"; icon = "⚡"; }
                
                if (move.synergy === "mark") { effectText += " (🎯+50%)"; }
                } else if (move.type === "heal") {
                    dmgText = `💚+${move.healAmount} HP`;
                    hitText = "🧪 GYÓGYUL";
                    effectText = move.effect === "cleanse" ? "🌿 CLEANSE" : "🧪 REGEN";
                    icon = "🧪";
                } else if (move.type === "shield") {
                    dmgText = "🛡️ VÉD";
                    hitText = "🛡️ AKTÍV";
                    effectText = move.effect === "counter" ? "⚔️ COUNTER" : "🛡️ PAJZS";
                    icon = "🛡️";
                }

                const spellIcon = getSpellIconPath(move);
                btn.innerHTML = `
                    <img src="${spellIcon}" class="spell-icon">
                    <div class="btn-text-content">
                        <div class="btn-title"><span class="truncate-text">${icon} ${move.name}</span></div>
                        <div class="btn-row"><span>${dmgText}</span><span>${hitText}</span></div>
                        <div class="btn-row"><span>⚡${move.cost} AP</span><span class="btn-eff">${effectText}</span></div>
                    </div>
                `;
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
                if (action.effect === "burn") {
                    icon = "🔥";
                    dmgText = "🔥 ÉGÉS";
                    hitText = "☣️ STÁTUSZ";
                    effectText = "🔥 ÉGÉS";
                } else if (action.effect === "poison") {
                    icon = "☠️";
                    dmgText = "☠️ MÉREG";
                    hitText = "☣️ STÁTUSZ";
                    effectText = "☠️ MÉREG";
                } else if (action.effect === "mark") {
                    icon = "🎯";
                    dmgText = "🎯 JELÖLÉS";
                    hitText = "☣️ STÁTUSZ";
                    effectText = "🎯 JELÖL";
                }
            } else if (action.type === "ap_drain") {
                icon = "⚡";
                dmgText = `⚡-${action.amount} AP`;
                hitText = "⚡ ELVONÁS";
                effectText = "⚡ DRAIN";
            } else if (action.type === "cleanse") {
                icon = "✨";
                dmgText = "✨ TISZTÍT";
                hitText = "✨ TISZTÍT";
                effectText = "✨ TISZTÍTÁS";
            } else if (action.type === "ap_gain") {
                icon = "⚡";
                dmgText = `⚡+${action.amount} AP`;
                hitText = "⚡ ENERGIA";
                effectText = "⚡ AP +";
            } else if (action.type === "drain") {
                icon = "🦇";
                dmgText = `💥${action.amount} HP`;
                hitText = "🦇 SZÍVÁS";
                effectText = "🦇 ELSZÍVÁS";
            }

            btn.innerHTML = `
                <div class="item-img-wrapper"><img src="${cardData.image}" class="item-img"></div>
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
        const activeState = gameState[gameState.activePlayer];
        const activeCard = (activeState && activeState.activeIndex < 5) ? activeState.team[activeState.activeIndex] : null;
        const activeName = activeCard ? activeCard.name : "Vége";
        document.getElementById('turn-indicator').innerText = `${turnPrefix} (${activeName})`;
    }
}
