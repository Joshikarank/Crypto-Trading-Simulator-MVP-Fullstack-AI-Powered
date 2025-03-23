const coinDetails = document.getElementById("coinDetails");
const token = localStorage.getItem("token");

document.getElementById("fetchBtn").addEventListener("click", async () => {
  const query = document.getElementById("coinName").value.trim().toLowerCase();
  if (!query) return alert("⚠️ Enter a search term.");

  coinDetails.innerHTML = "🔎 Searching...";

  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/search?query=${query}`);
    const data = await res.json();

    if (!data.coins || data.coins.length === 0) {
      coinDetails.innerHTML = "❌ No coins found.";
      return;
    }

    coinDetails.innerHTML = "";

    data.coins.forEach((coin) => {
      const item = document.createElement("div");
      item.classList.add("holding");

      item.innerHTML = `
        <img src="${coin.thumb}" width="24" />
        <strong>${coin.name}</strong> (${coin.symbol.toUpperCase()})
        ${coin.market_cap_rank ? ` - Rank: ${coin.market_cap_rank}` : ""}
        <br>ID: <code>${coin.id}</code>
        <br><button onclick="selectCoin('${coin.id}')">🟢 Buy this</button>
        <hr>
      `;

      coinDetails.appendChild(item);
    });

  } catch (err) {
    coinDetails.innerHTML = "❌ Error during search.";
    console.error(err.message);
  }
});

// ⚡ When user clicks "Buy this"
window.selectCoin = async (coinId) => {
  coinDetails.innerHTML = "⏳ Fetching live price...";

  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&ids=${coinId}`);
    const [coin] = await res.json();

    if (!coin) {
      coinDetails.innerHTML = "❌ Couldn't fetch price.";
      return;
    }

    coinDetails.innerHTML = `
      <img src="${coin.image}" width="32" />
      <strong>${coin.name}</strong> (${coin.symbol.toUpperCase()})<br>
      💰 Price: ₹${coin.current_price.toLocaleString("en-IN")}<br><br>

      <label>Buy Amount (₹):</label>
      <input type="number" id="buyAmount" placeholder="Enter amount in ₹" />
      <button onclick="buyCoin('${coin.id}')">🛒 Confirm Buy</button>
    `;
  } catch (err) {
    coinDetails.innerHTML = "❌ Failed to fetch price.";
    console.error(err.message);
  }
};

// 🛒 Final Buy Action
window.buyCoin = async (coinId) => {
  const value = parseFloat(document.getElementById("buyAmount").value);
  if (!value || value <= 0) return alert("⚠️ Invalid ₹ amount.");

  try {
    const res = await fetch("http://localhost:5000/api/portfolio/buy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        coin: coinId,
        virtualMoney: value
      })
    });

    const data = await res.json();
    if (!res.ok) return alert(`❌ ${data.error}`);

    alert(`✅ Bought ₹${value} of ${coinId}`);
    window.location.href = "dashboard.html";
  } catch (err) {
    alert("❌ Failed to buy.");
    console.error(err.message);
  }
};
