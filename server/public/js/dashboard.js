document.addEventListener("DOMContentLoaded", () => {
  const name = localStorage.getItem("name");
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const welcome = document.getElementById("welcomeMsg");
  const balance = document.getElementById("balanceText");
  const invested = document.getElementById("investedText");
  const profit = document.getElementById("profitText");
  const holdingsList = document.getElementById("holdingsList");

  // 🔐 Auth check
  if (!name || !userId || !token) {
    window.location.href = "/index.html";
    return;
  }

  welcome.textContent = `👋 Welcome, ${name}`;

  // 🔥 Fetch portfolio
  fetch(`http://localhost:5000/api/portfolio/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => {
      let totalValue = parseFloat(data.balance);
      let totalInvested = 0;

      holdingsList.innerHTML = "";

      if (!data.holdings || data.holdings.length === 0) {
        holdingsList.innerHTML = "<p>❌ No holdings yet.</p>";
      } else {
        data.holdings.forEach(h => {
          totalInvested += h.invested;

          const plValue = (h.currentValue - h.invested).toFixed(2);
          const plPercent = ((plValue / h.invested) * 100).toFixed(2);
          const coinId = h.coin.toLowerCase();

          const item = document.createElement("div");
          item.classList.add("holding");

          item.innerHTML = `
            <strong>${coinId.toUpperCase()}</strong><br>
            Quantity: ${h.amount.toFixed(5)}<br>
            Invested: ₹${h.invested.toFixed(2)}<br>
            Profit/Loss: ₹${plValue} (${plPercent}%)<br><br>

            <label>Sell ₹:</label>
            <input type="number" id="sellInput-${coinId}" placeholder="Amount in ₹" />
            <button onclick="sellCoin('${coinId}')">Sell</button>
            <br><br>

            <label>Buy ₹:</label>
            <input type="number" id="buyInput-${coinId}" placeholder="Amount in ₹" />
            <button onclick="buyMore('${coinId}')">Buy More</button>
            <hr>
          `;

          holdingsList.appendChild(item);
        });
      }

      // 📈 Summary
      const profitValue = totalValue - totalInvested;
      const profitPercent = totalInvested > 0 ? ((profitValue / totalInvested) * 100).toFixed(2) : 0;

      balance.textContent = `💰 Total Portfolio: ₹${totalValue.toFixed(2)}`;
      invested.textContent = `💼 Invested: ₹${totalInvested.toFixed(2)}`;
      profit.textContent = `📈 Profit/Loss: ₹${profitValue.toFixed(2)} (${profitPercent}%)`;
    })
    .catch(err => {
      console.error("Error loading dashboard:", err);
      balance.textContent = "⚠️ Could not load portfolio.";
    });

  // 🔴 Logout
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "/index.html";
  });
});


// 🔻 Sell Function (₹ based)
window.sellCoin = async (coinId) => {
  const amountInINR = parseFloat(document.getElementById(`sellInput-${coinId}`).value);
  if (isNaN(amountInINR) || amountInINR <= 0) {
    alert("⚠️ Enter a valid ₹ amount to sell.");
    return;
  }

  const res = await fetch("http://localhost:5000/api/portfolio/sell", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({
      userId: localStorage.getItem("userId"),
      coin: coinId,
      amountInINR
    })
  });

  const data = await res.json();
  if (!res.ok) return alert(`❌ ${data.error}`);
  alert(`✅ Sold ₹${amountInINR} worth of ${coinId}`);
  location.reload();
};


// 🔺 Buy Function
window.buyMore = async (coinId) => {
  const value = parseFloat(document.getElementById(`buyInput-${coinId}`).value);
  if (isNaN(value) || value <= 0) {
    alert("⚠️ Enter valid amount in ₹");
    return;
  }

  const res = await fetch("http://localhost:5000/api/portfolio/buy", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({
      coin: coinId,
      virtualMoney: value
    })
  });

  const data = await res.json();
  if (!res.ok) return alert(`❌ ${data.error}`);
  alert(`✅ Bought ₹${value} of ${coinId}`);
  location.reload();
};
