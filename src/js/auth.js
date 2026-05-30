// --- FIREBASE AUTHENTICATION (Google Bejelentkezés) ---

// !!! IDE MÁSOLD BE A FIREBASE CONSOLE-BÓL (Project settings) A SAJÁT CONFIGODAT !!!
const firebaseConfig = {
    apiKey: "AIzaSyCv7KxaXC-NVzieHA5vnR9lMpm8DlUJXJQ",
    authDomain: "killer-lake.firebaseapp.com",
    databaseURL: "https://killer-lake-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "killer-lake",
    storageBucket: "killer-lake.firebasestorage.app",
    messagingSenderId: "673886954683",
    appId: "1:673886954683:web:b37ed0467bc9bb5af3759e"
};

// Firebase inicializálása
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Figyeljük, hogy be van-e jelentkezve a játékos
firebase.auth().onAuthStateChanged((user) => {
    loggedInUser = user; // A globals.js-ben definiált változó
    const loginBtn = document.getElementById('google-login-btn');
    const userInfo = document.getElementById('auth-user-info');

    if (user) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (userInfo) {
            userInfo.style.display = 'block';
            userInfo.innerHTML = `Bejelentkezve mint: <b>${user.displayName}</b>`;
        }
    } else {
        if (loginBtn) loginBtn.style.display = 'inline-flex';
        if (userInfo) userInfo.style.display = 'none';
    }
});

function loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).catch((error) => {
        console.error("Bejelentkezési hiba:", error);
        alert("Nem sikerült bejelentkezni: " + error.message);
    });
}
