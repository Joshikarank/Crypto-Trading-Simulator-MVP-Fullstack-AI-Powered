document.getElementById("signupBtn").addEventListener("click", async () => {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const status = document.getElementById("statusMsg");
  
    if (!name || !email || !password) {
      status.textContent = "⚠️ Fill in all fields.";
      return;
    }
  
    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        status.textContent = `❌ ${data.error || "Signup failed"}`;
        return;
      }
  
      status.textContent = "✅ Account created! Redirecting to login...";
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);
  
    } catch (err) {
      console.error("Signup error:", err.message);
      status.textContent = "❌ Could not connect to server.";
    }
  });
  