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

let loggedInUser = null;

// --- DRAFT VÁLTOZÓK ---
let myDraftTeam = [];
let oppDraftTeam = [];
let myItemIds = [];
let oppItemIds = [];
let iAmReady = false;
let oppIsReady = false;
let draggedIndex = null;

// --- OPTIMALIZÁLT ADATOK BETÖLTÉSE ---
const optScript = document.createElement('script');
optScript.src = 'src/js/optimized_cards.js'; // Javítva az útvonal
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
