// Handle disease selection navigation
document.addEventListener("DOMContentLoaded", () => {
    const heartLink = document.querySelector('#heart-disease-link');
    const diabetesLink = document.querySelector('#diabetes-disease-link');

    if (heartLink) {
        heartLink.addEventListener('click', () => {
            window.location.href = '/predict-heart';
        });
    }

    if (diabetesLink) {
        diabetesLink.addEventListener('click', () => {
            window.location.href = '/predict-diabetes';
        });
    }
});
