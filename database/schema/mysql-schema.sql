/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
DROP TABLE IF EXISTS `activity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `activity` (
  `activity_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `category` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `activity_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `activity_date` date NOT NULL,
  `activity_time` time NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `pdl_ids` json DEFAULT NULL,
  `status` enum('pending','completed','cancelled','rescheduled') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`activity_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `agency`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `agency` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `agency_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cache` (
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `case_information`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `case_information` (
  `case_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `case_number` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `crime_committed` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_committed` date NOT NULL,
  `time_committed` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `case_status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `case_remarks` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pdl_id` bigint unsigned NOT NULL,
  `security_classification` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `drug_related` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`case_id`),
  UNIQUE KEY `case_information_case_number_unique` (`case_number`),
  KEY `case_information_pdl_id_foreign` (`pdl_id`),
  CONSTRAINT `case_information_pdl_id_foreign` FOREIGN KEY (`pdl_id`) REFERENCES `pdl` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `cell_assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cell_assignments` (
  `assignment_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `cell_id` bigint unsigned NOT NULL,
  `pdl_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`assignment_id`),
  KEY `cell_assignments_cell_id_foreign` (`cell_id`),
  KEY `cell_assignments_pdl_id_foreign` (`pdl_id`),
  CONSTRAINT `cell_assignments_cell_id_foreign` FOREIGN KEY (`cell_id`) REFERENCES `cells` (`cell_id`) ON DELETE CASCADE,
  CONSTRAINT `cell_assignments_pdl_id_foreign` FOREIGN KEY (`pdl_id`) REFERENCES `pdl` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `cell_transfer_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cell_transfer_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `assignment_id` bigint unsigned NOT NULL,
  `pdl_id` bigint unsigned NOT NULL,
  `from_cell_id` bigint unsigned NOT NULL,
  `to_cell_id` bigint unsigned NOT NULL,
  `transferred_by` bigint unsigned NOT NULL,
  `reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `transferred_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cell_transfer_logs_assignment_id_foreign` (`assignment_id`),
  KEY `cell_transfer_logs_pdl_id_foreign` (`pdl_id`),
  KEY `cell_transfer_logs_from_cell_id_foreign` (`from_cell_id`),
  KEY `cell_transfer_logs_to_cell_id_foreign` (`to_cell_id`),
  KEY `cell_transfer_logs_transferred_by_foreign` (`transferred_by`),
  CONSTRAINT `cell_transfer_logs_assignment_id_foreign` FOREIGN KEY (`assignment_id`) REFERENCES `cell_assignments` (`assignment_id`) ON DELETE CASCADE,
  CONSTRAINT `cell_transfer_logs_from_cell_id_foreign` FOREIGN KEY (`from_cell_id`) REFERENCES `cells` (`cell_id`) ON DELETE CASCADE,
  CONSTRAINT `cell_transfer_logs_pdl_id_foreign` FOREIGN KEY (`pdl_id`) REFERENCES `pdl` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cell_transfer_logs_to_cell_id_foreign` FOREIGN KEY (`to_cell_id`) REFERENCES `cells` (`cell_id`) ON DELETE CASCADE,
  CONSTRAINT `cell_transfer_logs_transferred_by_foreign` FOREIGN KEY (`transferred_by`) REFERENCES `personnel` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `cells`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cells` (
  `cell_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `cell_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `capacity` int NOT NULL,
  `gender` enum('male','female') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'male',
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cell_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`cell_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `certificates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `certificates` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `certificate_number` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `certificate_type` enum('drug_clearing_status','no_records','good_standing','release_clearance','medical_clearance','disciplinary_clearance') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `pdl_data` json NOT NULL,
  `issuer_data` json NOT NULL,
  `issue_date` date NOT NULL,
  `valid_until` date DEFAULT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `purpose` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `remarks` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `file_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pdl_id` bigint unsigned DEFAULT NULL,
  `issued_by` bigint unsigned NOT NULL,
  `requested_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `certificates_certificate_number_unique` (`certificate_number`),
  KEY `certificates_issued_by_foreign` (`issued_by`),
  KEY `certificates_requested_by_foreign` (`requested_by`),
  KEY `certificates_certificate_type_status_index` (`certificate_type`,`status`),
  KEY `certificates_issue_date_valid_until_index` (`issue_date`,`valid_until`),
  KEY `certificates_pdl_id_certificate_type_index` (`pdl_id`,`certificate_type`),
  CONSTRAINT `certificates_issued_by_foreign` FOREIGN KEY (`issued_by`) REFERENCES `personnel` (`id`) ON DELETE CASCADE,
  CONSTRAINT `certificates_pdl_id_foreign` FOREIGN KEY (`pdl_id`) REFERENCES `pdl` (`id`) ON DELETE CASCADE,
  CONSTRAINT `certificates_requested_by_foreign` FOREIGN KEY (`requested_by`) REFERENCES `personnel` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `court_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `court_orders` (
  `court_order_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `order_date` date NOT NULL,
  `received_date` date DEFAULT NULL,
  `remarks` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cod_remarks` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `document_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `document_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `original_filename` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pdl_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `archive_status` enum('BONDED','SERVED_SENTENCE','PROV_DISMISSED','DISMISSED','TRANSFER_TO_OTHER_FACILITY','DAPECOL','PROBATION','DECEASED','ACQUITTED') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `archive_reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `archive_court_order_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `archived_at` timestamp NULL DEFAULT NULL,
  `archive_notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `admission_date` timestamp NULL DEFAULT NULL,
  `release_date` timestamp NULL DEFAULT NULL,
  `court_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`court_order_id`),
  KEY `court_orders_pdl_id_foreign` (`pdl_id`),
  CONSTRAINT `court_orders_pdl_id_foreign` FOREIGN KEY (`pdl_id`) REFERENCES `pdl` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `courts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `courts` (
  `court_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `branch_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `branch` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `station` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `court_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`court_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `login_attempts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `login_attempts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ip_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `success` tinyint(1) NOT NULL DEFAULT '0',
  `attempted_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `login_attempts_email_attempted_at_index` (`email`,`attempted_at`),
  KEY `login_attempts_ip_address_attempted_at_index` (`ip_address`,`attempted_at`),
  KEY `login_attempts_email_index` (`email`),
  KEY `login_attempts_ip_address_index` (`ip_address`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `medical_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `medical_records` (
  `medical_record_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `pdl_id` bigint unsigned NOT NULL,
  `complaint` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` date NOT NULL,
  `prognosis` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `prescription` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `findings` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `stored_filename` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`medical_record_id`),
  KEY `medical_records_pdl_id_foreign` (`pdl_id`),
  CONSTRAINT `medical_records_pdl_id_foreign` FOREIGN KEY (`pdl_id`) REFERENCES `pdl` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `password_resets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `password_resets` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `personnel_id` bigint unsigned NOT NULL,
  `is_used` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `password_resets_personnel_id_foreign` (`personnel_id`),
  CONSTRAINT `password_resets_personnel_id_foreign` FOREIGN KEY (`personnel_id`) REFERENCES `personnel` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `pdl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pdl` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `fname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `lname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `mname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alias` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `birthdate` date DEFAULT NULL,
  `age` int DEFAULT NULL,
  `gender` enum('Male','Female') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ethnic_group` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `civil_status` enum('Single','Married','Widowed','Annulment') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `brgy` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `province` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mugshot_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mugshot_original_filename` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `personnel_id` bigint unsigned NOT NULL,
  `archive_status` enum('BONDED','SERVED_SENTENCE','PROV_DISMISSED','DISMISSED','TRANSFER_TO_OTHER_FACILITY','DAPECOL','PROBATION','DECEASED','ACQUITTED') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `archive_reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `archived_at` timestamp NULL DEFAULT NULL,
  `archive_court_order_type` enum('RELEASE','BAIL','SERVED_SENTENCE','PROBATION','PAROLE','TRANSFER','OTHER') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `archive_court_order_file` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `archive_court_order_date` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `pdl_personnel_id_foreign` (`personnel_id`),
  CONSTRAINT `pdl_personnel_id_foreign` FOREIGN KEY (`personnel_id`) REFERENCES `personnel` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `pdl_alerts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pdl_alerts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `pdl_id` bigint unsigned NOT NULL,
  `alert_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `scheduled_date` datetime NOT NULL,
  `reminder_date` datetime DEFAULT NULL,
  `location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `created_by` bigint unsigned NOT NULL,
  `assigned_to` bigint unsigned DEFAULT NULL,
  `reminder_sent_to` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `pdl_alerts_pdl_id_foreign` (`pdl_id`),
  KEY `pdl_alerts_created_by_foreign` (`created_by`),
  KEY `pdl_alerts_assigned_to_foreign` (`assigned_to`),
  CONSTRAINT `pdl_alerts_assigned_to_foreign` FOREIGN KEY (`assigned_to`) REFERENCES `personnel` (`id`) ON DELETE SET NULL,
  CONSTRAINT `pdl_alerts_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `personnel` (`id`) ON DELETE CASCADE,
  CONSTRAINT `pdl_alerts_pdl_id_foreign` FOREIGN KEY (`pdl_id`) REFERENCES `pdl` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `personnel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `personnel` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `fname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `mname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `contactnum` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `position` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `agency` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1 for active, 0 for inactive',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personnel_username_unique` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `physical_characteristics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `physical_characteristics` (
  `characteristic_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `height` decimal(8,2) DEFAULT NULL,
  `weight` decimal(8,2) DEFAULT NULL,
  `build` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `complexion` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hair_color` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `eye_color` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `identification_marks` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `mark_location` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `remark` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `pc_remark` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `pdl_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`characteristic_id`),
  KEY `physical_characteristics_pdl_id_foreign` (`pdl_id`),
  CONSTRAINT `physical_characteristics_pdl_id_foreign` FOREIGN KEY (`pdl_id`) REFERENCES `pdl` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `request_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `request_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `method` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status_code` int DEFAULT NULL,
  `request_headers` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `request_body` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `response_headers` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `response_body` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `success_message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `error_message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `ip_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `personnel_id` bigint unsigned DEFAULT NULL,
  `duration` double NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `request_logs_method_index` (`method`),
  KEY `request_logs_status_code_index` (`status_code`),
  KEY `request_logs_personnel_id_index` (`personnel_id`),
  KEY `request_logs_created_at_index` (`created_at`),
  CONSTRAINT `request_logs_personnel_id_foreign` FOREIGN KEY (`personnel_id`) REFERENCES `personnel` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `system_notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `system_notifications` (
  `notification_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `notification_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'general',
  `action_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `personnel_id` bigint unsigned NOT NULL,
  `pdl_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`notification_id`),
  KEY `system_notifications_personnel_id_foreign` (`personnel_id`),
  KEY `system_notifications_pdl_id_foreign` (`pdl_id`),
  CONSTRAINT `system_notifications_pdl_id_foreign` FOREIGN KEY (`pdl_id`) REFERENCES `pdl` (`id`) ON DELETE CASCADE,
  CONSTRAINT `system_notifications_personnel_id_foreign` FOREIGN KEY (`personnel_id`) REFERENCES `personnel` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `system_notifications_read_by`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `system_notifications_read_by` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `notification_id` bigint unsigned NOT NULL,
  `personnel_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `system_notifications_read_by_notification_id_foreign` (`notification_id`),
  KEY `system_notifications_read_by_personnel_id_foreign` (`personnel_id`),
  CONSTRAINT `system_notifications_read_by_notification_id_foreign` FOREIGN KEY (`notification_id`) REFERENCES `system_notifications` (`notification_id`) ON DELETE CASCADE,
  CONSTRAINT `system_notifications_read_by_personnel_id_foreign` FOREIGN KEY (`personnel_id`) REFERENCES `personnel` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `time_allowances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `time_allowances` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `pdl_id` bigint unsigned NOT NULL,
  `type` enum('gcta','tastm') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `days` int NOT NULL,
  `reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `awarded_by` bigint unsigned NOT NULL,
  `awarded_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `time_allowances_pdl_id_foreign` (`pdl_id`),
  KEY `time_allowances_awarded_by_foreign` (`awarded_by`),
  CONSTRAINT `time_allowances_awarded_by_foreign` FOREIGN KEY (`awarded_by`) REFERENCES `personnel` (`id`) ON DELETE CASCADE,
  CONSTRAINT `time_allowances_pdl_id_foreign` FOREIGN KEY (`pdl_id`) REFERENCES `pdl` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `verifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `verifications` (
  `verification_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `reason` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `personnel_id` bigint unsigned NOT NULL,
  `pdl_id` bigint unsigned NOT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `feedback` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `reviewed_by` bigint unsigned DEFAULT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`verification_id`),
  KEY `verifications_personnel_id_foreign` (`personnel_id`),
  KEY `verifications_pdl_id_foreign` (`pdl_id`),
  KEY `verifications_reviewed_by_foreign` (`reviewed_by`),
  CONSTRAINT `verifications_pdl_id_foreign` FOREIGN KEY (`pdl_id`) REFERENCES `pdl` (`id`) ON DELETE CASCADE,
  CONSTRAINT `verifications_personnel_id_foreign` FOREIGN KEY (`personnel_id`) REFERENCES `personnel` (`id`) ON DELETE CASCADE,
  CONSTRAINT `verifications_reviewed_by_foreign` FOREIGN KEY (`reviewed_by`) REFERENCES `personnel` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (9,'0001_01_01_000000_create_users_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (10,'0001_01_01_000001_create_cache_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (11,'0001_01_01_000002_create_jobs_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (12,'2025_06_30_024800_personnel',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (13,'2025_07_12_193317_create_personal_information_table',2);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (14,'2025_07_14_011931_add_user_status',3);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (15,'2025_07_20_163428_add-cell-assignment',4);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (16,'2025_07_20_182009_add-court-order',5);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (18,'2025_07_20_205501_add-case-information',6);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (19,'2025_08_11_155343_activity',7);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (23,'2025_08_12_065404_add-verification',8);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (24,'2025_08_15_145929_update-personnel',9);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (34,'2025_09_16_192343_create_medical_documents_table',19);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (35,'2025_09_16_192600_create_medical_documents_table',20);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (46,'2025_08_15_154308_system-notification',21);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (47,'2025_08_22_204000_time_allowances',21);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (48,'2025_09_16_175912_add_notification_type_to_system_notifications_table',22);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (49,'2025_09_16_183719_add_timestamps_to_system_notifications_read_by_table',23);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (50,'2025_09_19_194756_make_pdl_id_nullable_in_system_notifications_table',24);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (51,'2025_09_12_085038_add-forgot-password',25);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (52,'2025_09_16_184015_add_gender_to_cells_table',25);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (53,'2025_09_16_184225_update_cells_gender_enum_to_male_female_only',25);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (54,'2025_09_16_185315_create_pdl_alerts_table',25);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (55,'2025_09_16_191732_add_drug_related_to_case_information_table',25);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (56,'2025_09_16_192900_create_medical_documents_table',25);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (57,'2025_09_16_195725_add_document_path_to_court_orders_table',25);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (58,'2025_09_16_203245_create_login_attempts_table',25);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (59,'2025_09_16_204048_create_certificates_table',25);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (60,'2025_09_16_223030_add_archiving_fields_to_pdls_table',25);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (61,'2025_09_16_224304_add_court_order_fields_to_pdl_table',25);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (62,'2025_09_16_225139_move_archiving_fields_to_case_information_table',25);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (63,'2025_09_16_225451_move_archiving_fields_to_court_orders_table',25);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (64,'2025_09_19_181009_add_archive_fields_to_pdl_table',25);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (65,'2025_09_19_182031_add_court_order_fields_to_pdl_archive',25);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (66,'2025_09_20_000752_add_middlename',26);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (67,'2025_09_21_163812_remove_court_order_laboratory_results',27);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (68,'2025_09_21_164451_update_court_orders_table_for_one_page_form',28);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (69,'2025_09_21_164508_update_medical_records_table_for_one_page_form',28);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (70,'2025_09_21_164526_update_physical_characteristics_table_for_one_page_form',28);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (71,'2025_09_21_170940_update_medical_record_and_remove_medical_record_tbl',29);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (72,'2025_09_21_200659_remove_archive_case_number',30);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (73,'2025_09_21_200714_remove_archive_case_number',31);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (74,'2025_09_21_200724_remove_archive_case_number',31);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (76,'2025_10_09_151517_create_cell_transfer_logs_table',32);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (80,'2025_10_09_165010_add_pdl_ids_to_activity_table',33);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (81,'2025_10_14_012334_add_mugshot_to_pdl_table',34);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (82,'2025_10_17_184140_add_agency_table',35);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (83,'2025_10_17_192704_add_court_table',36);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (84,'2025_10_17_200511_update_court_order_table',37);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (85,'2025_10_17_230806_update_activity_table',38);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (86,'2025_10_18_001054_update_change_divorce_to_anullment_table',39);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (87,'2025_10_19_155121_create_request_logs_table',40);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (88,'2025_10_19_164339_update_cell',41);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (89,'2025_10_19_170515_update_court',42);
