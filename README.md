# 🩺 Multiple Disease Prediction System

This project is a full-stack web application for predicting **Heart Disease** and **Diabetes** using Machine Learning models. It allows users to log in, choose a disease, input medical data, and receive instant predictions. All user data and predictions are tracked in a secure database.

---

## 📌 Features

- 🔐 User authentication (Login/Signup)
- 🤖 ML-based prediction for:
  - Heart Disease
  - Diabetes
- 🗂️ Organized HTML templates and static files
- 📊 Clean dashboard and result display
- 💾 SQLite database to track user activity and results
- 🧠 Trained `.pkl` models stored and integrated

---

## 🚀 Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Python (`app.py`)
- **ML Models**: Trained with `sklearn` and saved as `.pkl`
- **Database**: SQLite (`users.db`)
- **Hosting**: Localhost (or can be deployed on Render/Heroku)

---

## 🗃️ Project Structure

dbms-project/
│
├── app.py # Main backend logic
├── models/ # Machine learning models
│ ├── heart_model.pkl
│ └── diabetes_model.pkl
│
├── templates/ # HTML templates
│ ├── login.html, signup.html, ...
│
├── static/ # CSS & JS files
│ ├── css/
│ └── js/
│
├── users.db # SQLite database
└── README.md # You're reading it!

yaml
Copy
Edit

### To Add This:
1. Create a file named `README.md` in your project folder.
2. Paste the above content.
3. Then commit and push it:

```bash
git add README.md
git commit -m "Add project README"
git push
---

## 🛠️ How to Run

1. **Clone the repo**:
   ```bash
   git clone https://github.com/Sai2475/Multiple_disease_prediction.git
   cd Multiple_disease_prediction

