from flask import Flask, render_template, request, redirect, url_for
import joblib

app = Flask(__name__)

# Load models
heart_model = joblib.load('models/heart_model.pkl')
diabetes_model = joblib.load('models/diabetes_model.pkl')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['POST', 'GET'])
def login():
    if request.method == 'POST':
        # Handle login
        return redirect(url_for('dashboard'))
    return render_template('login.html')

@app.route('/signup', methods=['POST', 'GET'])
def signup():
    if request.method == 'POST':
        # Handle signup
        return redirect(url_for('login'))
    return render_template('signup.html')

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

@app.route('/select-disease')
def select_disease():
    return render_template('select-disease.html')

# ========================
# Heart Disease Prediction
# ========================
@app.route('/predict-heart', methods=['POST', 'GET'])
def predict_heart():
    if request.method == 'POST':
        try:
            # Collect all form data
            age = int(request.form['age'])
            sex = int(request.form['sex'])
            cp = int(request.form['cp'])  # chest pain
            trestbps = int(request.form['trestbps'])  # resting blood pressure
            chol = int(request.form['chol'])
            fbs = int(request.form['fbs'])  # fasting blood sugar
            restecg = int(request.form['restecg'])
            thalach = int(request.form['thalach'])  # max heart rate
            exang = int(request.form['exang'])  # exercise induced angina
            oldpeak = float(request.form['oldpeak'])  # ST depression
            slope = int(request.form['slope'])  # ST slope

            # Combine into a list for model
            input_data = [[age, sex, cp, trestbps, chol, fbs, restecg,
                          thalach, exang, oldpeak, slope]]

            # Predict
            result = heart_model.predict(input_data)[0]
            return render_template('results-heart.html', result=result)

        except Exception as e:
            return f"Error: {e}"

    return render_template('predict-heart.html')

# =========================
# Diabetes Prediction Logic
# =========================
@app.route('/predict-diabetes', methods=['POST', 'GET'])
def predict_diabetes():
    if request.method == 'POST':
        try:
            pregnancies = int(request.form['pregnancies'])
            glucose = float(request.form['glucose'])
            bp = float(request.form['bp'])  # blood pressure
            skin_thickness = float(request.form['skin_thickness'])
            insulin = float(request.form['insulin'])
            bmi = float(request.form['bmi'])
            dpf = float(request.form['dpf'])  # diabetes pedigree function
            age = int(request.form['age'])

            input_data = [[pregnancies, glucose, bp, skin_thickness,
                          insulin, bmi, dpf, age]]

            result = diabetes_model.predict(input_data)[0]
            return render_template('results-diabetes.html', result=result)

        except Exception as e:
            return f"Error: {e}"

    return render_template('predict-diabetes.html')

if __name__ == '__main__':
    app.run(debug=True, port=5500)
