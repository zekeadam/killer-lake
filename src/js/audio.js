// --- HANG RENDSZER (Online MP3 streamelés) ---
// Ide bármilyen weben található hang linkjét berakhatod! (Nem kell letölteni fájlokat)
const soundURLs = {
    damage_normal: "https://www.myinstants.com/media/sounds/sword-hit-with-blood.mp3", // MEGSZÓLAL: Amikor a karakter ténylegesen sebet kap (nem pajzsot).
    damage_burn: "https://www.myinstants.com/media/sounds/fireball-incoming.mp3",    // MEGSZÓLAL: Égési sérülés elszenvedésekor (találatkor vagy kör végén).
    damage_paralyze: "https://www.myinstants.com/media/sounds/electricity_us849kj.mp3",// MEGSZÓLAL: Bénító sebzés (villám) becsapódásakor.
    shield_break: "https://www.myinstants.com/media/sounds/metal-pipe-sound.mp3", // MEGSZÓLAL: Amikor egy pajzs megsemmisül.
    miss: "https://www.myinstants.com/media/sounds/woosh_s21KzKN.mp3",        // MEGSZÓLAL: Amikor a támadás célt téveszt vagy kikerülik.
    shield: "https://www.myinstants.com/media/sounds/energy-generator-bounce.mp3",     // MEGSZÓLAL: Amikor a karakter pajzsot (Shield) kap (saját támadásból vagy itemből).
    heal: "https://www.myinstants.com/media/sounds/health-potion.mp3",        // MEGSZÓLAL: Életerő (HP) visszatöltésekor, legyen az képesség vagy gyógyító item.
    charge: "https://www.myinstants.com/media/sounds/z-charge.mp3",       // MEGSZÓLAL: Amikor a játékos az "ENERGIA TÖLTÉS" (+1 AP, kör kimaradása) gombra kattint.
    game_start: "https://www.myinstants.com/media/sounds/fight-mksm.mp3", // MEGSZÓLAL: Játék kezdetekor.
    game_over: "https://www.myinstants.com/media/sounds/fatality-announcer-mortal-kombat-9-sound-effect.mp3", // MEGSZÓLAL: Meccs végén (Győzelem).
    death: "https://www.myinstants.com/media/sounds/dandys-world-death-sound.mp3" // MEGSZÓLAL: Karakter halálakor (OOF)
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

function playDeathSound(card) {
    playSound('death');
}
