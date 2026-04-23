# StudentAI — AI-Based Student Performance Prediction

A full-stack academic project that predicts whether a student is likely to **pass or fail** from attendance, internal marks, study hours, and previous performance. It combines a **React** client, **Node.js / Express** API with **MongoDB**, **JWT authentication**, and a **Python FastAPI** microservice that serves a trained **Random Forest** model built with **scikit-learn**.

### Research paper (PDF)

The written research report that accompanies this work is included in the repository:

**[Research-Paper.pdf](docs/Research-Paper.pdf)** — *Early Prediction of Student Academic Performance Using Machine Learning* (Chitkara University).

On **GitHub**, open this link from the README view to preview or download the file. Markdown cannot embed the PDF inline; linking is the standard approach.

---

## Features

- **Landing page** explaining the pipeline and tech stack (useful for demos and reports).
- **Secure accounts**: signup/login with hashed passwords, optional **show/hide password**, and JWT-protected routes.
- **Service health** (navbar): live **API** and **ML** status indicators for exam-day confidence.
- **Interactive prediction**: sliders, **one-click presets** (strong / average / at risk), **⌘+Enter / Ctrl+Enter** to submit, result **copy-to-clipboard** summary, and pass probability with tips.
- **Toasts** for quick feedback (save, export, copy, errors).
- **Dashboard**: area, bar, and pie charts; **refresh** history; **export prediction log to CSV**; full table of past runs.

---

## Architecture

```mermaid
flowchart LR
  subgraph client [Browser]
    UI[React + Vite]
  end
  subgraph api [Node.js]
    EX[Express REST API]
    DB[(MongoDB)]
  end
  subgraph ml [Python]
    PY[FastAPI / Uvicorn]
    RF[Random Forest model.pkl]
  end
  UI -->|JWT + JSON| EX
  EX --> DB
  EX -->|HTTP /predict| PY
  PY --> RF
```

1. The **frontend** calls the **backend** (`/api/auth`, `/api/predict`).
2. The **backend** verifies the user, stores prediction records, and forwards features to the **ML service**.
3. The **ML service** loads `model.pkl` and returns pass/fail probability and suggestions.

---

## Tech stack

| Layer        | Technologies |
|-------------|----------------|
| Frontend    | React 18, React Router, Vite 5, Tailwind CSS, Framer Motion, Recharts, Axios |
| Backend     | Express, Mongoose, bcryptjs, jsonwebtoken, Axios |
| ML service  | FastAPI, Uvicorn, scikit-learn, NumPy, Pandas |
| Data        | MongoDB Atlas (or any MongoDB URI) |

---

## Prerequisites

- **Node.js** 18+ and **npm**
- **Python** 3.9+ (3.10+ recommended)
- A **MongoDB** connection string
- Three terminal windows (or tmux panes) to run API, ML, and UI together

---

## Quick setup (automated)

From the project root:

```bash
chmod +x setup.sh
./setup.sh
```

This installs dependencies for backend and frontend, creates **`ml-service/.venv`**, installs Python packages, runs **`train_model.py`** to generate **`model.pkl`**, and prints how to start each service.

---

## Manual setup

### 1. Backend

```bash
cd backend
npm install
```

Create **`backend/.env`** (see [Environment variables](#environment-variables)).

```bash
npm run dev
# or: npm start
```

API default: **http://localhost:5000**

### 2. ML service

```bash
cd ml-service
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python train_model.py       # creates model.pkl — run whenever you need a fresh model
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

ML service: **http://localhost:8000** — try `GET /health` and `POST /predict` (see FastAPI docs at `/docs` when the server is running).

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

App URL: **http://localhost:3000** (Vite is configured to use port **3000** so it matches backend CORS).

Production build:

```bash
npm run build
npm run preview
```

---

## Environment variables

Copy the template and edit (the real **`backend/.env`** is gitignored):

```bash
cp backend/.env.example backend/.env
```

Then set values in **`backend/.env`**:

```env
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/DATABASE_NAME
JWT_SECRET=your_long_random_secret
PORT=5000
ML_SERVICE_URL=http://localhost:8000
```

- **`MONGODB_URI`**: your MongoDB connection string.
- **`JWT_SECRET`**: any strong random string for signing tokens (do not commit real secrets to public repos).
- **`PORT`**: HTTP port for Express (default `5000`).
- **`ML_SERVICE_URL`**: base URL of the FastAPI service; must be reachable when users run predictions.

The backend enables CORS for **`http://localhost:3000`**. If you change the Vite port, update CORS in `backend/src/server.js` accordingly.

Optional **frontend** env (e.g. `frontend/.env.local` for deployed demos) — must be prefixed with `VITE_`:

```env
VITE_SERVER_ORIGIN=http://localhost:5000
VITE_ML_ORIGIN=http://localhost:8000
```

These drive the shared API client and the **navbar health checks**. Defaults match local development if unset.

---

## Useful endpoints (backend)

| Method | Path | Notes |
|--------|------|--------|
| `POST` | `/api/auth/signup` | Register |
| `POST` | `/api/auth/login` | Login, returns JWT |
| `GET` | `/api/auth/me` | Current user (auth required) |
| `POST` | `/api/predict` | Run prediction (auth required) |
| `GET` | `/api/predict/history` | List past predictions (auth required) |
| `GET` | `/health` | Backend health |

---

## Project layout

```
Student Performance Prediction/
├── frontend/          # React (Vite) SPA
├── backend/           # Express API + Mongoose models
├── ml-service/        # FastAPI app, train_model.py, model.pkl (after training)
├── setup.sh           # One-shot dependency + model setup
└── README.md
```

---

## Troubleshooting

| Issue | What to check |
|--------|----------------|
| `venv/bin/activate: No such file` | Use **`source .venv/bin/activate`** from `ml-service/` (the venv folder is **`.venv`**). |
| Prediction errors from the UI | Ensure **ML service** is running on port **8000** and **`ML_SERVICE_URL`** in `.env` matches. |
| `model.pkl not found` | Run **`python train_model.py`** inside **`ml-service/`** with the venv activated. |
| CORS errors in the browser | Frontend should be on **port 3000**, or adjust CORS in `backend/src/server.js`. |
| MongoDB connection failed | Verify **`MONGODB_URI`** and network / IP allowlist for Atlas. |

---

## Academic use

This repository is structured so you can present a clear **data flow**, **security** (JWT, password hashing), **ML serving** (separate Python service), and **visualization** (dashboard) in reports or vivas.

If you extend the work, consider documenting dataset sources, evaluation metrics from `train_model.py`, and any deployment steps (e.g., environment variables in production).

---

## License

Use and modify for educational purposes as required by your institution.
