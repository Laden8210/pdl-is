# Diff Details

Date : 2025-10-20 10:16:13

Directory c:\\xampp\\htdocs\\pdl-is

Total : 354 files,  10321 codes, 600 comments, 880 blanks, all 11801 lines

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [app/Console/Commands/SendEventReminders.php](/app/Console/Commands/SendEventReminders.php) | PHP | 66 | 19 | 15 | 100 |
| [app/Http/Controllers/Admin/CourtHearingCalendarController.php](/app/Http/Controllers/Admin/CourtHearingCalendarController.php) | PHP | 27 | 4 | 1 | 32 |
| [app/Http/Controllers/Admin/ProfileManagementController.php](/app/Http/Controllers/Admin/ProfileManagementController.php) | PHP | 0 | 0 | 2 | 2 |
| [app/Http/Controllers/Admin/UserManagementController.php](/app/Http/Controllers/Admin/UserManagementController.php) | PHP | 3 | 0 | 0 | 3 |
| [app/Http/Controllers/Admin/VerificationController.php](/app/Http/Controllers/Admin/VerificationController.php) | PHP | 5 | 0 | 3 | 8 |
| [app/Http/Controllers/AgencyController.php](/app/Http/Controllers/AgencyController.php) | PHP | 17 | 0 | 10 | 27 |
| [app/Http/Controllers/CaseInformationController.php](/app/Http/Controllers/CaseInformationController.php) | PHP | 51 | 0 | 13 | 64 |
| [app/Http/Controllers/CellAssignmentController.php](/app/Http/Controllers/CellAssignmentController.php) | PHP | 97 | 9 | 19 | 125 |
| [app/Http/Controllers/CourtController.php](/app/Http/Controllers/CourtController.php) | PHP | 40 | 0 | 6 | 46 |
| [app/Http/Controllers/CustodyController.php](/app/Http/Controllers/CustodyController.php) | PHP | 127 | 29 | 35 | 191 |
| [app/Http/Controllers/DashboardController.php](/app/Http/Controllers/DashboardController.php) | PHP | 238 | 3 | 11 | 252 |
| [app/Http/Controllers/MedicalRecordController.php](/app/Http/Controllers/MedicalRecordController.php) | PHP | 16 | 0 | 1 | 17 |
| [app/Http/Controllers/PdlArchiveController.php](/app/Http/Controllers/PdlArchiveController.php) | PHP | 5 | 1 | 2 | 8 |
| [app/Http/Controllers/PhysicalCharacteristicController.php](/app/Http/Controllers/PhysicalCharacteristicController.php) | PHP | 19 | 0 | 0 | 19 |
| [app/Http/Controllers/RecordOfficer/JailEventsController.php](/app/Http/Controllers/RecordOfficer/JailEventsController.php) | PHP | 92 | 6 | 15 | 113 |
| [app/Http/Controllers/RecordOfficer/PDLManagementController.php](/app/Http/Controllers/RecordOfficer/PDLManagementController.php) | PHP | 125 | 6 | 34 | 165 |
| [app/Http/Controllers/ReportController.php](/app/Http/Controllers/ReportController.php) | PHP | 429 | 27 | 60 | 516 |
| [app/Http/Controllers/RequestLogController.php](/app/Http/Controllers/RequestLogController.php) | PHP | 76 | 4 | 12 | 92 |
| [app/Http/Controllers/SearchController.php](/app/Http/Controllers/SearchController.php) | PHP | 62 | 0 | 9 | 71 |
| [app/Http/Controllers/TimeAllowanceController.php](/app/Http/Controllers/TimeAllowanceController.php) | PHP | 3 | 0 | 0 | 3 |
| [app/Http/Controllers/UserPDLArchiveController.php](/app/Http/Controllers/UserPDLArchiveController.php) | PHP | 36 | 6 | 8 | 50 |
| [app/Http/Middleware/LogRequestsMiddleware.php](/app/Http/Middleware/LogRequestsMiddleware.php) | PHP | 12 | 5 | 4 | 21 |
| [app/Http/Middleware/ShareNotifications.php](/app/Http/Middleware/ShareNotifications.php) | PHP | 2 | 0 | 0 | 2 |
| [app/Http/Middleware/SystemLogRequestsMiddleware.php](/app/Http/Middleware/SystemLogRequestsMiddleware.php) | PHP | 245 | 45 | 52 | 342 |
| [app/Http/Requests/CreateCellRequest.php](/app/Http/Requests/CreateCellRequest.php) | PHP | 3 | 0 | 0 | 3 |
| [app/Http/Requests/CreatePDLOnePageRequest.php](/app/Http/Requests/CreatePDLOnePageRequest.php) | PHP | 7 | -1 | 6 | 12 |
| [app/Http/Requests/EditCellRequest.php](/app/Http/Requests/EditCellRequest.php) | PHP | 3 | 0 | 0 | 3 |
| [app/Http/Requests/Profile/UpdateProfileRequest.php](/app/Http/Requests/Profile/UpdateProfileRequest.php) | PHP | 18 | 5 | -1 | 22 |
| [app/Jobs/LogRequestJob.php](/app/Jobs/LogRequestJob.php) | PHP | 19 | 0 | 6 | 25 |
| [app/Models/Activity.php](/app/Models/Activity.php) | PHP | 15 | 1 | 3 | 19 |
| [app/Models/Agency.php](/app/Models/Agency.php) | PHP | 13 | 0 | 5 | 18 |
| [app/Models/CellTransferLog.php](/app/Models/CellTransferLog.php) | PHP | 41 | 0 | 12 | 53 |
| [app/Models/Cells.php](/app/Models/Cells.php) | PHP | 1 | 0 | 0 | 1 |
| [app/Models/Court.php](/app/Models/Court.php) | PHP | 62 | 7 | 12 | 81 |
| [app/Models/CourtOrder.php](/app/Models/CourtOrder.php) | PHP | 8 | 0 | 3 | 11 |
| [app/Models/MedicalDocument.php](/app/Models/MedicalDocument.php) | PHP | -29 | 0 | -7 | -36 |
| [app/Models/MedicalRecord.php](/app/Models/MedicalRecord.php) | PHP | -3 | 0 | -1 | -4 |
| [app/Models/Pdl.php](/app/Models/Pdl.php) | PHP | 11 | 2 | 3 | 16 |
| [app/Models/Personnel.php](/app/Models/Personnel.php) | PHP | 0 | 0 | -2 | -2 |
| [app/Models/PhysicalCharacteristic.php](/app/Models/PhysicalCharacteristic.php) | PHP | 1 | 0 | 0 | 1 |
| [app/Models/RequestLog.php](/app/Models/RequestLog.php) | PHP | 45 | 0 | 13 | 58 |
| [bootstrap/app.php](/bootstrap/app.php) | PHP | 2 | 0 | 0 | 2 |
| [database/migrations/2025\_09\_20\_000752\_add\_middlename.php](/database/migrations/2025_09_20_000752_add_middlename.php) | PHP | 19 | 6 | 4 | 29 |
| [database/migrations/2025\_09\_21\_163812\_remove\_court\_order\_laboratory\_results.php](/database/migrations/2025_09_21_163812_remove_court_order_laboratory_results.php) | PHP | 25 | 6 | 6 | 37 |
| [database/migrations/2025\_09\_21\_164451\_update\_court\_orders\_table\_for\_one\_page\_form.php](/database/migrations/2025_09_21_164451_update_court_orders_table_for_one_page_form.php) | PHP | 28 | 9 | 6 | 43 |
| [database/migrations/2025\_09\_21\_164508\_update\_medical\_records\_table\_for\_one\_page\_form.php](/database/migrations/2025_09_21_164508_update_medical_records_table_for_one_page_form.php) | PHP | 28 | 9 | 5 | 42 |
| [database/migrations/2025\_09\_21\_164526\_update\_physical\_characteristics\_table\_for\_one\_page\_form.php](/database/migrations/2025_09_21_164526_update_physical_characteristics_table_for_one_page_form.php) | PHP | 30 | 8 | 5 | 43 |
| [database/migrations/2025\_09\_21\_170940\_update\_medical\_record\_and\_remove\_medical\_record\_tbl.php](/database/migrations/2025_09_21_170940_update_medical_record_and_remove_medical_record_tbl.php) | PHP | 22 | 6 | 6 | 34 |
| [database/migrations/2025\_09\_21\_200659\_remove\_archive\_case\_number.php](/database/migrations/2025_09_21_200659_remove_archive_case_number.php) | PHP | 13 | 8 | 4 | 25 |
| [database/migrations/2025\_09\_21\_200714\_remove\_archive\_case\_number.php](/database/migrations/2025_09_21_200714_remove_archive_case_number.php) | PHP | 19 | 6 | 4 | 29 |
| [database/migrations/2025\_09\_21\_200724\_remove\_archive\_case\_number.php](/database/migrations/2025_09_21_200724_remove_archive_case_number.php) | PHP | 13 | 8 | 4 | 25 |
| [database/migrations/2025\_10\_09\_151517\_create\_cell\_transfer\_logs\_table.php](/database/migrations/2025_10_09_151517_create_cell_transfer_logs_table.php) | PHP | 30 | 6 | 5 | 41 |
| [database/migrations/2025\_10\_09\_165010\_add\_pdl\_ids\_to\_activity\_table.php](/database/migrations/2025_10_09_165010_add_pdl_ids_to_activity_table.php) | PHP | 24 | 8 | 6 | 38 |
| [database/migrations/2025\_10\_14\_012334\_add\_mugshot\_to\_pdl\_table.php](/database/migrations/2025_10_14_012334_add_mugshot_to_pdl_table.php) | PHP | 20 | 6 | 4 | 30 |
| [database/migrations/2025\_10\_17\_184140\_add\_agency\_table.php](/database/migrations/2025_10_17_184140_add_agency_table.php) | PHP | 19 | 6 | 4 | 29 |
| [database/migrations/2025\_10\_17\_192704\_add\_court\_table.php](/database/migrations/2025_10_17_192704_add_court_table.php) | PHP | 21 | 3 | 6 | 30 |
| [database/migrations/2025\_10\_17\_200511\_update\_court\_order\_table.php](/database/migrations/2025_10_17_200511_update_court_order_table.php) | PHP | 13 | 10 | 5 | 28 |
| [database/migrations/2025\_10\_17\_230806\_update\_activity\_table.php](/database/migrations/2025_10_17_230806_update_activity_table.php) | PHP | 22 | 7 | 7 | 36 |
| [database/migrations/2025\_10\_18\_001054\_update\_change\_divorce\_to\_anullment\_table.php](/database/migrations/2025_10_18_001054_update_change_divorce_to_anullment_table.php) | PHP | 20 | 9 | 8 | 37 |
| [database/migrations/2025\_10\_19\_155121\_create\_request\_logs\_table.php](/database/migrations/2025_10_19_155121_create_request_logs_table.php) | PHP | 35 | 0 | 5 | 40 |
| [database/migrations/2025\_10\_19\_164339\_update\_cell.php](/database/migrations/2025_10_19_164339_update_cell.php) | PHP | 19 | 6 | 4 | 29 |
| [database/migrations/2025\_10\_19\_170515\_update\_court.php](/database/migrations/2025_10_19_170515_update_court.php) | PHP | 21 | 6 | 4 | 31 |
| [database/schema/mysql-schema.sql](/database/schema/mysql-schema.sql) | MS SQL | 239 | 0 | 0 | 239 |
| [database/seeders/PersonnelSeeder.php](/database/seeders/PersonnelSeeder.php) | PHP | 33 | -26 | 2 | 9 |
| [docs/database/database documentation.md](/docs/database/database%20documentation.md) | Markdown | -384 | 0 | -60 | -444 |
| [docs/global-search-system.md](/docs/global-search-system.md) | Markdown | -185 | 0 | -53 | -238 |
| [docs/law-enforcement-dashboard.md](/docs/law-enforcement-dashboard.md) | Markdown | -148 | 0 | -44 | -192 |
| [docs/middleware-protection.md](/docs/middleware-protection.md) | Markdown | -104 | 0 | -27 | -131 |
| [docs/system-requirement.md](/docs/system-requirement.md) | Markdown | -1,020 | 0 | -190 | -1,210 |
| [package-lock.json](/package-lock.json) | JSON | 110 | 0 | 0 | 110 |
| [package.json](/package.json) | JSON | 5 | 0 | 0 | 5 |
| [public/build/assets/PieChart-9VGzp2I5.js](/public/build/assets/PieChart-9VGzp2I5.js) | JavaScript | -67 | -11 | -1 | -79 |
| [public/build/assets/PieChart-BKSYQMwV.js](/public/build/assets/PieChart-BKSYQMwV.js) | JavaScript | 67 | 11 | 1 | 79 |
| [public/build/assets/accordion-CI9yjvea.js](/public/build/assets/accordion-CI9yjvea.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/accordion-CWJVgog7.js](/public/build/assets/accordion-CWJVgog7.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/alert-Cr1nbU3H.js](/public/build/assets/alert-Cr1nbU3H.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/alert-H5bhuK7p.js](/public/build/assets/alert-H5bhuK7p.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/app-0i\_fFd18.js](/public/build/assets/app-0i_fFd18.js) | JavaScript | 76 | 35 | 13 | 124 |
| [public/build/assets/app-B6Uqmd67.css](/public/build/assets/app-B6Uqmd67.css) | CSS | -1 | 0 | -1 | -2 |
| [public/build/assets/app-D7sJuwJc.js](/public/build/assets/app-D7sJuwJc.js) | JavaScript | -76 | -35 | -13 | -124 |
| [public/build/assets/app-DhVVAe0s.css](/public/build/assets/app-DhVVAe0s.css) | CSS | 1 | 0 | 1 | 2 |
| [public/build/assets/app-layout-DMq9\_fqY.js](/public/build/assets/app-layout-DMq9_fqY.js) | JavaScript | 46 | 32 | 8 | 86 |
| [public/build/assets/app-layout-l1YM3YbX.js](/public/build/assets/app-layout-l1YM3YbX.js) | JavaScript | -46 | -32 | -8 | -86 |
| [public/build/assets/appearance-B993ZYZk.js](/public/build/assets/appearance-B993ZYZk.js) | JavaScript | -4 | -12 | -1 | -17 |
| [public/build/assets/appearance-BNSZixrX.js](/public/build/assets/appearance-BNSZixrX.js) | JavaScript | 4 | 12 | 1 | 17 |
| [public/build/assets/archive-B9Uombcr.js](/public/build/assets/archive-B9Uombcr.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/archive-C-v6ttJl.js](/public/build/assets/archive-C-v6ttJl.js) | JavaScript | -2 | -4 | -1 | -7 |
| [public/build/assets/archive-DF7wGM0K.js](/public/build/assets/archive-DF7wGM0K.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/archive-KkLxy3\_l.js](/public/build/assets/archive-KkLxy3_l.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/archived-BGHQU89u.js](/public/build/assets/archived-BGHQU89u.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/archived-BxhXcYX6.js](/public/build/assets/archived-BxhXcYX6.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/arrow-left-Bf-TA\_WP.js](/public/build/assets/arrow-left-Bf-TA_WP.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/arrow-left-DfiAP-S2.js](/public/build/assets/arrow-left-DfiAP-S2.js) | JavaScript | -2 | -4 | -1 | -7 |
| [public/build/assets/badge-C-b1LAND.js](/public/build/assets/badge-C-b1LAND.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/badge-DDEXAs5P.js](/public/build/assets/badge-DDEXAs5P.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/button-OH02krXJ.js](/public/build/assets/button-OH02krXJ.js) | JavaScript | 5 | 16 | 1 | 22 |
| [public/build/assets/button-u9ZiHX7C.js](/public/build/assets/button-u9ZiHX7C.js) | JavaScript | -5 | -16 | -1 | -22 |
| [public/build/assets/calendar-2ukcrKyw.js](/public/build/assets/calendar-2ukcrKyw.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/calendar-BX--AMhk.js](/public/build/assets/calendar-BX--AMhk.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/card-CY\_EzAZa.js](/public/build/assets/card-CY_EzAZa.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/card-DLWDwqHf.js](/public/build/assets/card-DLWDwqHf.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/case-information-ClPNQ3Bs.js](/public/build/assets/case-information-ClPNQ3Bs.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/case-information-DQiBFTjF.js](/public/build/assets/case-information-DQiBFTjF.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/cell-activity-log-DYjqU8-O.js](/public/build/assets/cell-activity-log-DYjqU8-O.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/cell-assignment-0Iw3wnF1.js](/public/build/assets/cell-assignment-0Iw3wnF1.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/cell-assignment-CD6Y6yK2.js](/public/build/assets/cell-assignment-CD6Y6yK2.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/cell-management-CDnBtwpe.js](/public/build/assets/cell-management-CDnBtwpe.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/cell-management-DTA1l98O.js](/public/build/assets/cell-management-DTA1l98O.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/certificate-of-detention-Dv\_dsBXH.js](/public/build/assets/certificate-of-detention-Dv_dsBXH.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/certificate-of-detention-YgG1I2Cn.js](/public/build/assets/certificate-of-detention-YgG1I2Cn.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/checkbox-CWIJLNTr.js](/public/build/assets/checkbox-CWIJLNTr.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/checkbox-sZP-Rulp.js](/public/build/assets/checkbox-sZP-Rulp.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/command-C04kKPjx.js](/public/build/assets/command-C04kKPjx.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/command-cggK63BW.js](/public/build/assets/command-cggK63BW.js) | JavaScript | -2 | -4 | -1 | -7 |
| [public/build/assets/court-list-DIy9cpDY.js](/public/build/assets/court-list-DIy9cpDY.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/court-order-B1MdKM\_N.js](/public/build/assets/court-order-B1MdKM_N.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/court-order-sVuqGVmP.js](/public/build/assets/court-order-sVuqGVmP.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/create-BHYT9rG1.js](/public/build/assets/create-BHYT9rG1.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/create-CB62wW8z.js](/public/build/assets/create-CB62wW8z.js) | JavaScript | -2 | -4 | -1 | -7 |
| [public/build/assets/create-event-5xhP2mbc.js](/public/build/assets/create-event-5xhP2mbc.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/create-event-C7SFgDEz.js](/public/build/assets/create-event-C7SFgDEz.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/create-pdl-information-BAfTGMAf.js](/public/build/assets/create-pdl-information-BAfTGMAf.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/create-pdl-information-BnvlZo87.js](/public/build/assets/create-pdl-information-BnvlZo87.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/custody-management-C054GtZ8.js](/public/build/assets/custody-management-C054GtZ8.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/dashboard-BD-GlSth.js](/public/build/assets/dashboard-BD-GlSth.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/dashboard-BM4yjk0C.js](/public/build/assets/dashboard-BM4yjk0C.js) | JavaScript | -3 | -8 | -1 | -12 |
| [public/build/assets/dashboard-CeMoNjFa.js](/public/build/assets/dashboard-CeMoNjFa.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/dashboard-D6LDuMJR.js](/public/build/assets/dashboard-D6LDuMJR.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/dashboard-D6LFiJQV.js](/public/build/assets/dashboard-D6LFiJQV.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/dashboard-Py903Y\_-.js](/public/build/assets/dashboard-Py903Y_-.js) | JavaScript | 3 | 8 | 1 | 12 |
| [public/build/assets/data-table-CdXOgC0P.js](/public/build/assets/data-table-CdXOgC0P.js) | JavaScript | 6 | 16 | 1 | 23 |
| [public/build/assets/data-table-Cnc7GZMm.js](/public/build/assets/data-table-Cnc7GZMm.js) | JavaScript | -6 | -16 | -1 | -23 |
| [public/build/assets/detail-jXiElUBF.js](/public/build/assets/detail-jXiElUBF.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/detail-oeYKesmf.js](/public/build/assets/detail-oeYKesmf.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/download-BKqJGcMM.js](/public/build/assets/download-BKqJGcMM.js) | JavaScript | -2 | -4 | -1 | -7 |
| [public/build/assets/download-DNe8aGal.js](/public/build/assets/download-DNe8aGal.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/dropdown-menu-3aHMrs\_F.js](/public/build/assets/dropdown-menu-3aHMrs_F.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/dropdown-menu-BQjRxx1t.js](/public/build/assets/dropdown-menu-BQjRxx1t.js) | JavaScript | -2 | -4 | -1 | -7 |
| [public/build/assets/drug-clearing-certificate-BASoiXys.js](/public/build/assets/drug-clearing-certificate-BASoiXys.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/drug-clearing-certificate-ZD9r5g5Q.js](/public/build/assets/drug-clearing-certificate-ZD9r5g5Q.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/drug-related-cases-monthly-CHu5kbJv.js](/public/build/assets/drug-related-cases-monthly-CHu5kbJv.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/drug-related-cases-monthly-D6xgn0xF.js](/public/build/assets/drug-related-cases-monthly-D6xgn0xF.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/edit-case-information-CfxVE24M.js](/public/build/assets/edit-case-information-CfxVE24M.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/edit-court-order-OqPJJkNx.js](/public/build/assets/edit-court-order-OqPJJkNx.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/edit-medical-record-DyCjCRJg.js](/public/build/assets/edit-medical-record-DyCjCRJg.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/edit-physical-characteristic-c8sQJvIJ.js](/public/build/assets/edit-physical-characteristic-c8sQJvIJ.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/eye-B8lowLFn.js](/public/build/assets/eye-B8lowLFn.js) | JavaScript | -2 | -4 | -1 | -7 |
| [public/build/assets/eye-YhM80ZuI.js](/public/build/assets/eye-YhM80ZuI.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/eye-off-COyWUic6.js](/public/build/assets/eye-off-COyWUic6.js) | JavaScript | -2 | -4 | -1 | -7 |
| [public/build/assets/eye-off-Ds1NgvJP.js](/public/build/assets/eye-off-Ds1NgvJP.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/forgot-password-D8ndBohQ.js](/public/build/assets/forgot-password-D8ndBohQ.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/forgot-password-DMI4vcoN.js](/public/build/assets/forgot-password-DMI4vcoN.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/gcta-tastm-report-AME5nrgP.js](/public/build/assets/gcta-tastm-report-AME5nrgP.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/gcta-tastm-report-DajtQ5Q2.js](/public/build/assets/gcta-tastm-report-DajtQ5Q2.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/health-assessment-D-XTkDfT.js](/public/build/assets/health-assessment-D-XTkDfT.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/health-assessment-D4AH\_V49.js](/public/build/assets/health-assessment-D4AH_V49.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/image-pSNkJrkG.js](/public/build/assets/image-pSNkJrkG.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/index-BFvJa6MF.js](/public/build/assets/index-BFvJa6MF.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/index-BHiRKjcJ.js](/public/build/assets/index-BHiRKjcJ.js) | JavaScript | -2 | -4 | -1 | -7 |
| [public/build/assets/index-B\_D8OfiT.js](/public/build/assets/index-B_D8OfiT.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/index-BhBvCQmn.js](/public/build/assets/index-BhBvCQmn.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/index-BuqPUp1W.js](/public/build/assets/index-BuqPUp1W.js) | JavaScript | 22 | 15 | 1 | 38 |
| [public/build/assets/index-C0U5jhjx.js](/public/build/assets/index-C0U5jhjx.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/index-CpJ\_UQcW.js](/public/build/assets/index-CpJ_UQcW.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/index-CuXwdDn1.js](/public/build/assets/index-CuXwdDn1.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/index-D790qEjM.js](/public/build/assets/index-D790qEjM.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/index-D\_lPPXtr.js](/public/build/assets/index-D_lPPXtr.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/index-LOQAaJzy.js](/public/build/assets/index-LOQAaJzy.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/index-cUzlZSPW.js](/public/build/assets/index-cUzlZSPW.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/inmates-status-BeJTxs57.js](/public/build/assets/inmates-status-BeJTxs57.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/inmates-status-CAlU7G8b.js](/public/build/assets/inmates-status-CAlU7G8b.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/inmates-status-daily-C91\_7lPc.js](/public/build/assets/inmates-status-daily-C91_7lPc.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/inmates-status-daily-D5QR8nn0.js](/public/build/assets/inmates-status-daily-D5QR8nn0.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/input-BS\_xsQ9S.js](/public/build/assets/input-BS_xsQ9S.js) | JavaScript | -3 | -8 | -1 | -12 |
| [public/build/assets/input-Ck-TdrSf.js](/public/build/assets/input-Ck-TdrSf.js) | JavaScript | 3 | 8 | 1 | 12 |
| [public/build/assets/input-error-Cvw2w7NP.js](/public/build/assets/input-error-Cvw2w7NP.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/input-error-CxlRydsG.js](/public/build/assets/input-error-CxlRydsG.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/jail-events-D0mdgVbk.js](/public/build/assets/jail-events-D0mdgVbk.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/jail-events-tkt2pR3N.js](/public/build/assets/jail-events-tkt2pR3N.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/label-Br4WJ6FG.js](/public/build/assets/label-Br4WJ6FG.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/label-CS0UIooq.js](/public/build/assets/label-CS0UIooq.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/layout-BO4G7KCG.js](/public/build/assets/layout-BO4G7KCG.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/layout-Srf2JIfJ.js](/public/build/assets/layout-Srf2JIfJ.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/list-3g7MBLxu.js](/public/build/assets/list-3g7MBLxu.js) | JavaScript | -3 | -8 | -1 | -12 |
| [public/build/assets/list-C1m4wjk5.js](/public/build/assets/list-C1m4wjk5.js) | JavaScript | -3 | -8 | -1 | -12 |
| [public/build/assets/list-CZqNLXGI.js](/public/build/assets/list-CZqNLXGI.js) | JavaScript | 3 | 8 | 1 | 12 |
| [public/build/assets/list-DBV2ttjJ.js](/public/build/assets/list-DBV2ttjJ.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/list-DCR3LN4I.js](/public/build/assets/list-DCR3LN4I.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/list-DTRpSB\_L.js](/public/build/assets/list-DTRpSB_L.js) | JavaScript | -2 | -4 | -1 | -7 |
| [public/build/assets/list-Dh2joUoj.js](/public/build/assets/list-Dh2joUoj.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/list-HPlqprTJ.js](/public/build/assets/list-HPlqprTJ.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/list-of-pdl-reports-DgK254WB.js](/public/build/assets/list-of-pdl-reports-DgK254WB.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/list-of-pdl-reports-OGZvat9Y.js](/public/build/assets/list-of-pdl-reports-OGZvat9Y.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/loader-circle-BL-pLoWm.js](/public/build/assets/loader-circle-BL-pLoWm.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/loader-circle-D1os5qeW.js](/public/build/assets/loader-circle-D1os5qeW.js) | JavaScript | -2 | -4 | -1 | -7 |
| [public/build/assets/lock-CVLeyUCs.js](/public/build/assets/lock-CVLeyUCs.js) | JavaScript | -2 | -4 | -1 | -7 |
| [public/build/assets/lock-D0E-lloR.js](/public/build/assets/lock-D0E-lloR.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/medical-records-CZSaNN-K.js](/public/build/assets/medical-records-CZSaNN-K.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/medical-records-zVsmPdzi.js](/public/build/assets/medical-records-zVsmPdzi.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/no-records-certificate-CDYt0RTw.js](/public/build/assets/no-records-certificate-CDYt0RTw.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/no-records-certificate-CYLhZ4Ih.js](/public/build/assets/no-records-certificate-CYLhZ4Ih.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/password-BZINJoUq.js](/public/build/assets/password-BZINJoUq.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/password-CORK0mcR.js](/public/build/assets/password-CORK0mcR.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/pdl-archives-Bx0KXhqM.js](/public/build/assets/pdl-archives-Bx0KXhqM.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/pdl-archives-Dl1Wx2o3.js](/public/build/assets/pdl-archives-Dl1Wx2o3.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/personal-information-DQwFUjlQ.js](/public/build/assets/personal-information-DQwFUjlQ.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/personal-information-admin-B5\_\_GcrF.js](/public/build/assets/personal-information-admin-B5__GcrF.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/personal-information-admin-l0rcEb\_k.js](/public/build/assets/personal-information-admin-l0rcEb_k.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/personal-information-oUiyn4we.js](/public/build/assets/personal-information-oUiyn4we.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/physical-characteristics-B98AxxwS.js](/public/build/assets/physical-characteristics-B98AxxwS.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/physical-characteristics-CKbBTa4c.js](/public/build/assets/physical-characteristics-CKbBTa4c.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/plus-CW2GUMnA.js](/public/build/assets/plus-CW2GUMnA.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/plus-DUoRAMYM.js](/public/build/assets/plus-DUoRAMYM.js) | JavaScript | -2 | -4 | -1 | -7 |
| [public/build/assets/population-report-BAT0d8M7.js](/public/build/assets/population-report-BAT0d8M7.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/population-report-oQOnBEhu.js](/public/build/assets/population-report-oQOnBEhu.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/profie-Dwmf0DJb.js](/public/build/assets/profie-Dwmf0DJb.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/profie-Yqrxi9bi.js](/public/build/assets/profie-Yqrxi9bi.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/profile-06zDjjIk.js](/public/build/assets/profile-06zDjjIk.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/profile-bMD9o5q-.js](/public/build/assets/profile-bMD9o5q-.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/profile-management-77Dgwhm-.js](/public/build/assets/profile-management-77Dgwhm-.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/profile-management-BzSf09Ym.js](/public/build/assets/profile-management-BzSf09Ym.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/progress-LINHkAX9.js](/public/build/assets/progress-LINHkAX9.js) | JavaScript | -7 | -8 | -2 | -17 |
| [public/build/assets/radio-group-C7XEDH3e.js](/public/build/assets/radio-group-C7XEDH3e.js) | JavaScript | -2 | -4 | -1 | -7 |
| [public/build/assets/radio-group-DEwBk1-o.js](/public/build/assets/radio-group-DEwBk1-o.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/results-CXRtBJ3Q.js](/public/build/assets/results-CXRtBJ3Q.js) | JavaScript | -3 | -8 | -1 | -12 |
| [public/build/assets/results-CtOwn4aZ.js](/public/build/assets/results-CtOwn4aZ.js) | JavaScript | 3 | 8 | 1 | 12 |
| [public/build/assets/scale-Bjeu-qsv.js](/public/build/assets/scale-Bjeu-qsv.js) | JavaScript | 5 | 16 | 1 | 22 |
| [public/build/assets/scale-DVrI9DmE.js](/public/build/assets/scale-DVrI9DmE.js) | JavaScript | -5 | -16 | -1 | -22 |
| [public/build/assets/select-BBZMYkik.js](/public/build/assets/select-BBZMYkik.js) | JavaScript | -2 | -4 | -1 | -7 |
| [public/build/assets/select-Cbe0A\_wq.js](/public/build/assets/select-Cbe0A_wq.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/separator-BvKtsuET.js](/public/build/assets/separator-BvKtsuET.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/separator-CPFO9C7\_.js](/public/build/assets/separator-CPFO9C7_.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/shield-BfSoSboW.js](/public/build/assets/shield-BfSoSboW.js) | JavaScript | -2 | -4 | -1 | -7 |
| [public/build/assets/shield-WprgJKiJ.js](/public/build/assets/shield-WprgJKiJ.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/show-CjrMYuO4.js](/public/build/assets/show-CjrMYuO4.js) | JavaScript | 3 | 8 | 1 | 12 |
| [public/build/assets/show-DpTN79ri.js](/public/build/assets/show-DpTN79ri.js) | JavaScript | -3 | -8 | -1 | -12 |
| [public/build/assets/square-pen-CejSo5qV.js](/public/build/assets/square-pen-CejSo5qV.js) | JavaScript | -2 | -4 | -1 | -7 |
| [public/build/assets/square-pen-tveyayPY.js](/public/build/assets/square-pen-tveyayPY.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/table-C22pG3nj.js](/public/build/assets/table-C22pG3nj.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/table-k\_TbSi63.js](/public/build/assets/table-k_TbSi63.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/tabs-B1nSmZO\_.js](/public/build/assets/tabs-B1nSmZO_.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/tabs-D8NqiNnX.js](/public/build/assets/tabs-D8NqiNnX.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/textarea-BmLTENgj.js](/public/build/assets/textarea-BmLTENgj.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/textarea-Diy51N5h.js](/public/build/assets/textarea-Diy51N5h.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/transition-B7SWznhX.js](/public/build/assets/transition-B7SWznhX.js) | JavaScript | -5 | 0 | -1 | -6 |
| [public/build/assets/transition-C5NAs8xx.js](/public/build/assets/transition-C5NAs8xx.js) | JavaScript | 5 | 0 | 1 | 6 |
| [public/build/assets/trash-2-CA4fYNQR.js](/public/build/assets/trash-2-CA4fYNQR.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/trending-up-CQfyb\_qf.js](/public/build/assets/trending-up-CQfyb_qf.js) | JavaScript | -2 | -4 | -1 | -7 |
| [public/build/assets/trending-up-DGNvTdpQ.js](/public/build/assets/trending-up-DGNvTdpQ.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/triangle-alert-Cfc0mhXY.js](/public/build/assets/triangle-alert-Cfc0mhXY.js) | JavaScript | -2 | -4 | -1 | -7 |
| [public/build/assets/triangle-alert-\_AUliq2N.js](/public/build/assets/triangle-alert-_AUliq2N.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/update-pdl-information-4kz3-Le3.js](/public/build/assets/update-pdl-information-4kz3-Le3.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/update-pdl-information-C1L0ymoB.js](/public/build/assets/update-pdl-information-C1L0ymoB.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/usePSGCLocation-CQjEVx4Z.js](/public/build/assets/usePSGCLocation-CQjEVx4Z.js) | JavaScript | 6 | 4 | 2 | 12 |
| [public/build/assets/user-CmeQLBVE.js](/public/build/assets/user-CmeQLBVE.js) | JavaScript | -2 | -4 | -1 | -7 |
| [public/build/assets/user-IpuL6Ol5.js](/public/build/assets/user-IpuL6Ol5.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/users-BxYB4q2L.js](/public/build/assets/users-BxYB4q2L.js) | JavaScript | -8 | -28 | -1 | -37 |
| [public/build/assets/users-CJDzaCO4.js](/public/build/assets/users-CJDzaCO4.js) | JavaScript | 8 | 28 | 1 | 37 |
| [public/build/assets/view-pdl-information-CKWzbjKH.js](/public/build/assets/view-pdl-information-CKWzbjKH.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/view-pdl-information-ORSLFmmL.js](/public/build/assets/view-pdl-information-ORSLFmmL.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/welcome-C06BPBQw.js](/public/build/assets/welcome-C06BPBQw.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/welcome-Cbpe7U6Z.js](/public/build/assets/welcome-Cbpe7U6Z.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/manifest.json](/public/build/manifest.json) | JSON | 342 | 0 | 0 | 342 |
| [resources/css/app.css](/resources/css/app.css) | CSS | -1 | 0 | 9 | 8 |
| [resources/js/components/app-sidebar-header.tsx](/resources/js/components/app-sidebar-header.tsx) | TypeScript JSX | 0 | 1 | 1 | 2 |
| [resources/js/components/app-sidebar.tsx](/resources/js/components/app-sidebar.tsx) | TypeScript JSX | 7 | 0 | 1 | 8 |
| [resources/js/components/ui/alert-dialog.tsx](/resources/js/components/ui/alert-dialog.tsx) | TypeScript JSX | 126 | 0 | 14 | 140 |
| [resources/js/components/ui/badge.tsx](/resources/js/components/ui/badge.tsx) | TypeScript JSX | 22 | 0 | 0 | 22 |
| [resources/js/components/ui/sonner.tsx](/resources/js/components/ui/sonner.tsx) | TypeScript JSX | 25 | 0 | 5 | 30 |
| [resources/js/features/cancel-event.tsx](/resources/js/features/cancel-event.tsx) | TypeScript JSX | 100 | 1 | 7 | 108 |
| [resources/js/features/court-hearing/create-event.tsx](/resources/js/features/court-hearing/create-event.tsx) | TypeScript JSX | -1 | 1 | 1 | 1 |
| [resources/js/features/create-court.tsx](/resources/js/features/create-court.tsx) | TypeScript JSX | 115 | 0 | 6 | 121 |
| [resources/js/features/edit-court.tsx](/resources/js/features/edit-court.tsx) | TypeScript JSX | 128 | 1 | 7 | 136 |
| [resources/js/features/pdl-management/add-case-information.tsx](/resources/js/features/pdl-management/add-case-information.tsx) | TypeScript JSX | 253 | 19 | 28 | 300 |
| [resources/js/features/pdl-management/case-information-columns.tsx](/resources/js/features/pdl-management/case-information-columns.tsx) | TypeScript JSX | 6 | 0 | -1 | 5 |
| [resources/js/features/pdl-management/cell-assignment-columns.tsx](/resources/js/features/pdl-management/cell-assignment-columns.tsx) | TypeScript JSX | -17 | 0 | 0 | -17 |
| [resources/js/features/pdl-management/cell-management-columns.tsx](/resources/js/features/pdl-management/cell-management-columns.tsx) | TypeScript JSX | 9 | 0 | 1 | 10 |
| [resources/js/features/pdl-management/cell-transfer-log-columns.tsx](/resources/js/features/pdl-management/cell-transfer-log-columns.tsx) | TypeScript JSX | 60 | 0 | 3 | 63 |
| [resources/js/features/pdl-management/court\_order\_columns.tsx](/resources/js/features/pdl-management/court_order_columns.tsx) | TypeScript JSX | 23 | -1 | 7 | 29 |
| [resources/js/features/pdl-management/create-case-information.tsx](/resources/js/features/pdl-management/create-case-information.tsx) | TypeScript JSX | 1 | 0 | 0 | 1 |
| [resources/js/features/pdl-management/create-cell-information.tsx](/resources/js/features/pdl-management/create-cell-information.tsx) | TypeScript JSX | 19 | 1 | 1 | 21 |
| [resources/js/features/pdl-management/create-court-order.tsx](/resources/js/features/pdl-management/create-court-order.tsx) | TypeScript JSX | 215 | 4 | 8 | 227 |
| [resources/js/features/pdl-management/create-medical-record.tsx](/resources/js/features/pdl-management/create-medical-record.tsx) | TypeScript JSX | -15 | -2 | 0 | -17 |
| [resources/js/features/pdl-management/create-physical-characteristic.tsx](/resources/js/features/pdl-management/create-physical-characteristic.tsx) | TypeScript JSX | 10 | 1 | 1 | 12 |
| [resources/js/features/pdl-management/delete-case-information.tsx](/resources/js/features/pdl-management/delete-case-information.tsx) | TypeScript JSX | 79 | 0 | 6 | 85 |
| [resources/js/features/pdl-management/delete-court-order.tsx](/resources/js/features/pdl-management/delete-court-order.tsx) | TypeScript JSX | 79 | 0 | 6 | 85 |
| [resources/js/features/pdl-management/delete-medical-record.tsx](/resources/js/features/pdl-management/delete-medical-record.tsx) | TypeScript JSX | 79 | 0 | 6 | 85 |
| [resources/js/features/pdl-management/delete-physical-characteristic.tsx](/resources/js/features/pdl-management/delete-physical-characteristic.tsx) | TypeScript JSX | 67 | 0 | 6 | 73 |
| [resources/js/features/pdl-management/edit-case-information.tsx](/resources/js/features/pdl-management/edit-case-information.tsx) | TypeScript JSX | 291 | 19 | 22 | 332 |
| [resources/js/features/pdl-management/edit-cell-information.tsx](/resources/js/features/pdl-management/edit-cell-information.tsx) | TypeScript JSX | 19 | 1 | 1 | 21 |
| [resources/js/features/pdl-management/edit-court-order.tsx](/resources/js/features/pdl-management/edit-court-order.tsx) | TypeScript JSX | 388 | 14 | 26 | 428 |
| [resources/js/features/pdl-management/edit-medical-record.tsx](/resources/js/features/pdl-management/edit-medical-record.tsx) | TypeScript JSX | -51 | 0 | -1 | -52 |
| [resources/js/features/pdl-management/edit-physical-characteristic.tsx](/resources/js/features/pdl-management/edit-physical-characteristic.tsx) | TypeScript JSX | 0 | 1 | 1 | 2 |
| [resources/js/features/pdl-management/medical-record-columns.tsx](/resources/js/features/pdl-management/medical-record-columns.tsx) | TypeScript JSX | 20 | 0 | 2 | 22 |
| [resources/js/features/pdl-management/physical-characteristic-columns.tsx](/resources/js/features/pdl-management/physical-characteristic-columns.tsx) | TypeScript JSX | 3 | 0 | 0 | 3 |
| [resources/js/features/pdl-management/transfer-cell.tsx](/resources/js/features/pdl-management/transfer-cell.tsx) | TypeScript JSX | 162 | 8 | 20 | 190 |
| [resources/js/features/pdl-management/transfer-pdl.tsx](/resources/js/features/pdl-management/transfer-pdl.tsx) | TypeScript JSX | 8 | 0 | 1 | 9 |
| [resources/js/features/pdl-management/update-case-status.tsx](/resources/js/features/pdl-management/update-case-status.tsx) | TypeScript JSX | 129 | 1 | 22 | 152 |
| [resources/js/features/pdl-management/view-cell-activity-log.tsx](/resources/js/features/pdl-management/view-cell-activity-log.tsx) | TypeScript JSX | 15 | 0 | 3 | 18 |
| [resources/js/features/pdl-management/view-pdl-information.tsx](/resources/js/features/pdl-management/view-pdl-information.tsx) | TypeScript JSX | 54 | 0 | 9 | 63 |
| [resources/js/features/request-log/request-logs-table.tsx](/resources/js/features/request-log/request-logs-table.tsx) | TypeScript JSX | 306 | 10 | 26 | 342 |
| [resources/js/features/request-log/requestlog-details-dialog.tsx](/resources/js/features/request-log/requestlog-details-dialog.tsx) | TypeScript JSX | 201 | 5 | 19 | 225 |
| [resources/js/features/reschedule-event.tsx](/resources/js/features/reschedule-event.tsx) | TypeScript JSX | 145 | 3 | 10 | 158 |
| [resources/js/features/time-allowance/manage-time-allowance.tsx](/resources/js/features/time-allowance/manage-time-allowance.tsx) | TypeScript JSX | 22 | 1 | 3 | 26 |
| [resources/js/features/user-management/create-agency.tsx](/resources/js/features/user-management/create-agency.tsx) | TypeScript JSX | 72 | 0 | 9 | 81 |
| [resources/js/features/user-management/create-user.tsx](/resources/js/features/user-management/create-user.tsx) | TypeScript JSX | -18 | 2 | -6 | -22 |
| [resources/js/features/user-management/edit-user.tsx](/resources/js/features/user-management/edit-user.tsx) | TypeScript JSX | 3 | 0 | 3 | 6 |
| [resources/js/features/verification/verification-card.tsx](/resources/js/features/verification/verification-card.tsx) | TypeScript JSX | 12 | 0 | 1 | 13 |
| [resources/js/hooks/usePSGCLocation.ts](/resources/js/hooks/usePSGCLocation.ts) | TypeScript | 205 | 17 | 30 | 252 |
| [resources/js/layouts/app-layout.tsx](/resources/js/layouts/app-layout.tsx) | TypeScript JSX | 2 | 0 | 1 | 3 |
| [resources/js/layouts/app/app-sidebar-layout.tsx](/resources/js/layouts/app/app-sidebar-layout.tsx) | TypeScript JSX | 25 | 2 | 5 | 32 |
| [resources/js/pages/admin/archive/list.tsx](/resources/js/pages/admin/archive/list.tsx) | TypeScript JSX | 439 | 10 | 6 | 455 |
| [resources/js/pages/admin/pdl/archive.tsx](/resources/js/pages/admin/pdl/archive.tsx) | TypeScript JSX | 53 | 1 | 1 | 55 |
| [resources/js/pages/admin/profile-management/profie.tsx](/resources/js/pages/admin/profile-management/profie.tsx) | TypeScript JSX | 11 | 0 | 1 | 12 |
| [resources/js/pages/admin/report/certificate-of-detention.tsx](/resources/js/pages/admin/report/certificate-of-detention.tsx) | TypeScript JSX | 32 | 0 | 0 | 32 |
| [resources/js/pages/admin/report/gcta-tastm-report.tsx](/resources/js/pages/admin/report/gcta-tastm-report.tsx) | TypeScript JSX | 44 | 0 | 3 | 47 |
| [resources/js/pages/admin/report/inmates-status.tsx](/resources/js/pages/admin/report/inmates-status.tsx) | TypeScript JSX | 36 | 0 | 0 | 36 |
| [resources/js/pages/admin/report/list-of-pdl-reports.tsx](/resources/js/pages/admin/report/list-of-pdl-reports.tsx) | TypeScript JSX | 9 | 0 | 2 | 11 |
| [resources/js/pages/admin/report/no-records-certificate.tsx](/resources/js/pages/admin/report/no-records-certificate.tsx) | TypeScript JSX | 61 | 2 | 8 | 71 |
| [resources/js/pages/admin/report/population-report.tsx](/resources/js/pages/admin/report/population-report.tsx) | TypeScript JSX | 4 | 0 | 2 | 6 |
| [resources/js/pages/admin/request-logs/index.tsx](/resources/js/pages/admin/request-logs/index.tsx) | TypeScript JSX | 34 | 1 | 6 | 41 |
| [resources/js/pages/admin/user-management/list.tsx](/resources/js/pages/admin/user-management/list.tsx) | TypeScript JSX | 2 | 0 | 0 | 2 |
| [resources/js/pages/dashboard.tsx](/resources/js/pages/dashboard.tsx) | TypeScript JSX | 9 | 0 | 0 | 9 |
| [resources/js/pages/law-enforcement/dashboard/dashboard.tsx](/resources/js/pages/law-enforcement/dashboard/dashboard.tsx) | TypeScript JSX | 2 | 0 | 1 | 3 |
| [resources/js/pages/records-officer/court-list.tsx](/resources/js/pages/records-officer/court-list.tsx) | TypeScript JSX | 89 | 0 | 15 | 104 |
| [resources/js/pages/records-officer/jail-events/jail-events.tsx](/resources/js/pages/records-officer/jail-events/jail-events.tsx) | TypeScript JSX | 26 | 1 | 7 | 34 |
| [resources/js/pages/records-officer/pdl-management/case-information.tsx](/resources/js/pages/records-officer/pdl-management/case-information.tsx) | TypeScript JSX | 6 | 0 | 0 | 6 |
| [resources/js/pages/records-officer/pdl-management/cell-activity-log.tsx](/resources/js/pages/records-officer/pdl-management/cell-activity-log.tsx) | TypeScript JSX | 154 | 0 | 14 | 168 |
| [resources/js/pages/records-officer/pdl-management/cell-assignment.tsx](/resources/js/pages/records-officer/pdl-management/cell-assignment.tsx) | TypeScript JSX | 28 | 0 | 1 | 29 |
| [resources/js/pages/records-officer/pdl-management/court-order.tsx](/resources/js/pages/records-officer/pdl-management/court-order.tsx) | TypeScript JSX | 12 | 3 | 1 | 16 |
| [resources/js/pages/records-officer/pdl-management/create-pdl-information.tsx](/resources/js/pages/records-officer/pdl-management/create-pdl-information.tsx) | TypeScript JSX | 869 | 37 | 40 | 946 |
| [resources/js/pages/records-officer/pdl-management/edit-case-information.tsx](/resources/js/pages/records-officer/pdl-management/edit-case-information.tsx) | TypeScript JSX | 326 | 18 | 21 | 365 |
| [resources/js/pages/records-officer/pdl-management/edit-court-order.tsx](/resources/js/pages/records-officer/pdl-management/edit-court-order.tsx) | TypeScript JSX | 407 | 12 | 30 | 449 |
| [resources/js/pages/records-officer/pdl-management/edit-medical-record.tsx](/resources/js/pages/records-officer/pdl-management/edit-medical-record.tsx) | TypeScript JSX | 155 | 5 | 17 | 177 |
| [resources/js/pages/records-officer/pdl-management/edit-physical-characteristic.tsx](/resources/js/pages/records-officer/pdl-management/edit-physical-characteristic.tsx) | TypeScript JSX | 206 | 10 | 22 | 238 |
| [resources/js/pages/records-officer/pdl-management/medical-records.tsx](/resources/js/pages/records-officer/pdl-management/medical-records.tsx) | TypeScript JSX | 5 | 0 | 0 | 5 |
| [resources/js/pages/records-officer/pdl-management/personal-information-admin.tsx](/resources/js/pages/records-officer/pdl-management/personal-information-admin.tsx) | TypeScript JSX | 178 | 10 | 11 | 199 |
| [resources/js/pages/records-officer/pdl-management/personal-information.tsx](/resources/js/pages/records-officer/pdl-management/personal-information.tsx) | TypeScript JSX | 221 | 7 | 11 | 239 |
| [resources/js/pages/records-officer/pdl-management/physical-characteristics.tsx](/resources/js/pages/records-officer/pdl-management/physical-characteristics.tsx) | TypeScript JSX | 8 | 0 | 0 | 8 |
| [resources/js/pages/records-officer/pdl-management/update-pdl-information.tsx](/resources/js/pages/records-officer/pdl-management/update-pdl-information.tsx) | TypeScript JSX | 1,117 | 57 | 54 | 1,228 |
| [resources/js/types/index.d.ts](/resources/js/types/index.d.ts) | TypeScript | 61 | 0 | 6 | 67 |
| [resources/views/reports/certificate-of-detention.blade.php](/resources/views/reports/certificate-of-detention.blade.php) | PHP | 28 | 0 | -2 | 26 |
| [resources/views/reports/drug-cases-monthly.blade.php](/resources/views/reports/drug-cases-monthly.blade.php) | PHP | 57 | 0 | 5 | 62 |
| [resources/views/reports/gcta-tastm.blade.php](/resources/views/reports/gcta-tastm.blade.php) | PHP | 117 | 1 | 16 | 134 |
| [resources/views/reports/inmate-status-report.blade.php](/resources/views/reports/inmate-status-report.blade.php) | PHP | 168 | 0 | 25 | 193 |
| [resources/views/reports/inmates-status.blade.php](/resources/views/reports/inmates-status.blade.php) | PHP | 6 | 0 | 3 | 9 |
| [resources/views/reports/no-records-certificate.blade.php](/resources/views/reports/no-records-certificate.blade.php) | PHP | -6 | 0 | 0 | -6 |
| [resources/views/reports/pdl-information.blade.php](/resources/views/reports/pdl-information.blade.php) | PHP | 283 | 0 | 40 | 323 |
| [resources/views/reports/pdl-list.blade.php](/resources/views/reports/pdl-list.blade.php) | PHP | 60 | 0 | 17 | 77 |
| [resources/views/reports/pdl-report.blade.php](/resources/views/reports/pdl-report.blade.php) | PHP | 18 | 0 | 0 | 18 |
| [resources/views/reports/population-report.blade.php](/resources/views/reports/population-report.blade.php) | PHP | 58 | 0 | 8 | 66 |
| [resources/views/test-logo.blade.php](/resources/views/test-logo.blade.php) | PHP | 40 | 0 | 4 | 44 |
| [routes/web.php](/routes/web.php) | PHP | 72 | 1 | 38 | 111 |
| [test-psgc-api.js](/test-psgc-api.js) | JavaScript | 39 | 6 | 9 | 54 |

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details