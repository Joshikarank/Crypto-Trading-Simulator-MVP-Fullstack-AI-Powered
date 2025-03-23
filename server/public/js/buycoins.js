document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    if (!token) return (window.location.href = "/index.html");
  
    const coinListDiv = document.getElementById("coinList");
  
    try {
      const res = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&order=market_cap_desc&per_page=100&page=1");
      const coins = await res.json();
  
      coinListDiv.innerHTML = "";
  
      coins.forEach(coin => {
        const item = document.createElement("div");
        item.classList.add("holding");
  
        item.innerHTML = `
          <img src="${coin.image}" width="20" /> 
          <strong>${coin.name}</strong> (${coin.symbol.toUpperCase()})<br>
          Price: ₹${coin.current_price.toLocaleString("en-IN")}<br>
          <input type="number" placeholder="Amount in ₹" id="buy-${coin.id}" />
          <button onclick="buyListedCoin('${coin.id}')">Buy</button>
          <hr>
        `;
  
        coinListDiv.appendChild(item);
      });
  
      // 🔍 Search functionality
      document.getElementById("searchBar").addEventListener("input", function () {
        const search = this.value.toLowerCase();
        const items = coinListDiv.querySelectorAll(".holding");
        items.forEach(div => {
          const match = div.innerText.toLowerCase().includes(search);
          div.style.display = match ? "block" : "none";
        });
      });
    } catch (err) {
      coinListDiv.innerHTML = "❌ Failed to load coins.";
      console.error("CoinGecko fetch error:", err.message);
    }
  });
  
  window.buyListedCoin = async (coinId) => {
    const token = localStorage.getItem("token");
    const value = parseFloat(document.getElementById(`buy-${coinId}`).value);
    if (!value || value <= 0) {
      alert("⚠️ Enter valid ₹ amount");
      return;
    }
  
    const res = await fetch("http://localhost:5000/api/portfolio/buy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ coin: coinId, virtualMoney: value })
    });
  
    const data = await res.json();
    if (!res.ok) return alert(`❌ ${data.error}`);
    alert(`✅ Bought ₹${value} of ${coinId}`);
    location.reload();
  };
  