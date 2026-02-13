const heartContainer = document.getElementById('heart-container');
const heartImg = document.getElementById('heart-img'); // Référence à la nouvelle image
const progressRing = document.getElementById('progress-ring');
const bgMusic = document.getElementById('bgMusic');
const playMusicBtn = document.getElementById('playMusicBtn'); // Référence au bouton musique
const finalMessage = document.getElementById('final-message');

let holdTimer;
let progress = 0;
const goal = 100;
// Mise à jour de la circonférence pour s'adapter au nouveau rayon de 100px
const circumference = 2 * Math.PI * 100; 

// Initialiser l'offset de la bague de progression
updateProgress(0);

function updateProgress(value) {
    const offset = circumference - (value / 100) * circumference;
    progressRing.style.strokeDashoffset = offset;
}

const startCharging = () => {
    // La musique sera gérée par le bouton, donc on retire le play ici
    // pour éviter les interférences.

    holdTimer = setInterval(() => {
        if (progress < goal) {
            progress += 2;
            updateProgress(progress);
            // L'image du cœur grossit avec la charge
            heartImg.style.transform = `scale(${1 + progress / 200})`; // Ajustement du scale pour l'image
        } else {
            explode();
            clearInterval(holdTimer);
        }
    }, 30);
};

const stopCharging = () => {
    clearInterval(holdTimer);
    if (progress < goal) {
        // Reset progressif si on relâche trop tôt
        const resetInterval = setInterval(() => {
            if (progress > 0) {
                progress -= 5;
                updateProgress(Math.max(0, progress));
                // Réinitialiser la taille de l'image aussi
                heartImg.style.transform = `scale(${1 + Math.max(0, progress) / 200})`;
            } else {
                clearInterval(resetInterval);
            }
        }, 20);
    }
};

function explode() {
    // Explosion de confettis en forme de cœurs
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff0000', '#f1dee8', '#e22d2d'] // Ajout du blanc pour la variété
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff0000', '#898587', '#f05454']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      } else {
          finalMessage.classList.remove('hidden');
          finalMessage.classList.add('animate-fade-in');
          document.getElementById('main-container').classList.add('hidden'); // Cache le contenu principal
          // Arrêter la musique si elle joue
          if (!bgMusic.paused) bgMusic.pause();
      }
    }());
}

// Gestion du bouton de lecture de la musique
playMusicBtn.addEventListener('click', () => {
    if (bgMusic.paused) {
        bgMusic.play().then(() => {
            playMusicBtn.textContent = '⏸️'; // Change le bouton en Pause
        }).catch(error => {
            console.error("Erreur lors de la lecture de la musique :", error);
            alert("La lecture automatique de la musique est bloquée. Veuillez interagir avec la page.");
        });
    } else {
        bgMusic.pause();
        playMusicBtn.textContent = '▶️'; // Change le bouton en Play
    }
});


// Événements Souris et Tactile (Responsive)
heartContainer.addEventListener('mousedown', startCharging);
heartContainer.addEventListener('mouseup', stopCharging);
heartContainer.addEventListener('mouseleave', stopCharging);

heartContainer.addEventListener('touchstart', (e) => {
    e.preventDefault();
    startCharging();
}, { passive: false }); // Ajout de { passive: false } pour éviter les avertissements de la console
heartContainer.addEventListener('touchend', stopCharging);
document.addEventListener("mousemove", (e) => {
  const heart = document.createElement("div");

  heart.textContent = "❤️";
  heart.className =
    "absolute text-2xl pointer-events-none animate-ping";

  heart.style.left = e.clientX + "px";
  heart.style.top = e.clientY + "px";

  document.body.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 700);
});
document.getElementById('shareWA').addEventListener('click', () => {
    // Récupère l'URL de ton site automatiquement
    const urlSite = window.location.href; 
    
    // Le message pré-rempli avec un espace vide pour le nom
    const texte = `Coucou ! Regarde cette surprise de St Valentin que j'ai trouvée : ${urlSite} \n\nSigné : [ÉCRIS TON NOM ICI]`;
    
    // Encodage pour URL
    const messageFinal = encodeURIComponent(texte);
    
    // Lien WhatsApp
    const lienWA = `https://api.whatsapp.com/send?text=${messageFinal}`;
    
    // Ouvrir WhatsApp
    window.open(lienWA, '_blank');
});