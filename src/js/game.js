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
    isActionLocked = false;
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
    playSound('game_start');
    updateUI();
}

function checkWin() {
    if (gameState.gameOver) return true;
    if (gameState.p1.activeIndex >= 5 || gameState.p2.activeIndex >= 5) {
        gameState.gameOver = true;
        playSound('game_over');
        const winnerId = gameState.p1.activeIndex < 5 ? 'p1' : 'p2';
        const loserId = winnerId === 'p1' ? 'p2' : 'p1';
        const winnerName = winnerId === myRole ? myNickname : oppNickname;
        const loserName = loserId === myRole ? myNickname : oppNickname;
        
        // --- Csak a befejezett PVP és PVE meccseket mentjük a ranglistára (Test módot nem) ---
        if (!isTestMode) {
            const mode = isPvEMode ? 'pve' : 'pvp';
            if (isPvEMode) {
                // PVE módban csak a játékos (p1) statisztikáját mentjük el, az AI-t nem
                updateGlobalStats(myNickname, winnerId === 'p1', battleStats.p1.damageDealt, mode);
            } else {
                updateGlobalStats(winnerName, true, battleStats[winnerId].damageDealt, mode);
                updateGlobalStats(loserName, false, battleStats[loserId].damageDealt, mode);
            }
        }

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

function handleNewGameButtonClick() {
    if (isTestMode) {
        document.getElementById('victory-screen').style.display = 'none';
        startTestMode();
    } else {
        location.reload();
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
            let hitCount = move.hits || 1;
            let baseDmgPerHit = move.dmg / hitCount;
            let variance = baseDmgPerHit * 0.2;
            damagePerHit = Math.floor(baseDmgPerHit + (Math.random() * variance * 2) - variance);
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
            spawnFloatingText(`${oppId}-card`, "MISS", "miss");
            if (checkWin()) return;
            endTurnPhase(playerId);
            return;
        }

        if (move.type === "dmg") {
            const hitCount = move.hits || 1;
            let dmgPerHit = data.damagePerHit;
            if (data.isCrit) {
                dmgPerHit = Math.floor(dmgPerHit * 1.5);
                triggerAnimation('container', 'screen-shake-heavy', 450);
            } else {
                triggerAnimation('container', 'screen-shake-subtle', 200);
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
                    
                    spawnFloatingText(`${oppId}-card`, "🛡️ BLOCKED", "shield");
                    const center = getCardImageCenter(oppId);
                    spawnShieldShatterParticles(center.x, center.y, 12);
                } else {
                    oppCard.hp -= dmgPerHit;
                    hitsLanded++;
                    if (battleStats && battleStats[playerId]) battleStats[playerId].damageDealt += dmgPerHit;
                    
                    spawnFloatingText(`${oppId}-card`, `-${dmgPerHit}`, "dmg", data.isCrit);
                    const center = getCardImageCenter(oppId);
                    spawnBloodParticles(center.x, center.y, data.isCrit ? 20 : 8);
                }
            }
            
            if (oppCard.hasCounter && hitsLanded > 0) {
                attackerCard.hp -= 20; // 20 fix sebzés a visszatámadásból
                if (battleStats && battleStats[oppId]) battleStats[oppId].damageDealt += 20;
                logMessage(`> ⚔️ Visszatámadás! ${attackerCard.name} 20 sebzést kapott!`, "log-dmg");
                triggerAnimation(`${playerId}-card`, 'anim-damage', 400);
                
                spawnFloatingText(`${playerId}-card`, `-20`, "dmg");
                const center = getCardImageCenter(playerId);
                spawnBloodParticles(center.x, center.y, 6);
            }

            if (shieldsBroken > 0) {
                logMessage(`> ${oppCard.name} pajzsa elnyelt ${shieldsBroken} ütést! (${oppCard.shields} maradt)`, "log-shield");
                if (hitsLanded === 0) {
                    triggerAnimation('container', 'screen-shake-shield-break', 300);
                }
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
                
                spawnFloatingText(`${playerId}-card`, `+${actualHeal}`, "heal");
                const center = getCardImageCenter(playerId);
                spawnParticles(center.x, center.y, "#2ecc71", 15, 80);
            }

            if (oppCard.hp <= 0) {
                playDeathSound(oppCard);
                logMessage(`> ${oppCard.name} elájult (K.O.)!`, "crit");
                spawnFloatingText(`${oppId}-card`, "K.O.", "crit");
                oppState.activeIndex++;
                if (oppState.activeIndex < 5) {
                    const nextCard = oppState.team[oppState.activeIndex];
                    logMessage(`> <b>${nextCard.name}</b> lép a pályára!`, "log-system");
                    triggerAnimation(`${oppId}-card`, 'anim-heal', 600);
                    
                    setTimeout(() => {
                        const center = getCardImageCenter(oppId);
                        spawnParticles(center.x, center.y, "#2ecc71", 30, 100);
                    }, 200);
                }
            } else if (hitsLanded > 0) {
                if (move.effect === "paralyze" || move.effect === "burn" || move.effect === "poison" || move.effect === "mark") {
                    const center = getCardImageCenter(oppId);
                    if (move.effect === "paralyze") {
                        if (oppCard.paraImmune) {
                            logMessage(`> ${oppCard.name} ellenállt a bénításnak!`, "status-effect");
                            spawnFloatingText(`${oppId}-card`, "ELLENÁLLT", "miss");
                        } else {
                            oppCard.isParalyzed = true;
                            logMessage(`> ${oppCard.name} megbénult!`, "status-effect");
                            spawnFloatingText(`${oppId}-card`, "⚡ MEGBÉNULT", "status");
                            spawnStatusParticles(center.x, center.y, 'paralyze', 15);
                        }
                    } else if (move.effect === "burn") {
                        oppCard.burnStacks = Math.min(3, (oppCard.burnStacks || 0) + 1);
                        oppCard.burnTurns = 3;
                        logMessage(`> ${oppCard.name} meggyulladt! (Szint: ${oppCard.burnStacks})`, "crit");
                        spawnFloatingText(`${oppId}-card`, `🔥 ÉGÉS x${oppCard.burnStacks}`, "status");
                        spawnStatusParticles(center.x, center.y, 'burn', 15);
                    } else if (move.effect === "poison") {
                        oppCard.poisonStacks = Math.min(3, (oppCard.poisonStacks || 0) + 1);
                        oppCard.poisonTurns = 3;
                        logMessage(`> ${oppCard.name} megmérgeződött! (Szint: ${oppCard.poisonStacks})`, "status-effect");
                        spawnFloatingText(`${oppId}-card`, `☠️ MÉREG x${oppCard.poisonStacks}`, "status");
                        spawnStatusParticles(center.x, center.y, 'poison', 15);
                    } else if (move.effect === "mark") {
                        oppCard.isMarked = true;
                        logMessage(`> ${oppCard.name} Célkeresztbe került (Megjelölve)!`, "status-effect");
                        spawnFloatingText(`${oppId}-card`, "🎯 MEGJELÖLVE", "status");
                    }
                }
            }
        } else if (move.type === "heal") {
            const actualHeal = Math.min(attackerCard.maxHp - attackerCard.hp, move.healAmount);
            attackerCard.hp += actualHeal;
            if (battleStats && battleStats[playerId]) battleStats[playerId].healingDone += actualHeal;
            const center = getCardImageCenter(playerId);
            spawnParticles(center.x, center.y, "#2ecc71", 45, 150);
            triggerAnimation(`${playerId}-card`, 'anim-heal', 600);
            playSound('heal');
            logMessage(`> ${attackerCard.name} visszatöltött ${actualHeal} Életerőt!`, "log-heal");
            
            spawnFloatingText(`${playerId}-card`, `+${actualHeal}`, "heal");
        } else if (move.type === "shield") {
            attackerCard.shields = Math.min(2, attackerCard.shields + 1);
            triggerShieldScan(playerId);
            playSound('shield');
            const center = getCardImageCenter(playerId);
            spawnParticles(center.x, center.y, "#3498db", 45, 150);
            logMessage(`> ${attackerCard.name} felhúzott egy pajzsot.`, "log-shield");
            
            spawnFloatingText(`${playerId}-card`, "+🛡️ Pajzs", "shield");
        }
        
        if (move.effect === "counter") {
            attackerCard.hasCounter = true;
            logMessage(`> ${attackerCard.name} Visszatámadó (Counter) állásba lépett!`, "status-effect");
            spawnFloatingText(`${playerId}-card`, "⚔️ VISSZATÁMADÁS", "status");
        }

        // Ha a visszatámadás (Counter) miatt az aktuális támadó meghalt
        if (attackerCard.hp <= 0) {
            playDeathSound(attackerCard);
            logMessage(`> ${attackerCard.name} belehalt a visszatámadásba (K.O.)!`, "crit");
            spawnFloatingText(`${playerId}-card`, "K.O.", "crit");
            attackerState.activeIndex++;
            if (attackerState.activeIndex < 5) {
                const nextCard = attackerState.team[attackerState.activeIndex];
                logMessage(`> <b>${nextCard.name}</b> lép a pályára!`, "log-system");
                triggerAnimation(`${playerId}-card`, 'anim-heal', 600);
                
                setTimeout(() => {
                    const center = getCardImageCenter(playerId);
                    spawnParticles(center.x, center.y, "#2ecc71", 30, 100);
                }, 200);
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
        
        spawnFloatingText(`${currentPlayerId}-card`, `☠️ -${pDmg}`, "status");
        const center = getCardImageCenter(currentPlayerId);
        spawnStatusParticles(center.x, center.y, 'poison', 12);
        triggerAnimation('container', 'screen-shake-subtle', 200);

        if (pCard.poisonTurns === 0) pCard.poisonStacks = 0;
        
        if (pCard.hp <= 0) {
            playDeathSound(pCard);
            logMessage(`> ${pCard.name} belehalt a méregbe (K.O.)!`, "crit");
            spawnFloatingText(`${currentPlayerId}-card`, "K.O.", "crit");
            pState.activeIndex++;
            if (pState.activeIndex < 5) {
                pCard = pState.team[pState.activeIndex];
                logMessage(`> <b>${pCard.name}</b> lép a pályára!`, "log-system");
                triggerAnimation(`${currentPlayerId}-card`, 'anim-heal', 600);
                
                setTimeout(() => {
                    const centerNext = getCardImageCenter(currentPlayerId);
                    spawnParticles(centerNext.x, centerNext.y, "#2ecc71", 30, 100);
                }, 200);
            }
        } else if (pCard.poisonTurns === 0) {
            logMessage(`> ${pCard.name} szervezete legyőzte a mérget.`);
        }
        if (checkWin()) return;
    }
    
    if (pCard && pCard.burnTurns > 0) {
        const center = getCardImageCenter(currentPlayerId);
        if (pCard.shields > 0) {
            pCard.shields--;
            pCard.burnTurns--;
            logMessage(`${pCard.name} pajzsa elnyelte az égést! (1 pajzs elveszett)`, "log-shield");
            playSound('shield_break');
            triggerShieldScan(currentPlayerId);
            
            spawnFloatingText(`${currentPlayerId}-card`, "🛡️ BLOCKED", "shield");
            spawnShieldShatterParticles(center.x, center.y, 10);
            triggerAnimation('container', 'screen-shake-shield-break', 300);
        } else {
            const bDmg = pCard.burnStacks * 20;
            pCard.hp -= bDmg;
            if (battleStats && battleStats[oppId]) battleStats[oppId].damageDealt += bDmg;
            pCard.burnTurns--;
            triggerAnimation(`${currentPlayerId}-card`, 'anim-damage', 400);
            playSound('damage_burn');
            logMessage(`${pCard.name} égési sérülést szenvedett (${bDmg} DMG).`, "crit");
            
            spawnFloatingText(`${currentPlayerId}-card`, `🔥 -${bDmg}`, "status");
            spawnStatusParticles(center.x, center.y, 'burn', 12);
            triggerAnimation('container', 'screen-shake-subtle', 200);
        }
        
        if (pCard.hp <= 0) {
            playDeathSound(pCard);
            logMessage(`> ${pCard.name} elégett és elájult (K.O.)!`, "crit");
            spawnFloatingText(`${currentPlayerId}-card`, "K.O.", "crit");
            pState.activeIndex++;
            if (pState.activeIndex < 5) {
                pCard = pState.team[pState.activeIndex];
                logMessage(`> <b>${pCard.name}</b> lép a pályára!`, "log-system");
                triggerAnimation(`${currentPlayerId}-card`, 'anim-heal', 600);
                
                setTimeout(() => {
                    const centerNext = getCardImageCenter(currentPlayerId);
                    spawnParticles(centerNext.x, centerNext.y, "#2ecc71", 30, 100);
                }, 200);
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
        setTimeout(runAITestMove, 750);
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
        const center = getCardImageCenter(oppId);
        if (oppCard.shields > 0) {
            oppCard.shields--;
            dmgToApply = 0; // A pajzs elnyeli a tárgy sebzését
            logMessage(`> ${oppCard.name} pajzsa elnyelte a tárgy sebzését!`, "log-shield");
            playSound('shield_break');
            triggerShieldScan(oppId);
            
            spawnFloatingText(`${oppId}-card`, "🛡️ BLOCKED", "shield");
            spawnShieldShatterParticles(center.x, center.y, 12);
            triggerAnimation('container', 'screen-shake-shield-break', 300);
        } else {
            oppCard.hp -= dmgToApply;
            if (battleStats && battleStats[playerId]) battleStats[playerId].damageDealt += dmgToApply;
            logMessage(`> ${cardData.name} sebzett ${dmgToApply}-t!`, "log-dmg");
            if (action.effect === "burn") playSound('damage_burn');
            else if (action.effect === "paralyze") playSound('damage_paralyze');
            else playSound('damage_normal');
            
            spawnFloatingText(`${oppId}-card`, `-${dmgToApply}`, "dmg");
            spawnBloodParticles(center.x, center.y, 10);
            triggerAnimation('container', 'screen-shake-subtle', 200);
        }

        triggerAnimation(`${oppId}-card`, 'anim-damage', 400);
        if (action.effect === 'paralyze' && dmgToApply > 0) {
            if (oppCard.paraImmune) {
                logMessage(`> ${oppCard.name} ellenállt a bénításnak!`, "status-effect");
                spawnFloatingText(`${oppId}-card`, "ELLENÁLLT", "miss");
            } else {
                oppCard.isParalyzed = true;
                logMessage(`> ${oppCard.name} megbénult!`, "status-effect");
                spawnFloatingText(`${oppId}-card`, "⚡ MEGBÉNULT", "status");
                spawnStatusParticles(center.x, center.y, 'paralyze', 15);
            }
        }
    } else if (action.type === 'heal') {
        const actualHeal = Math.min(myCard.maxHp - myCard.hp, action.healAmount);
        myCard.hp += actualHeal;
        if (battleStats && battleStats[playerId]) battleStats[playerId].healingDone += actualHeal;
        logMessage(`> ${myCard.name} visszatöltött ${actualHeal} HP-t!`, "log-heal");
        triggerAnimation(`${playerId}-card`, 'anim-heal', 600);
        playSound('heal');
        
        spawnFloatingText(`${playerId}-card`, `+${actualHeal}`, "heal");
        const center = getCardImageCenter(playerId);
        spawnParticles(center.x, center.y, "#2ecc71", 20, 100);
    } else if (action.type === 'shield') {
        const gained = Math.min(action.amount, 2 - myCard.shields);
        myCard.shields += gained;
        logMessage(`> ${myCard.name} kapott ${gained} pajzsot!`, "log-shield");
        triggerShieldScan(playerId);
        playSound('shield');
        
        spawnFloatingText(`${playerId}-card`, "+🛡️ Pajzs", "shield");
        const center = getCardImageCenter(playerId);
        spawnParticles(center.x, center.y, "#3498db", 20, 100);
    } else if (action.type === 'status') {
        const center = getCardImageCenter(oppId);
        if (action.effect === 'burn') {
            if (oppCard.shields > 0) {
                oppCard.shields--;
                logMessage(`> ${oppCard.name} pajzsa kivédte az égést!`, "log-shield");
                playSound('shield_break');
                triggerShieldScan(oppId);
                
                spawnFloatingText(`${oppId}-card`, "🛡️ BLOCKED", "shield");
                spawnShieldShatterParticles(center.x, center.y, 12);
                triggerAnimation('container', 'screen-shake-shield-break', 300);
            } else {
                oppCard.burnStacks = Math.min(3, (oppCard.burnStacks || 0) + 1);
                oppCard.burnTurns = 3;
                logMessage(`> ${oppCard.name} meggyulladt! (Szint: ${oppCard.burnStacks})`, "crit");
                
                spawnFloatingText(`${oppId}-card`, `🔥 ÉGÉS x${oppCard.burnStacks}`, "status");
                spawnStatusParticles(center.x, center.y, 'burn', 15);
            }
        }
    } else if (action.type === 'ap_drain') {
        oppState.ap = Math.max(0, oppState.ap - action.amount);
        logMessage(`> ${cardData.name} elszívott ${action.amount} AP-t!`, "status-effect");
        
        spawnFloatingText(`${oppId}-card`, `⚡ -${action.amount} AP`, "status");
    }

    pState.items.splice(data.itemIndex, 1);

    if (wasFullHP && oppCard.hp <= 0) {
        oppCard.hp = Math.max(1, Math.floor(oppCard.maxHp * 0.01));
        logMessage(`> 🛡️ KITARTÁS! ${oppCard.name} túlélte a tárgyat 1% élettel!`, "status-effect");
        spawnFloatingText(`${oppId}-card`, "KITARTÁS!", "status");
    }
    
    if (oppCard.hp <= 0) {
        playDeathSound(oppCard);
        logMessage(`> ${oppCard.name} elájult az itemtől (K.O.)!`, "crit");
        spawnFloatingText(`${oppId}-card`, "K.O.", "crit");
        oppState.activeIndex++;
        if (oppState.activeIndex < 5) {
            const nextCard = oppState.team[oppState.activeIndex];
            logMessage(`> <b>${nextCard.name}</b> lép a pályára!`, "log-system");
            triggerAnimation(`${oppId}-card`, 'anim-heal', 600);
            
            setTimeout(() => {
                const centerNext = getCardImageCenter(oppId);
                spawnParticles(centerNext.x, centerNext.y, "#2ecc71", 30, 100);
            }, 200);
        }
    }

    if (checkWin()) return;
    isActionLocked = false; // Item kijátszása után újra lehet kattintani (mivel az item nem fejezi be a kört)
    updateUI();
}
