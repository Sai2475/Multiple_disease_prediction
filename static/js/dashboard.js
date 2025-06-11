document.addEventListener('DOMContentLoaded', () => {
  // ==================== NEW: NAVIGATION FIXES ====================
  // 1. Fix all navigation links first
  const fixNavigation = () => {
      // New Prediction link
      const newPredictionLink = document.querySelector('.nav-link[href="select-disease.html"]');
      if (newPredictionLink) {
          newPredictionLink.addEventListener('click', (e) => {
              e.preventDefault();
              window.location.href = 'select-disease.html';
          });
      }

      // Logout link
      const logoutLink = document.querySelector('.nav-link[href="index.html"]');
      if (logoutLink) {
          logoutLink.addEventListener('click', (e) => {
              e.preventDefault();
              // Add any logout cleanup here if needed
              window.location.href = 'index.html';
          });
      }

      // Make recent predictions clickable
      document.getElementById('predictions-list')?.addEventListener('click', (e) => {
          const predictionItem = e.target.closest('.prediction-item');
          if (predictionItem) {
              const type = predictionItem.querySelector('strong')?.textContent.toLowerCase();
              if (type) window.location.href = `predict-${type}.html`;
          }
      });
  };
  fixNavigation();
  // ==================== END NAVIGATION FIXES ====================

  // Original initialization code (unchanged)
  try {
      initTheme();
      const user = loadUserData();
      updateUI(user);
      
      if (document.getElementById('diabetesTrendChart') && document.getElementById('heartTrendChart')) {
          initCharts(user);
      } else {
          console.error('Chart containers not found');
      }
  
      initHabitCards();
      displayInsights(user);
  } catch (error) {
      console.error('Dashboard initialization failed:', error);
      displayErrorToUser();
  }
});

// ==================== MODIFIED FUNCTIONS ====================
function renderRecentPredictions(user) {
  try {
      const container = document.getElementById('predictions-list');
      if (!container) return;
  
      container.innerHTML = '';
      
      const recentPredictions = user.predictions
          .slice(0, 3)
          .sort((a, b) => new Date(b.date) - new Date(a.date));
      
      if (recentPredictions.length === 0) {
          container.innerHTML = '<div class="no-data">No predictions yet</div>';
          return;
      }
  
      recentPredictions.forEach(pred => {
          const predEl = document.createElement('div');
          predEl.className = 'prediction-item';
          predEl.dataset.type = pred.type; // Add type as data attribute
          
          predEl.innerHTML = `
              <div>
                  <strong>${pred.type.toUpperCase()}</strong>
                  <span>${formatDate(pred.date)}</span>
              </div>
              <div class="risk-badge" style="color: ${getRiskColor(pred.risk)}">
                  ${pred.risk}%
              </div>
          `;
          container.appendChild(predEl);
      });
  } catch (error) {
      console.error('Failed to render predictions:', error);
  }
}

function displayErrorToUser() {
  const errorEl = document.createElement('div');
  errorEl.className = 'error-message';
  errorEl.innerHTML = `
      <p>⚠️ We're experiencing technical difficulties</p>
      <div class="error-actions">
          <button onclick="window.location.reload()">Refresh Page</button>
          <button onclick="window.location.href='dashboard.html'">Return Home</button>
      </div>
  `;
  document.body.prepend(errorEl);
  
  // Add minimal error styling
  const style = document.createElement('style');
  style.textContent = `
      .error-message {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: #ff4d4d;
          color: white;
          padding: 1rem;
          z-index: 1000;
          text-align: center;
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      }
      .error-actions {
          margin-top: 0.5rem;
          display: flex;
          justify-content: center;
          gap: 1rem;
      }
      .error-actions button {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-family: 'Poppins', sans-serif;
      }
  `;
  document.head.appendChild(style);
}
  
  // Theme Management
  function initTheme() {
    try {
      const themeToggle = document.getElementById('themeToggle');
      if (!themeToggle) {
        console.warn('Theme toggle button not found');
        return;
      }
  
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const savedTheme = localStorage.getItem('theme');
      
      // Set initial theme
      document.body.classList.remove('light-mode', 'dark-mode');
      if (savedTheme === 'light' || (!prefersDark && !savedTheme)) {
        document.body.classList.add('light-mode');
      } else {
        document.body.classList.add('dark-mode');
      }
      
      // Toggle handler
      themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', 
          document.body.classList.contains('light-mode') ? 'light' : 'dark'
        );
        updateChartThemes();
      });
    } catch (error) {
      console.error('Theme initialization failed:', error);
    }
  }
  
  // Data Handling
  function loadUserData() {
    try {
      let user = JSON.parse(localStorage.getItem('medisense_user'));
      
      if (!user) {
        user = {
          username: 'Guest',
          predictions: [
            { type: 'diabetes', date: new Date().toISOString().split('T')[0], risk: 34 },
            { type: 'heart', date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], risk: 72 },
            { type: 'diabetes', date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], risk: 41 }
          ]
        };
        localStorage.setItem('medisense_user', JSON.stringify(user));
      }
      
      return user;
    } catch (error) {
      console.error('Failed to load user data:', error);
      return {
        username: 'Guest',
        predictions: []
      };
    }
  }
  
  // UI Updates
  function updateUI(user) {
    try {
      if (!user) throw new Error('No user data provided');
      
      // Safe element updates
      const safeUpdate = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
      };
  
      safeUpdate('username', user.username);
      safeUpdate('last-login', new Date().toLocaleDateString());
      
      // Update stats
      const diabetesCount = user.predictions.filter(p => p.type === 'diabetes').length;
      const heartCount = user.predictions.filter(p => p.type === 'heart').length;
      safeUpdate('diabetes-count', diabetesCount);
      safeUpdate('heart-count', heartCount);
      safeUpdate('total-count', user.predictions.length);
      
      // Render recent predictions
      renderRecentPredictions(user);
    } catch (error) {
      console.error('UI update failed:', error);
    }
  }
  
  function renderRecentPredictions(user) {
    try {
      const container = document.getElementById('predictions-list');
      if (!container) return;
  
      container.innerHTML = '';
      
      const recentPredictions = user.predictions
        .slice(0, 3)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      
      if (recentPredictions.length === 0) {
        container.innerHTML = '<div class="no-data">No predictions yet</div>';
        return;
      }
  
      recentPredictions.forEach(pred => {
        const predEl = document.createElement('div');
        predEl.className = 'prediction-item';
        predEl.innerHTML = `
          <div>
            <strong>${pred.type.toUpperCase()}</strong>
            <span>${formatDate(pred.date)}</span>
          </div>
          <div class="risk-badge" style="color: ${getRiskColor(pred.risk)}">
            ${pred.risk}%
          </div>
        `;
        container.appendChild(predEl);
      });
    } catch (error) {
      console.error('Failed to render predictions:', error);
    }
  }
  
  function formatDate(dateString) {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString; // Fallback to raw string if parsing fails
    }
  }
  
  function getRiskColor(risk) {
    risk = Number(risk) || 0;
    if (risk > 70) return '#ff4d4d';
    if (risk > 30) return '#ffcc00';
    return '#4CAF50';
  }
  
  // Habit Tracking
  function initHabitCards() {
    try {
      const habitCards = document.querySelectorAll('.habit-card');
      if (!habitCards.length) return;
  
      habitCards.forEach(card => {
        // Load saved state
        const habitName = card.textContent.trim();
        const savedState = localStorage.getItem(`habit_${habitName}`);
        if (savedState) {
          card.dataset.completed = savedState;
        }
  
        // Add click handler
        card.addEventListener('click', () => {
          const completed = card.dataset.completed === 'true';
          card.dataset.completed = !completed;
          localStorage.setItem(`habit_${habitName}`, !completed);
        });
      });
    } catch (error) {
      console.error('Habit cards initialization failed:', error);
    }
  }
  
  // Insights Generation
  function displayInsights(user) {
    try {
      const insightsContainer = document.getElementById('insights-container');
      if (!insightsContainer) return;
  
      const insights = generateInsights(user);
      if (insights.length === 0) {
        insightsContainer.innerHTML = '<div class="no-insights">No significant health insights to show</div>';
        return;
      }
  
      insightsContainer.innerHTML = insights.map(insight => `
        <div class="insight-item">
          <span class="insight-icon">${insight.icon}</span>
          <p>${insight.text}</p>
        </div>
      `).join('');
    } catch (error) {
      console.error('Failed to display insights:', error);
    }
  }
  
  function generateInsights(user) {
    const insights = [];
    
    try {
      // Diabetes insight
      const diabetesPred = [...user.predictions]
        .filter(p => p.type === 'diabetes')
        .sort((a, b) => b.risk - a.risk)[0];
      
      if (diabetesPred?.risk > 50) {
        insights.push({
          icon: '🩸',
          text: `Your recent diabetes risk was ${diabetesPred.risk}% (${formatDate(diabetesPred.date)}). Consider reducing sugar intake and increasing physical activity.`
        });
      }
  
      // Heart disease insight
      const heartPred = [...user.predictions]
        .filter(p => p.type === 'heart')
        .sort((a, b) => b.risk - a.risk)[0];
      
      if (heartPred?.risk > 60) {
        insights.push({
          icon: '❤️',
          text: `Your heart disease risk was ${heartPred.risk}% (${formatDate(heartPred.date)}). Consider checking your cholesterol levels and reducing saturated fats.`
        });
      }
  
      // General health tip if no high risks
      if (insights.length === 0 && user.predictions.length > 0) {
        insights.push({
          icon: '👍',
          text: 'Your health risks are currently in normal ranges. Maintain your healthy habits!'
        });
      }
    } catch (error) {
      console.error('Insight generation failed:', error);
    }
    
    return insights;
  }
  
  // Chart Management
  let diabetesChart = null;
  let heartChart = null;
  
  function initCharts(user) {
    try {
      if (typeof Chart === 'undefined') {
        throw new Error('Chart.js not loaded');
      }
  
      const diabetesData = formatChartData(user, 'diabetes');
      const heartData = formatChartData(user, 'heart');
      
      diabetesChart = createChart('diabetesTrendChart', diabetesData, '#4a6bff', 'Diabetes Risk');
      heartChart = createChart('heartTrendChart', heartData, '#ff4d4d', 'Heart Disease Risk');
    } catch (error) {
      console.error('Chart initialization failed:', error);
      document.getElementById('charts-container')?.classList.add('error');
    }
  }
  
  function formatChartData(user, type) {
    try {
      return user.predictions
        .filter(p => p.type === type)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map(p => ({ 
          x: p.date, 
          y: Math.min(Math.max(Number(p.risk) || 0, 0), 100) // Ensure risk is between 0-100
        }));
    } catch (error) {
      console.error(`Failed to format ${type} chart data:`, error);
      return [];
    }
  }
  
  function createChart(canvasId, data, borderColor, label) {
    try {
      const ctx = document.getElementById(canvasId)?.getContext('2d');
      if (!ctx) throw new Error(`Canvas ${canvasId} not found`);
  
      const isDark = document.body.classList.contains('dark-mode');
      
      return new Chart(ctx, {
        type: 'line',
        data: {
          datasets: [{
            label: label,
            data: data,
            borderColor: borderColor,
            backgroundColor: hexToRgba(borderColor, 0.1),
            tension: 0.3,
            fill: true,
            pointRadius: 5,
            pointHoverRadius: 7
          }]
        },
        options: getChartOptions(isDark, label)
      });
    } catch (error) {
      console.error(`Failed to create ${canvasId} chart:`, error);
      return null;
    }
  }
  
  function getChartOptions(isDark, title) {
    const textColor = isDark ? '#f8f9fa' : '#2d3748';
    const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
    
    return {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'top',
          labels: { 
            color: textColor,
            font: {
              weight: 'bold'
            }
          }
        },
        tooltip: {
          callbacks: {
            label: (context) => `${context.dataset.label}: ${context.parsed.y}%`
          }
        },
        title: {
          display: true,
          text: title,
          color: textColor,
          font: {
            size: 16
          }
        }
      },
      scales: {
        x: {
          type: 'time',
          time: { 
            unit: 'day', 
            tooltipFormat: 'MMM d, yyyy',
            displayFormats: {
              day: 'MMM d'
            }
          },
          grid: { color: gridColor },
          ticks: { color: textColor }
        },
        y: {
          min: 0,
          max: 100,
          grid: { color: gridColor },
          ticks: { 
            color: textColor,
            callback: value => value + '%',
            stepSize: 20
          }
        }
      },
      animation: {
        duration: 1000,
        easing: 'easeOutQuart'
      }
    };
  }
  
  function updateChartThemes() {
    try {
      const isDark = document.body.classList.contains('dark-mode');
      const options = getChartOptions(isDark);
      
      if (diabetesChart) {
        diabetesChart.options = options;
        diabetesChart.update();
      }
      
      if (heartChart) {
        heartChart.options = options;
        heartChart.update();
      }
    } catch (error) {
      console.error('Failed to update chart themes:', error);
    }
  }
  
  function hexToRgba(hex, alpha) {
    try {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    } catch {
      return hex; // Fallback to original color if conversion fails
    }
  }
  
  function displayErrorToUser() {
    const errorEl = document.createElement('div');
    errorEl.className = 'error-message';
    errorEl.innerHTML = `
      <p>⚠️ We're experiencing technical difficulties. Please refresh the page.</p>
      <button onclick="window.location.reload()">Refresh</button>
    `;
    document.body.prepend(errorEl);
  }

  document.addEventListener('DOMContentLoaded', function() {
    // Ensure new prediction link works
    const newPredictionLink = document.getElementById('newPredictionLink');
    if (newPredictionLink) {
      newPredictionLink.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = 'select-disease.html';
      });
    }
  
    // Add other dashboard functionality here
  });

  function verifyPageLinks() {
    const linksToVerify = [
        'select-disease.html',
        'predict-diabetes.html',
        'predict-heart.html',
        'index.html'
    ];
    
    linksToVerify.forEach(page => {
        fetch(page, { method: 'HEAD' })
            .then(res => {
                if (!res.ok) console.warn(`Missing page: ${page}`);
            })
            .catch(() => console.warn(`Failed to verify: ${page}`));
    });
}

// Initialize link verification
document.addEventListener('DOMContentLoaded', verifyPageLinks);