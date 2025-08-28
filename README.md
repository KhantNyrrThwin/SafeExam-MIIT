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
# optional: choose key size
# Linux/Mac: RSA_KEY_BITS=3072 php backend/scripts/generate_keys.php
# Windows (PowerShell): $env:RSA_KEY_BITS=3072; php backend/scripts/generate_keys.php
```

Windows note: if keygen fails with an OpenSSL/system error, try a smaller key size:
```powershell
$env:RSA_KEY_BITS=1024; php backend/scripts/generate_keys.php
```
The script auto-falls back to 1024 bits on Windows if 2048 fails.

If it still fails on Windows, set `OPENSSL_CONF` to your `openssl.cnf` and retry:
```powershell
# Common XAMPP locations (adjust paths as needed):
$env:OPENSSL_CONF="C:\xampp\apache\bin\openssl.cnf"; php backend/scripts/generate_keys.php
# or
$env:OPENSSL_CONF="C:\xampp\php\extras\openssl\openssl.cnf"; php backend/scripts/generate_keys.php
```

Manual key generation with OpenSSL (Windows/Linux/Mac):
```bash
openssl genrsa -out backend/keys/private.pem 2048
openssl rsa -in backend/keys/private.pem -pubout -out backend/keys/public.pem
```
Ensure permissions (Windows: make sure the web server can read; Linux/Mac):
```bash
chmod 700 backend/keys
chmod 600 backend/keys/private.pem
chmod 644 backend/keys/public.pem
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

