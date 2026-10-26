# Presidency College Student Management & Dropout Early-Warning Platform

> An institutional, explainable education technology platform for Presidency College, Bengaluru. Built with human-centered care, SHAP-based machine learning explainability, and multi-role administrative command.

---

## 1. System Architecture

```
                                  [ Presidency College Community ]
                       (Students · Faculty · Mentors · Institutional Deans)
                                                │
                                    HTTPS / REST API / WebSockets
                                                ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               React 19 + TypeScript SPA                                │
│  · Institutional Early-Warning Center (45 Flagged Scholars across 1,250 Cohort)        │
│  · "Why This Alert?" SHAP Feature Attribution Side-Panel & Visual Weight Bars         │
│  · Role-Based Portals: Student · Faculty · Counselor/Mentor · Institutional Admin     │
│  · Interactive Illustrated Campus Navigation Map (SVG Vector + Facilities Directory)   │
│  · Real-time Campus Transit Bus Route Tracker (KA Fleet + Driver Telephony)            │
│  · Collaborative Kanban Project Workspace (To Do · In Progress · Review · Done)       │
│  · Offline-First IndexedDB/LocalStorage Cache with Bi-directional Sync Simulation      │
│  · Executive Emergency Broadcast Alert Composer (High-Severity Push)                   │
└──────────────────────────────────────┬─────────────────────────────────────────────────┘
                                       │
                                       ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                       Express 4.x + Node.js REST API Middleware                        │
│  · JWT Bearer Authentication & Multi-Factor Authentication (MFA)                       │
│  · Role-Based Access Control (RBAC) Least-Privilege Enforcer                           │
│  · Transparent Logging & Human Review Certification Audit Trail                        │
└───────────────────────┬────────────────────────────────────────┬───────────────────────┘
                        │                                        │
                        ▼                                        ▼
┌───────────────────────────────────┐    ┌───────────────────────────────────────────────┐
│     MySQL 8.0+ Relational DB      │    │           Python ML Microservice              │
│ · Students, Faculty, Courses      │    │ · Ensemble Gradient Boosted Trees (XGBoost)   │
│ · Lecture Attendance Sessions     │    │ · SHAP Game-Theoretic Feature Attribution     │
│ · Submissions, Transcripts        │    │ · Strict Exclusion of Protected Demographics  │
│ · Auditable Pastoral Notes        │    │ · Non-deterministic Early Support Indicators  │
└───────────────────────────────────┘    └───────────────────────────────────────────────┘
```

---

## 2. Ethical Machine Learning & Governance Charter

1. **Non-Deterministic Language Standard**:
   - The platform never states that a student "will drop out."
   - Flags are categorized as `"Elevated dropout-risk indicator"` or `"Student may require additional support"`.
2. **Strict Demographics Exclusion**:
   - Religion, caste, race, socio-economic origin, and gender are strictly excluded from predictive feature vectors.
3. **Mandatory Human-in-the-Loop Review**:
   - AI evaluations serve strictly as advisories for authorized educators and certified counselors.
   - Every flagged student dossier includes a `"Mark as Human Reviewed"` action with timestamped notes.

---

## 3. Quickstart & Execution Commands

### Prerequisites
- Node.js 20.x or higher
- npm 10.x or higher
- Python 3.11+ (optional for native ML microservice execution)

### Installation
```bash
# 1. Install frontend & node dependencies
npm install

# 2. Start Vite development server
npm run dev
```

### Building for Production
```bash
# Compile and build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

### Relational Database Initialization
```bash
# Run schema migration script on MySQL instance:
mysql -u root -p < database/mysql/schema.sql
```

### Python ML Service Execution (Optional)
```bash
cd ml-service
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn api.app:app --port 8000 --reload
```

---

## 4. Key Persona Credentials for Instant Testing

The platform includes simulated 1-click logins on the Sign-In modal:

| Persona | Name | Designation / Cohort | Default Access |
| :--- | :--- | :--- | :--- |
| **Institutional Admin** | Dr. Anand Ramanathan | Dean of Academic Affairs & Student Welfare | Full Early-Warning Center, Emergency Broadcasts, CSV Reports |
| **Faculty Instructor** | Dr. Rajeshwari Krishnan | Associate Professor & HOD (Computer Science) | Today's Lectures, 1-Click Attendance Logger, Coursework Creator |
| **Lead Counselor** | Smt. Kavitha Rao | Student Wellbeing & Pastoral Care Lead | Students Requiring Attention, Support Plans, Counseling Follow-ups |
| **Scholar / Student** | Aditya Vardhan Rao | B.Tech Computer Science (Sem 5) | Self Attendance %, Coursework Uploads, Official Transcript View |

---

## 5. Keyboard Shortcuts
- **`Ctrl + K` / `Cmd + K`**: Instant command palette global search across students, courses, assignments, and campus locations.
- **`Esc`**: Exit any modal or side panel.
