## SafeExam@MIIT: Web-Based Exam Paper Security with RSA

### Stack
- **Frontend**: React + TailwindCSS (Vite)
- **Backend**: PHP (XAMPP/LAMP) + MySQL
- **Crypto**: Hybrid RSA (OAEP) + AES-256-GCM in PHP

### Architecture
- Teacher uploads exam -> backend encrypts with public key -> stores in MySQL
- Admin lists and downloads -> backend decrypts with private key -> sends original file
- Session-based auth; roles: teacher/admin

### Setup
1) Create MySQL schema
```bash
mysql -u root -p < backend/schema.sql
```

2) Generate RSA keys
```bash
php backend/scripts/generate_keys.php
```

3) Seed demo users
```bash
php backend/scripts/seed_users.php
```

4) Configure web server
- Serve `backend/public` as a PHP-enabled directory (e.g., `http://localhost/safeexam/backend/public`)
- Ensure `backend/config/config.php` reads environment variables or use defaults

5) Frontend
```bash
cd frontend
npm install
npm run dev
```

6) Demo credentials
- Teacher: `teacher1` / `teacherpass`
- Admin: `admin1` / `adminpass`

### API Endpoints
- `GET /api/health.php`
- `POST /api/auth/login.php` { username, password }
- `POST /api/auth/logout.php`
- `GET /api/auth/me.php`
- `GET /api/papers/list.php` (teacher sees own; admin sees all)
- `POST /api/papers/upload.php` (multipart `file`)
- `GET /api/papers/download.php?paper_id=ID` (admin only)

### Notes
- Keys are stored in `backend/keys`. Do not commit private keys.
- AES-256-GCM provides confidentiality and integrity. RSA-OAEP wraps the symmetric key.

