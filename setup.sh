#!/bin/bash
# ============================================================
#  AI-Based Student Performance Prediction System — Setup
# ============================================================
set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo ""
echo "🚀  Setting up Student Performance Prediction System..."
echo ""

# --- Backend ---
echo "📦  Installing Backend dependencies..."
cd "$SCRIPT_DIR/backend"
npm install
echo "✅  Backend ready."

# --- ML Service ---
echo ""
echo "🐍  Setting up Python ML Service..."
cd "$SCRIPT_DIR/ml-service"
python3 -m venv .venv
source .venv/bin/activate
pip install fastapi uvicorn scikit-learn numpy pandas pydantic --quiet
echo "🤖  Training ML models (Logistic Regression, Decision Tree, Random Forest)..."
python3 train_model.py
deactivate
echo "✅  ML Service ready."

# --- Frontend ---
echo ""
echo "⚛️   Installing Frontend dependencies..."
cd "$SCRIPT_DIR/frontend"
npm install --legacy-peer-deps
echo "✅  Frontend ready."

echo ""
echo "============================================================"
echo "  ✅  ALL DONE! Start the project with:"
echo ""
echo "  Terminal 1 — Backend:    cd backend && npm run dev"
echo "  Terminal 2 — ML Service: cd ml-service && source .venv/bin/activate && uvicorn main:app --port 8000 --reload"
echo "  Terminal 3 — Frontend:   cd frontend && npm start"
echo ""
echo "  Frontend URL:  http://localhost:3000"
echo "  Backend API:   http://localhost:5000"
echo "  ML Service:    http://localhost:8000"
echo "============================================================"
