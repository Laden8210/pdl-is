

# **Database Schema Documentation**

## **Tables Overview**

This database consists of multiple tables designed for managing PDL (Persons Deprived of Liberty) records, activities, court orders, personnel information, and system notifications.

---

## **1. `activity`**

Stores information about activities assigned to PDLs.

| Column          | Type         | Attributes    | Description                    |
| --------------- | ------------ | ------------- | ------------------------------ |
| `activity_id`   | bigint       | PK, Auto Inc. | Unique identifier for activity |
| `category`      | varchar(255) | NOT NULL      | Activity category              |
| `activity_name` | varchar(255) | NOT NULL      | Name of the activity           |
| `activity_date` | date         | NOT NULL      | Date of the activity           |
| `activity_time` | time         | NOT NULL      | Time of the activity           |
| `created_at`    | timestamp    | NULL          | Record creation time           |
| `updated_at`    | timestamp    | NULL          | Last update time               |
| `pdl_id`        | bigint       | FK (pdl.id)   | Associated PDL                 |

**Foreign Key:** `pdl_id` → `pdl(id)` (ON DELETE CASCADE)

---

## **2. `cache`**

Stores application cache data.

| Column       | Type         | Attributes |
| ------------ | ------------ | ---------- |
| `key`        | varchar(255) | PK         |
| `value`      | mediumtext   | NOT NULL   |
| `expiration` | int          | NOT NULL   |

---

## **3. `cache_locks`**

Used for handling cache locks.

| Column       | Type         | Attributes |
| ------------ | ------------ | ---------- |
| `key`        | varchar(255) | PK         |
| `owner`      | varchar(255) | NOT NULL   |
| `expiration` | int          | NOT NULL   |

---

## **4. `case_information`**

Contains case details for PDLs.

| Column                    | Type         | Attributes    |
| ------------------------- | ------------ | ------------- |
| `case_id`                 | bigint       | PK, Auto Inc. |
| `case_number`             | varchar(255) | UNIQUE        |
| `crime_committed`         | varchar(255) | NOT NULL      |
| `date_committed`          | date         | NOT NULL      |
| `time_committed`          | varchar(255) | NOT NULL      |
| `case_status`             | varchar(255) | NOT NULL      |
| `case_remarks`            | varchar(255) | NULL          |
| `pdl_id`                  | bigint       | FK (pdl.id)   |
| `security_classification` | varchar(255) | NULL          |
| `created_at`              | timestamp    | NULL          |
| `updated_at`              | timestamp    | NULL          |

**Foreign Key:** `pdl_id` → `pdl(id)` (ON DELETE CASCADE)

---

## **5. `cell_assignments`**

Links PDLs to cells.

| Column          | Type   | Attributes          |
| --------------- | ------ | ------------------- |
| `assignment_id` | bigint | PK, Auto Inc.       |
| `cell_id`       | bigint | FK (cells.cell\_id) |
| `pdl_id`        | bigint | FK (pdl.id)         |

---

## **6. `cells`**

Holds details of prison cells.

| Column        | Type         | Attributes        |
| ------------- | ------------ | ----------------- |
| `cell_id`     | bigint       | PK, Auto Inc.     |
| `cell_name`   | varchar(255) | NOT NULL          |
| `capacity`    | int          | NOT NULL          |
| `description` | varchar(255) | NULL              |
| `status`      | varchar(255) | Default: 'active' |

---

## **7. `court_orders`**

Stores court order details for PDLs.

| Column               | Type         | Attributes    |
| -------------------- | ------------ | ------------- |
| `court_order_id`     | bigint       | PK, Auto Inc. |
| `court_order_number` | varchar(255) | UNIQUE        |
| `order_type`         | varchar(255) | NOT NULL      |
| `order_date`         | date         | NOT NULL      |
| `received_date`      | date         | NULL          |
| `remarks`            | varchar(255) | NULL          |
| `document_type`      | varchar(255) | NULL          |
| `court_branch`       | varchar(255) | NOT NULL      |
| `pdl_id`             | bigint       | FK (pdl.id)   |

---

## **8. `pdl`**

Main table for Persons Deprived of Liberty.

| Column         | Type                                          | Attributes        |
| -------------- | --------------------------------------------- | ----------------- |
| `id`           | bigint                                        | PK, Auto Inc.     |
| `fname`        | varchar(255)                                  | NOT NULL          |
| `lname`        | varchar(255)                                  | NOT NULL          |
| `alias`        | varchar(255)                                  | NULL              |
| `birthdate`    | date                                          | NULL              |
| `age`          | int                                           | NULL              |
| `gender`       | enum('Male','Female')                         | NULL              |
| `civil_status` | enum('Single','Married','Widowed','Divorced') | NULL              |
| `brgy`         | varchar(255)                                  | NULL              |
| `city`         | varchar(255)                                  | NULL              |
| `province`     | varchar(255)                                  | NULL              |
| `personnel_id` | bigint                                        | FK (personnel.id) |

---

## **9. `personnel`**

System users who manage PDL data.

| Column       | Type         | Attributes       |
| ------------ | ------------ | ---------------- |
| `id`         | bigint       | PK, Auto Inc.    |
| `fname`      | varchar(255) | NOT NULL         |
| `lname`      | varchar(255) | NOT NULL         |
| `contactnum` | varchar(255) | NOT NULL         |
| `username`   | varchar(255) | UNIQUE, NOT NULL |
| `password`   | varchar(255) | NOT NULL         |
| `position`   | varchar(255) | NOT NULL         |
| `status`     | tinyint(1)   | Default: 1       |

---

## **10. Other Tables**

* **`medical_records`**: Tracks PDL medical history.
* **`physical_characteristics`**: Stores PDL physical details like height, weight, marks.
* **`system_notifications`** & **`system_notifications_read_by`**: Manages alerts for personnel.
* **`verifications`**: Handles verification requests and feedback.
* **`time_allowances`**: Records GCTA/TASTM allowances.
* **`sessions`, `jobs`, `failed_jobs`, `job_batches`**: Related to Laravel system and queue jobs.
* **`migrations`**: Laravel migration history.
* **`cache`, `cache_locks`**: Caching system.


