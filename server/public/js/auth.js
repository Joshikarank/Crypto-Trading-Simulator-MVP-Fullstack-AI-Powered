document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const status = document.getElementById("statusMsg");

  if (!email || !password) {
    status.textContent = "⚠️ Enter email and password";
    return;
  }

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      status.textContent = `❌ ${data.error || "Login failed"}`;
      return;
    }

    // ✅ Save to localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.userId);
    localStorage.setItem("name", data.name);

    status.textContent = "✅ Login successful!";
    setTimeout(() => {
      window.location.href = "/dashboard.html";
    }, 800);

  } catch (err) {
    console.error("Login error:", err.message);
    status.textContent = "❌ Server error. Check backend.";
  }
});
