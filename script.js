document.addEventListener('DOMContentLoaded', () => {
    // Éléments de l'écran d'accueil
    const accueil = document.getElementById('accueil');
    const entrerBtn = document.getElementById('entrerBtn');
    const calculatriceApp = document.getElementById('calculatriceApp');

    // Éléments des réglages
    const settingsBtn = document.getElementById('settings-btn');
    const settingsMenu = document.getElementById('settings-menu');
    const themeToggle = document.getElementById('theme-toggle');
    const soundToggle = document.getElementById('sound-toggle');
    const clickSound = document.getElementById('click-sound');

    // Fonction pour jouer le son (si activé)
    function playClickSound() {
        if (soundToggle.checked) { // On utilise soundToggle.checked pour vérifier l'état
            clickSound.currentTime = 0;
            clickSound.play().catch(e => console.log("Erreur de lecture audio:", e));
        }
    }

    // Gestion du clic sur le bouton "Entrer"
    entrerBtn.addEventListener('click', () => {
        // Appelle la fonction de son ici pour débloquer l'audio du navigateur
        playClickSound();
        accueil.style.display = 'none';
        calculatriceApp.style.display = 'flex';
    });

    // Gestion de l'affichage du menu des réglages
    settingsBtn.addEventListener('click', () => {
        settingsMenu.style.display = settingsMenu.style.display === 'block' ? 'none' : 'block';
    });

    // Gestion du thème
    themeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-theme');
    });

    // Le reste de votre code de la calculatrice
    const ecran = document.getElementById('ecran');
    const touches = document.querySelectorAll('.touche');
    let expression = '';

    touches.forEach(touche => {
        touche.addEventListener('click', () => {
            // Appelle la fonction de son ici pour chaque touche
            playClickSound();

            const valeur = touche.dataset.valeur;
            if (valeur === '=') {
                try {
                    const resultat = eval(expression);
                    ecran.value = resultat;
                    expression = String(resultat);
                } catch (e) {
                    ecran.value = 'Erreur';
                    expression = '';
                }
            } else if (valeur === 'C') {
                expression = '';
                ecran.value = '';
            } else {
                expression += valeur;
                ecran.value = expression;
            }
        });
    });
});