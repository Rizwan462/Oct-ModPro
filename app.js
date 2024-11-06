const apiURL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false';

function fetchDataWithThen() {
    fetch(apiURL)
        .then(response => response.json())
        .then(data => renderTable(data))
        .catch(error => console.error('Error fetching data:', error));
}

async function fetchDataWithAsync() {
    try {
        const response = await fetch(apiURL);
        const data = await response.json();
        renderTable(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function renderTable(data) {
    const tbody = document.querySelector('#coinTable tbody');
    tbody.innerHTML = ''; // Clear previous data

    data.forEach(coin => {
        const change24h = coin.price_change_percentage_24h;
        const changeClass = change24h >= 0 ? 'gain' : 'loss';

        const row = `
            <tr>
                <td><img src="${coin.image}" alt="${coin.name}" width="30"></td>
                <td>${coin.name}</td>
                <td class="symbol">${coin.symbol.toUpperCase()}</td>
                <td class="price">$${coin.current_price.toFixed(2)}</td>
                <td class="percentage ${changeClass}">${change24h.toFixed(2)}%</td>
                <td class="volume">Mkt Cap : $${coin.total_volume.toLocaleString()}</td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', row);
    });
}

function searchCoins() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    fetchDataWithAsync().then(data => {
        const filteredData = data.filter(coin => coin.name.toLowerCase().includes(query));
        renderTable(filteredData);
    });
}

function sortByMarketCap() {
    fetchDataWithAsync().then(data => {
        const sortedData = data.sort((a, b) => b.market_cap - a.market_cap);
        renderTable(sortedData);
    });
}

function sortByPercentageChange() {
    fetchDataWithAsync().then(data => {
        const sortedData = data.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
        renderTable(sortedData);
    });
}
