async function updateBitcoinPrice() {
  const priceElement = document.getElementById("btc-price");
  if (!priceElement) return;

  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",
      { headers: { Accept: "application/json" } },
    );

    if (!response.ok) throw new Error(`CoinGecko returned ${response.status}`);

    const data = await response.json();
    priceElement.textContent = `$${data.bitcoin.usd.toLocaleString()}`;
  } catch (_error) {
    priceElement.textContent = "Unavailable";
  }
}

updateBitcoinPrice();
