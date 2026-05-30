// --- GLOBÁLIS RANGLISTA (LEADERBOARD) ÉS UTILITIES ---

function copyInviteLink() {
    const id = peer.id;
    if (!id) return;
    
    const url = new URL(window.location.href);
    url.searchParams.set('join', id);
    
    navigator.clipboard.writeText(url.toString()).then(() => {
        const btn = document.getElementById('copy-link-btn');
        const sub = btn.querySelector('.btn-subtext');
        if (sub) {
            sub.innerText = "Várakozás A Másik Játékosra";
        }
        if (!btn.querySelector('.btn-spinner')) {
            const spinner = document.createElement('span');
            spinner.className = 'btn-spinner';
            btn.appendChild(spinner);
        }
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

// IDE MÁSOLD BE A SAJÁT FIREBASE LINKEDET! (Ne felejtsd el a végét: /leaderboard)
const LEADERBOARD_API_URL = 'https://killer-lake-default-rtdb.europe-west1.firebasedatabase.app/leaderboard';
const LEADERBOARD_PVE_API_URL = 'https://killer-lake-default-rtdb.europe-west1.firebasedatabase.app/leaderboard_pve';

async function updateGlobalStats(playerName, isWinner, damageDealt, mode = 'pvp') {
    if (!playerName) return;
    
    const safeName = playerName.replace(/[.#$\[\]/]/g, '').trim();
    const targetUrl = mode === 'pve' ? LEADERBOARD_PVE_API_URL : LEADERBOARD_API_URL;
    
    try {
        const res = await fetch(`${targetUrl}/${encodeURIComponent(safeName)}.json`);
        let stats = await res.json() || { wins: 0, losses: 0, matches: 0, damage: 0 };

        // Ha régi formátumú adat (csak egy szám) volt ott, alakítsuk át
        if (typeof stats === 'number') {
            stats = { wins: stats, losses: 0, matches: stats, damage: 0 };
        }

        stats.matches = (stats.matches || 0) + 1;
        stats.damage = (stats.damage || 0) + (damageDealt || 0);
        if (isWinner) stats.wins = (stats.wins || 0) + 1;
        else stats.losses = (stats.losses || 0) + 1;
        
        await fetch(`${targetUrl}/${encodeURIComponent(safeName)}.json`, {
            method: 'PUT',
            body: JSON.stringify(stats)
        });
    } catch (error) {
        console.error('Nem sikerült menteni a szerverre:', error);
    }
}

async function showLeaderboard(mode = 'pvp') {
    const modal = document.getElementById('leaderboard-modal');
    const list = document.getElementById('leaderboard-list');
    const tabPvp = document.getElementById('tab-pvp');
    const tabPve = document.getElementById('tab-pve');
    if (tabPvp) tabPvp.classList.toggle('active', mode === 'pvp');
    if (tabPve) tabPve.classList.toggle('active', mode === 'pve');
    
    // Mutatunk egy töltőképernyőt, amíg az internetről jön az adat
    list.innerHTML = '<p style="color: #aaa; padding: 20px; text-align: center;">Várakozás a szerverre...</p>';
    modal.style.display = 'flex';
    const targetUrl = mode === 'pve' ? LEADERBOARD_PVE_API_URL : LEADERBOARD_API_URL;

    try {
        console.log("Ranglista lekérése innen:", targetUrl);
        const res = await fetch(`${targetUrl}.json`);
        if (!res.ok) throw new Error("Hálózati hiba");
        let leaderboard = await res.json() || {};
        
        // Rendezés: Elsősorban Wins, másodsorban összes sebzés
        const sorted = Object.entries(leaderboard).sort((a, b) => {
            const aWins = typeof a[1] === 'object' ? a[1].wins : a[1];
            const bWins = typeof b[1] === 'object' ? b[1].wins : b[1];
            if (bWins !== aWins) return bWins - aWins;
            return (b[1].damage || 0) - (a[1].damage || 0);
        });
        
        if (sorted.length === 0) {
            list.innerHTML = '<p style="color: #aaa; padding: 20px; text-align: center;">Még nincsenek győzelmek rögzítve globálisan.</p>';
        } else {
            // Fejléc hozzáadása
            list.innerHTML = `
                <div class="leaderboard-entry leaderboard-header">
                        <span class="rank">🏆</span>
                        <span class="name">Játékos</span>
                        <span class="stat" title="Győzelem">Győz.</span>
                        <span class="stat" title="Vereség">Vesz.</span>
                        <span class="stat" title="Lejátszott Meccsek">Meccs</span>
                        <span class="stat" title="Kiosztott Sebzés">Sebzés</span>
                </div>`;

            sorted.forEach(([name, data], index) => {
                const s = typeof data === 'object' ? data : { wins: data, losses: 0, matches: data, damage: 0 };
                    const rankClass = index === 0 ? 'rank-1' : index === 1 ? 'rank-2' : index === 2 ? 'rank-3' : 'rank-normal';
                    const rankDisplay = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`;
                    
                list.innerHTML += `
                    <div class="leaderboard-entry">
                            <span class="rank ${rankClass}">${rankDisplay}</span>
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
        console.error("Firebase hiba:", error);
        list.innerHTML = '<p style="color: #e74c3c; padding: 20px; text-align: center;">Hiba a hálózati kapcsolatban.</p>';
    }
}

function closeLeaderboard() {
    document.getElementById('leaderboard-modal').style.display = 'none';
}

function openGuide() {
    window.location.href = 'pages/guide.html';
}
