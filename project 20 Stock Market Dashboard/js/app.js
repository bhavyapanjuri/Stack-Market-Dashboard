// Stock Market Dashboard Application
class StockDashboard {
    constructor() {
        this.appState = {
            stocks: [],
            selectedStock: 'AAPL',
            lastUpdated: null,
            priceHistory: [],
            volumeHistory: [],
            currency: 'USD'
        };
        
        this.watchlist = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'];
        this.usdToInr = 83.25; // Current exchange rate
        this.init();
    }

    // Initialize the application
    async init() {
        this.setupEventListeners();
        await this.loadInitialData();
        this.startPolling();
        this.updateLastUpdatedTime();
        this.startAnimations();
    }

    // Setup event listeners
    setupEventListeners() {
        document.getElementById('searchBtn').addEventListener('click', () => this.handleSearch());
        document.getElementById('stockSearch').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });
        
        // Currency toggle
        document.getElementById('currencyToggle').addEventListener('click', () => this.toggleCurrency('USD'));
        document.getElementById('currencyToggleINR').addEventListener('click', () => this.toggleCurrency('INR'));
    }

    // Toggle currency display
    toggleCurrency(currency) {
        this.appState.currency = currency;
        
        // Update button states
        document.getElementById('currencyToggle').classList.toggle('active', currency === 'USD');
        document.getElementById('currencyToggleINR').classList.toggle('active', currency === 'INR');
        
        // Update display
        this.updateDashboard();
    }

    // Start visual animations
    startAnimations() {
        // Stagger card animations
        const cards = document.querySelectorAll('.slide-in');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.2}s`;
        });
        
        // Chart container animations
        const charts = document.querySelectorAll('.fade-in');
        charts.forEach((chart, index) => {
            chart.style.animationDelay = `${0.8 + index * 0.3}s`;
        });
    }

    // Convert USD to INR
    convertToINR(usdAmount) {
        return usdAmount * this.usdToInr;
    }

    // Format currency display
    formatCurrency(amount, currency = 'USD') {
        if (currency === 'INR') {
            return `₹${amount.toFixed(2)}`;
        }
        return `$${amount.toFixed(2)}`;
    }

    // Generate simulated stock data
    generateStockData(symbol) {
        const basePrice = Math.random() * 200 + 50;
        const change = (Math.random() - 0.5) * 10;
        const changePercent = (change / basePrice) * 100;
        
        return {
            symbol: symbol,
            company: this.getCompanyName(symbol),
            price: basePrice,
            change: change,
            changePercent: changePercent,
            dayHigh: basePrice + Math.random() * 5,
            dayLow: basePrice - Math.random() * 5,
            volume: Math.floor(Math.random() * 10000000) + 1000000
        };
    }

    // Get company name for symbol
    getCompanyName(symbol) {
        const companies = {
            'AAPL': 'Apple Inc.',
            'GOOGL': 'Alphabet Inc.',
            'MSFT': 'Microsoft Corp.',
            'AMZN': 'Amazon.com Inc.',
            'TSLA': 'Tesla Inc.',
            'META': 'Meta Platforms',
            'NVDA': 'NVIDIA Corp.',
            'NFLX': 'Netflix Inc.'
        };
        return companies[symbol] || `${symbol} Corp.`;
    }

    // Load initial data
    async loadInitialData() {
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Generate data for watchlist
            this.appState.stocks = this.watchlist.map(symbol => this.generateStockData(symbol));
            
            // Generate price history for selected stock
            this.generatePriceHistory();
            
            // Update UI
            this.updateDashboard();
            
        } catch (error) {
            console.error('Error loading data:', error);
            this.showError('Failed to load stock data');
        }
    }

    // Generate price history for charts
    generatePriceHistory() {
        const selectedStockData = this.appState.stocks.find(stock => stock.symbol === this.appState.selectedStock);
        if (!selectedStockData) return;

        const basePrice = selectedStockData.price;
        this.appState.priceHistory = [];
        this.appState.volumeHistory = [];

        // Generate 30 data points
        for (let i = 29; i >= 0; i--) {
            const variation = (Math.random() - 0.5) * 0.1;
            const price = basePrice * (1 + variation * (i / 30));
            const volume = Math.floor(Math.random() * 5000000) + 1000000;
            
            this.appState.priceHistory.push({
                time: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
                price: price
            });
            
            this.appState.volumeHistory.push({
                time: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
                volume: volume
            });
        }
    }

    // Update entire dashboard
    updateDashboard() {
        const selectedStock = this.appState.stocks.find(stock => stock.symbol === this.appState.selectedStock);
        if (selectedStock) {
            this.renderSummaryCards(selectedStock);
            this.renderCharts();
        }
        this.renderStockTable();
        this.updateLastUpdatedTime();
    }

    // Render summary cards with dual currency
    renderSummaryCards(stock) {
        const currentPrice = this.appState.currency === 'USD' ? stock.price : this.convertToINR(stock.price);
        const dayHigh = this.appState.currency === 'USD' ? stock.dayHigh : this.convertToINR(stock.dayHigh);
        const dayLow = this.appState.currency === 'USD' ? stock.dayLow : this.convertToINR(stock.dayLow);
        
        // Update primary currency display
        document.getElementById('currentPrice').textContent = this.formatCurrency(currentPrice, this.appState.currency);
        document.getElementById('dayHigh').textContent = this.formatCurrency(dayHigh, this.appState.currency);
        document.getElementById('dayLow').textContent = this.formatCurrency(dayLow, this.appState.currency);
        
        // Update secondary currency display
        const secondaryCurrency = this.appState.currency === 'USD' ? 'INR' : 'USD';
        const secondaryPrice = this.appState.currency === 'USD' ? this.convertToINR(stock.price) : stock.price;
        const secondaryHigh = this.appState.currency === 'USD' ? this.convertToINR(stock.dayHigh) : stock.dayHigh;
        const secondaryLow = this.appState.currency === 'USD' ? this.convertToINR(stock.dayLow) : stock.dayLow;
        
        document.getElementById('currentPriceINR').textContent = this.formatCurrency(secondaryPrice, secondaryCurrency);
        document.getElementById('dayHighINR').textContent = this.formatCurrency(secondaryHigh, secondaryCurrency);
        document.getElementById('dayLowINR').textContent = this.formatCurrency(secondaryLow, secondaryCurrency);
        
        // Update change with animation
        const changeElement = document.getElementById('priceChange');
        const changeText = `${stock.change >= 0 ? '+' : ''}${stock.change.toFixed(2)} (${stock.changePercent.toFixed(2)}%)`;
        changeElement.textContent = changeText;
        changeElement.className = `metric-change ${stock.change >= 0 ? 'positive' : 'negative'}`;
        
        // Volume with animation
        const volumeElement = document.getElementById('volume');
        volumeElement.textContent = this.formatNumber(stock.volume);
        
        // Add pulse animation to updated values
        [document.getElementById('currentPrice'), volumeElement].forEach(el => {
            el.style.animation = 'none';
            setTimeout(() => el.style.animation = 'pulse 1s ease-in-out', 10);
        });
    }

    // Enhanced price chart with gradients and animations
    renderPriceChart() {
        const canvas = document.getElementById('priceChart');
        const ctx = canvas.getContext('2d');
        
        canvas.width = canvas.offsetWidth * 2;
        canvas.height = canvas.offsetHeight * 2;
        ctx.scale(2, 2);
        
        const width = canvas.offsetWidth;
        const height = canvas.offsetHeight;
        
        ctx.clearRect(0, 0, width, height);
        
        if (this.appState.priceHistory.length === 0) return;
        
        const prices = this.appState.priceHistory.map(item => item.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        const priceRange = maxPrice - minPrice;
        
        // Draw gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, 'rgba(255, 107, 107, 0.1)');
        gradient.addColorStop(1, 'rgba(78, 205, 196, 0.1)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Draw animated grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            const y = (height - 60) * (i / 5) + 30;
            ctx.beginPath();
            ctx.moveTo(40, y);
            ctx.lineTo(width - 20, y);
            ctx.stroke();
        }
        
        // Draw gradient line
        const lineGradient = ctx.createLinearGradient(0, 0, width, 0);
        lineGradient.addColorStop(0, '#ff6b6b');
        lineGradient.addColorStop(0.5, '#4ecdc4');
        lineGradient.addColorStop(1, '#45b7d1');
        
        ctx.strokeStyle = lineGradient;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        
        // Draw area under curve
        const areaGradient = ctx.createLinearGradient(0, 30, 0, height - 30);
        areaGradient.addColorStop(0, 'rgba(255, 107, 107, 0.3)');
        areaGradient.addColorStop(1, 'rgba(78, 205, 196, 0.1)');
        
        ctx.beginPath();
        this.appState.priceHistory.forEach((item, index) => {
            const x = 40 + (width - 60) * (index / (this.appState.priceHistory.length - 1));
            const y = height - 30 - ((item.price - minPrice) / priceRange) * (height - 60);
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        // Fill area
        ctx.lineTo(width - 20, height - 30);
        ctx.lineTo(40, height - 30);
        ctx.closePath();
        ctx.fillStyle = areaGradient;
        ctx.fill();
        
        // Draw main line
        ctx.beginPath();
        this.appState.priceHistory.forEach((item, index) => {
            const x = 40 + (width - 60) * (index / (this.appState.priceHistory.length - 1));
            const y = height - 30 - ((item.price - minPrice) / priceRange) * (height - 60);
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();
        
        // Draw data points
        this.appState.priceHistory.forEach((item, index) => {
            const x = 40 + (width - 60) * (index / (this.appState.priceHistory.length - 1));
            const y = height - 30 - ((item.price - minPrice) / priceRange) * (height - 60);
            
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, 2 * Math.PI);
            ctx.fillStyle = '#fff';
            ctx.fill();
            ctx.strokeStyle = '#ff6b6b';
            ctx.lineWidth = 2;
            ctx.stroke();
        });
        
        // Price labels with better styling
        ctx.fillStyle = '#666';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'right';
        
        for (let i = 0; i <= 5; i++) {
            const price = minPrice + (priceRange * (5 - i) / 5);
            const y = (height - 60) * (i / 5) + 35;
            ctx.fillText(this.formatCurrency(price, this.appState.currency), 35, y);
        }
    }

    // Enhanced volume chart with colorful bars
    renderVolumeChart() {
        const canvas = document.getElementById('volumeChart');
        const ctx = canvas.getContext('2d');
        
        canvas.width = canvas.offsetWidth * 2;
        canvas.height = canvas.offsetHeight * 2;
        ctx.scale(2, 2);
        
        const width = canvas.offsetWidth;
        const height = canvas.offsetHeight;
        
        ctx.clearRect(0, 0, width, height);
        
        if (this.appState.volumeHistory.length === 0) return;
        
        const volumes = this.appState.volumeHistory.map(item => item.volume);
        const maxVolume = Math.max(...volumes);
        const barWidth = (width - 60) / this.appState.volumeHistory.length;
        
        // Draw colorful bars with gradients
        this.appState.volumeHistory.forEach((item, index) => {
            const x = 40 + index * barWidth;
            const barHeight = (item.volume / maxVolume) * (height - 60);
            const y = height - 30 - barHeight;
            
            // Create gradient for each bar
            const barGradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
            const colors = ['#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
            const color = colors[index % colors.length];
            
            barGradient.addColorStop(0, color);
            barGradient.addColorStop(1, color + '80');
            
            ctx.fillStyle = barGradient;
            ctx.fillRect(x + 1, y, barWidth - 3, barHeight);
            
            // Add bar border
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.strokeRect(x + 1, y, barWidth - 3, barHeight);
        });
        
        // Volume labels
        ctx.fillStyle = '#666';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'right';
        
        for (let i = 0; i <= 3; i++) {
            const volume = (maxVolume * (3 - i) / 3);
            const y = (height - 60) * (i / 3) + 35;
            ctx.fillText(this.formatNumber(volume), 35, y);
        }
    }

    // Render both charts
    renderCharts() {
        this.renderPriceChart();
        this.renderVolumeChart();
    }

    // Enhanced stock table with animations
    renderStockTable() {
        const tbody = document.getElementById('stockTableBody');
        tbody.innerHTML = '';
        
        this.appState.stocks.forEach((stock, index) => {
            const row = document.createElement('tr');
            const displayPrice = this.appState.currency === 'USD' ? stock.price : this.convertToINR(stock.price);
            
            row.innerHTML = `
                <td class="symbol">${stock.symbol}</td>
                <td>${stock.company}</td>
                <td>${this.formatCurrency(displayPrice, this.appState.currency)}</td>
                <td class="${stock.change >= 0 ? 'positive' : 'negative'}">
                    ${stock.change >= 0 ? '+' : ''}${stock.change.toFixed(2)} (${stock.changePercent.toFixed(2)}%)
                </td>
                <td>${this.formatNumber(stock.volume)}</td>
            `;
            
            // Add staggered animation
            row.style.opacity = '0';
            row.style.transform = 'translateX(-20px)';
            row.style.transition = 'all 0.3s ease';
            
            setTimeout(() => {
                row.style.opacity = '1';
                row.style.transform = 'translateX(0)';
            }, index * 100);
            
            row.addEventListener('click', () => {
                this.appState.selectedStock = stock.symbol;
                this.generatePriceHistory();
                this.updateDashboard();
                
                // Add click animation
                row.style.transform = 'scale(0.98)';
                setTimeout(() => row.style.transform = 'scale(1)', 150);
            });
            
            tbody.appendChild(row);
        });
    }

    // Handle search functionality
    handleSearch() {
        const searchTerm = document.getElementById('stockSearch').value.trim().toUpperCase();
        if (!searchTerm) return;
        
        // Check if stock already exists
        const existingStock = this.appState.stocks.find(stock => stock.symbol === searchTerm);
        if (existingStock) {
            this.appState.selectedStock = searchTerm;
            this.generatePriceHistory();
            this.updateDashboard();
            return;
        }
        
        // Add new stock
        const newStock = this.generateStockData(searchTerm);
        this.appState.stocks.push(newStock);
        this.appState.selectedStock = searchTerm;
        this.generatePriceHistory();
        this.updateDashboard();
        
        // Clear search input
        document.getElementById('stockSearch').value = '';
    }

    // Start polling for updates
    startPolling() {
        setInterval(() => {
            this.updateStockPrices();
        }, 5000); // Update every 5 seconds
    }

    // Update stock prices (simulate real-time updates)
    updateStockPrices() {
        this.appState.stocks.forEach(stock => {
            const variation = (Math.random() - 0.5) * 0.02; // ±2% variation
            stock.price *= (1 + variation);
            stock.change = stock.price - (stock.price / (1 + variation));
            stock.changePercent = (stock.change / (stock.price - stock.change)) * 100;
        });
        
        this.updateDashboard();
    }

    // Update last updated time
    updateLastUpdatedTime() {
        const now = new Date();
        document.getElementById('lastUpdated').textContent = 
            `Last updated: ${now.toLocaleTimeString()}`;
        this.appState.lastUpdated = now;
    }

    // Format large numbers
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    // Show error message
    showError(message) {
        console.error(message);
        // Could implement a toast notification here
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new StockDashboard();
});