document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('password');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
  
    passwordInput.addEventListener('input', function() {
      const password = passwordInput.value;
      const strength = calculatePasswordStrength(password);
      
      updateStrengthIndicator(strength);
    });
  
    function calculatePasswordStrength(password) {
      let strength = 0;
      
      // Length check
      if (password.length > 0) strength += 1;
      if (password.length >= 8) strength += 1;
      
      // Character type checks
      if (/[A-Z]/.test(password)) strength += 1;
      if (/[0-9]/.test(password)) strength += 1;
      if (/[^A-Za-z0-9]/.test(password)) strength += 1;
      
      return strength;
    }
  
    function updateStrengthIndicator(strength) {
      let color, width, text;
      
      switch(strength) {
        case 0:
          color = '#ff4757';
          width = '10%';
          text = 'Very Weak';
          break;
        case 1:
          color = '#ff6348';
          width = '25%';
          text = 'Weak';
          break;
        case 2:
          color = '#ffa502';
          width = '50%';
          text = 'Medium';
          break;
        case 3:
          color = '#2ed573';
          width = '75%';
          text = 'Strong';
          break;
        case 4:
        case 5:
          color = '#1dd1a1';
          width = '100%';
          text = 'Very Strong';
          break;
        default:
          color = '#ff4757';
          width = '10%';
          text = 'Very Weak';
      }
      
      strengthBar.style.width = width;
      strengthBar.style.background = color;
      strengthText.textContent = text;
      strengthText.style.color = color;
    }
  });