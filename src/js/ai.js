/**
 * AI ellenfél logikája.
 */

/**
 * Az AI számára kiválasztja a következő lépést.
 *
 * @param {object} myState Az AI játékos aktuális állapota (pl. gameState.p1 vagy gameState.p2).
 * @param {object} oppState Az ellenfél játékos aktuális állapota.
 * @returns {string|number} A kiválasztott támadás indexe (0-tól n-ig) vagy 'charge' az AP gyűjtéshez.
 */
function getAIMove(myState, oppState) {
    const myCard = myState.team[myState.activeIndex];
    const oppCard = oppState.team[oppState.activeIndex];

    if (myCard.isParalyzed) {
        return null;
    }

    // 1. TÁRGYAK HASZNÁLATA (Ha van és még nem használt)
    if (!myState.itemUsedThisTurn && myState.items && myState.items.length > 0) {
        // Ha kevés a HP, vagy 20% eséllyel meglepetésszerűen elnyom egy tárgyat
        if (myCard.hp < myCard.maxHp * 0.4 || Math.random() < 0.2) {
            return { type: 'item', itemIndex: 0 }; 
        }
    }

    let bestMove = null;
    let bestScorePerAp = -Infinity;
    let targetCost = 0;

    // 2. KÉPESSÉGEK KIÉRTÉKELÉSE (AP-tól függetlenül!)
    myCard.attacks.forEach((move, index) => {
        if (!move) return;
        
        let score = 0;
        
        if (move.type === 'dmg') {
            // Alap várható sebzés (sebzés * pontosság - a dmg immár az összesített sebzés!)
            let expectedDmg = move.dmg * (move.accuracy !== undefined ? move.accuracy : 1);
            
            // Szinergia bónusz (ha a célpont meg van jelölve)
            if (oppCard.isMarked && move.synergy === 'mark') expectedDmg *= 1.5;
            
            score += expectedDmg;

            // KILL SHOT: Ha ez a támadás valószínűleg kiüti az ellenfelet, kapjon óriási prioritást
            if (expectedDmg >= oppCard.hp && (oppCard.shields || 0) === 0) {
                score += 500;
            }
            
            // Státusz effektek súlyozása
            if (move.effect === 'burn' || move.effect === 'poison') score += 15;
            // Csak akkor pontozzuk, ha még nincs kimaxolva a stack (max 3)
            if (move.effect === 'burn' && (oppCard.burnStacks || 0) < 3) score += 15;
            if (move.effect === 'poison' && (oppCard.poisonStacks || 0) < 3) score += 15;
            // Csak akkor kap pontot a bénításra, ha nem immunis az ellenfél
            if (move.effect === 'paralyze') score += oppCard.paraImmune ? 0 : 25;
            if (move.effect === 'lifesteal') score += 20;
            if (move.effect === 'counter') score += 15;
            if (move.effect === 'mark' && !oppCard.isMarked) score += 20;

        } else if (move.type === 'heal') {
            // Csak akkor ér sokat, ha tényleg szükség van rá
            if (myCard.hp < myCard.maxHp * 0.5) score += move.healAmount * 1.5;
            else score -= 100;

        } else if (move.type === 'shield') {
            if (myCard.shields < 2) score += 25;
            else score -= 100;
        }

        // AP Hatékonyság számítása
        let efficiency = score / Math.max(1, move.cost);

        if (efficiency > bestScorePerAp) {
            bestScorePerAp = efficiency;
            bestMove = index;
            targetCost = move.cost;
        }
    });

    // 3. DÖNTÉSHOZATAL
    if (bestMove !== null) {
        if (myState.ap >= targetCost) {
            // Van elég AP a leghatékonyabb mozdulathoz
            return bestMove;
        } else {
            // Ha kevés a HP, ne spóroljunk, üssünk amivel tudunk
            if (myCard.hp < myCard.maxHp * 0.25) {
                const affordable = myCard.attacks
                    .map((m, i) => ({m, i}))
                    .filter(item => item.m && myState.ap >= item.m.cost && item.m.type !== 'shield');
                if (affordable.length > 0) return affordable[0].i;
            }
            
            // Különben spóroljunk a nagy ütésre
            return 'charge';
        }
    }

    return 'charge'; 
}