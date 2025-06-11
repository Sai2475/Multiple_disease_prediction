// Form Validation
document.addEventListener('DOMContentLoaded', () => {
    // Password strength indicator (for signup)
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
      passwordInput.addEventListener('input', () => {
        const strengthBar = document.querySelector('.password-strength');
        const strength = Math.min(passwordInput.value.length / 8 * 100, 100);
        strengthBar.style.width = `${strength}%`;
        strengthBar.style.background = strength < 50 ? '#ff4d4d' : 
                                     strength < 75 ? '#ffcc00' : '#4CAF50';
      });
    }
  
    // Form submission handlers
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Temporary - Replace with actual auth later
        localStorage.setItem('medisense_user', JSON.stringify({
          email: document.getElementById('email').value
        }));
        window.location.href = 'dashboard.html';
      });
    }
  
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
      signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (password !== confirmPassword) {
          alert('Passwords do not match!');
          return;
        }
        
        // Temporary storage
        localStorage.setItem('medisense_user', JSON.stringify({
          name: document.getElementById('fullname').value,
          email: document.getElementById('email').value
        }));
        window.location.href = 'dashboard.html';
      });
    }
  });