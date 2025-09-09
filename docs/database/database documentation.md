# Jail Management System Database Documentation

## Overview

This document provides a comprehensive overview of the database schema for a Jail Management System. The system manages Persons Deprived of Liberty (PDL), personnel, cells, medical records, court orders, case information, and various other aspects of correctional facility management.

## Table Structure

### Core Tables

#### `pdl` - Persons Deprived of Liberty
Stores personal information about incarcerated individuals.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | bigint unsigned | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| fname | varchar(255) | NOT NULL | First name |
| lname | varchar(255) | NOT NULL | Last name |
| alias | varchar(255) | NULL | Alias/Nickname |
| birthdate | date | NULL | Date of birth |
| age | int | NULL | Age |
| gender | enum('Male','Female') | NULL | Gender |
| ethnic_group | varchar(255) | NULL | Ethnic group |
| civil_status | enum('Single','Married','Widowed','Divorced') | NULL | Civil status |
| brgy | varchar(255) | NULL | Barangay |
| city | varchar(255) | NULL | City |
| province | varchar(255) | NULL | Province |
| created_at | timestamp | NULL | Creation timestamp |
| updated_at | timestamp | NULL | Update timestamp |
| deleted_at | timestamp | NULL | Soft delete timestamp |
| personnel_id | bigint unsigned | FOREIGN KEY (personnel.id) | Assigned personnel |

#### `personnel` - Staff Members
Stores information about correctional facility staff.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | bigint unsigned | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| fname | varchar(255) | NOT NULL | First name |
| mname | varchar(255) | NULL | Middle name |
| lname | varchar(255) | NOT NULL | Last name |
| contactnum | varchar(255) | NOT NULL | Contact number |
| avatar | varchar(255) | NULL | Profile picture |
| username | varchar(255) | NOT NULL, UNIQUE | Login username |
| password | varchar(255) | NOT NULL | Hashed password |
| position | varchar(255) | NOT NULL | Job position |
| agency | varchar(255) | NOT NULL | Agency/Department |
| status | tinyint(1) | DEFAULT 1 | 1=active, 0=inactive |
| created_at | timestamp | NULL | Creation timestamp |
| updated_at | timestamp | NULL | Update timestamp |
| deleted_at | timestamp | NULL | Soft delete timestamp |
| remember_token | varchar(100) | NULL | Remember token for authentication |

### Facility Management Tables

#### `cells` - Cell Information
Stores information about prison cells.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| cell_id | bigint unsigned | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| cell_name | varchar(255) | NOT NULL | Cell name/number |
| capacity | int | NOT NULL | Maximum capacity |
| description | varchar(255) | NULL | Cell description |
| status | varchar(255) | DEFAULT 'active' | Cell status |
| created_at | timestamp | NULL | Creation timestamp |
| updated_at | timestamp | NULL | Update timestamp |

#### `cell_assignments` - Cell Assignments
Tracks which PDLs are assigned to which cells.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| assignment_id | bigint unsigned | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| cell_id | bigint unsigned | FOREIGN KEY (cells.cell_id) | Cell reference |
| pdl_id | bigint unsigned | FOREIGN KEY (pdl.id) | PDL reference |
| created_at | timestamp | NULL | Creation timestamp |
| updated_at | timestamp | NULL | Update timestamp |

### Legal & Case Management Tables

#### `case_information` - Case Details
Stores information about legal cases.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| case_id | bigint unsigned | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| case_number | varchar(255) | NOT NULL, UNIQUE | Case number |
| crime_committed | varchar(255) | NOT NULL | Crime description |
| date_committed | date | NOT NULL | Date crime was committed |
| time_committed | varchar(255) | NOT NULL | Time crime was committed |
| case_status | varchar(255) | NOT NULL | Current case status |
| case_remarks | varchar(255) | NULL | Case remarks |
| pdl_id | bigint unsigned | FOREIGN KEY (pdl.id) | PDL reference |
| security_classification | varchar(255) | NULL | Security classification |
| created_at | timestamp | NULL | Creation timestamp |
| updated_at | timestamp | NULL | Update timestamp |

#### `court_orders` - Court Orders
Stores court order information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| court_order_id | bigint unsigned | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| court_order_number | varchar(255) | NOT NULL, UNIQUE | Court order number |
| order_type | varchar(255) | NOT NULL | Type of order |
| order_date | date | NOT NULL | Date order was issued |
| received_date | date | NULL | Date order was received |
| remarks | varchar(255) | NULL | Order remarks |
| document_type | varchar(255) | NULL | Document type |
| court_branch | varchar(255) | NOT NULL | Court branch |
| pdl_id | bigint unsigned | FOREIGN KEY (pdl.id) | PDL reference |
| created_at | timestamp | NULL | Creation timestamp |
| updated_at | timestamp | NULL | Update timestamp |

### Medical & Physical Records

#### `medical_records` - Medical History
Stores medical records for PDLs.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| medical_record_id | bigint unsigned | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| pdl_id | bigint unsigned | FOREIGN KEY (pdl.id) | PDL reference |
| complaint | varchar(255) | NOT NULL | Medical complaint |
| date | date | NOT NULL | Date of medical visit |
| prognosis | text | NULL | Medical prognosis |
| laboratory | text | NULL | Laboratory results |
| prescription | text | NULL | Prescription information |
| findings | text | NULL | Medical findings |
| created_at | timestamp | NULL | Creation timestamp |
| updated_at | timestamp | NULL | Update timestamp |

#### `physical_characteristics` - Physical Attributes
Stores physical characteristics of PDLs.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| characteristic_id | bigint unsigned | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| height | double | NULL | Height measurement |
| weight | double | NULL | Weight measurement |
| build | varchar(255) | NULL | Body build |
| complexion | varchar(255) | NULL | Skin complexion |
| hair_color | varchar(255) | NULL | Hair color |
| eye_color | varchar(255) | NULL | Eye color |
| identification_marks | varchar(255) | NULL | Identifying marks |
| mark_location | varchar(255) | NULL | Location of marks |
| remark | varchar(255) | NULL | Additional remarks |
| pdl_id | bigint unsigned | FOREIGN KEY (pdl.id) | PDL reference |
| created_at | timestamp | NULL | Creation timestamp |
| updated_at | timestamp | NULL | Update timestamp |

### Activity & Time Management

#### `activity` - PDL Activities
Tracks activities and schedules for PDLs.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| activity_id | bigint unsigned | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| category | varchar(255) | NOT NULL | Activity category |
| activity_name | varchar(255) | NOT NULL | Activity name |
| activity_date | date | NOT NULL | Activity date |
| activity_time | time | NOT NULL | Activity time |
| created_at | timestamp | NULL | Creation timestamp |
| updated_at | timestamp | NULL | Update timestamp |
| pdl_id | bigint unsigned | FOREIGN KEY (pdl.id) | PDL reference |

#### `time_allowances` - Time Allowances
Tracks time allowances for PDLs (GCTA, TASTM).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | bigint unsigned | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| pdl_id | bigint unsigned | FOREIGN KEY (pdl.id) | PDL reference |
| type | enum('gcta','tastm') | NOT NULL | Allowance type |
| days | int | NOT NULL | Number of days |
| reason | text | NOT NULL | Reason for allowance |
| awarded_by | bigint unsigned | FOREIGN KEY (personnel.id) | Awarding personnel |
| awarded_at | timestamp | NOT NULL | Award timestamp |
| created_at | timestamp | NULL | Creation timestamp |
| updated_at | timestamp | NULL | Update timestamp |

### System & Notification Tables

#### `system_notifications` - System Notifications
Stores system-generated notifications.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| notification_id | bigint unsigned | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| title | varchar(255) | NOT NULL | Notification title |
| message | text | NOT NULL | Notification message |
| personnel_id | bigint unsigned | FOREIGN KEY (personnel.id) | Target personnel |
| pdl_id | bigint unsigned | FOREIGN KEY (pdl.id) | Related PDL |
| created_at | timestamp | NULL | Creation timestamp |
| updated_at | timestamp | NULL | Update timestamp |

#### `system_notifications_read_by` - Notification Read Status
Tracks which personnel have read which notifications.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | bigint unsigned | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| notification_id | bigint unsigned | FOREIGN KEY (system_notifications.notification_id) | Notification reference |
| personnel_id | bigint unsigned | FOREIGN KEY (personnel.id) | Personnel reference |

#### `verifications` - Verification Requests
Stores verification requests and their status.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| verification_id | bigint unsigned | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| reason | varchar(255) | NOT NULL | Verification reason |
| personnel_id | bigint unsigned | FOREIGN KEY (personnel.id) | Requesting personnel |
| pdl_id | bigint unsigned | FOREIGN KEY (pdl.id) | PDL reference |
| status | varchar(255) | DEFAULT 'pending' | Verification status |
| created_at | timestamp | NULL | Creation timestamp |
| updated_at | timestamp | NULL | Update timestamp |
| feedback | text | NULL | Verification feedback |
| reviewed_by | bigint unsigned | FOREIGN KEY (personnel.id) | Reviewing personnel |
| reviewed_at | timestamp | NULL | Review timestamp |

### Framework & System Tables

#### `cache`, `cache_locks`, `failed_jobs`, `job_batches`, `jobs`, `migrations`, `sessions`
Standard Laravel framework tables for caching, queue management, migrations, and sessions.

## Relationships Summary

- **PDL** has many: Case Information, Court Orders, Medical Records, Physical Characteristics, Activities, Cell Assignments, Time Allowances
- **Personnel** has many: PDLs (assigned), Notifications, Verification Requests, Time Allowances (awarded)
- **Cells** have many: Cell Assignments
- **System Notifications** have many: Read By records

## Security Features

- Soft deletes implemented on `pdl` and `personnel` tables
- Foreign key constraints with cascading deletes
- Unique constraints on critical fields (usernames, case numbers, court order numbers)
- Status tracking for personnel and cells
- Authentication system with remember tokens

## Notes

- The database uses UTF8MB4 Unicode collation for international character support
- Timestamps are used for tracking creation and modification times
- The schema appears to be designed for a Laravel application with Eloquent ORM
- Relationships are properly established with foreign key constraints
- The system supports soft deletes for main entities

This database schema provides a comprehensive foundation for managing a correctional facility, tracking inmates, staff, legal proceedings, medical care, and facility operations.

```mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
```

erDiagram
    personnel {
        bigint id PK "AUTO_INCREMENT"
        varchar fname "NOT NULL"
        varchar mname
        varchar lname "NOT NULL"
        varchar contactnum "NOT NULL"
        varchar avatar
        varchar username "NOT NULL, UNIQUE"
        varchar password "NOT NULL"
        varchar position "NOT NULL"
        varchar agency "NOT NULL"
        tinyint status "DEFAULT 1"
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
        varchar remember_token
    }

    pdl {
        bigint id PK "AUTO_INCREMENT"
        varchar fname "NOT NULL"
        varchar lname "NOT NULL"
        varchar alias
        date birthdate
        int age
        enum gender "Male, Female"
        varchar ethnic_group
        enum civil_status "Single, Married, Widowed, Divorced"
        varchar brgy
        varchar city
        varchar province
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
        bigint personnel_id FK "NOT NULL"
    }

    cells {
        bigint cell_id PK "AUTO_INCREMENT"
        varchar cell_name "NOT NULL"
        int capacity "NOT NULL"
        varchar description
        varchar status "DEFAULT 'active'"
        timestamp created_at
        timestamp updated_at
    }

    cell_assignments {
        bigint assignment_id PK "AUTO_INCREMENT"
        bigint cell_id FK "NOT NULL"
        bigint pdl_id FK "NOT NULL"
        timestamp created_at
        timestamp updated_at
    }

    case_information {
        bigint case_id PK "AUTO_INCREMENT"
        varchar case_number "NOT NULL, UNIQUE"
        varchar crime_committed "NOT NULL"
        date date_committed "NOT NULL"
        varchar time_committed "NOT NULL"
        varchar case_status "NOT NULL"
        varchar case_remarks
        bigint pdl_id FK "NOT NULL"
        varchar security_classification
        timestamp created_at
        timestamp updated_at
    }

    court_orders {
        bigint court_order_id PK "AUTO_INCREMENT"
        varchar court_order_number "NOT NULL, UNIQUE"
        varchar order_type "NOT NULL"
        date order_date "NOT NULL"
        date received_date
        varchar remarks
        varchar document_type
        varchar court_branch "NOT NULL"
        bigint pdl_id FK "NOT NULL"
        timestamp created_at
        timestamp updated_at
    }

    medical_records {
        bigint medical_record_id PK "AUTO_INCREMENT"
        bigint pdl_id FK "NOT NULL"
        varchar complaint "NOT NULL"
        date date "NOT NULL"
        text prognosis
        text laboratory
        text prescription
        text findings
        timestamp created_at
        timestamp updated_at
    }

    physical_characteristics {
        bigint characteristic_id PK "AUTO_INCREMENT"
        double height
        double weight
        varchar build
        varchar complexion
        varchar hair_color
        varchar eye_color
        varchar identification_marks
        varchar mark_location
        varchar remark
        bigint pdl_id FK "NOT NULL"
        timestamp created_at
        timestamp updated_at
    }

    activity {
        bigint activity_id PK "AUTO_INCREMENT"
        varchar category "NOT NULL"
        varchar activity_name "NOT NULL"
        date activity_date "NOT NULL"
        time activity_time "NOT NULL"
        timestamp created_at
        timestamp updated_at
        bigint pdl_id FK "NOT NULL"
    }

    time_allowances {
        bigint id PK "AUTO_INCREMENT"
        bigint pdl_id FK "NOT NULL"
        enum type "gcta, tastm, NOT NULL"
        int days "NOT NULL"
        text reason "NOT NULL"
        bigint awarded_by FK "NOT NULL"
        timestamp awarded_at "NOT NULL"
        timestamp created_at
        timestamp updated_at
    }

    system_notifications {
        bigint notification_id PK "AUTO_INCREMENT"
        varchar title "NOT NULL"
        text message "NOT NULL"
        bigint personnel_id FK "NOT NULL"
        bigint pdl_id FK "NOT NULL"
        timestamp created_at
        timestamp updated_at
    }

    system_notifications_read_by {
        bigint id PK "AUTO_INCREMENT"
        bigint notification_id FK "NOT NULL"
        bigint personnel_id FK "NOT NULL"
    }

    verifications {
        bigint verification_id PK "AUTO_INCREMENT"
        varchar reason "NOT NULL"
        bigint personnel_id FK "NOT NULL"
        bigint pdl_id FK "NOT NULL"
        varchar status "DEFAULT 'pending'"
        timestamp created_at
        timestamp updated_at
        text feedback
        bigint reviewed_by FK
        timestamp reviewed_at
    }

    personnel ||--o{ pdl : manages
    pdl ||--o{ cell_assignments : assigned_to
    cells ||--o{ cell_assignments : contains
    pdl ||--o{ case_information : has
    pdl ||--o{ court_orders : has
    pdl ||--o{ medical_records : has
    pdl ||--o{ physical_characteristics : has
    pdl ||--o{ activity : participates_in
    pdl ||--o{ time_allowances : receives
    personnel ||--o{ time_allowances : awards
    personnel ||--o{ system_notifications : receives
    pdl ||--o{ system_notifications : related_to
    system_notifications ||--o{ system_notifications_read_by : read_by
    personnel ||--o{ system_notifications_read_by : has_read
    personnel ||--o{ verifications : requests
    pdl ||--o{ verifications : subject_of
    personnel ||--o{ verifications : reviews
