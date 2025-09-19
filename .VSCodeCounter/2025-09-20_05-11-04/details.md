# Details

Date : 2025-09-20 05:11:04

Directory c:\\xampp\\htdocs\\pdl-is

Total : 411 files,  58779 codes, 2420 comments, 4712 blanks, all 65911 lines

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [.github/workflows/lint.yml](/.github/workflows/lint.yml) | YAML | 31 | 5 | 10 | 46 |
| [.github/workflows/tests.yml](/.github/workflows/tests.yml) | YAML | 39 | 0 | 12 | 51 |
| [.prettierignore](/.prettierignore) | Ignore | 3 | 0 | 1 | 4 |
| [.prettierrc](/.prettierrc) | JSON | 19 | 0 | 1 | 20 |
| [app/Console/Commands/CleanupLoginAttempts.php](/app/Console/Commands/CleanupLoginAttempts.php) | PHP | 17 | 13 | 10 | 40 |
| [app/Console/Commands/SendPdlReminders.php](/app/Console/Commands/SendPdlReminders.php) | PHP | 24 | 14 | 11 | 49 |
| [app/Http/Controllers/Admin/CourtHearingCalendarController.php](/app/Http/Controllers/Admin/CourtHearingCalendarController.php) | PHP | 37 | 0 | 8 | 45 |
| [app/Http/Controllers/Admin/ProfileManagementController.php](/app/Http/Controllers/Admin/ProfileManagementController.php) | PHP | 38 | 0 | 14 | 52 |
| [app/Http/Controllers/Admin/UserManagementController.php](/app/Http/Controllers/Admin/UserManagementController.php) | PHP | 113 | 0 | 31 | 144 |
| [app/Http/Controllers/Admin/VerificationController.php](/app/Http/Controllers/Admin/VerificationController.php) | PHP | 91 | 1 | 12 | 104 |
| [app/Http/Controllers/Auth/AuthController.php](/app/Http/Controllers/Auth/AuthController.php) | PHP | 64 | 0 | 21 | 85 |
| [app/Http/Controllers/CaseInformationController.php](/app/Http/Controllers/CaseInformationController.php) | PHP | 62 | 1 | 13 | 76 |
| [app/Http/Controllers/CellAssignmentController.php](/app/Http/Controllers/CellAssignmentController.php) | PHP | 123 | 3 | 30 | 156 |
| [app/Http/Controllers/CertificateController.php](/app/Http/Controllers/CertificateController.php) | PHP | 176 | 37 | 39 | 252 |
| [app/Http/Controllers/Controller.php](/app/Http/Controllers/Controller.php) | PHP | 5 | 1 | 3 | 9 |
| [app/Http/Controllers/CustodyController.php](/app/Http/Controllers/CustodyController.php) | PHP | 41 | 4 | 9 | 54 |
| [app/Http/Controllers/DashboardController.php](/app/Http/Controllers/DashboardController.php) | PHP | 671 | 43 | 58 | 772 |
| [app/Http/Controllers/LawEnforcement/ProfileManagementController.php](/app/Http/Controllers/LawEnforcement/ProfileManagementController.php) | PHP | 11 | 0 | 6 | 17 |
| [app/Http/Controllers/MedicalDocumentController.php](/app/Http/Controllers/MedicalDocumentController.php) | PHP | 6 | 1 | 4 | 11 |
| [app/Http/Controllers/MedicalRecordController.php](/app/Http/Controllers/MedicalRecordController.php) | PHP | 81 | 0 | 16 | 97 |
| [app/Http/Controllers/NotificationController.php](/app/Http/Controllers/NotificationController.php) | PHP | 17 | 1 | 7 | 25 |
| [app/Http/Controllers/PdlAlertController.php](/app/Http/Controllers/PdlAlertController.php) | PHP | 144 | 30 | 30 | 204 |
| [app/Http/Controllers/PdlArchiveController.php](/app/Http/Controllers/PdlArchiveController.php) | PHP | 99 | 19 | 23 | 141 |
| [app/Http/Controllers/PhysicalCharacteristicController.php](/app/Http/Controllers/PhysicalCharacteristicController.php) | PHP | 89 | 0 | 16 | 105 |
| [app/Http/Controllers/RecordOfficer/JailEventsController.php](/app/Http/Controllers/RecordOfficer/JailEventsController.php) | PHP | 49 | 1 | 12 | 62 |
| [app/Http/Controllers/RecordOfficer/PDLArchiveController.php](/app/Http/Controllers/RecordOfficer/PDLArchiveController.php) | PHP | 12 | 0 | 5 | 17 |
| [app/Http/Controllers/RecordOfficer/PDLManagementController.php](/app/Http/Controllers/RecordOfficer/PDLManagementController.php) | PHP | 496 | 18 | 63 | 577 |
| [app/Http/Controllers/RecordOfficer/ProfileManagementController.php](/app/Http/Controllers/RecordOfficer/ProfileManagementController.php) | PHP | 39 | 0 | 14 | 53 |
| [app/Http/Controllers/ReportController.php](/app/Http/Controllers/ReportController.php) | PHP | 1,556 | 69 | 266 | 1,891 |
| [app/Http/Controllers/SearchController.php](/app/Http/Controllers/SearchController.php) | PHP | 262 | 12 | 23 | 297 |
| [app/Http/Controllers/SearchResultsController.php](/app/Http/Controllers/SearchResultsController.php) | PHP | 307 | 9 | 35 | 351 |
| [app/Http/Controllers/SearchTestController.php](/app/Http/Controllers/SearchTestController.php) | PHP | 26 | 1 | 5 | 32 |
| [app/Http/Controllers/TimeAllowanceController.php](/app/Http/Controllers/TimeAllowanceController.php) | PHP | 145 | 1 | 21 | 167 |
| [app/Http/Controllers/UserPDLArchiveController.php](/app/Http/Controllers/UserPDLArchiveController.php) | PHP | 96 | 1 | 14 | 111 |
| [app/Http/Middleware/Authenticate.php](/app/Http/Middleware/Authenticate.php) | PHP | 22 | 7 | 6 | 35 |
| [app/Http/Middleware/EnsureUserIsAdmin.php](/app/Http/Middleware/EnsureUserIsAdmin.php) | PHP | 35 | 10 | 9 | 54 |
| [app/Http/Middleware/EnsureUserIsLawEnforcement.php](/app/Http/Middleware/EnsureUserIsLawEnforcement.php) | PHP | 35 | 10 | 9 | 54 |
| [app/Http/Middleware/EnsureUserIsRecordOfficer.php](/app/Http/Middleware/EnsureUserIsRecordOfficer.php) | PHP | 35 | 10 | 9 | 54 |
| [app/Http/Middleware/HandleAppearance.php](/app/Http/Middleware/HandleAppearance.php) | PHP | 14 | 5 | 5 | 24 |
| [app/Http/Middleware/HandleInertiaRequests.php](/app/Http/Middleware/HandleInertiaRequests.php) | PHP | 33 | 19 | 7 | 59 |
| [app/Http/Middleware/ShareNotifications.php](/app/Http/Middleware/ShareNotifications.php) | PHP | 102 | 11 | 14 | 127 |
| [app/Http/Requests/Auth/LoginRequest.php](/app/Http/Requests/Auth/LoginRequest.php) | PHP | 72 | 31 | 21 | 124 |
| [app/Http/Requests/CreateCellRequest.php](/app/Http/Requests/CreateCellRequest.php) | PHP | 37 | 0 | 10 | 47 |
| [app/Http/Requests/CreatePDLOnePageRequest.php](/app/Http/Requests/CreatePDLOnePageRequest.php) | PHP | 133 | 10 | 18 | 161 |
| [app/Http/Requests/EditCellRequest.php](/app/Http/Requests/EditCellRequest.php) | PHP | 32 | 0 | 6 | 38 |
| [app/Http/Requests/PDL/CreatePdlRequest.php](/app/Http/Requests/PDL/CreatePdlRequest.php) | PHP | 52 | 0 | 16 | 68 |
| [app/Http/Requests/PDL/TransferRequest.php](/app/Http/Requests/PDL/TransferRequest.php) | PHP | 27 | 8 | 6 | 41 |
| [app/Http/Requests/Profile/CreateUserRequest.php](/app/Http/Requests/Profile/CreateUserRequest.php) | PHP | 55 | 14 | 7 | 76 |
| [app/Http/Requests/Profile/UpdateProfileRequest.php](/app/Http/Requests/Profile/UpdateProfileRequest.php) | PHP | 43 | 8 | 11 | 62 |
| [app/Http/Requests/Settings/ProfileUpdateRequest.php](/app/Http/Requests/Settings/ProfileUpdateRequest.php) | PHP | 23 | 5 | 5 | 33 |
| [app/Http/Requests/StoreCellAssignmentRequest.php](/app/Http/Requests/StoreCellAssignmentRequest.php) | PHP | 15 | 9 | 5 | 29 |
| [app/Http/Requests/UpdateUserRequest.php](/app/Http/Requests/UpdateUserRequest.php) | PHP | 42 | 0 | 8 | 50 |
| [app/Models/Activity.php](/app/Models/Activity.php) | PHP | 19 | 0 | 7 | 26 |
| [app/Models/CaseInformation.php](/app/Models/CaseInformation.php) | PHP | 28 | 0 | 8 | 36 |
| [app/Models/CellAssignment.php](/app/Models/CellAssignment.php) | PHP | 24 | 0 | 8 | 32 |
| [app/Models/Cells.php](/app/Models/Cells.php) | PHP | 23 | 0 | 7 | 30 |
| [app/Models/Certificate.php](/app/Models/Certificate.php) | PHP | 144 | 54 | 31 | 229 |
| [app/Models/CourtOrder.php](/app/Models/CourtOrder.php) | PHP | 33 | 0 | 8 | 41 |
| [app/Models/LoginAttempt.php](/app/Models/LoginAttempt.php) | PHP | 85 | 21 | 25 | 131 |
| [app/Models/MedicalDocument.php](/app/Models/MedicalDocument.php) | PHP | 29 | 0 | 7 | 36 |
| [app/Models/MedicalRecord.php](/app/Models/MedicalRecord.php) | PHP | 31 | 0 | 9 | 40 |
| [app/Models/PasswordReset.php](/app/Models/PasswordReset.php) | PHP | 17 | 0 | 7 | 24 |
| [app/Models/Pdl.php](/app/Models/Pdl.php) | PHP | 147 | 11 | 31 | 189 |
| [app/Models/PdlAlert.php](/app/Models/PdlAlert.php) | PHP | 74 | 4 | 14 | 92 |
| [app/Models/Personnel.php](/app/Models/Personnel.php) | PHP | 73 | 0 | 11 | 84 |
| [app/Models/PhysicalCharacteristic.php](/app/Models/PhysicalCharacteristic.php) | PHP | 25 | 0 | 7 | 32 |
| [app/Models/SystemNotification.php](/app/Models/SystemNotification.php) | PHP | 33 | 0 | 12 | 45 |
| [app/Models/SystemNotificationReadBy.php](/app/Models/SystemNotificationReadBy.php) | PHP | 22 | 0 | 9 | 31 |
| [app/Models/TimeAllowance.php](/app/Models/TimeAllowance.php) | PHP | 25 | 0 | 8 | 33 |
| [app/Models/Verifications.php](/app/Models/Verifications.php) | PHP | 28 | 0 | 7 | 35 |
| [app/Providers/AppServiceProvider.php](/app/Providers/AppServiceProvider.php) | PHP | 19 | 6 | 7 | 32 |
| [app/Services/CertificateService.php](/app/Services/CertificateService.php) | PHP | 170 | 44 | 40 | 254 |
| [app/Services/NotificationService.php](/app/Services/NotificationService.php) | PHP | 408 | 75 | 52 | 535 |
| [bootstrap/app.php](/bootstrap/app.php) | PHP | 35 | 2 | 5 | 42 |
| [bootstrap/providers.php](/bootstrap/providers.php) | PHP | 4 | 0 | 3 | 7 |
| [components.json](/components.json) | JSON | 21 | 0 | 1 | 22 |
| [composer.json](/composer.json) | JSON | 87 | 0 | 1 | 88 |
| [composer.lock](/composer.lock) | JSON | 9,527 | 0 | 1 | 9,528 |
| [config/app.php](/config/app.php) | PHP | 22 | 82 | 23 | 127 |
| [config/auth.php](/config/auth.php) | PHP | 28 | 74 | 14 | 116 |
| [config/cache.php](/config/cache.php) | PHP | 57 | 34 | 18 | 109 |
| [config/database.php](/config/database.php) | PHP | 109 | 43 | 23 | 175 |
| [config/filesystems.php](/config/filesystems.php) | PHP | 36 | 32 | 13 | 81 |
| [config/inertia.php](/config/inertia.php) | PHP | 21 | 23 | 12 | 56 |
| [config/logging.php](/config/logging.php) | PHP | 79 | 33 | 21 | 133 |
| [config/mail.php](/config/mail.php) | PHP | 55 | 43 | 19 | 117 |
| [config/queue.php](/config/queue.php) | PHP | 52 | 44 | 17 | 113 |
| [config/services.php](/config/services.php) | PHP | 20 | 11 | 8 | 39 |
| [config/session.php](/config/session.php) | PHP | 23 | 160 | 35 | 218 |
| [database/factories/UserFactory.php](/database/factories/UserFactory.php) | PHP | 25 | 14 | 6 | 45 |
| [database/migrations/0001\_01\_01\_000000\_create\_users\_table.php](/database/migrations/0001_01_01_000000_create_users_table.php) | PHP | 24 | 6 | 5 | 35 |
| [database/migrations/0001\_01\_01\_000001\_create\_cache\_table.php](/database/migrations/0001_01_01_000001_create_cache_table.php) | PHP | 25 | 6 | 5 | 36 |
| [database/migrations/0001\_01\_01\_000002\_create\_jobs\_table.php](/database/migrations/0001_01_01_000002_create_jobs_table.php) | PHP | 46 | 6 | 6 | 58 |
| [database/migrations/2025\_06\_30\_024800\_personnel.php](/database/migrations/2025_06_30_024800_personnel.php) | PHP | 28 | 6 | 6 | 40 |
| [database/migrations/2025\_07\_12\_193317\_create\_personal\_information\_table.php](/database/migrations/2025_07_12_193317_create_personal_information_table.php) | PHP | 36 | 0 | 6 | 42 |
| [database/migrations/2025\_07\_14\_011931\_add\_user\_status.php](/database/migrations/2025_07_14_011931_add_user_status.php) | PHP | 16 | 7 | 4 | 27 |
| [database/migrations/2025\_07\_20\_163428\_add-cell-assignment.php](/database/migrations/2025_07_20_163428_add-cell-assignment.php) | PHP | 30 | 7 | 7 | 44 |
| [database/migrations/2025\_07\_20\_182009\_add-court-order.php](/database/migrations/2025_07_20_182009_add-court-order.php) | PHP | 27 | 7 | 4 | 38 |
| [database/migrations/2025\_07\_20\_205501\_add-case-information.php](/database/migrations/2025_07_20_205501_add-case-information.php) | PHP | 56 | 7 | 8 | 71 |
| [database/migrations/2025\_08\_11\_155343\_activity.php](/database/migrations/2025_08_11_155343_activity.php) | PHP | 25 | 6 | 7 | 38 |
| [database/migrations/2025\_08\_12\_065404\_add-verification.php](/database/migrations/2025_08_12_065404_add-verification.php) | PHP | 32 | 3 | 5 | 40 |
| [database/migrations/2025\_08\_15\_145929\_update-personnel.php](/database/migrations/2025_08_15_145929_update-personnel.php) | PHP | 18 | 6 | 4 | 28 |
| [database/migrations/2025\_08\_15\_154308\_system-notification.php](/database/migrations/2025_08_15_154308_system-notification.php) | PHP | 36 | 6 | 5 | 47 |
| [database/migrations/2025\_08\_22\_204000\_time\_allowances.php](/database/migrations/2025_08_22_204000_time_allowances.php) | PHP | 24 | 0 | 4 | 28 |
| [database/migrations/2025\_09\_12\_085038\_add-forgot-password.php](/database/migrations/2025_09_12_085038_add-forgot-password.php) | PHP | 21 | 7 | 7 | 35 |
| [database/migrations/2025\_09\_16\_175912\_add\_notification\_type\_to\_system\_notifications\_table.php](/database/migrations/2025_09_16_175912_add_notification_type_to_system_notifications_table.php) | PHP | 20 | 6 | 4 | 30 |
| [database/migrations/2025\_09\_16\_183719\_add\_timestamps\_to\_system\_notifications\_read\_by\_table.php](/database/migrations/2025_09_16_183719_add_timestamps_to_system_notifications_read_by_table.php) | PHP | 19 | 6 | 4 | 29 |
| [database/migrations/2025\_09\_16\_184015\_add\_gender\_to\_cells\_table.php](/database/migrations/2025_09_16_184015_add_gender_to_cells_table.php) | PHP | 19 | 6 | 4 | 29 |
| [database/migrations/2025\_09\_16\_184225\_update\_cells\_gender\_enum\_to\_male\_female\_only.php](/database/migrations/2025_09_16_184225_update_cells_gender_enum_to_male_female_only.php) | PHP | 21 | 8 | 5 | 34 |
| [database/migrations/2025\_09\_16\_185315\_create\_pdl\_alerts\_table.php](/database/migrations/2025_09_16_185315_create_pdl_alerts_table.php) | PHP | 29 | 6 | 4 | 39 |
| [database/migrations/2025\_09\_16\_191732\_add\_drug\_related\_to\_case\_information\_table.php](/database/migrations/2025_09_16_191732_add_drug_related_to_case_information_table.php) | PHP | 19 | 6 | 4 | 29 |
| [database/migrations/2025\_09\_16\_192900\_create\_medical\_documents\_table.php](/database/migrations/2025_09_16_192900_create_medical_documents_table.php) | PHP | 27 | 6 | 4 | 37 |
| [database/migrations/2025\_09\_16\_195725\_add\_document\_path\_to\_court\_orders\_table.php](/database/migrations/2025_09_16_195725_add_document_path_to_court_orders_table.php) | PHP | 20 | 6 | 4 | 30 |
| [database/migrations/2025\_09\_16\_203245\_create\_login\_attempts\_table.php](/database/migrations/2025_09_16_203245_create_login_attempts_table.php) | PHP | 24 | 7 | 5 | 36 |
| [database/migrations/2025\_09\_16\_204048\_create\_certificates\_table.php](/database/migrations/2025_09_16_204048_create_certificates_table.php) | PHP | 43 | 7 | 5 | 55 |
| [database/migrations/2025\_09\_16\_223030\_add\_archiving\_fields\_to\_pdls\_table.php](/database/migrations/2025_09_16_223030_add_archiving_fields_to_pdls_table.php) | PHP | 45 | 6 | 5 | 56 |
| [database/migrations/2025\_09\_16\_224304\_add\_court\_order\_fields\_to\_pdl\_table.php](/database/migrations/2025_09_16_224304_add_court_order_fields_to_pdl_table.php) | PHP | 13 | 13 | 4 | 30 |
| [database/migrations/2025\_09\_16\_225139\_move\_archiving\_fields\_to\_case\_information\_table.php](/database/migrations/2025_09_16_225139_move_archiving_fields_to_case_information_table.php) | PHP | 75 | 10 | 8 | 93 |
| [database/migrations/2025\_09\_16\_225451\_move\_archiving\_fields\_to\_court\_orders\_table.php](/database/migrations/2025_09_16_225451_move_archiving_fields_to_court_orders_table.php) | PHP | 73 | 10 | 8 | 91 |
| [database/migrations/2025\_09\_19\_181009\_add\_archive\_fields\_to\_pdl\_table.php](/database/migrations/2025_09_19_181009_add_archive_fields_to_pdl_table.php) | PHP | 35 | 6 | 5 | 46 |
| [database/migrations/2025\_09\_19\_182031\_add\_court\_order\_fields\_to\_pdl\_archive.php](/database/migrations/2025_09_19_182031_add_court_order_fields_to_pdl_archive.php) | PHP | 35 | 6 | 5 | 46 |
| [database/migrations/2025\_09\_19\_194756\_make\_pdl\_id\_nullable\_in\_system\_notifications\_table.php](/database/migrations/2025_09_19_194756_make_pdl_id_nullable_in_system_notifications_table.php) | PHP | 17 | 8 | 4 | 29 |
| [database/schema/mysql-schema.sql](/database/schema/mysql-schema.sql) | MS SQL | 370 | 0 | 3 | 373 |
| [database/seeders/DatabaseSeeder.php](/database/seeders/DatabaseSeeder.php) | PHP | 11 | 4 | 4 | 19 |
| [database/seeders/PersonnelSeeder.php](/database/seeders/PersonnelSeeder.php) | PHP | 27 | 29 | 7 | 63 |
| [docs/database/database documentation.md](/docs/database/database%20documentation.md) | Markdown | 384 | 0 | 60 | 444 |
| [docs/global-search-system.md](/docs/global-search-system.md) | Markdown | 185 | 0 | 53 | 238 |
| [docs/law-enforcement-dashboard.md](/docs/law-enforcement-dashboard.md) | Markdown | 148 | 0 | 44 | 192 |
| [docs/middleware-protection.md](/docs/middleware-protection.md) | Markdown | 104 | 0 | 27 | 131 |
| [docs/system-requirement.md](/docs/system-requirement.md) | Markdown | 1,020 | 0 | 190 | 1,210 |
| [eslint.config.js](/eslint.config.js) | JavaScript | 42 | 1 | 2 | 45 |
| [package-lock.json](/package-lock.json) | JSON | 10,033 | 0 | 1 | 10,034 |
| [package.json](/package.json) | JSON | 82 | 0 | 1 | 83 |
| [phpunit.xml](/phpunit.xml) | XML | 33 | 0 | 1 | 34 |
| [public/build/assets/PieChart-9VGzp2I5.js](/public/build/assets/PieChart-9VGzp2I5.js) | JavaScript | 67 | 11 | 1 | 79 |
| [public/build/assets/accordion-CWJVgog7.js](/public/build/assets/accordion-CWJVgog7.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/alert-Cr1nbU3H.js](/public/build/assets/alert-Cr1nbU3H.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/app-B6Uqmd67.css](/public/build/assets/app-B6Uqmd67.css) | CSS | 1 | 0 | 1 | 2 |
| [public/build/assets/app-D7sJuwJc.js](/public/build/assets/app-D7sJuwJc.js) | JavaScript | 76 | 35 | 13 | 124 |
| [public/build/assets/app-layout-l1YM3YbX.js](/public/build/assets/app-layout-l1YM3YbX.js) | JavaScript | 46 | 32 | 8 | 86 |
| [public/build/assets/appearance-B993ZYZk.js](/public/build/assets/appearance-B993ZYZk.js) | JavaScript | 4 | 12 | 1 | 17 |
| [public/build/assets/archive-C-v6ttJl.js](/public/build/assets/archive-C-v6ttJl.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/archive-DF7wGM0K.js](/public/build/assets/archive-DF7wGM0K.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/archived-BxhXcYX6.js](/public/build/assets/archived-BxhXcYX6.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/arrow-left-DfiAP-S2.js](/public/build/assets/arrow-left-DfiAP-S2.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/badge-C-b1LAND.js](/public/build/assets/badge-C-b1LAND.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/button-u9ZiHX7C.js](/public/build/assets/button-u9ZiHX7C.js) | JavaScript | 5 | 16 | 1 | 22 |
| [public/build/assets/calendar-2ukcrKyw.js](/public/build/assets/calendar-2ukcrKyw.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/card-DLWDwqHf.js](/public/build/assets/card-DLWDwqHf.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/case-information-DQiBFTjF.js](/public/build/assets/case-information-DQiBFTjF.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/cell-assignment-0Iw3wnF1.js](/public/build/assets/cell-assignment-0Iw3wnF1.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/cell-management-CDnBtwpe.js](/public/build/assets/cell-management-CDnBtwpe.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/certificate-of-detention-Dv\_dsBXH.js](/public/build/assets/certificate-of-detention-Dv_dsBXH.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/checkbox-sZP-Rulp.js](/public/build/assets/checkbox-sZP-Rulp.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/command-cggK63BW.js](/public/build/assets/command-cggK63BW.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/court-order-sVuqGVmP.js](/public/build/assets/court-order-sVuqGVmP.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/create-CB62wW8z.js](/public/build/assets/create-CB62wW8z.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/create-event-C7SFgDEz.js](/public/build/assets/create-event-C7SFgDEz.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/create-pdl-information-BAfTGMAf.js](/public/build/assets/create-pdl-information-BAfTGMAf.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/dashboard-BD-GlSth.js](/public/build/assets/dashboard-BD-GlSth.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/dashboard-BM4yjk0C.js](/public/build/assets/dashboard-BM4yjk0C.js) | JavaScript | 3 | 8 | 1 | 12 |
| [public/build/assets/dashboard-D6LDuMJR.js](/public/build/assets/dashboard-D6LDuMJR.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/data-table-Cnc7GZMm.js](/public/build/assets/data-table-Cnc7GZMm.js) | JavaScript | 6 | 16 | 1 | 23 |
| [public/build/assets/dateUtils-Iw3XMDmk.js](/public/build/assets/dateUtils-Iw3XMDmk.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/detail-oeYKesmf.js](/public/build/assets/detail-oeYKesmf.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/download-BKqJGcMM.js](/public/build/assets/download-BKqJGcMM.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/dropdown-menu-BQjRxx1t.js](/public/build/assets/dropdown-menu-BQjRxx1t.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/drug-clearing-certificate-ZD9r5g5Q.js](/public/build/assets/drug-clearing-certificate-ZD9r5g5Q.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/drug-related-cases-monthly-D6xgn0xF.js](/public/build/assets/drug-related-cases-monthly-D6xgn0xF.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/eye-B8lowLFn.js](/public/build/assets/eye-B8lowLFn.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/eye-off-COyWUic6.js](/public/build/assets/eye-off-COyWUic6.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/forgot-password-D8ndBohQ.js](/public/build/assets/forgot-password-D8ndBohQ.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/format-B3rlCQGj.js](/public/build/assets/format-B3rlCQGj.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/gcta-tastm-report-AME5nrgP.js](/public/build/assets/gcta-tastm-report-AME5nrgP.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/health-assessment-D4AH\_V49.js](/public/build/assets/health-assessment-D4AH_V49.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/index-BFvJa6MF.js](/public/build/assets/index-BFvJa6MF.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/index-BHiRKjcJ.js](/public/build/assets/index-BHiRKjcJ.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/index-D790qEjM.js](/public/build/assets/index-D790qEjM.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/index-LOQAaJzy.js](/public/build/assets/index-LOQAaJzy.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/inmates-status-BeJTxs57.js](/public/build/assets/inmates-status-BeJTxs57.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/inmates-status-daily-C91\_7lPc.js](/public/build/assets/inmates-status-daily-C91_7lPc.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/input-BS\_xsQ9S.js](/public/build/assets/input-BS_xsQ9S.js) | JavaScript | 3 | 8 | 1 | 12 |
| [public/build/assets/input-error-Cvw2w7NP.js](/public/build/assets/input-error-Cvw2w7NP.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/jail-events-tkt2pR3N.js](/public/build/assets/jail-events-tkt2pR3N.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/label-Br4WJ6FG.js](/public/build/assets/label-Br4WJ6FG.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/layout-BO4G7KCG.js](/public/build/assets/layout-BO4G7KCG.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/list-3g7MBLxu.js](/public/build/assets/list-3g7MBLxu.js) | JavaScript | 3 | 8 | 1 | 12 |
| [public/build/assets/list-C1m4wjk5.js](/public/build/assets/list-C1m4wjk5.js) | JavaScript | 3 | 8 | 1 | 12 |
| [public/build/assets/list-DTRpSB\_L.js](/public/build/assets/list-DTRpSB_L.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/list-HPlqprTJ.js](/public/build/assets/list-HPlqprTJ.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/list-of-pdl-reports-DgK254WB.js](/public/build/assets/list-of-pdl-reports-DgK254WB.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/loader-circle-D1os5qeW.js](/public/build/assets/loader-circle-D1os5qeW.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/lock-CVLeyUCs.js](/public/build/assets/lock-CVLeyUCs.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/medical-records-CZSaNN-K.js](/public/build/assets/medical-records-CZSaNN-K.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/no-records-certificate-CDYt0RTw.js](/public/build/assets/no-records-certificate-CDYt0RTw.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/password-BZINJoUq.js](/public/build/assets/password-BZINJoUq.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/pdl-archives-Bx0KXhqM.js](/public/build/assets/pdl-archives-Bx0KXhqM.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/personal-information-admin-l0rcEb\_k.js](/public/build/assets/personal-information-admin-l0rcEb_k.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/personal-information-oUiyn4we.js](/public/build/assets/personal-information-oUiyn4we.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/physical-characteristics-B98AxxwS.js](/public/build/assets/physical-characteristics-B98AxxwS.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/plus-DUoRAMYM.js](/public/build/assets/plus-DUoRAMYM.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/population-report-oQOnBEhu.js](/public/build/assets/population-report-oQOnBEhu.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/profie-Dwmf0DJb.js](/public/build/assets/profie-Dwmf0DJb.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/profile-bMD9o5q-.js](/public/build/assets/profile-bMD9o5q-.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/profile-management-BzSf09Ym.js](/public/build/assets/profile-management-BzSf09Ym.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/progress-LINHkAX9.js](/public/build/assets/progress-LINHkAX9.js) | JavaScript | 7 | 8 | 2 | 17 |
| [public/build/assets/radio-group-C7XEDH3e.js](/public/build/assets/radio-group-C7XEDH3e.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/results-CXRtBJ3Q.js](/public/build/assets/results-CXRtBJ3Q.js) | JavaScript | 3 | 8 | 1 | 12 |
| [public/build/assets/scale-DVrI9DmE.js](/public/build/assets/scale-DVrI9DmE.js) | JavaScript | 5 | 16 | 1 | 22 |
| [public/build/assets/select-BBZMYkik.js](/public/build/assets/select-BBZMYkik.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/separator-CPFO9C7\_.js](/public/build/assets/separator-CPFO9C7_.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/shield-BfSoSboW.js](/public/build/assets/shield-BfSoSboW.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/show-DpTN79ri.js](/public/build/assets/show-DpTN79ri.js) | JavaScript | 3 | 8 | 1 | 12 |
| [public/build/assets/square-pen-CejSo5qV.js](/public/build/assets/square-pen-CejSo5qV.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/table-C22pG3nj.js](/public/build/assets/table-C22pG3nj.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/tabs-B1nSmZO\_.js](/public/build/assets/tabs-B1nSmZO_.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/textarea-BmLTENgj.js](/public/build/assets/textarea-BmLTENgj.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/transition-B7SWznhX.js](/public/build/assets/transition-B7SWznhX.js) | JavaScript | 5 | 0 | 1 | 6 |
| [public/build/assets/trending-up-CQfyb\_qf.js](/public/build/assets/trending-up-CQfyb_qf.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/triangle-alert-Cfc0mhXY.js](/public/build/assets/triangle-alert-Cfc0mhXY.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/update-pdl-information-C1L0ymoB.js](/public/build/assets/update-pdl-information-C1L0ymoB.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/user-CmeQLBVE.js](/public/build/assets/user-CmeQLBVE.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/users-BxYB4q2L.js](/public/build/assets/users-BxYB4q2L.js) | JavaScript | 8 | 28 | 1 | 37 |
| [public/build/assets/view-pdl-information-ORSLFmmL.js](/public/build/assets/view-pdl-information-ORSLFmmL.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/welcome-C06BPBQw.js](/public/build/assets/welcome-C06BPBQw.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/manifest.json](/public/build/manifest.json) | JSON | 1,474 | 0 | 0 | 1,474 |
| [public/favicon.svg](/public/favicon.svg) | XML | 3 | 0 | 1 | 4 |
| [public/images/README.md](/public/images/README.md) | Markdown | 16 | 0 | 6 | 22 |
| [public/index.php](/public/index.php) | PHP | 10 | 4 | 7 | 21 |
| [public/logo.svg](/public/logo.svg) | XML | 16 | 0 | 1 | 17 |
| [resources/css/app.css](/resources/css/app.css) | CSS | 155 | 14 | 36 | 205 |
| [resources/js/app.tsx](/resources/js/app.tsx) | TypeScript JSX | 18 | 0 | 6 | 24 |
| [resources/js/components/app-content.tsx](/resources/js/components/app-content.tsx) | TypeScript JSX | 15 | 0 | 4 | 19 |
| [resources/js/components/app-header.tsx](/resources/js/components/app-header.tsx) | TypeScript JSX | 171 | 2 | 10 | 183 |
| [resources/js/components/app-logo-icon.tsx](/resources/js/components/app-logo-icon.tsx) | TypeScript JSX | 12 | 0 | 2 | 14 |
| [resources/js/components/app-logo.tsx](/resources/js/components/app-logo.tsx) | TypeScript JSX | 20 | 0 | 2 | 22 |
| [resources/js/components/app-shell.tsx](/resources/js/components/app-shell.tsx) | TypeScript JSX | 14 | 0 | 5 | 19 |
| [resources/js/components/app-sidebar-header.tsx](/resources/js/components/app-sidebar-header.tsx) | TypeScript JSX | 692 | 29 | 52 | 773 |
| [resources/js/components/app-sidebar.tsx](/resources/js/components/app-sidebar.tsx) | TypeScript JSX | 307 | 1 | 34 | 342 |
| [resources/js/components/appearance-dropdown.tsx](/resources/js/components/appearance-dropdown.tsx) | TypeScript JSX | 50 | 0 | 4 | 54 |
| [resources/js/components/appearance-tabs.tsx](/resources/js/components/appearance-tabs.tsx) | TypeScript JSX | 31 | 0 | 4 | 35 |
| [resources/js/components/breadcrumbs.tsx](/resources/js/components/breadcrumbs.tsx) | TypeScript JSX | 33 | 0 | 2 | 35 |
| [resources/js/components/data-table.tsx](/resources/js/components/data-table.tsx) | TypeScript JSX | 73 | 0 | 7 | 80 |
| [resources/js/components/delete-user.tsx](/resources/js/components/delete-user.tsx) | TypeScript JSX | 76 | 0 | 14 | 90 |
| [resources/js/components/heading-small.tsx](/resources/js/components/heading-small.tsx) | TypeScript JSX | 8 | 0 | 1 | 9 |
| [resources/js/components/heading.tsx](/resources/js/components/heading.tsx) | TypeScript JSX | 8 | 0 | 1 | 9 |
| [resources/js/components/icon.tsx](/resources/js/components/icon.tsx) | TypeScript JSX | 9 | 0 | 3 | 12 |
| [resources/js/components/input-error.tsx](/resources/js/components/input-error.tsx) | TypeScript JSX | 9 | 0 | 2 | 11 |
| [resources/js/components/nav-footer.tsx](/resources/js/components/nav-footer.tsx) | TypeScript JSX | 33 | 0 | 2 | 35 |
| [resources/js/components/nav-main.tsx](/resources/js/components/nav-main.tsx) | TypeScript JSX | 79 | 0 | 7 | 86 |
| [resources/js/components/nav-user.tsx](/resources/js/components/nav-user.tsx) | TypeScript JSX | 34 | 0 | 6 | 40 |
| [resources/js/components/pagination-controls.tsx](/resources/js/components/pagination-controls.tsx) | TypeScript JSX | 43 | 0 | 6 | 49 |
| [resources/js/components/text-link.tsx](/resources/js/components/text-link.tsx) | TypeScript JSX | 17 | 0 | 3 | 20 |
| [resources/js/components/ui/accordion.tsx](/resources/js/components/ui/accordion.tsx) | TypeScript JSX | 58 | 0 | 7 | 65 |
| [resources/js/components/ui/alert.tsx](/resources/js/components/ui/alert.tsx) | TypeScript JSX | 62 | 0 | 7 | 69 |
| [resources/js/components/ui/avatar.tsx](/resources/js/components/ui/avatar.tsx) | TypeScript JSX | 46 | 0 | 6 | 52 |
| [resources/js/components/ui/badge.tsx](/resources/js/components/ui/badge.tsx) | TypeScript JSX | 41 | 0 | 6 | 47 |
| [resources/js/components/ui/breadcrumb.tsx](/resources/js/components/ui/breadcrumb.tsx) | TypeScript JSX | 99 | 0 | 11 | 110 |
| [resources/js/components/ui/button.tsx](/resources/js/components/ui/button.tsx) | TypeScript JSX | 54 | 0 | 6 | 60 |
| [resources/js/components/ui/calendar.tsx](/resources/js/components/ui/calendar.tsx) | TypeScript JSX | 202 | 0 | 10 | 212 |
| [resources/js/components/ui/card.tsx](/resources/js/components/ui/card.tsx) | TypeScript JSX | 60 | 0 | 9 | 69 |
| [resources/js/components/ui/checkbox.tsx](/resources/js/components/ui/checkbox.tsx) | TypeScript JSX | 27 | 0 | 4 | 31 |
| [resources/js/components/ui/collapsible.tsx](/resources/js/components/ui/collapsible.tsx) | TypeScript JSX | 27 | 0 | 5 | 32 |
| [resources/js/components/ui/command.tsx](/resources/js/components/ui/command.tsx) | TypeScript JSX | 171 | 0 | 12 | 183 |
| [resources/js/components/ui/dialog.tsx](/resources/js/components/ui/dialog.tsx) | TypeScript JSX | 130 | 0 | 14 | 144 |
| [resources/js/components/ui/dropdown-menu.tsx](/resources/js/components/ui/dropdown-menu.tsx) | TypeScript JSX | 238 | 0 | 18 | 256 |
| [resources/js/components/ui/icon.tsx](/resources/js/components/ui/icon.tsx) | TypeScript JSX | 11 | 0 | 4 | 15 |
| [resources/js/components/ui/input.tsx](/resources/js/components/ui/input.tsx) | TypeScript JSX | 27 | 0 | 6 | 33 |
| [resources/js/components/ui/label.tsx](/resources/js/components/ui/label.tsx) | TypeScript JSX | 19 | 0 | 4 | 23 |
| [resources/js/components/ui/navigation-menu.tsx](/resources/js/components/ui/navigation-menu.tsx) | TypeScript JSX | 157 | 0 | 12 | 169 |
| [resources/js/components/ui/placeholder-pattern.tsx](/resources/js/components/ui/placeholder-pattern.tsx) | TypeScript JSX | 17 | 0 | 4 | 21 |
| [resources/js/components/ui/popover.tsx](/resources/js/components/ui/popover.tsx) | TypeScript JSX | 40 | 0 | 7 | 47 |
| [resources/js/components/ui/progress.tsx](/resources/js/components/ui/progress.tsx) | TypeScript JSX | 23 | 0 | 4 | 27 |
| [resources/js/components/ui/radio-group.tsx](/resources/js/components/ui/radio-group.tsx) | TypeScript JSX | 39 | 0 | 5 | 44 |
| [resources/js/components/ui/scroll-area.tsx](/resources/js/components/ui/scroll-area.tsx) | TypeScript JSX | 52 | 0 | 5 | 57 |
| [resources/js/components/ui/select.tsx](/resources/js/components/ui/select.tsx) | TypeScript JSX | 167 | 0 | 13 | 180 |
| [resources/js/components/ui/separator.tsx](/resources/js/components/ui/separator.tsx) | TypeScript JSX | 23 | 0 | 4 | 27 |
| [resources/js/components/ui/sheet.tsx](/resources/js/components/ui/sheet.tsx) | TypeScript JSX | 125 | 0 | 13 | 138 |
| [resources/js/components/ui/sidebar.tsx](/resources/js/components/ui/sidebar.tsx) | TypeScript JSX | 656 | 12 | 54 | 722 |
| [resources/js/components/ui/skeleton.tsx](/resources/js/components/ui/skeleton.tsx) | TypeScript JSX | 11 | 0 | 3 | 14 |
| [resources/js/components/ui/switch.tsx](/resources/js/components/ui/switch.tsx) | TypeScript JSX | 26 | 0 | 4 | 30 |
| [resources/js/components/ui/table.tsx](/resources/js/components/ui/table.tsx) | TypeScript JSX | 104 | 0 | 11 | 115 |
| [resources/js/components/ui/tabs.tsx](/resources/js/components/ui/tabs.tsx) | TypeScript JSX | 58 | 0 | 7 | 65 |
| [resources/js/components/ui/textarea.tsx](/resources/js/components/ui/textarea.tsx) | TypeScript JSX | 15 | 0 | 4 | 19 |
| [resources/js/components/ui/toggle-group.tsx](/resources/js/components/ui/toggle-group.tsx) | TypeScript JSX | 65 | 0 | 7 | 72 |
| [resources/js/components/ui/toggle.tsx](/resources/js/components/ui/toggle.tsx) | TypeScript JSX | 41 | 0 | 5 | 46 |
| [resources/js/components/ui/tooltip.tsx](/resources/js/components/ui/tooltip.tsx) | TypeScript JSX | 53 | 0 | 7 | 60 |
| [resources/js/components/user-info.tsx](/resources/js/components/user-info.tsx) | TypeScript JSX | 20 | 0 | 3 | 23 |
| [resources/js/components/user-menu-content.tsx](/resources/js/components/user-menu-content.tsx) | TypeScript JSX | 96 | 1 | 9 | 106 |
| [resources/js/features/court-hearing/create-event.tsx](/resources/js/features/court-hearing/create-event.tsx) | TypeScript JSX | 334 | 6 | 29 | 369 |
| [resources/js/features/custody/custody-management.tsx](/resources/js/features/custody/custody-management.tsx) | TypeScript JSX | 199 | 6 | 23 | 228 |
| [resources/js/features/pdl-management/case-information-columns.tsx](/resources/js/features/pdl-management/case-information-columns.tsx) | TypeScript JSX | 105 | 0 | 5 | 110 |
| [resources/js/features/pdl-management/cell-assignment-columns.tsx](/resources/js/features/pdl-management/cell-assignment-columns.tsx) | TypeScript JSX | 68 | 1 | 3 | 72 |
| [resources/js/features/pdl-management/cell-management-columns.tsx](/resources/js/features/pdl-management/cell-management-columns.tsx) | TypeScript JSX | 73 | 0 | 4 | 77 |
| [resources/js/features/pdl-management/court\_order\_columns.tsx](/resources/js/features/pdl-management/court_order_columns.tsx) | TypeScript JSX | 101 | 1 | 6 | 108 |
| [resources/js/features/pdl-management/create-case-information.tsx](/resources/js/features/pdl-management/create-case-information.tsx) | TypeScript JSX | 301 | 20 | 22 | 343 |
| [resources/js/features/pdl-management/create-cell-assignment.tsx](/resources/js/features/pdl-management/create-cell-assignment.tsx) | TypeScript JSX | 246 | 14 | 26 | 286 |
| [resources/js/features/pdl-management/create-cell-information.tsx](/resources/js/features/pdl-management/create-cell-information.tsx) | TypeScript JSX | 141 | 0 | 18 | 159 |
| [resources/js/features/pdl-management/create-court-order.tsx](/resources/js/features/pdl-management/create-court-order.tsx) | TypeScript JSX | 150 | 8 | 18 | 176 |
| [resources/js/features/pdl-management/create-medical-record.tsx](/resources/js/features/pdl-management/create-medical-record.tsx) | TypeScript JSX | 153 | 8 | 13 | 174 |
| [resources/js/features/pdl-management/create-pdl-personal-information.tsx](/resources/js/features/pdl-management/create-pdl-personal-information.tsx) | TypeScript JSX | 175 | 0 | 18 | 193 |
| [resources/js/features/pdl-management/create-physical-characteristic.tsx](/resources/js/features/pdl-management/create-physical-characteristic.tsx) | TypeScript JSX | 158 | 10 | 18 | 186 |
| [resources/js/features/pdl-management/edit-cell-assignment.tsx](/resources/js/features/pdl-management/edit-cell-assignment.tsx) | TypeScript JSX | 123 | 0 | 16 | 139 |
| [resources/js/features/pdl-management/edit-cell-information.tsx](/resources/js/features/pdl-management/edit-cell-information.tsx) | TypeScript JSX | 145 | 0 | 20 | 165 |
| [resources/js/features/pdl-management/edit-medical-record.tsx](/resources/js/features/pdl-management/edit-medical-record.tsx) | TypeScript JSX | 155 | 7 | 14 | 176 |
| [resources/js/features/pdl-management/edit-pdl-personal-information.tsx](/resources/js/features/pdl-management/edit-pdl-personal-information.tsx) | TypeScript JSX | 178 | 0 | 16 | 194 |
| [resources/js/features/pdl-management/edit-physical-characteristic.tsx](/resources/js/features/pdl-management/edit-physical-characteristic.tsx) | TypeScript JSX | 185 | 10 | 17 | 212 |
| [resources/js/features/pdl-management/medical-record-columns.tsx](/resources/js/features/pdl-management/medical-record-columns.tsx) | TypeScript JSX | 80 | 0 | 4 | 84 |
| [resources/js/features/pdl-management/physical-characteristic-columns.tsx](/resources/js/features/pdl-management/physical-characteristic-columns.tsx) | TypeScript JSX | 76 | 0 | 3 | 79 |
| [resources/js/features/pdl-management/transfer-pdl.tsx](/resources/js/features/pdl-management/transfer-pdl.tsx) | TypeScript JSX | 88 | 0 | 11 | 99 |
| [resources/js/features/pdl-management/view-pdl-information.tsx](/resources/js/features/pdl-management/view-pdl-information.tsx) | TypeScript JSX | 229 | 6 | 9 | 244 |
| [resources/js/features/time-allowance/manage-time-allowance.tsx](/resources/js/features/time-allowance/manage-time-allowance.tsx) | TypeScript JSX | 168 | 1 | 16 | 185 |
| [resources/js/features/time-allowance/time-allowance-records.tsx](/resources/js/features/time-allowance/time-allowance-records.tsx) | TypeScript JSX | 333 | 2 | 26 | 361 |
| [resources/js/features/user-management/create-user.tsx](/resources/js/features/user-management/create-user.tsx) | TypeScript JSX | 208 | 0 | 26 | 234 |
| [resources/js/features/user-management/delete-user.tsx](/resources/js/features/user-management/delete-user.tsx) | TypeScript JSX | 80 | 0 | 11 | 91 |
| [resources/js/features/user-management/edit-user.tsx](/resources/js/features/user-management/edit-user.tsx) | TypeScript JSX | 201 | 1 | 20 | 222 |
| [resources/js/features/user-management/reset-password-dialog.tsx](/resources/js/features/user-management/reset-password-dialog.tsx) | TypeScript JSX | 143 | 2 | 13 | 158 |
| [resources/js/features/user-management/user-columns.tsx](/resources/js/features/user-management/user-columns.tsx) | TypeScript JSX | 89 | 0 | 7 | 96 |
| [resources/js/features/verification/verification-card.tsx](/resources/js/features/verification/verification-card.tsx) | TypeScript JSX | 365 | 11 | 19 | 395 |
| [resources/js/hooks/use-appearance.tsx](/resources/js/hooks/use-appearance.tsx) | TypeScript JSX | 48 | 3 | 21 | 72 |
| [resources/js/hooks/use-initials.tsx](/resources/js/hooks/use-initials.tsx) | TypeScript JSX | 11 | 0 | 5 | 16 |
| [resources/js/hooks/use-mobile-navigation.ts](/resources/js/hooks/use-mobile-navigation.ts) | TypeScript | 6 | 1 | 2 | 9 |
| [resources/js/hooks/use-mobile.tsx](/resources/js/hooks/use-mobile.tsx) | TypeScript JSX | 15 | 0 | 8 | 23 |
| [resources/js/layouts/app-layout.tsx](/resources/js/layouts/app-layout.tsx) | TypeScript JSX | 12 | 0 | 3 | 15 |
| [resources/js/layouts/app/app-header-layout.tsx](/resources/js/layouts/app/app-header-layout.tsx) | TypeScript JSX | 13 | 0 | 2 | 15 |
| [resources/js/layouts/app/app-sidebar-layout.tsx](/resources/js/layouts/app/app-sidebar-layout.tsx) | TypeScript JSX | 22 | 0 | 3 | 25 |
| [resources/js/layouts/auth-layout.tsx](/resources/js/layouts/auth-layout.tsx) | TypeScript JSX | 8 | 0 | 2 | 10 |
| [resources/js/layouts/auth/auth-card-layout.tsx](/resources/js/layouts/auth/auth-card-layout.tsx) | TypeScript JSX | 34 | 0 | 3 | 37 |
| [resources/js/layouts/auth/auth-simple-layout.tsx](/resources/js/layouts/auth/auth-simple-layout.tsx) | TypeScript JSX | 31 | 0 | 4 | 35 |
| [resources/js/layouts/auth/auth-split-layout.tsx](/resources/js/layouts/auth/auth-split-layout.tsx) | TypeScript JSX | 42 | 0 | 4 | 46 |
| [resources/js/layouts/settings/layout.tsx](/resources/js/layouts/settings/layout.tsx) | TypeScript JSX | 60 | 1 | 8 | 69 |
| [resources/js/lib/dateUtils.ts](/resources/js/lib/dateUtils.ts) | TypeScript | 14 | 0 | 2 | 16 |
| [resources/js/lib/utils.ts](/resources/js/lib/utils.ts) | TypeScript | 5 | 0 | 2 | 7 |
| [resources/js/pages/admin/archive/list.tsx](/resources/js/pages/admin/archive/list.tsx) | TypeScript JSX | 562 | 17 | 30 | 609 |
| [resources/js/pages/admin/court-hearing/calendar.tsx](/resources/js/pages/admin/court-hearing/calendar.tsx) | TypeScript JSX | 86 | 2 | 11 | 99 |
| [resources/js/pages/admin/pdl/archive.tsx](/resources/js/pages/admin/pdl/archive.tsx) | TypeScript JSX | 241 | 5 | 16 | 262 |
| [resources/js/pages/admin/pdl/archived.tsx](/resources/js/pages/admin/pdl/archived.tsx) | TypeScript JSX | 236 | 4 | 11 | 251 |
| [resources/js/pages/admin/profile-management/profie.tsx](/resources/js/pages/admin/profile-management/profie.tsx) | TypeScript JSX | 155 | 3 | 15 | 173 |
| [resources/js/pages/admin/report/certificate-of-detention.tsx](/resources/js/pages/admin/report/certificate-of-detention.tsx) | TypeScript JSX | 238 | 6 | 30 | 274 |
| [resources/js/pages/admin/report/drug-clearing-certificate.tsx](/resources/js/pages/admin/report/drug-clearing-certificate.tsx) | TypeScript JSX | 335 | 6 | 22 | 363 |
| [resources/js/pages/admin/report/drug-related-cases-monthly.tsx](/resources/js/pages/admin/report/drug-related-cases-monthly.tsx) | TypeScript JSX | 291 | 8 | 20 | 319 |
| [resources/js/pages/admin/report/gcta-tastm-report.tsx](/resources/js/pages/admin/report/gcta-tastm-report.tsx) | TypeScript JSX | 153 | 1 | 16 | 170 |
| [resources/js/pages/admin/report/inmates-status-daily.tsx](/resources/js/pages/admin/report/inmates-status-daily.tsx) | TypeScript JSX | 444 | 15 | 28 | 487 |
| [resources/js/pages/admin/report/inmates-status.tsx](/resources/js/pages/admin/report/inmates-status.tsx) | TypeScript JSX | 327 | 10 | 23 | 360 |
| [resources/js/pages/admin/report/list-of-pdl-reports.tsx](/resources/js/pages/admin/report/list-of-pdl-reports.tsx) | TypeScript JSX | 143 | 0 | 12 | 155 |
| [resources/js/pages/admin/report/no-records-certificate.tsx](/resources/js/pages/admin/report/no-records-certificate.tsx) | TypeScript JSX | 292 | 12 | 26 | 330 |
| [resources/js/pages/admin/report/population-report.tsx](/resources/js/pages/admin/report/population-report.tsx) | TypeScript JSX | 143 | 0 | 15 | 158 |
| [resources/js/pages/admin/settings/appearance.tsx](/resources/js/pages/admin/settings/appearance.tsx) | TypeScript JSX | 25 | 0 | 6 | 31 |
| [resources/js/pages/admin/settings/password.tsx](/resources/js/pages/admin/settings/password.tsx) | TypeScript JSX | 108 | 0 | 21 | 129 |
| [resources/js/pages/admin/settings/profile.tsx](/resources/js/pages/admin/settings/profile.tsx) | TypeScript JSX | 107 | 0 | 21 | 128 |
| [resources/js/pages/admin/time-allowance/list.tsx](/resources/js/pages/admin/time-allowance/list.tsx) | TypeScript JSX | 100 | 0 | 9 | 109 |
| [resources/js/pages/admin/user-management/list.tsx](/resources/js/pages/admin/user-management/list.tsx) | TypeScript JSX | 77 | 0 | 14 | 91 |
| [resources/js/pages/admin/verification/list.tsx](/resources/js/pages/admin/verification/list.tsx) | TypeScript JSX | 81 | 2 | 12 | 95 |
| [resources/js/pages/certificates/create.tsx](/resources/js/pages/certificates/create.tsx) | TypeScript JSX | 278 | 6 | 20 | 304 |
| [resources/js/pages/certificates/index.tsx](/resources/js/pages/certificates/index.tsx) | TypeScript JSX | 279 | 3 | 16 | 298 |
| [resources/js/pages/certificates/show.tsx](/resources/js/pages/certificates/show.tsx) | TypeScript JSX | 333 | 9 | 18 | 360 |
| [resources/js/pages/dashboard.tsx](/resources/js/pages/dashboard.tsx) | TypeScript JSX | 635 | 20 | 33 | 688 |
| [resources/js/pages/forgot-password.tsx](/resources/js/pages/forgot-password.tsx) | TypeScript JSX | 156 | 7 | 20 | 183 |
| [resources/js/pages/law-enforcement/dashboard/dashboard.tsx](/resources/js/pages/law-enforcement/dashboard/dashboard.tsx) | TypeScript JSX | 495 | 16 | 25 | 536 |
| [resources/js/pages/records-officer/dashboard/dashboard.tsx](/resources/js/pages/records-officer/dashboard/dashboard.tsx) | TypeScript JSX | 528 | 15 | 27 | 570 |
| [resources/js/pages/records-officer/jail-events/jail-events.tsx](/resources/js/pages/records-officer/jail-events/jail-events.tsx) | TypeScript JSX | 447 | 11 | 40 | 498 |
| [resources/js/pages/records-officer/pdl-archives/pdl-archives.tsx](/resources/js/pages/records-officer/pdl-archives/pdl-archives.tsx) | TypeScript JSX | 113 | 8 | 16 | 137 |
| [resources/js/pages/records-officer/pdl-management/case-information.tsx](/resources/js/pages/records-officer/pdl-management/case-information.tsx) | TypeScript JSX | 135 | 3 | 14 | 152 |
| [resources/js/pages/records-officer/pdl-management/cell-assignment.tsx](/resources/js/pages/records-officer/pdl-management/cell-assignment.tsx) | TypeScript JSX | 131 | 4 | 15 | 150 |
| [resources/js/pages/records-officer/pdl-management/cell-management.tsx](/resources/js/pages/records-officer/pdl-management/cell-management.tsx) | TypeScript JSX | 71 | 0 | 8 | 79 |
| [resources/js/pages/records-officer/pdl-management/court-order.tsx](/resources/js/pages/records-officer/pdl-management/court-order.tsx) | TypeScript JSX | 73 | 0 | 10 | 83 |
| [resources/js/pages/records-officer/pdl-management/create-pdl-information.tsx](/resources/js/pages/records-officer/pdl-management/create-pdl-information.tsx) | TypeScript JSX | 1,414 | 29 | 61 | 1,504 |
| [resources/js/pages/records-officer/pdl-management/health-assessment.tsx](/resources/js/pages/records-officer/pdl-management/health-assessment.tsx) | TypeScript JSX | 73 | 1 | 7 | 81 |
| [resources/js/pages/records-officer/pdl-management/medical-records.tsx](/resources/js/pages/records-officer/pdl-management/medical-records.tsx) | TypeScript JSX | 134 | 2 | 14 | 150 |
| [resources/js/pages/records-officer/pdl-management/personal-information-admin.tsx](/resources/js/pages/records-officer/pdl-management/personal-information-admin.tsx) | TypeScript JSX | 538 | 8 | 37 | 583 |
| [resources/js/pages/records-officer/pdl-management/personal-information.tsx](/resources/js/pages/records-officer/pdl-management/personal-information.tsx) | TypeScript JSX | 125 | 1 | 14 | 140 |
| [resources/js/pages/records-officer/pdl-management/physical-characteristics.tsx](/resources/js/pages/records-officer/pdl-management/physical-characteristics.tsx) | TypeScript JSX | 121 | 2 | 14 | 137 |
| [resources/js/pages/records-officer/pdl-management/update-pdl-information.tsx](/resources/js/pages/records-officer/pdl-management/update-pdl-information.tsx) | TypeScript JSX | 1,395 | 28 | 59 | 1,482 |
| [resources/js/pages/records-officer/profile-management/profile-management.tsx](/resources/js/pages/records-officer/profile-management/profile-management.tsx) | TypeScript JSX | 165 | 3 | 15 | 183 |
| [resources/js/pages/search/detail.tsx](/resources/js/pages/search/detail.tsx) | TypeScript JSX | 579 | 5 | 21 | 605 |
| [resources/js/pages/search/results.tsx](/resources/js/pages/search/results.tsx) | TypeScript JSX | 287 | 3 | 18 | 308 |
| [resources/js/pages/welcome.tsx](/resources/js/pages/welcome.tsx) | TypeScript JSX | 208 | 30 | 23 | 261 |
| [resources/js/ssr.tsx](/resources/js/ssr.tsx) | TypeScript JSX | 22 | 5 | 4 | 31 |
| [resources/js/types/global.d.ts](/resources/js/types/global.d.ts) | TypeScript | 4 | 0 | 2 | 6 |
| [resources/js/types/index.d.ts](/resources/js/types/index.d.ts) | TypeScript | 151 | 1 | 15 | 167 |
| [resources/js/types/vite-env.d.ts](/resources/js/types/vite-env.d.ts) | TypeScript | 0 | 1 | 1 | 2 |
| [resources/views/app.blade.php](/resources/views/app.blade.php) | PHP | 25 | 0 | 9 | 34 |
| [resources/views/reports/certificate-of-detention.blade.php](/resources/views/reports/certificate-of-detention.blade.php) | PHP | 159 | 0 | 32 | 191 |
| [resources/views/reports/drug-cases-monthly.blade.php](/resources/views/reports/drug-cases-monthly.blade.php) | PHP | 144 | 0 | 18 | 162 |
| [resources/views/reports/drug-clearing-certificate.blade.php](/resources/views/reports/drug-clearing-certificate.blade.php) | PHP | 215 | 0 | 36 | 251 |
| [resources/views/reports/gcta-tastm.blade.php](/resources/views/reports/gcta-tastm.blade.php) | PHP | 249 | 0 | 52 | 301 |
| [resources/views/reports/inmate-status-report.blade.php](/resources/views/reports/inmate-status-report.blade.php) | PHP | 91 | 0 | 6 | 97 |
| [resources/views/reports/inmates-status-daily.blade.php](/resources/views/reports/inmates-status-daily.blade.php) | PHP | 345 | 0 | 35 | 380 |
| [resources/views/reports/inmates-status.blade.php](/resources/views/reports/inmates-status.blade.php) | PHP | 235 | 0 | 27 | 262 |
| [resources/views/reports/no-records-certificate.blade.php](/resources/views/reports/no-records-certificate.blade.php) | PHP | 204 | 0 | 34 | 238 |
| [resources/views/reports/pdl-list.blade.php](/resources/views/reports/pdl-list.blade.php) | PHP | 121 | 0 | 5 | 126 |
| [resources/views/reports/pdl-report.blade.php](/resources/views/reports/pdl-report.blade.php) | PHP | 222 | 0 | 50 | 272 |
| [resources/views/reports/population-report.blade.php](/resources/views/reports/population-report.blade.php) | PHP | 95 | 0 | 3 | 98 |
| [routes/auth.php](/routes/auth.php) | PHP | 15 | 0 | 8 | 23 |
| [routes/console.php](/routes/console.php) | PHP | 8 | 1 | 4 | 13 |
| [routes/settings.php](/routes/settings.php) | PHP | 16 | 0 | 6 | 22 |
| [routes/web.php](/routes/web.php) | PHP | 204 | 13 | 59 | 276 |
| [tests/Feature/Auth/AuthenticationTest.php](/tests/Feature/Auth/AuthenticationTest.php) | PHP | 30 | 0 | 13 | 43 |
| [tests/Feature/Auth/EmailVerificationTest.php](/tests/Feature/Auth/EmailVerificationTest.php) | PHP | 34 | 0 | 14 | 48 |
| [tests/Feature/Auth/PasswordConfirmationTest.php](/tests/Feature/Auth/PasswordConfirmationTest.php) | PHP | 23 | 0 | 11 | 34 |
| [tests/Feature/Auth/PasswordResetTest.php](/tests/Feature/Auth/PasswordResetTest.php) | PHP | 42 | 0 | 20 | 62 |
| [tests/Feature/Auth/RegistrationTest.php](/tests/Feature/Auth/RegistrationTest.php) | PHP | 16 | 0 | 5 | 21 |
| [tests/Feature/DashboardTest.php](/tests/Feature/DashboardTest.php) | PHP | 10 | 0 | 5 | 15 |
| [tests/Feature/ExampleTest.php](/tests/Feature/ExampleTest.php) | PHP | 5 | 0 | 3 | 8 |
| [tests/Feature/Settings/PasswordUpdateTest.php](/tests/Feature/Settings/PasswordUpdateTest.php) | PHP | 33 | 0 | 9 | 42 |
| [tests/Feature/Settings/ProfileUpdateTest.php](/tests/Feature/Settings/ProfileUpdateTest.php) | PHP | 65 | 0 | 22 | 87 |
| [tests/Pest.php](/tests/Pest.php) | PHP | 9 | 32 | 7 | 48 |
| [tests/TestCase.php](/tests/TestCase.php) | PHP | 6 | 1 | 4 | 11 |
| [tests/Unit/ExampleTest.php](/tests/Unit/ExampleTest.php) | PHP | 4 | 0 | 2 | 6 |
| [tsconfig.json](/tsconfig.json) | JSON with Comments | 26 | 88 | 9 | 123 |
| [vite.config.ts](/vite.config.ts) | TypeScript | 24 | 0 | 2 | 26 |

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)