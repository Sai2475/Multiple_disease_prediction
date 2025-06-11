// Display results for heart and diabetes predictions
document.addEventListener("DOMContentLoaded", () => {
    const heartResult = document.querySelector('#heart-result');
    const diabetesResult = document.querySelector('#diabetes-result');

    if (heartResult) {
        const heartPrediction = localStorage.getItem('heartPrediction'); // Get prediction from localStorage
        heartResult.innerText = `Heart Disease Prediction: ${heartPrediction}`;
    }

    if (diabetesResult) {
        const diabetesPrediction = localStorage.getItem('diabetesPrediction'); // Get prediction from localStorage
        diabetesResult.innerText = `Diabetes Prediction: ${diabetesPrediction}`;
    }
});
