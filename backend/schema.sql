-- Schema for SafeExam@MIIT

CREATE DATABASE IF NOT EXISTS `safe_exam_miit` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `safe_exam_miit`;

CREATE TABLE IF NOT EXISTS `users` (
  `user_id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(64) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('teacher','admin','student') NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `exam_papers` (
  `paper_id` INT AUTO_INCREMENT PRIMARY KEY,
  `teacher_id` INT NOT NULL,
  `filename` VARCHAR(255) NOT NULL,
  `encrypted_key` VARBINARY(1024) NOT NULL,
  `iv` VARBINARY(32) NOT NULL,
  `tag` VARBINARY(32) NOT NULL,
  `encrypted_data` LONGBLOB NOT NULL,
  `upload_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_exam_papers_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Demo users (passwords should be set via seed script to use password_hash)
