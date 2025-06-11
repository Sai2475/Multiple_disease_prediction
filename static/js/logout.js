// Handle logout functionality
document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.querySelector('#logout-button');

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            // Clear session data and log out
            localStorage.clear();
            sessionStorage.clear();
            alert("You have been logged out.");
            window.location.href = '/login';
        });
    }
});
