<?php
declare(strict_types=1);

require_once __DIR__ . '/../lib/db.php';

$pdo = get_pdo();

$pdo->exec("INSERT INTO users (username, password, role) VALUES
  ('teacher1', 'TEMP', 'teacher'),
  ('admin1', 'TEMP', 'admin'),
  ('student1', 'TEMP', 'student')");

$stmt = $pdo->prepare('UPDATE users SET password = ? WHERE username = ?');
$stmt->execute([password_hash('teacherpass', PASSWORD_DEFAULT), 'teacher1']);
$stmt->execute([password_hash('adminpass', PASSWORD_DEFAULT), 'admin1']);
$stmt->execute([password_hash('studentpass', PASSWORD_DEFAULT), 'student1']);

echo "Seeded users: teacher1/teacherpass, admin1/adminpass, student1/studentpass" . PHP_EOL;

