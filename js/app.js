import { storage, db } from './firebase-config.js';
import { ref as sRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";
import { ref as dRef, push, set } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

// Enhanced analysis function with better simulation
function analyzeChart(imageData) {
  // In a real app, this would use ML/AI to analyze the chart
  // For simulation, we'll generate more realistic values based on some patterns
  
  // Simulate detecting chart patterns
  const patterns = ['Bull Flag', 'Head & Shoulders', 'Double Top', 'Ascending Triangle', 'Descending Triangle'];
  const detectedPattern = patterns[Math.floor(Math.random() * patterns.length)];
  
  // Generate values based on pattern
  let basePrice, volatility, confidence;
  
  switch(detectedPattern) {
    case 'Bull Flag':
      basePrice = 150 + Math.random() * 50;
      volatility = 5 + Math.random() * 3;
      confidence = 85 + Math.random() * 10;
      break;
    case 'Head & Shoulders':
      basePrice = 200 + Math.random() * 80;
      volatility = 8 + Math.random() * 5;
      confidence = 75 + Math.random() * 15;
      break;
    case 'Double Top':
      basePrice = 180 + Math.random() * 60;
      volatility = 6 + Math.random() * 4;
      confidence = 80 + Math.random() * 15;
      break;
    case 'Ascending Triangle':
      basePrice = 120 + Math.random() * 40;
      volatility = 4 + Math.random() * 2;
      confidence = 90 + Math.random() * 8;
      break;
    case 'Descending Triangle':
      basePrice = 160 + Math.random() * 70;
      volatility = 7 + Math.random() * 4;
      confidence = 70 + Math.random() * 20;
      break;
    default:
      basePrice = 100 + Math.random() * 100;
      volatility = 5 + Math.random() * 5;
      confidence = 80 + Math.random() * 15;
  }
  
  // Ensure confidence is between 70-95%
  confidence = Math.min(Math.max(confidence, 70), 95);
  
  // Calculate trade parameters
  const entry = (basePrice + (Math.random() * volatility - volatility/2)).toFixed(2);
  const stoploss = (entry * 0.97).toFixed(2);
  const avg = ((parseFloat(entry) + parseFloat(stoploss)) / 2).toFixed(2);
  const target = (entry * 1.06).toFixed(2);
  const profit = ((target - entry) / entry * 100).toFixed(1);
  
  return {
    entry,
    stoploss,
    avg,
    target,
    profit: profit + '%',
    confidence: Math.round(confidence),
    pattern: detectedPattern
  };
}

window.uploadScreenshot = async function () {
  const fileInput = document.getElementById('screenshot');
  const file = fileInput.files[0];
  if (!file) return alert("Please select a chart screenshot.");
  
  try {
    // Show loading state
    const analyzeBtn = document.querySelector('.analyze-btn');
    analyzeBtn.disabled = true;
    analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
    
    // Upload to Firebase Storage
    const fileRef = sRef(storage, 'charts/' + Date.now() + '_' + file.name);
    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);
    
    // Simulate analysis (in real app, this would be ML model processing)
    const analysis = analyzeChart(file);
    
    // Save to database
    const key = push(dRef(db, 'charts')).key;
    await set(dRef(db, 'charts/' + key), {
      url: downloadURL,
      ...analysis,
      user: localStorage.getItem("user"),
      timestamp: Date.now()
    });
    
    // Display results
    document.getElementById("entry").innerText = analysis.entry;
    document.getElementById("stoploss").innerText = analysis.stoploss;
    document.getElementById("avg").innerText = analysis.avg;
    document.getElementById("target").innerText = analysis.target;
    document.getElementById("profit").innerText = analysis.profit;
    document.getElementById("confidenceValue").innerText = analysis.confidence;
    document.getElementById("confidenceFill").style.width = analysis.confidence + '%';
    
    // Show success message
    alert(`Analysis complete! Detected pattern: ${analysis.pattern}\nConfidence: ${analysis.confidence}%`);
    
  } catch (error) {
    console.error("Error:", error);
    alert("Analysis failed. Please try again.");
  } finally {
    // Reset button
    const analyzeBtn = document.querySelector('.analyze-btn');
    analyzeBtn.disabled = false;
    analyzeBtn.textContent = 'Analyze Chart';
  }
};

// Add drag and drop functionality
document.addEventListener('DOMContentLoaded', () => {
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('screenshot');
  
  dropZone.addEventListener('click', () => fileInput.click());
  
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#4361ee';
    dropZone.style.background = 'rgba(67, 97, 238, 0.1)';
  });
  
  dropZone.addEventListener('dragleave', () => {
    dropZone.style.borderColor = '#ddd';
    dropZone.style.background = 'transparent';
  });
  
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#ddd';
    dropZone.style.background = 'transparent';
    
    if (e.dataTransfer.files.length) {
      fileInput.files = e.dataTransfer.files;
      dropZone.querySelector('p').textContent = `File ready: ${fileInput.files[0].name}`;
    }
  });
});

window.logout = function() {
  localStorage.removeItem("user");
  window.location.href = "login.html";
};
