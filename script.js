const apiKey = 'your_api_key_here'; // Insert your financial API key here
const portfolioBody = document.getElementById('portfolio-body');
const totalPerformanceDisplay = document.getElementById('total-performance');
let portfolio = [];

document.getElementById('add-stock-btn').addEventListener('click', () => {
  const symbols = document.getElementById('stock-symbol').value.toUpperCase().split(',');
  symbols.forEach(symbol => {
    fetchStockData(symbol.trim());
  });
});

function fetchStockData(symbol) {
  // Fetch stock data from financial API (using Alpha Vantage as an example)
  fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      const stockData = data['Global Quote'];
      if (stockData) {
        const stock = {
          symbol: stockData['01. symbol'],
          price: parseFloat(stockData['05. price']),
          change: parseFloat(stockData['10. change percent'].replace('%', ''))
        };
        addToPortfolio(stock);
      } else {
        alert(`Stock symbol ${symbol} not found!`);
      }
    })
    .catch(error => console.error('Error fetching stock data:', error));
}

function addToPortfolio(stock) {
  portfolio.push(stock);
  updatePortfolioTable();
}

function updatePortfolioTable() {
  portfolioBody.innerHTML = ''; // Clear current portfolio

  portfolio.forEach((stock, index) => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${stock.symbol}</td>
      <td>$${stock.price.toFixed(2)}</td>
      <td>${stock.change.toFixed(2)}%</td>
      <td><button class="remove-btn" onclick="removeStock(${index})">Remove</button></td>
    `;
    portfolioBody.appendChild(row);
  });

  calculateTotalPerformance();
}

function removeStock(index) {
  portfolio.splice(index, 1);
  updatePortfolioTable();
}

function calculateTotalPerformance() {
  let totalPerformance = portfolio.reduce((acc, stock) => acc + stock.change, 0);
  totalPerformanceDisplay.textContent = totalPerformance.toFixed(2) + '%';
}
