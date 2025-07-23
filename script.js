document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const analysisResult = document.getElementById('analysisResult');
    const uploadedImage = document.getElementById('uploadedImage');
    
    // Event Listeners
    uploadArea.addEventListener('click', () => fileInput.click());
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            handleFileUpload(e.dataTransfer.files[0]);
        }
    });
    
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length) {
            handleFileUpload(fileInput.files[0]);
        }
    });
    
    // Simulate analysis for demo purposes
    document.querySelector('.btn-new-analysis')?.addEventListener('click', () => {
        analysisResult.style.display = 'none';
        fileInput.value = '';
    });
    
    // Functions
    function handleFileUpload(file) {
        if (!file.type.match('image.*')) {
            alert('Please upload an image file');
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = function(e) {
            // Display uploaded image
            uploadedImage.src = e.target.result;
            
            // Simulate AI analysis (in a real app, this would be an API call)
            simulateAnalysis();
            
            // Show analysis result section
            analysisResult.style.display = 'block';
            
            // Scroll to analysis result
            analysisResult.scrollIntoView({ behavior: 'smooth' });
        };
        
        reader.readAsDataURL(file);
    }
    
    function simulateAnalysis() {
        // This is just for demo - in a real app, you would call your AI analysis API
        
        // Random coin data for demo
        const coins = [
            { name: 'Bitcoin (BTC)', logo: 'btc-logo.png', price: '$' + (Math.random() * 10000 + 30000).toFixed(2) },
            { name: 'Ethereum (ETH)', logo: 'eth-logo.png', price: '$' + (Math.random() * 1000 + 1800).toFixed(2) },
            { name: 'Binance Coin (BNB)', logo: 'bnb-logo.png', price: '$' + (Math.random() * 100 + 200).toFixed(2) },
            { name: 'Solana (SOL)', logo: 'sol-logo.png', price: '$' + (Math.random() * 50 + 50).toFixed(2) }
        ];
        
        const randomCoin = coins[Math.floor(Math.random() * coins.length)];
        
        // Update coin info
        document.getElementById('coinName').textContent = randomCoin.name;
        document.getElementById('coinPrice').textContent = `Current Price: ${randomCoin.price}`;
        document.getElementById('coinLogo').src = `assets/images/${randomCoin.logo}`;
        
        // Generate random analysis data
        const currentPrice = parseFloat(randomCoin.price.substring(1));
        const entryLow = currentPrice * (1 - (Math.random() * 0.02 + 0.005));
        const entryHigh = currentPrice * (1 - (Math.random() * 0.01));
        const stopLoss = currentPrice * (1 - (Math.random() * 0.04 + 0.02));
        const takeProfitLow = currentPrice * (1 + (Math.random() * 0.03 + 0.02));
        const takeProfitHigh = currentPrice * (1 + (Math.random() * 0.05 + 0.03));
        
        // Update trading recommendations
        document.getElementById('entryPoint').textContent = `$${entryLow.toFixed(2)} - $${entryHigh.toFixed(2)}`;
        document.getElementById('stopLoss').textContent = `$${stopLoss.toFixed(2)}`;
        document.getElementById('takeProfit').textContent = `$${takeProfitLow.toFixed(2)} - $${takeProfitHigh.toFixed(2)}`;
        
        // Random timeframe
        const timeframes = ['15M - 1H', '1H - 4H', '4H - 1D', '1D - 1W'];
        document.getElementById('timeframe').textContent = timeframes[Math.floor(Math.random() * timeframes.length)];
        
        // Random analysis summary
        const summaries = [
            'The chart shows a bullish flag pattern forming after a strong upward move. The RSI is at 58, indicating there\'s still room for upward movement before becoming overbought. Volume is increasing on upward moves, supporting the bullish case.',
            'A head and shoulders pattern appears to be forming, suggesting potential reversal. The MACD histogram is showing decreasing momentum, and price is approaching a strong resistance level from previous highs.',
            'Price is consolidating in a symmetrical triangle after a strong trend. The Bollinger Bands are tightening, suggesting a breakout is imminent. Watch for volume confirmation on the breakout direction.',
            'The chart shows a clear uptrend with higher highs and higher lows. The 50-day moving average is acting as support, and the Stochastic RSI is coming out of oversold territory, suggesting potential continuation.'
        ];
        document.getElementById('analysisSummary').textContent = summaries[Math.floor(Math.random() * summaries.length)];
        
        // Random confidence level (between 60-80% for demo)
        const confidence = Math.floor(Math.random() * 20) + 60;
        document.querySelector('.progress-fill').style.width = `${confidence}%`;
        document.querySelector('.confidence-level span').textContent = `${confidence}% Confidence`;
    }
    
    // Local storage for saving analyses
    document.querySelector('.btn-save-analysis')?.addEventListener('click', function() {
        const analysisData = {
            coin: document.getElementById('coinName').textContent,
            price: document.getElementById('coinPrice').textContent,
            entry: document.getElementById('entryPoint').textContent,
            stopLoss: document.getElementById('stopLoss').textContent,
            takeProfit: document.getElementById('takeProfit').textContent,
            timeframe: document.getElementById('timeframe').textContent,
            summary: document.getElementById('analysisSummary').textContent,
            confidence: document.querySelector('.confidence-level span').textContent,
            timestamp: new Date().toISOString(),
            image: uploadedImage.src
        };
        
        let savedAnalyses = JSON.parse(localStorage.getItem('cryptoVisionAnalyses')) || [];
        savedAnalyses.push(analysisData);
        localStorage.setItem('cryptoVisionAnalyses', JSON.stringify(savedAnalyses));
        
        alert('Analysis saved successfully!');
    });
    
    // View history functionality
    document.querySelector('.btn-view-history')?.addEventListener('click', function() {
        const savedAnalyses = JSON.parse(localStorage.getItem('cryptoVisionAnalyses')) || [];
        if (savedAnalyses.length === 0) {
            alert('No saved analyses found.');
        } else {
            // In a real app, you would show a modal or navigate to a history page
            console.log('Saved analyses:', savedAnalyses);
            alert(`You have ${savedAnalyses.length} saved analyses. In a full implementation, this would show your history.`);
        }
    });
});