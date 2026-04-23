"""
Train Logistic Regression, Decision Tree, and Random Forest models.
Best model (Random Forest) is saved to model.pkl.
Run this script once before starting the API server.
"""

import pickle
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from sklearn.preprocessing import StandardScaler

np.random.seed(42)

def generate_dataset(n=2000):
    """
    Synthetic dataset with features:
      attendance (0-100), marks (0-100), study_hours (0-12), previous_performance (0-100)
    Label: 1=PASS, 0=FAIL
    """
    attendance = np.random.uniform(0, 100, n)
    marks = np.random.uniform(0, 100, n)
    study_hours = np.random.uniform(0, 12, n)
    previous_performance = np.random.uniform(0, 100, n)

    # Score-based pass/fail with noise
    score = (
        0.30 * attendance +
        0.35 * marks +
        0.20 * (study_hours / 12 * 100) +
        0.15 * previous_performance
    )
    noise = np.random.normal(0, 5, n)
    labels = (score + noise >= 50).astype(int)

    X = np.column_stack([attendance, marks, study_hours, previous_performance])
    return X, labels

X, y = generate_dataset()
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Scale features (for Logistic Regression)
scaler = StandardScaler()
X_train_sc = scaler.fit_transform(X_train)
X_test_sc = scaler.transform(X_test)

# --- Logistic Regression ---
lr = LogisticRegression(max_iter=500, random_state=42)
lr.fit(X_train_sc, y_train)
lr_acc = accuracy_score(y_test, lr.predict(X_test_sc))
print(f"Logistic Regression Accuracy: {lr_acc:.4f}")

# --- Decision Tree ---
dt = DecisionTreeClassifier(max_depth=8, random_state=42)
dt.fit(X_train, y_train)
dt_acc = accuracy_score(y_test, dt.predict(X_test))
print(f"Decision Tree Accuracy:       {dt_acc:.4f}")

# --- Random Forest (Best Model) ---
rf = RandomForestClassifier(n_estimators=200, max_depth=10, random_state=42, n_jobs=-1)
rf.fit(X_train, y_train)
rf_acc = accuracy_score(y_test, rf.predict(X_test))
print(f"Random Forest Accuracy:       {rf_acc:.4f}")

print("\nBest Model: Random Forest")
print(classification_report(y_test, rf.predict(X_test), target_names=["FAIL", "PASS"]))

# Save model + scaler
with open("model.pkl", "wb") as f:
    pickle.dump({"model": rf, "scaler": scaler}, f)

print("\nModel saved to model.pkl")
