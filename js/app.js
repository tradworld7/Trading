// Professional Trading Analysis Engine
class TradingAnalyzer {
  constructor() {
    this.patterns = {
      'Bull Flag': {
        baseRange: [150, 200],
        volatility: [3, 6],
        confidence: [85, 95],
        profitMultiplier: 1.08
      },
      'Head & Shoulders': {
        baseRange: [200, 280],
        volatility: [6, 10],
        confidence: [75, 85],
        profitMultiplier: 1.12
      },
      'Double Top': {
        baseRange: [180, 240],
        volatility: [5, 8],
        confidence: [80, 90],
        profitMultiplier: 1.10
      },
      'Ascending Triangle': {
        baseRange: [120, 160],
        volatility: [2, 4],
        confidence: [90, 98],
        profitMultiplier: 1.06
      },
      'Descending Triangle': {
        baseRange: [160, 220],
        volatility: [5, 9],
        confidence: [70, 80],
        profitMultiplier: 1.15
      },
      'Cup and Handle': {
        baseRange: [100, 180],
        volatility: [4, 7],
        confidence: [88, 95],
        profitMultiplier: 1.09
      }
    };
  }

  analyze(imageData) {
    // In a real application, this would use computer vision to detect patterns
    // For simulation, we'll randomly select a pattern with realistic parameters
    
    const patternNames = Object.keys(this.patterns);
    const patternName = patternNames[Math.floor(Math.random() * patternNames.length)];
    const pattern = this.patterns[patternName];
    
    // Generate base price within pattern's range
    const basePrice = this._randomInRange(...pattern.baseRange);
    
    // Generate volatility
    const volatility = this._randomInRange(...pattern.volatility);
    
    // Generate confidence (higher for more reliable patterns)
    let confidence = this._randomInRange(...pattern.confidence);
    
    // Calculate entry price with some volatility
    const entry = (basePrice + (Math.random() * volatility - volatility/2)).toFixed(2);
    
    // Calculate stop loss (3-5% below entry, depending on volatility)
    const stopLossPercent = 3 + (volatility / 2);
    const stoploss = (entry * (1 - stopLossPercent/100)).toFixed(2);
    
    // Calculate average buy price (midpoint between entry and stop loss)
    const avg = ((parseFloat(entry) + parseFloat(stoploss)) / 2).toFixed(2);
    
    // Calculate target based on pattern's typical profit multiplier
    const target = (entry * pattern.profitMultiplier).toFixed(2);
    
    // Calculate potential profit percentage
    const profit = ((target - entry) / entry * 100).toFixed(1);
    
    // Add slight randomness to confidence
    confidence = Math.min(Math.max(confidence + (Math.random() * 6 - 3), 100).toFixed(0);
    
    return {
      pattern: patternName,
      entry,
      stoploss,
      avg,
      target,
      profit: profit + '%',
      confidence,
      timestamp: new Date().toISOString()
    };
  }

  _randomInRange(min, max) {
    return min + Math.random() * (max - min);
  }
}

// Firebase Integration
async function uploadAndAnalyze() {
  const fileInput = document.getElementById('screenshot');
  const file = fileInput.files[0];
  
  if (!file) {
    showError('Please select a chart screenshot first');
    return null;
  }

  try {
    // Show loading state
    const analyzeBtn = document.getElementById('analyzeBtn');
    analyzeBtn.disabled = true;
    analyzeBtn.innerHTML = '<i class="fas fa-spinner spinner btn-icon"></i> Analyzing...';
    
    // In a real app, you would upload to Firebase Storage here
    // const storageRef = sRef(storage, 'charts/' + Date.now() + '_' + file.name);
    // await uploadBytes(storageRef, file);
    // const downloadURL = await getDownloadURL(storageRef);
    
    // Simulate processing delay (1-3 seconds)
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Analyze the chart (simulated)
    const analyzer = new TradingAnalyzer();
    const analysis = analyzer.analyze(file);
    
    // In a real app, you would save to Firebase Database here
    // const newAnalysisRef = push(dRef(db, 'analyses'));
    // await set(newAnalysisRef, {
    //   ...analysis,
    //   user: localStorage.getItem("user"),
    //   imageUrl: downloadURL
    // });
    
    return analysis;
  } catch (error) {
    console.error("Analysis error:", error);
    showError('Analysis failed. Please try again.');
    return null;
  } finally {
    // Reset button state
    const analyzeBtn = document.getElementById('analyzeBtn');
    analyzeBtn.disabled = false;
    analyzeBtn.innerHTML = '<i class="fas fa-chart-pie btn-icon"></i> Analyze Chart';
  }
}

// UI Functions
function showError(message) {
  const errorElement = document.getElementById('errorMessage');
  errorElement.textContent = message;
  setTimeout(() => errorElement.textContent = '', 5000);
}

function displayResults(analysis) {
  document.getElementById('entry').textContent = analysis.entry;
  document.getElementById('stoploss').textContent = analysis.stoploss;
  document.getElementById('avg').textContent = analysis.avg;
  document.getElementById('target').textContent = analysis.target;
  document.getElementById('profit').textContent = analysis.profit;
  document.getElementById('confidenceValue').textContent = analysis.confidence + '%';
  
  // Animate confidence bar
  const confidenceFill = document.getElementById('confidenceFill');
  confidenceFill.style.width = '0%';
  setTimeout(() => {
    confidenceFill.style.width = analysis.confidence + '%';
  }, 100);
  
  // Show results container
  document.getElementById('resultsContainer').classList.remove('hidden');
  
  // Scroll to results
  document.getElementById('resultsContainer').scrollIntoView({ 
    behavior: 'smooth',
    block: 'nearest'
  });
}

// Main Analysis Function
window.analyzeChart = async function() {
  const analysis = await uploadAndAnalyze();
  if (analysis) {
    displayResults(analysis);
    
    // Show success notification
    const errorElement = document.getElementById('errorMessage');
    errorElement.style.color = 'var(--secondary)';
    errorElement.textContent = `Analysis complete! Detected pattern: ${analysis.pattern}`;
    setTimeout(() => errorElement.textContent = '', 5000);
  }
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  // Check authentication
  if (!localStorage.getItem("user")) {
    window.location.href = "login.html";
  }
});
