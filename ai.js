/**
 * AI ellenfél logikája.
 * Ez a fájl tartalmazza az AI döntéshozatali mechanizmusát,
 * de még nincs bekötve a fő játéklogikába.
 */

/**
 * Az AI számára kiválasztja a következő lépést.
 *
 * @param {object} aiPlayerState Az AI játékos aktuális állapota (pl. gameState.p1 vagy gameState.p2).
 * @param {object} opponentPlayerState Az ellenfél játékos aktuális állapota.
 * @returns {string|number} A kiválasztott támadás indexe (0-tól n-ig) vagy 'charge' az AP gyűjtéshez.
 */
function getAIMove(aiPlayerState, opponentPlayerState) {
    const aiCard = aiPlayerState.team[aiPlayerState.activeIndex];
    const oppCard = opponentPlayerState.team[opponentPlayerState.activeIndex];

    // Ha az AI kártyája bénult, akkor nincs mit tenni, a kör kimarad.
    // Ezt a fő játéklogika kezeli, de itt is érdemes figyelembe venni, ha az AI-nak kellene döntést hoznia.
    if (aiCard.isParalyzed) {
        // Az AI nem tud lépni, a játéklogika majd átugorja a körét.
        // Itt egy "pass" vagy "skip" jelzést adhatnánk vissza, ha a játéklogika ezt kezelné.
        // Jelenleg a játéklogika automatikusan átugorja a bénult kártya körét.
        return null; 
    }

    // Stratégia:
    // 1. Ha kevés az AP, és van még mit tölteni, akkor töltsön.
    // 2. Ha az AI kártyája nagyon alacsony HP-n van, és van gyógyító képessége, használja azt.
    // 3. Ha az ellenfél kártyája nagyon alacsony HP-n van, próbálja meg befejezni.
    // 4. Ha van pajzs képessége, és nincs pajzsa, használja.
    // 5. Egyébként válasszon egy random támadást, ami megfizethető.

    // AP töltés, ha kevés van
    if (aiPlayerState.ap < 3 && aiPlayerState.ap < 10) { // Pl. 3 AP alatt töltsön
        return 'charge';
    }

    // Csak a létező és megfizethető képességeket vesszük figyelembe
    const availableMoves = aiCard.attacks
        .map((move, index) => ({ move, index }))
        .filter(item => item.move && aiPlayerState.ap >= item.move.cost);

    // Ha nincs elérhető mozdulat, töltsön AP-t
    if (availableMoves.length === 0) {
        return 'charge';
    }

    // Gyógyítás, ha az AI kártyája alacsony HP-n van
    if (aiCard.hp / aiCard.maxHp < 0.4) { // 40% HP alatt
        const healMove = availableMoves.find(item => item.move.type === 'heal');
        if (healMove) {
            return healMove.index;
        }
    }

    // Pajzs használata, ha 2-nél kevesebb van
    if (aiCard.shields < 2) {
        const shieldMove = availableMoves.find(item => item.move.type === 'shield');
        if (shieldMove) {
            return shieldMove.index;
        }
    }

    // Támadás, ha az ellenfél alacsony HP-n van, vagy csak simán támadni kell
    const damageMoves = availableMoves.filter(item => item.move.type === 'dmg');
    if (damageMoves.length > 0) {
        // Válasszon egy random sebző támadást
        return damageMoves[Math.floor(Math.random() * damageMoves.length)].index;
    }

    // Ha semmi más, akkor töltsön AP-t (ez elvileg már fentebb lekezelődik, de biztonság kedvéért)
    return 'charge';
}