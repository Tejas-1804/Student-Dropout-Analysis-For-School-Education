-- ====================================================================
-- Presidency College Student Management & Dropout Early-Warning Platform
-- Relational Database Schema (MySQL 8.0+)
-- ====================================================================

CREATE DATABASE IF NOT EXISTS presidency_college_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE presidency_college_db;

-- 1. Departments Table
CREATE TABLE IF NOT EXISTS departments (
  id VARCHAR(36) PRIMARY KEY,
  code VARCHAR(16) NOT NULL UNIQUE,
  name VARCHAR(128) NOT NULL,
  head_of_department VARCHAR(128),
  building_location VARCHAR(128),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Users & Roles (RBAC)
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  email VARCHAR(128) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'faculty', 'mentor', 'student') NOT NULL,
  avatar_url TEXT,
  department_id VARCHAR(36),
  phone VARCHAR(32),
  mfa_enabled BOOLEAN DEFAULT FALSE,
  mfa_secret VARCHAR(64),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
  INDEX idx_users_role (role),
  INDEX idx_users_email (email)
) ENGINE=InnoDB;

-- 3. Students Table (Protected demographics excluded from automated ML vectors)
CREATE TABLE IF NOT EXISTS students (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL UNIQUE,
  student_id VARCHAR(32) NOT NULL UNIQUE,
  department_id VARCHAR(36) NOT NULL,
  course_name VARCHAR(128) NOT NULL,
  semester INT NOT NULL,
  section VARCHAR(8) NOT NULL DEFAULT 'A',
  admission_year INT NOT NULL,
  mentor_id VARCHAR(36),
  guardian_name VARCHAR(128),
  guardian_phone VARCHAR(32),
  cgpa DECIMAL(3,2) NOT NULL DEFAULT 0.00,
  current_gpa DECIMAL(3,2) NOT NULL DEFAULT 0.00,
  attendance_rate DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  academic_trend ENUM('improving', 'stable', 'declining') NOT NULL DEFAULT 'stable',
  missed_assignments INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT,
  FOREIGN KEY (mentor_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_students_semester (semester),
  INDEX idx_students_dept (department_id)
) ENGINE=InnoDB;

-- 4. Courses Table
CREATE TABLE IF NOT EXISTS courses (
  id VARCHAR(36) PRIMARY KEY,
  code VARCHAR(16) NOT NULL UNIQUE,
  name VARCHAR(128) NOT NULL,
  department_id VARCHAR(36) NOT NULL,
  semester INT NOT NULL,
  credits INT NOT NULL,
  faculty_id VARCHAR(36),
  schedule_time VARCHAR(64),
  room_location VARCHAR(64),
  syllabus_progress INT DEFAULT 0,
  total_classes INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE,
  FOREIGN KEY (faculty_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 5. Course Enrollments
CREATE TABLE IF NOT EXISTS enrollments (
  id VARCHAR(36) PRIMARY KEY,
  student_id VARCHAR(36) NOT NULL,
  course_id VARCHAR(36) NOT NULL,
  semester INT NOT NULL,
  academic_year VARCHAR(16) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  UNIQUE KEY uq_enrollment (student_id, course_id)
) ENGINE=InnoDB;

-- 6. Lecture Attendance Sessions
CREATE TABLE IF NOT EXISTS attendance_sessions (
  id VARCHAR(36) PRIMARY KEY,
  course_id VARCHAR(36) NOT NULL,
  session_date DATE NOT NULL,
  topic_covered VARCHAR(255),
  conducted_by VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (conducted_by) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 7. Student Attendance Records
CREATE TABLE IF NOT EXISTS student_attendance (
  id VARCHAR(36) PRIMARY KEY,
  session_id VARCHAR(36) NOT NULL,
  student_id VARCHAR(36) NOT NULL,
  is_present BOOLEAN NOT NULL DEFAULT TRUE,
  remarks VARCHAR(255),
  FOREIGN KEY (session_id) REFERENCES attendance_sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  INDEX idx_att_student (student_id)
) ENGINE=InnoDB;

-- 8. Assignments & Submissions
CREATE TABLE IF NOT EXISTS assignments (
  id VARCHAR(36) PRIMARY KEY,
  course_id VARCHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  max_score INT NOT NULL DEFAULT 100,
  due_date DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS submissions (
  id VARCHAR(36) PRIMARY KEY,
  assignment_id VARCHAR(36) NOT NULL,
  student_id VARCHAR(36) NOT NULL,
  submitted_at DATETIME NOT NULL,
  file_url TEXT NOT NULL,
  score DECIMAL(5,2),
  feedback TEXT,
  status ENUM('submitted', 'late', 'graded') DEFAULT 'submitted',
  FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  UNIQUE KEY uq_submission (assignment_id, student_id)
) ENGINE=InnoDB;

-- 9. Explainable Dropout Early-Warning Model Assessments
CREATE TABLE IF NOT EXISTS dropout_risk_assessments (
  id VARCHAR(36) PRIMARY KEY,
  student_id VARCHAR(36) NOT NULL,
  model_version VARCHAR(32) NOT NULL DEFAULT 'v2.4-ensemble',
  risk_level ENUM('LOW', 'MODERATE', 'HIGH') NOT NULL,
  risk_score INT NOT NULL, -- 0 - 100
  evaluated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_human_reviewed BOOLEAN DEFAULT FALSE,
  reviewed_by VARCHAR(128),
  reviewed_at DATETIME,
  review_notes TEXT,
  shap_features_json JSON NOT NULL, -- transparent SHAP waterfall contributions
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  INDEX idx_risk_level (risk_level),
  INDEX idx_evaluated_at (evaluated_at)
) ENGINE=InnoDB;

-- 10. Support Interventions & Pastoral Tracking
CREATE TABLE IF NOT EXISTS interventions (
  id VARCHAR(36) PRIMARY KEY,
  student_id VARCHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  type ENUM(
    'academic_mentoring',
    'counseling_session',
    'attendance_check',
    'remedial_classes',
    'financial_aid',
    'parental_connect'
  ) NOT NULL,
  status ENUM(
    'new',
    'under_review',
    'student_contacted',
    'support_assigned',
    'followup_required',
    'resolved'
  ) NOT NULL DEFAULT 'new',
  priority ENUM('urgent', 'high', 'medium', 'low') NOT NULL DEFAULT 'medium',
  assigned_to VARCHAR(36),
  next_follow_up_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_intervention_status (status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS intervention_notes (
  id VARCHAR(36) PRIMARY KEY,
  intervention_id VARCHAR(36) NOT NULL,
  author_id VARCHAR(36) NOT NULL,
  note_text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (intervention_id) REFERENCES interventions(id) ON DELETE CASCADE,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB;
