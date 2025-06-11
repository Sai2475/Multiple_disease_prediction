document.addEventListener('DOMContentLoaded', () => {
  // Tab Switching
  const tabs = document.querySelectorAll('.tab-btn');
  const forms = document.querySelectorAll('.prediction-form');

  tabs.forEach(tab => {
      tab.addEventListener('click', () => {
          tabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          
          const disease = tab.dataset.disease;
          forms.forEach(form => {
              form.classList.remove('active');
              if(form.id === `${disease}Form`) {
                  form.classList.add('active');
              }
          });
      });
  });

  // Diabetes Form Submission
  document.getElementById('diabetesForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      if(validateForm('diabetes')) {
          const formData = getFormData('diabetes');
          const riskPercentage = calculateRisk('diabetes', formData);
          savePrediction('diabetes', riskPercentage);
          
          // Store results for the results page
          sessionStorage.setItem('currentPrediction', JSON.stringify({
              type: 'diabetes',
              risk: riskPercentage,
              details: formData
          }));
          
          // Redirect to diabetes results page
          window.location.href = 'results-diabetes.html';
      }
  });

  // Heart Form Submission
  document.getElementById('heartForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      if(validateForm('heart')) {
          const formData = getFormData('heart');
          const riskPercentage = calculateRisk('heart', formData);
          savePrediction('heart', riskPercentage);
          
          // Store results for the results page
          sessionStorage.setItem('currentPrediction', JSON.stringify({
              type: 'heart',
              risk: riskPercentage,
              details: formData
          }));
          
          // Redirect to heart results page
          window.location.href = 'results-heart.html';
      }
  });

  // Helper Functions
  function validateForm(diseaseType) {
      let isValid = true;
      const form = document.getElementById(`${diseaseType}Form`);
      
      form.querySelectorAll('input[required], select[required]').forEach(input => {
          if(!input.value) {
              input.style.borderColor = '#ff4d4d';
              isValid = false;
          } else {
              input.style.borderColor = '';
          }
      });
  
      return isValid;
  }

  function getFormData(diseaseType) {
      const form = document.getElementById(`${diseaseType}Form`);
      const data = {};
      
      if(diseaseType === 'diabetes') {
          data.pregnancies = parseInt(form.querySelector('#pregnancies').value);
          data.glucose = parseInt(form.querySelector('#glucose').value);
          data.bloodPressure = parseInt(form.querySelector('#bloodpressure').value);
          data.skinThickness = parseInt(form.querySelector('#skinthickness').value);
          data.insulin = parseInt(form.querySelector('#insulin').value);
          data.bmi = parseFloat(form.querySelector('#bmi').value);  
          data.diabetesPedigreeFunction = parseFloat(form.querySelector('#dpf').value);
          data.age = parseInt(form.querySelector('#age').value);
      } else {
          data.age = parseInt(form.querySelector('#age').value);
          data.sex = parseInt(form.querySelector('#sex').value);
          data.cp = parseInt(form.querySelector('#cp').value);
          data.trestbps = parseInt(form.querySelector('#trestbps').value);
          data.chol = parseInt(form.querySelector('#chol').value);
          data.fbs = parseInt(form.querySelector('#fbs').value);
          data.restecg = parseInt(form.querySelector('#restecg').value);
          data.thalach = parseInt(form.querySelector('#thalach').value);
          data.exang = parseInt(form.querySelector('#exang').value);
          data.oldpeak = parseFloat(form.querySelector('#oldpeak').value);
          data.slope = parseInt(form.querySelector('#slope').value);
      }
  
      return data;
  }

  function calculateRisk(diseaseType, data) {
      // Mock calculation - replace with actual ML model later
      if(diseaseType === 'diabetes') {
          return Math.min(30 + (data.glucose - 100) * 0.2 + (data.bmi - 25) * 0.5, 95);
      } else {
          return Math.min(40 + (data.chol - 200) * 0.1 + (data.trestbps - 120) * 0.3, 95);
      }
  }

  function savePrediction(diseaseType, risk) {
      const user = JSON.parse(localStorage.getItem('medisense_user')) || {};
      if(!user.predictions) user.predictions = [];
      
      user.predictions.push({
          type: diseaseType,
          date: new Date().toISOString().split('T')[0],
          risk: Math.round(risk)
      });
  
      localStorage.setItem('medisense_user', JSON.stringify(user));
  }
});