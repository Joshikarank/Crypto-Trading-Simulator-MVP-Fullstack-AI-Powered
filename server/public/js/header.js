document.addEventListener("DOMContentLoaded", () => {
    // Set username in header
    const usernameDisplay = document.getElementById("usernameDisplay");
    const name = localStorage.getItem("name");
    if (name) {
      usernameDisplay.textContent = name;
    }
  
    // User dropdown functionality
    const userMenu = document.querySelector(".user-menu");
    const userDropdown = document.querySelector(".user-dropdown");
    
  
    // Highlight active nav item
    const navItems = document.querySelectorAll(".main-nav li");
    navItems.forEach(item => {
      item.addEventListener("click", () => {
        navItems.forEach(i => i.classList.remove("active"));
        item.classList.add("active");
      });
    });
  });
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "/"; // or your login page
  });