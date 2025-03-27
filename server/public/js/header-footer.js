// Load header and footer
document.addEventListener("DOMContentLoaded", function() {
    // Load header
    fetch('header.html')
      .then(response => response.text())
      .then(data => {
        document.getElementById('header-container').innerHTML = data;
        initializeHeader();
      });
  
    // Load footer
    fetch('footer.html')
      .then(response => response.text())
      .then(data => {
        document.getElementById('footer-container').innerHTML = data;
      });
  });
  
  function initializeHeader() {
    // Set username if available
    const username = localStorage.getItem("name");
    if (username) {
      const usernameDisplay = document.getElementById("usernameDisplay");
      if (usernameDisplay) usernameDisplay.textContent = username;
    }
  
    // Highlight active nav item based on current page
    const currentPage = window.location.pathname.split('/').pop();
    const navItems = document.querySelectorAll('.main-nav li');
    
    navItems.forEach(item => {
      const link = item.querySelector('a');
      if (link.getAttribute('href') === currentPage) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  
    // User dropdown functionality
    const userMenu = document.querySelector(".user-menu");
    if (userMenu) {
      userMenu.addEventListener("click", () => {
        // Implement dropdown toggle logic here
        console.log("User menu clicked");
      });
    }
  }