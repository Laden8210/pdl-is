### **4.2.2# **System Requirements Specification (SRS)**

## **Web-Based Person Deprived of Liberty (PDL) Information System**

### **South Cotabato Rehabilitation and Detention Center**

---

## **Table of Contents**

1. [Introduction](#1-introduction)
2. [Role-Based Access Control (RBAC)](#2-role-based-access-control-rbac)
3. [CRUD Operations and Database Tables](#3-crud-operations-and-database-tables)
4. [Functional Requirements](#4-functional-requirements)
   - [Admin Officer Modules](#41-admin-officer-modules)
   - [Records Officer Modules](#42-records-officer-modules)
   - [Municipal Jails and Law Enforcement Modules](#43-municipal-jails-and-law-enforcement-modules)

---

## **1. Introduction**

This document specifies the functional requirements for the Web-Based Person Deprived of Liberty (PDL) Information System for South Cotabato Rehabilitation and Detention Center (SCRDC). The focus is on Role-Based Access Control (RBAC), detailed functional requirements with system flows, and module display specifications.

---

## **2. Role-Based Access Control (RBAC)**

### **2.1 Admin Officer**
- **Access Level**: Full system access with administrative privileges
- **Permissions**:
  - Create, read, update, delete all PDL records
  - Manage user accounts and system settings
  - Generate all report types
  - Access verification and approval functions
  - View all activity logs and audit trails
  - Manage cell assignments and facility operations

### **2.2 Records Officer**
- **Access Level**: Full PDL and case management access
- **Permissions**:
  - Create, read, update PDL records
  - Manage case information and court orders
  - Access scheduling and calendar functions
  - Archive PDL records
  - Generate operational reports (limited)
  - Cannot manage user accounts or system settings

### **2.3 Municipal Jails and Law Enforcement**
- **Access Level**: Limited data entry and viewing permissions
- **Permissions**:
  - Submit new PDL information
  - Upload required documents
  - View submission status
  - Update own profile information
  - Cannot access existing PDL records or system administration

---

## **3. CRUD Operations and Database Tables**

### **3.1 PDL Management CRUD**

#### **PDL Table Structure**
| Field Name | Data Type | Length | Constraints | Description |
|------------|-----------|--------|-------------|-------------|
| pdl_id | INT | - | PRIMARY KEY, AUTO_INCREMENT | Unique PDL identifier |
| pdl_number | VARCHAR | 20 | UNIQUE, NOT NULL | PDL identification number |
| first_name | VARCHAR | 50 | NOT NULL | PDL first name |
| middle_name | VARCHAR | 50 | NULL | PDL middle name |
| last_name | VARCHAR | 50 | NOT NULL | PDL last name |
| alias | VARCHAR | 100 | NULL | PDL known aliases |
| date_of_birth | DATE | - | NOT NULL | Birth date |
| age | INT | - | NOT NULL | Current age |
| gender | ENUM | - | ('Male','Female') | Gender |
| civil_status | ENUM | - | ('Single','Married','Widowed','Separated') | Civil status |
| ethnicity | VARCHAR | 50 | NULL | Ethnic background |
| address | TEXT | - | NOT NULL | Complete address |
| contact_number | VARCHAR | 15 | NULL | Phone number |
| emergency_contact | VARCHAR | 100 | NULL | Emergency contact person |
| emergency_phone | VARCHAR | 15 | NULL | Emergency contact number |
| photo_path | VARCHAR | 255 | NULL | Path to PDL photo |
| fingerprint_data | LONGBLOB | - | NULL | Biometric fingerprint data |
| admission_date | DATETIME | - | NOT NULL | Date of admission |
| cell_id | INT | - | FOREIGN KEY | Assigned cell |
| status | ENUM | - | ('Active','Released','Transferred','Archived') | PDL status |
| created_at | TIMESTAMP | - | DEFAULT CURRENT_TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | - | ON UPDATE CURRENT_TIMESTAMP | Last update time |
| created_by | INT | - | FOREIGN KEY (users.user_id) | User who created record |
| updated_by | INT | - | FOREIGN KEY (users.user_id) | User who updated record |

#### **PDL Table Headers and Actions**
| Header | Field | Type | Actions Available |
|--------|--------|------|-------------------|
| Photo | photo_path | Image | View Full Size |
| PDL Number | pdl_number | Text | Copy to Clipboard |
| Full Name | CONCAT(first_name, ' ', last_name) | Text | View Profile |
| Age/Gender | CONCAT(age, '/', gender) | Text | - |
| Admission Date | admission_date | Date | Sort |
| Cell Assignment | cell_id | Text | Reassign |
| Status | status | Badge | Update Status |
| Actions | - | Buttons | Edit, Delete, Archive, Transfer, Print |

#### **PDL CRUD Operations**

##### **CREATE Operation**
**Frontend Flow:**
```
Click "Add New PDL" → Form Modal Opens → Fill Personal Info → 
Upload Photo → Select Cell → Enter Case Details → Validate Form → 
Submit Data → Show Loading → Display Success/Error → Refresh Table
```

**Backend Flow:**
```
Receive POST Request → Validate Input Data → Check Duplicate PDL Number → 
Upload Photo to Server → Insert into PDL Table → Insert into Activity Log → 
Assign Cell → Generate PDL Number → Return Success Response → 
Send Notification to Records Officer
```

##### **READ Operation**
**Frontend Flow:**
```
Page Load → Send GET Request → Display Loading → Receive Data → 
Populate Table → Apply Pagination → Show Search/Filter Options → 
Enable Row Click for Details
```

**Backend Flow:**
```
Receive GET Request → Check User Permissions → Build Query with Filters → 
Execute Database Query → Format Response Data → Return JSON → 
Log Access Activity
```

##### **UPDATE Operation**
**Frontend Flow:**
```
Click Edit Button → Load Current Data → Pre-fill Form → Allow Modifications → 
Validate Changes → Submit Update → Show Loading → Display Success/Error → 
Update Table Row → Close Modal
```

**Backend Flow:**
```
Receive PUT Request → Validate User Permissions → Validate Input Data → 
Check for Changes → Update PDL Record → Update Related Tables → 
Log Activity → Return Updated Data → Send Change Notifications
```

##### **DELETE/ARCHIVE Operation**
**Frontend Flow:**
```
Click Delete/Archive → Show Confirmation Dialog → Confirm Action → 
Send Request → Show Loading → Remove from Table → Display Success → 
Update Counter
```

**Backend Flow:**
```
Receive DELETE Request → Check User Permissions → Validate PDL Status → 
Soft Delete (Archive) → Update Status to 'Archived' → Log Activity → 
Move to Archive Table → Return Success Response
```

---

### **3.2 User Management CRUD**

#### **Users Table Structure**
| Field Name | Data Type | Length | Constraints | Description |
|------------|-----------|--------|-------------|-------------|
| user_id | INT | - | PRIMARY KEY, AUTO_INCREMENT | Unique user identifier |
| username | VARCHAR | 50 | UNIQUE, NOT NULL | Login username |
| email | VARCHAR | 100 | UNIQUE, NOT NULL | User email |
| password | VARCHAR | 255 | NOT NULL | Encrypted password |
| first_name | VARCHAR | 50 | NOT NULL | User first name |
| last_name | VARCHAR | 50 | NOT NULL | User last name |
| role | ENUM | - | ('Admin','Records_Officer','Law_Enforcement') | User role |
| agency | VARCHAR | 100 | NULL | Agency/Department |
| position | VARCHAR | 100 | NULL | Job position |
| phone | VARCHAR | 15 | NULL | Contact number |
| profile_photo | VARCHAR | 255 | NULL | Profile photo path |
| status | ENUM | - | ('Active','Inactive','Suspended') | Account status |
| last_login | DATETIME | - | NULL | Last login time |
| created_at | TIMESTAMP | - | DEFAULT CURRENT_TIMESTAMP | Account creation |
| updated_at | TIMESTAMP | - | ON UPDATE CURRENT_TIMESTAMP | Last update |

#### **User Table Headers and Actions**
| Header | Field | Type | Actions Available |
|--------|--------|------|-------------------|
| Photo | profile_photo | Image | Upload New |
| Name | CONCAT(first_name, ' ', last_name) | Text | View Profile |
| Username | username | Text | - |
| Role | role | Badge | Change Role |
| Agency | agency | Text | Edit |
| Status | status | Toggle | Activate/Deactivate |
| Last Login | last_login | DateTime | - |
| Actions | - | Buttons | Edit, Reset Password, Delete, Send Email |

#### **User CRUD Operations**

##### **CREATE Operation**
**Frontend Flow:**
```
Click "Add User" → Form Opens → Fill User Details → Select Role → 
Set Permissions → Validate Form → Submit → Show Loading → 
Display Success → Refresh User List
```

**Backend Flow:**
```
Receive POST Request → Validate Admin Permissions → Check Username/Email → 
Hash Password → Insert User Record → Assign Default Permissions → 
Send Welcome Email → Log Activity → Return Success
```

##### **READ Operation**
**Frontend Flow:**
```
Load User Management → Send GET Request → Display Loading → 
Populate User Table → Apply Filters → Enable Search → Show Pagination
```

**Backend Flow:**
```
Receive GET Request → Validate Admin Access → Build Query → 
Execute Query → Format User Data → Hide Sensitive Info → Return JSON
```

##### **UPDATE Operation**
**Frontend Flow:**
```
Click Edit User → Load User Data → Pre-fill Form → Modify Fields → 
Validate Changes → Submit Update → Show Loading → Update Table
```

**Backend Flow:**
```
Receive PUT Request → Validate Permissions → Check Data Changes → 
Update User Record → Hash New Password (if changed) → Log Activity → 
Return Updated Data
```

##### **DELETE Operation**
**Frontend Flow:**
```
Click Delete → Confirmation Dialog → Confirm Delete → Send Request → 
Remove from Table → Show Success Message
```

**Backend Flow:**
```
Receive DELETE Request → Validate Admin Rights → Check User Dependencies → 
Soft Delete User → Update Status to 'Deleted' → Archive User Data → 
Log Activity → Return Success
```

---

### **3.3 Case Management CRUD**

#### **Cases Table Structure**
| Field Name | Data Type | Length | Constraints | Description |
|------------|-----------|--------|-------------|-------------|
| case_id | INT | - | PRIMARY KEY, AUTO_INCREMENT | Unique case identifier |
| case_number | VARCHAR | 50 | UNIQUE, NOT NULL | Official case number |
| pdl_id | INT | - | FOREIGN KEY (pdl.pdl_id) | Associated PDL |
| crime_committed | TEXT | - | NOT NULL | Description of crime |
| case_type | ENUM | - | ('Criminal','Civil','Drug','Robbery','etc') | Type of case |
| court_assigned | VARCHAR | 100 | NOT NULL | Assigned court |
| judge_name | VARCHAR | 100 | NULL | Presiding judge |
| prosecutor | VARCHAR | 100 | NULL | Prosecutor name |
| lawyer | VARCHAR | 100 | NULL | Defense lawyer |
| case_status | ENUM | - | ('Pending','Ongoing','Resolved','Dismissed') | Current status |
| filing_date | DATE | - | NOT NULL | Case filing date |
| hearing_date | DATE | - | NULL | Next hearing date |
| bail_amount | DECIMAL | 10,2 | NULL | Bail amount if applicable |
| bail_status | ENUM | - | ('Not_Set','Granted','Posted','Denied') | Bail status |
| sentence | TEXT | - | NULL | Court sentence |
| created_at | TIMESTAMP | - | DEFAULT CURRENT_TIMESTAMP | Record creation |
| updated_at | TIMESTAMP | - | ON UPDATE CURRENT_TIMESTAMP | Last update |

#### **Case Table Headers and Actions**
| Header | Field | Type | Actions Available |
|--------|--------|------|-------------------|
| Case Number | case_number | Text | View Details |
| PDL Name | pdl.full_name | Link | Go to PDL Profile |
| Crime | crime_committed | Text | Edit |
| Court | court_assigned | Text | Update |
| Status | case_status | Badge | Update Status |
| Next Hearing | hearing_date | Date | Schedule |
| Bail Status | bail_status | Badge | Update |
| Actions | - | Buttons | Edit, Documents, Schedule, Print |

#### **Case CRUD Operations**

##### **CREATE Operation**
**Frontend Flow:**
```
Select PDL → Click "Add Case" → Case Form Opens → Fill Case Details → 
Select Court → Upload Documents → Set Hearing Date → Validate → 
Submit → Show Success → Refresh Case List
```

**Backend Flow:**
```
Receive POST Request → Validate User Permissions → Link to PDL → 
Insert Case Record → Generate Case Number → Upload Documents → 
Schedule Notifications → Log Activity → Return Success
```

##### **READ Operation**
**Frontend Flow:**
```
Load Cases Module → Send GET Request → Display Case List → 
Apply Filters (PDL, Court, Status) → Enable Search → Show Details on Click
```

**Backend Flow:**
```
Receive GET Request → Check Access Rights → Join PDL Data → 
Build Filtered Query → Execute Query → Format Response → Return JSON
```

##### **UPDATE Operation**
**Frontend Flow:**
```
Click Edit Case → Load Case Data → Modify Fields → Update Status → 
Upload New Documents → Submit Changes → Show Loading → Update List
```

**Backend Flow:**
```
Receive PUT Request → Validate Permissions → Update Case Record → 
Handle Document Uploads → Update Hearing Schedule → Log Changes → 
Send Notifications → Return Updated Data
```

##### **DELETE Operation**
**Frontend Flow:**
```
Click Delete Case → Warning Dialog → Confirm Delete → Send Request → 
Remove from List → Show Confirmation
```

**Backend Flow:**
```
Receive DELETE Request → Check Dependencies → Archive Case → 
Update Status to 'Archived' → Preserve Documents → Log Activity → 
Return Success
```

---

### **3.4 Court Orders CRUD**

#### **Court Orders Table Structure**
| Field Name | Data Type | Length | Constraints | Description |
|------------|-----------|--------|-------------|-------------|
| order_id | INT | - | PRIMARY KEY, AUTO_INCREMENT | Unique order identifier |
| case_id | INT | - | FOREIGN KEY (cases.case_id) | Associated case |
| pdl_id | INT | - | FOREIGN KEY (pdl.pdl_id) | Associated PDL |
| order_type | ENUM | - | ('Commitment','Transfer','Release','Bail','Hearing') | Order type |
| order_number | VARCHAR | 50 | NOT NULL | Official order number |
| court_name | VARCHAR | 100 | NOT NULL | Issuing court |
| judge_name | VARCHAR | 100 | NOT NULL | Issuing judge |
| order_date | DATE | - | NOT NULL | Date of order |
| effective_date | DATE | - | NOT NULL | When order takes effect |
| expiry_date | DATE | - | NULL | Order expiration |
| document_path | VARCHAR | 255 | NOT NULL | Order document file |
| order_details | TEXT | - | NOT NULL | Order description |
| status | ENUM | - | ('Pending','Executed','Expired','Cancelled') | Order status |
| executed_by | INT | - | FOREIGN KEY (users.user_id) | User who executed |
| execution_date | DATETIME | - | NULL | When order was executed |
| remarks | TEXT | - | NULL | Additional notes |
| created_at | TIMESTAMP | - | DEFAULT CURRENT_TIMESTAMP | Record creation |
| updated_at | TIMESTAMP | - | ON UPDATE CURRENT_TIMESTAMP | Last update |

#### **Court Orders Table Headers and Actions**
| Header | Field | Type | Actions Available |
|--------|--------|------|-------------------|
| Order Number | order_number | Text | View Document |
| Type | order_type | Badge | - |
| PDL Name | pdl.full_name | Link | View Profile |
| Court | court_name | Text | - |
| Order Date | order_date | Date | Sort |
| Effective Date | effective_date | Date | Update |
| Status | status | Badge | Execute/Cancel |
| Actions | - | Buttons | View, Execute, Download, Print |

#### **Court Orders CRUD Operations**

##### **CREATE Operation**
**Frontend Flow:**
```
Select Case/PDL → Click "Add Order" → Form Opens → Select Order Type → 
Fill Details → Upload Document → Set Dates → Validate → Submit → 
Show Success → Update Orders List
```

**Backend Flow:**
```
Receive POST Request → Validate Permissions → Upload Document → 
Insert Order Record → Generate Order Number → Set Notifications → 
Update Case Status → Log Activity → Return Success
```

##### **READ Operation**
**Frontend Flow:**
```
Load Court Orders → Send GET Request → Display Orders List → 
Filter by Type/Status → Search by Order Number → Show Document Preview
```

**Backend Flow:**
```
Receive GET Request → Check Access Rights → Join Related Data → 
Execute Filtered Query → Format Response → Return Orders List
```

##### **UPDATE Operation**
**Frontend Flow:**
```
Click Edit Order → Load Data → Modify Fields → Upload New Document → 
Update Status → Submit Changes → Show Loading → Refresh List
```

**Backend Flow:**
```
Receive PUT Request → Validate Changes → Update Order Record → 
Handle Document Upload → Update Related Records → Log Activity → 
Return Updated Data
```

##### **EXECUTE Operation**
**Frontend Flow:**
```
Click Execute Order → Confirmation Dialog → Execute → Update Status → 
Generate Execution Report → Show Success → Refresh List
```

**Backend Flow:**
```
Receive EXECUTE Request → Validate Permissions → Update Order Status → 
Record Execution Details → Update PDL Status → Generate Notifications → 
Log Activity → Return Success
```

---

### **3.5 Medical Records CRUD**

#### **Medical Records Table Structure**
| Field Name | Data Type | Length | Constraints | Description |
|------------|-----------|--------|-------------|-------------|
| medical_id | INT | - | PRIMARY KEY, AUTO_INCREMENT | Unique medical record ID |
| pdl_id | INT | - | FOREIGN KEY (pdl.pdl_id) | Associated PDL |
| record_type | ENUM | - | ('Assessment','Treatment','Checkup','Emergency','Medication') | Record type |
| record_date | DATETIME | - | NOT NULL | Date of medical record |
| medical_officer | VARCHAR | 100 | NOT NULL | Medical officer name |
| chief_complaint | TEXT | - | NULL | Patient complaint |
| diagnosis | TEXT | - | NULL | Medical diagnosis |
| treatment | TEXT | - | NULL | Treatment provided |
| medications | TEXT | - | NULL | Prescribed medications |
| vital_signs | JSON | - | NULL | Blood pressure, temperature, etc. |
| medical_history | TEXT | - | NULL | Previous medical history |
| allergies | TEXT | - | NULL | Known allergies |
| special_conditions | TEXT | - | NULL | Special medical conditions |
| document_path | VARCHAR | 255 | NULL | Medical document file |
| next_checkup | DATE | - | NULL | Next scheduled checkup |
| status | ENUM | - | ('Active','Completed','Cancelled') | Record status |
| confidentiality | ENUM | - | ('Normal','Restricted','Confidential') | Access level |
| created_at | TIMESTAMP | - | DEFAULT CURRENT_TIMESTAMP | Record creation |
| updated_at | TIMESTAMP | - | ON UPDATE CURRENT_TIMESTAMP | Last update |

#### **Medical Records Table Headers and Actions**
| Header | Field | Type | Actions Available |
|--------|--------|------|-------------------|
| Date | record_date | DateTime | Sort |
| PDL Name | pdl.full_name | Link | View Profile |
| Type | record_type | Badge | Filter |
| Medical Officer | medical_officer | Text | - |
| Chief Complaint | chief_complaint | Text | View Details |
| Diagnosis | diagnosis | Text | Edit |
| Next Checkup | next_checkup | Date | Schedule |
| Status | status | Badge | Update |
| Actions | - | Buttons | View, Edit, Print, Schedule |

#### **Medical Records CRUD Operations**

##### **CREATE Operation**
**Frontend Flow:**
```
Select PDL → Click "Add Medical Record" → Medical Form Opens → 
Fill Patient Details → Enter Diagnosis → Add Medications → 
Upload Documents → Schedule Follow-up → Submit → Show Success
```

**Backend Flow:**
```
Receive POST Request → Validate Medical Staff → Insert Medical Record → 
Upload Documents → Schedule Notifications → Update PDL Health Status → 
Log Activity → Return Success
```

##### **READ Operation**
**Frontend Flow:**
```
Load Medical Records → Send GET Request → Display Records List → 
Filter by PDL/Date/Type → Search Records → Show Confidentiality Levels
```

**Backend Flow:**
```
Receive GET Request → Check Medical Access Rights → Filter by Permissions → 
Join PDL Data → Execute Query → Format Response → Return Medical Data
```

##### **UPDATE Operation**
**Frontend Flow:**
```
Click Edit Record → Load Medical Data → Modify Fields → Update Treatment → 
Add New Medications → Submit Changes → Show Loading → Update List
```

**Backend Flow:**
```
Receive PUT Request → Validate Medical Staff → Update Medical Record → 
Handle Document Updates → Log Medical Changes → Return Updated Data
```

##### **DELETE Operation**
**Frontend Flow:**
```
Click Delete Record → Confirmation Dialog → Confirm Delete → 
Archive Record → Show Success → Refresh List
```

**Backend Flow:**
```
Receive DELETE Request → Validate Permissions → Archive Medical Record → 
Maintain History → Log Activity → Return Success
```

---

### **3.6 Schedule Management CRUD**

#### **Schedules Table Structure**
| Field Name | Data Type | Length | Constraints | Description |
|------------|-----------|--------|-------------|-------------|
| schedule_id | INT | - | PRIMARY KEY, AUTO_INCREMENT | Unique schedule ID |
| pdl_id | INT | - | FOREIGN KEY (pdl.pdl_id) | Associated PDL |
| case_id | INT | - | FOREIGN KEY (cases.case_id), NULL | Associated case if court hearing |
| event_type | ENUM | - | ('Court_Hearing','Medical_Checkup','Counseling','Transfer','Visitation') | Event type |
| title | VARCHAR | 200 | NOT NULL | Event title |
| description | TEXT | - | NULL | Event description |
| location | VARCHAR | 100 | NOT NULL | Event location |
| start_datetime | DATETIME | - | NOT NULL | Event start time |
| end_datetime | DATETIME | - | NOT NULL | Event end time |
| all_day | BOOLEAN | - | DEFAULT FALSE | All day event flag |
| recurring | ENUM | - | ('None','Daily','Weekly','Monthly') | Recurring pattern |
| reminder_minutes | INT | - | DEFAULT 30 | Reminder time in minutes |
| assigned_staff | INT | - | FOREIGN KEY (users.user_id) | Assigned staff member |
| priority | ENUM | - | ('Low','Medium','High','Critical') | Event priority |
| status | ENUM | - | ('Scheduled','In_Progress','Completed','Cancelled','Rescheduled') | Event status |
| notes | TEXT | - | NULL | Additional notes |
| created_by | INT | - | FOREIGN KEY (users.user_id) | User who created |
| created_at | TIMESTAMP | - | DEFAULT CURRENT_TIMESTAMP | Record creation |
| updated_at | TIMESTAMP | - | ON UPDATE CURRENT_TIMESTAMP | Last update |

#### **Schedule Table Headers and Actions**
| Header | Field | Type | Actions Available |
|--------|--------|------|-------------------|
| Date & Time | start_datetime | DateTime | Reschedule |
| Event Type | event_type | Badge | Filter |
| PDL Name | pdl.full_name | Link | View Profile |
| Title | title | Text | Edit |
| Location | location | Text | Update |
| Assigned Staff | assigned_staff | Text | Reassign |
| Priority | priority | Badge | Change Priority |
| Status | status | Badge | Update Status |
| Actions | - | Buttons | Edit, Cancel, Complete, Reschedule |

#### **Schedule CRUD Operations**

##### **CREATE Operation**
**Frontend Flow:**
```
Click "Add Event" → Event Form Opens → Select PDL → Choose Event Type → 
Set Date/Time → Assign Location → Select Staff → Set Priority → 
Add Reminders → Submit → Show Success → Update Calendar
```

**Backend Flow:**
```
Receive POST Request → Validate Permissions → Check Schedule Conflicts → 
Insert Schedule Record → Set Reminder Notifications → Update Calendar → 
Notify Assigned Staff → Log Activity → Return Success
```

##### **READ Operation**
**Frontend Flow:**
```
Load Calendar → Send GET Request → Display Events → Apply Date Filters → 
Show Different Views (Month/Week/Day) → Color Code by Type
```

**Backend Flow:**
```
Receive GET Request → Check Access Rights → Build Date Query → 
Join Related Data → Execute Query → Format Calendar Data → Return Events
```

##### **UPDATE Operation**
**Frontend Flow:**
```
Click Edit Event → Load Event Data → Modify Details → Change Time/Date → 
Update Assignments → Submit Changes → Show Loading → Update Calendar
```

**Backend Flow:**
```
Receive PUT Request → Validate Changes → Check New Schedule Conflicts → 
Update Schedule Record → Reschedule Notifications → Log Activity → 
Return Updated Data
```

##### **DELETE/CANCEL Operation**
**Frontend Flow:**
```
Click Cancel Event → Confirmation Dialog → Provide Reason → 
Confirm Cancellation → Remove from Calendar → Show Success
```

**Backend Flow:**
```
Receive DELETE Request → Validate Permissions → Update Status to 'Cancelled' → 
Cancel Notifications → Notify Affected Staff → Log Activity → Return Success
```

---

## **4. Functional Requirements**

## **4.1 Admin Officer Modules**

### **4.1.1 Login Module**

#### **System Flow:**
```
User Access → Enter Credentials → Role Validation → Authentication Check → 
Dashboard Redirect → Session Management → Activity Logging
```

#### **Display Elements:**
- **Login Form**: Username field, password field with visibility toggle, role dropdown
- **Validation Messages**: Error alerts for incorrect credentials, field validation warnings
- **Security Features**: CAPTCHA for multiple failed attempts, password reset link
- **Interface Design**: Clean, professional layout with SCRDC branding

---

### **4.1.2 Dashboard Module**

#### **System Flow:**
```
Login Success → Fetch Real-time Data → Calculate Statistics → 
Display Summary Cards → Load Recent Activities → Show Notifications → 
Render Quick Action Links
```

#### **Display Elements:**
- **Summary Cards**: 
  - Total PDLs (current count with trend indicator)
  - Upcoming Court Hearings (today and this week)
  - Medical Events (scheduled checkups and emergencies)
  - Unread Notifications (priority and regular alerts)
- **Charts and Graphs**:
  - PDL population trends (line chart)
  - Case status distribution (pie chart)
  - Monthly admission/release statistics (bar chart)
- **Quick Action Panel**:
  - "Add New PDL" button
  - "Generate Report" dropdown
  - "View Calendar" link
  - "Pending Verifications" alert badge
- **Recent Activity Feed**: Last 10 system activities with timestamps

---

### **4.1.3 Verification Module**

#### **System Flow:**
```
Document Upload → Pending Queue → Admin Review → Document Analysis → 
Status Update → Feedback Generation → Notification to Submitter → 
Archive Decision
```

#### **Display Elements:**
- **Document Queue Table**:
  - PDL Name and ID
  - Document Type and Upload Date
  - Status Icons (Pending/Verified/Rejected)
  - Action buttons (View/Approve/Reject)
- **Document Viewer**:
  - Full document preview panel
  - Zoom and navigation controls
  - Document metadata display
- **Review Panel**:
  - Completeness checklist
  - Comment box for feedback
  - Status update buttons
  - Approval signature area
- **Filter Options**: By status, date range, document type, submitting agency

---

### **4.1.4 Profile Management Module**

#### **System Flow:**
```
Profile Access → Load Current Data → Edit Fields → Validation Check → 
Password Verification → Update Database → Confirmation Display → 
Activity Log Entry
```

#### **Display Elements:**
- **Profile Information Panel**:
  - Profile picture upload area with preview
  - Personal details form (Name, Position, Contact Info)
  - Last login information
- **Security Section**:
  - Password change form with strength indicator
  - Two-factor authentication setup
  - Active sessions display
- **Preferences**:
  - Notification settings
  - Display preferences
  - Default report formats
- **Activity History**: Recent profile changes with timestamps

---

### **4.1.5 Search Module**

#### **System Flow:**
```
Search Query Input → Apply Filters → Database Query → Result Processing → 
Display Formatting → Export Options → Save Search History
```

#### **Display Elements:**
- **Search Interface**:
  - Universal search bar with auto-complete
  - Advanced filter panel (collapsible)
  - Search history dropdown
- **Filter Options**:
  - PDL Name/Alias search
  - Case Number field
  - Detention Date range picker
  - Case Status dropdown
  - Cell Block selection
  - Court assignment filter
- **Results Table**:
  - Sortable columns (Name, Case No., Date, Status)
  - Clickable rows for detailed view
  - Bulk action checkboxes
  - Export buttons (PDF/Excel)
- **Result Statistics**: Total matches, filter summary, search time

---

### **4.1.6 PDL Overview Module**

#### **System Flow:**
```
Module Access → Load PDL List → Apply Default Filters → Display Table → 
Row Selection → Profile Loading → Tab Navigation → Data Display → 
Action Processing → Database Update → Confirmation
```

#### **Display Elements:**
- **PDL List Table**:
  - Photo thumbnails
  - Basic info (Name, Age, Case No., Status)
  - Action buttons (View/Edit/Archive)
  - Sortable columns with pagination
- **PDL Profile Tabs**:
  - **Personal Information Tab**:
    - Demographic details form
    - Identification photos gallery
    - Physical characteristics
    - Emergency contacts
  - **Court Order Tab**:
    - Document list with status
    - Upload interface
    - Court date timeline
    - Legal representative info
  - **Case Information Tab**:
    - Charges and case numbers
    - Court assignments
    - Case status timeline
    - Related documents
  - **Medical Records Tab**:
    - Health assessment summary
    - Medical documents list
    - Treatment history
    - Medical alerts
- **Action Panel**:
  - Edit profile button
  - Archive PDL option
  - Transfer request
  - Print profile summary

---

### **4.1.7 Jail Activity & Court Hearing Calendar Module**

#### **System Flow:**
```
Calendar Load → Fetch Events → Apply Color Coding → Conflict Detection → 
Event Display → User Interaction → Event Management → Schedule Update → 
Notification Trigger
```

#### **Display Elements:**
- **Calendar Interface**:
  - Month/Week/Day view toggle
  - Color-coded events by type:
    - Court Hearings (Blue)
    - Medical Checkups (Green)
    - Counseling Sessions (Orange)
    - Transfers (Red)
  - Event click popover with details
- **Event Management Panel**:
  - Add new event form
  - Event type selector
  - PDL selection dropdown
  - Date and time picker
  - Recurring event options
- **Conflict Detection**:
  - Schedule conflict alerts
  - Double-booking warnings
  - Resource availability check
- **Notification Center**:
  - Upcoming events list
  - Overdue activities alerts
  - Schedule changes notifications
- **Quick Actions**:
  - Today's schedule summary
  - Add event shortcut
  - Print calendar option

---

### **4.1.8 Report Generator Module**

#### **System Flow:**
```
Report Selection → Parameter Input → Data Query → Processing → 
Preview Generation → User Review → Format Selection → Export → 
Storage/Download → Audit Log Entry
```

#### **Display Elements:**

#### **General Report Interface**:
- **Report Type Selector**: Dropdown with all available reports
- **Parameter Panel**:
  - Date range picker
  - Filter options specific to report type
  - Output format selection (PDF/Excel)
- **Preview Area**: Report preview before generation
- **Export Controls**: Download, print, email options

#### **Specific Report Displays**:

**a. Inmates Status Report Quarterly**
- **Parameters**: Quarter selection (Q1-Q4), year picker, case type filter
- **Display**: 
  - PDL count by status (Detained/Released/Transferred)
  - Court case progress summary
  - Pending hearings list
  - Statistical charts
- **Export Options**: PDF for court submission, Excel for analysis

**b. Population of Inmates Report**
- **Parameters**: Date range, gender filter, cell block selection
- **Display**:
  - Current population count
  - Demographics breakdown (age, gender, case type)
  - Capacity utilization chart
  - Trend analysis graph
- **Export Options**: PDF for Peace and Order Committee submission

**c. Population of Drug-Related Cases Monthly Report**
- **Parameters**: Month/year selection, drug case type filter
- **Display**:
  - Drug case count by type
  - Court status breakdown
  - Monthly trend comparison
  - PDEA submission format
- **Export Options**: PDF for PDEA monthly submission

**d. Drug Clearing Status Report**
- **Parameters**: Barangay selection, request details input
- **Display**:
  - PDLs from selected barangay
  - Case status indicators (Ongoing/Under Rehabilitation/Cleared)
  - Progress timeline
  - Clearing recommendations
- **Export Options**: PDF for barangay officials

**e. PDL GCTA Report**
- **Parameters**: PDL selection, date range, GCTA status filter
- **Display**:
  - Earned time allowance summary
  - Behavior and participation logs
  - Eligibility status indicators
  - Sentence reduction calculations
- **Export Options**: PDF for warden review and court submission

---

### **4.1.9 User Management Module (Backend)**

#### **System Flow:**
```
User Request → Role Verification → Account Creation/Modification → 
Permission Assignment → Database Update → Email Notification → 
Activity Logging → Confirmation Response
```

#### **Display Elements:**
- **User List Table**:
  - User details (Name, Role, Status, Last Login)
  - Action buttons (Edit/Activate/Deactivate/Delete)
  - Status indicators (Active/Inactive/Suspended)
- **User Form**:
  - Personal information fields
  - Role assignment dropdown
  - Permission checklist
  - Account status toggle
- **Activity Monitor**:
  - User login history
  - Action logs by user
  - Failed login attempts
  - Session management

---

### **4.1.10 Activity Logs Module**

#### **System Flow:**
```
System Action → Log Generation → Data Categorization → Database Storage → 
Search/Filter Request → Log Retrieval → Display Formatting → Export Option
```

#### **Display Elements:**
- **Log Viewer Table**:
  - Timestamp, User, Action, Module, Result columns
  - Color-coded action types (Create/Update/Delete/Login)
  - Detailed action description
- **Filter Panel**:
  - Date range selector
  - User filter dropdown
  - Action type checkboxes
  - Module selection
- **Search Function**: Full-text search within log entries
- **Export Options**: Export filtered logs to PDF/Excel

---

## **4.2 Records Officer Modules**

### **4.2.1 Login Module**
*(Same as Admin Officer with role-specific validation)*

#### **System Flow:**
```
Records Officer Access → Credential Validation → Role Check → 
Limited Dashboard Access → Session Creation
```

#### **Display Elements:**
- Same login interface but with Records Officer role pre-selected
- Role-specific welcome message
- Limited feature access notifications

---

### **3.2.2 Dashboard Module**

#### **System Flow:**
```
Login → Load Records Officer Data → Display Operational Metrics → 
Show Assigned Tasks → Load Quick Actions → Display Notifications
```

#### **Display Elements:**
- **Operational Summary Cards**:
  - Assigned PDLs count
  - Pending document reviews
  - Today's court schedules
  - Overdue tasks
- **Task List**:
  - Document verification queue
  - Schedule updates needed
  - Archive requests
- **Quick Actions**:
  - Add new PDL
  - Update existing records
  - View calendar
  - Generate reports (limited set)

---

### **3.2.3 PDL Management Module**

#### **System Flow:**
```
PDL Selection → Profile Loading → Tab Navigation → Data Entry/Update → 
Validation → Database Update → Notification Generation → Confirmation
```

#### **Display Elements:**
*(Similar to Admin Officer PDL Overview but with limited administrative functions)*
- **PDL List**: Same table structure without delete/transfer options
- **Profile Tabs**: Same information display with edit restrictions
- **Limited Actions**: Edit personal info, update case status, add documents

---

### **3.2.4 Scheduling Module**

#### **System Flow:**
```
Calendar Access → Event Loading → Schedule Entry → Conflict Check → 
Notification Setup → Database Update → Confirmation Display
```

#### **Display Elements:**
- Same calendar interface as Admin Officer
- Limited to adding/editing events (cannot delete system-critical events)
- Focus on court hearings and medical appointments

---

## **3.3 Municipal Jails and Law Enforcement Modules**

### **3.3.1 Login Module**

#### **System Flow:**
```
Agency Access → Agency Verification → User Authentication → 
Limited Dashboard Access → Session Management
```

#### **Display Elements:**
- **Agency Selection**: Dropdown for selecting municipal jail or law enforcement agency
- **Officer Authentication**: Username/password specific to agency
- **Limited Interface**: Simplified design focused on data submission

---

### **3.3.2 Dashboard Module**

#### **System Flow:**
```
Login → Load Agency Data → Display Submission Status → 
Show Recent Transfers → Load Action Items
```

#### **Display Elements:**
- **Submission Status Panel**:
  - Pending submissions count
  - Completed transfers
  - Rejected submissions with reasons
- **Recent Activity**:
  - Last 10 PDL transfers
  - Status updates from SCRDC
- **Quick Actions**:
  - Submit new PDL
  - Check transfer status
  - Update profile

---

### **3.3.3 PDL Transfer Module**

#### **System Flow:**
```
New Transfer → PDL Information Entry → Document Upload → 
Validation Check → Submission Queue → SCRDC Notification → 
Status Tracking → Completion Confirmation
```

#### **Display Elements:**

#### **Main Transfer Form Interface**:
- **Progress Indicator**: Step-by-step completion tracker
- **Tab Navigation**: Easy switching between information sections

#### **Personal Information Tab**:
- **Basic Details Form**:
  - Full name and alias fields
  - Date of birth picker
  - Gender, age, civil status dropdowns
  - Ethnicity and address fields
- **Validation Indicators**: Real-time field validation with checkmarks
- **Photo Upload**: Mugshot upload with preview
- **Completion Checklist**: Required fields tracker

#### **Cell Assignment Tab**:
- **Available Cells Display**: Grid showing cell availability
- **Assignment Interface**: Drag-and-drop or click-to-assign
- **Capacity Information**: Current occupancy vs. maximum capacity
- **Special Requirements**: Medical or security considerations

#### **Court Order Tab**:
- **Document Upload Interface**:
  - Drag-and-drop file upload area
  - Document type selector (Commitment Order, Warrant, etc.)
  - File preview thumbnail
- **Document Checklist**: Required documents with status
- **Remarks Field**: Additional notes or references
- **Validation Status**: Document completeness indicator

#### **Case Information Tab**:
- **Case Details Form**:
  - Case number field
  - Crime/charges dropdown with search
  - Court assignment selection
  - Case status indicator
- **Legal Information**:
  - Arresting officer details
  - Date of arrest
  - Location of arrest
- **Document Linking**: Attach case-related documents

#### **Medical Records Tab**:
- **Initial Medical Information**:
  - Basic health status checkboxes
  - Known medical conditions
  - Medication requirements
- **Document Upload**:
  - Medical clearance upload
  - Hospital reports attachment
  - Medical certificate submission
- **Health Alerts**: Special medical requirements or restrictions

#### **Health Assessment Tab**:
- **Pre-admission Assessment Form**:
  - Mental health screening checklist
  - Substance abuse history
  - Risk assessment indicators
- **Assessment Notes**: Free-text area for detailed observations
- **Document Attachment**: Supporting assessment documents
- **Review Status**: Indicates if assessment is complete

#### **Submission Interface**:
- **Review Summary**: All entered information overview
- **Validation Report**: Missing or incorrect information alerts
- **Submission Button**: Final submission with confirmation dialog
- **Status Tracking**: Real-time submission status updates

---

### **3.3.4 Status Tracking Module**

#### **System Flow:**
```
Submission Complete → Status Monitoring → SCRDC Processing → 
Status Updates → Notification Generation → Completion Confirmation
```

#### **Display Elements:**
- **Transfer Status Table**:
  - PDL name and submission date
  - Current status (Submitted/Under Review/Approved/Rejected)
  - SCRDC feedback/comments
  - Action required indicators
- **Status Details Panel**:
  - Detailed processing timeline
  - Document verification status
  - Required corrections or additions
- **Communication Panel**:
  - Messages from SCRDC
  - Response submission area
  - File attachment for corrections

---

**Document Version**: 2.0  
**Last Updated**: August 2025  
**Focus**: RBAC, Functional Requirements, System Flows, and Display Specifications


![PDL Process Flow](images/pdl-process-flow.png)

### Editable Diagram
The editable system diagram is available in [`docs/diagrams/system_flow.drawio`](docs/diagrams/system_flow.drawio).
You can open it with [draw.io](https://app.diagrams.net).

