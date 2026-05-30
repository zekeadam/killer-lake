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
    audioCache[key].volume = 0.5; // Hangerő 50% (ez az új maximum)
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

// --- HANGERŐSZABÁLYZÓ LOGIKA ---
let currentVolume = 1.0; // 0.0 - 1.0 (a csúszka értéke)
let isMuted = false;
let preMuteVolume = 1.0;

function loadVolumeSettings() {
    const savedVol = parseFloat(localStorage.getItem('gameVolume'));
    const savedMuted = localStorage.getItem('gameMuted');
    if (!isNaN(savedVol)) {
        currentVolume = savedVol;
        isMuted = savedMuted === 'true';
        // Preserve preMuteVolume for mute toggle
        preMuteVolume = isMuted ? (currentVolume > 0 ? currentVolume : 1.0) : currentVolume;
        // Apply volumes immediately
        updateAudioVolumes();
    }
}

function changeVolume(value) {
    currentVolume = value / 100;
    isMuted = currentVolume === 0;
    updateAudioVolumes();
    updateVolumeUI();
    // Persist settings
    try {
        localStorage.setItem('gameVolume', currentVolume);
        localStorage.setItem('gameMuted', isMuted);
    } catch (e) {}
}


function updateAudioVolumes() {
    const vol = (isMuted ? 0 : currentVolume) * 0.5; // A valós maximum hangerő 50% (0.5)
    for (const [key, audio] of Object.entries(audioCache)) {
        audio.volume = vol;
    }
}

function toggleMute() {
    if (isMuted) {
        isMuted = false;
        currentVolume = preMuteVolume > 0 ? preMuteVolume : 1.0;
    } else {
        preMuteVolume = currentVolume;
        isMuted = true;
        currentVolume = 0;
    }
    updateAudioVolumes();
    updateVolumeUI();
}

function updateVolumeUI() {
    const slider = document.getElementById('volume-slider');
    const percentLabel = document.getElementById('volume-percentage');
    const icon = document.getElementById('volume-icon');
    
    if (slider) slider.value = isMuted ? 0 : Math.round(currentVolume * 100);
    if (percentLabel) percentLabel.textContent = (isMuted ? 0 : Math.round(currentVolume * 100)) + '%';
    
    if (icon) {
        const vol = isMuted ? 0 : currentVolume;
        if (vol === 0) {
            icon.textContent = '🔇';
        } else if (vol < 0.3) {
            icon.textContent = '🔈';
        } else if (vol < 0.7) {
            icon.textContent = '🔉';
        } else {
            icon.textContent = '🔊';
        }
    }
}

// Inicializálás betöltődés után
document.addEventListener("DOMContentLoaded", () => {
    loadVolumeSettings();
    updateVolumeUI();
});
