# Diff Details

Date : 2025-09-20 05:11:04

Directory c:\\xampp\\htdocs\\pdl-is

Total : 216 files,  5816 codes, 296 comments, 616 blanks, all 6728 lines

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [app/Http/Controllers/Admin/VerificationController.php](/app/Http/Controllers/Admin/VerificationController.php) | PHP | 9 | 1 | 1 | 11 |
| [app/Http/Controllers/CaseInformationController.php](/app/Http/Controllers/CaseInformationController.php) | PHP | 8 | 0 | 0 | 8 |
| [app/Http/Controllers/CustodyController.php](/app/Http/Controllers/CustodyController.php) | PHP | 41 | 4 | 9 | 54 |
| [app/Http/Controllers/DashboardController.php](/app/Http/Controllers/DashboardController.php) | PHP | 23 | 1 | 3 | 27 |
| [app/Http/Controllers/MedicalRecordController.php](/app/Http/Controllers/MedicalRecordController.php) | PHP | 8 | 0 | 0 | 8 |
| [app/Http/Controllers/PdlArchiveController.php](/app/Http/Controllers/PdlArchiveController.php) | PHP | 99 | 19 | 23 | 141 |
| [app/Http/Controllers/PhysicalCharacteristicController.php](/app/Http/Controllers/PhysicalCharacteristicController.php) | PHP | 10 | 0 | 1 | 11 |
| [app/Http/Controllers/RecordOfficer/JailEventsController.php](/app/Http/Controllers/RecordOfficer/JailEventsController.php) | PHP | 2 | 0 | 4 | 6 |
| [app/Http/Controllers/RecordOfficer/PDLManagementController.php](/app/Http/Controllers/RecordOfficer/PDLManagementController.php) | PHP | 3 | 0 | 0 | 3 |
| [app/Http/Controllers/ReportController.php](/app/Http/Controllers/ReportController.php) | PHP | 435 | 17 | 74 | 526 |
| [app/Http/Controllers/TimeAllowanceController.php](/app/Http/Controllers/TimeAllowanceController.php) | PHP | 48 | 0 | 9 | 57 |
| [app/Http/Controllers/UserPDLArchiveController.php](/app/Http/Controllers/UserPDLArchiveController.php) | PHP | 47 | 1 | 8 | 56 |
| [app/Http/Middleware/ShareNotifications.php](/app/Http/Middleware/ShareNotifications.php) | PHP | 15 | 4 | 3 | 22 |
| [app/Http/Requests/CreatePDLOnePageRequest.php](/app/Http/Requests/CreatePDLOnePageRequest.php) | PHP | 1 | 0 | 0 | 1 |
| [app/Models/CourtOrder.php](/app/Models/CourtOrder.php) | PHP | 4 | 0 | 0 | 4 |
| [app/Models/Pdl.php](/app/Models/Pdl.php) | PHP | 92 | 11 | 17 | 120 |
| [app/Services/NotificationService.php](/app/Services/NotificationService.php) | PHP | 26 | 6 | 2 | 34 |
| [database/migrations/2025\_09\_16\_223030\_add\_archiving\_fields\_to\_pdls\_table.php](/database/migrations/2025_09_16_223030_add_archiving_fields_to_pdls_table.php) | PHP | 45 | 6 | 5 | 56 |
| [database/migrations/2025\_09\_16\_224304\_add\_court\_order\_fields\_to\_pdl\_table.php](/database/migrations/2025_09_16_224304_add_court_order_fields_to_pdl_table.php) | PHP | 13 | 13 | 4 | 30 |
| [database/migrations/2025\_09\_16\_225139\_move\_archiving\_fields\_to\_case\_information\_table.php](/database/migrations/2025_09_16_225139_move_archiving_fields_to_case_information_table.php) | PHP | 75 | 10 | 8 | 93 |
| [database/migrations/2025\_09\_16\_225451\_move\_archiving\_fields\_to\_court\_orders\_table.php](/database/migrations/2025_09_16_225451_move_archiving_fields_to_court_orders_table.php) | PHP | 73 | 10 | 8 | 91 |
| [database/migrations/2025\_09\_19\_181009\_add\_archive\_fields\_to\_pdl\_table.php](/database/migrations/2025_09_19_181009_add_archive_fields_to_pdl_table.php) | PHP | 35 | 6 | 5 | 46 |
| [database/migrations/2025\_09\_19\_182031\_add\_court\_order\_fields\_to\_pdl\_archive.php](/database/migrations/2025_09_19_182031_add_court_order_fields_to_pdl_archive.php) | PHP | 35 | 6 | 5 | 46 |
| [database/migrations/2025\_09\_19\_194756\_make\_pdl\_id\_nullable\_in\_system\_notifications\_table.php](/database/migrations/2025_09_19_194756_make_pdl_id_nullable_in_system_notifications_table.php) | PHP | 17 | 8 | 4 | 29 |
| [database/seeders/PersonnelSeeder.php](/database/seeders/PersonnelSeeder.php) | PHP | 0 | 0 | 1 | 1 |
| [public/build/assets/PieChart-9VGzp2I5.js](/public/build/assets/PieChart-9VGzp2I5.js) | JavaScript | 67 | 11 | 1 | 79 |
| [public/build/assets/PieChart-Rd69OCC8.js](/public/build/assets/PieChart-Rd69OCC8.js) | JavaScript | -71 | -27 | -1 | -99 |
| [public/build/assets/accordion-CWJVgog7.js](/public/build/assets/accordion-CWJVgog7.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/accordion-DkYmkr0A.js](/public/build/assets/accordion-DkYmkr0A.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/alert-Cr1nbU3H.js](/public/build/assets/alert-Cr1nbU3H.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/alert-CuSR\_Jww.js](/public/build/assets/alert-CuSR_Jww.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/app-B6Uqmd67.css](/public/build/assets/app-B6Uqmd67.css) | CSS | 1 | 0 | 1 | 2 |
| [public/build/assets/app-BvoQFbYW.css](/public/build/assets/app-BvoQFbYW.css) | CSS | -1 | 0 | -1 | -2 |
| [public/build/assets/app-D7sJuwJc.js](/public/build/assets/app-D7sJuwJc.js) | JavaScript | 76 | 35 | 13 | 124 |
| [public/build/assets/app-DcCWX9mk.js](/public/build/assets/app-DcCWX9mk.js) | JavaScript | -76 | -35 | -13 | -124 |
| [public/build/assets/app-layout-CwuzIVoQ.js](/public/build/assets/app-layout-CwuzIVoQ.js) | JavaScript | -45 | -28 | -8 | -81 |
| [public/build/assets/app-layout-l1YM3YbX.js](/public/build/assets/app-layout-l1YM3YbX.js) | JavaScript | 46 | 32 | 8 | 86 |
| [public/build/assets/appearance-B993ZYZk.js](/public/build/assets/appearance-B993ZYZk.js) | JavaScript | 4 | 12 | 1 | 17 |
| [public/build/assets/appearance-DCUKUIJQ.js](/public/build/assets/appearance-DCUKUIJQ.js) | JavaScript | -4 | -12 | -1 | -17 |
| [public/build/assets/archive-C-v6ttJl.js](/public/build/assets/archive-C-v6ttJl.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/archive-DF7wGM0K.js](/public/build/assets/archive-DF7wGM0K.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/archived-BxhXcYX6.js](/public/build/assets/archived-BxhXcYX6.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/arrow-left-DfiAP-S2.js](/public/build/assets/arrow-left-DfiAP-S2.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/badge-C-b1LAND.js](/public/build/assets/badge-C-b1LAND.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/badge-DDkQ-Sjn.js](/public/build/assets/badge-DDkQ-Sjn.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/button-u9ZiHX7C.js](/public/build/assets/button-u9ZiHX7C.js) | JavaScript | 5 | 16 | 1 | 22 |
| [public/build/assets/calendar-2ukcrKyw.js](/public/build/assets/calendar-2ukcrKyw.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/calendar-bIn4vfxR.js](/public/build/assets/calendar-bIn4vfxR.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/card-DLWDwqHf.js](/public/build/assets/card-DLWDwqHf.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/card-QNSo3ZOw.js](/public/build/assets/card-QNSo3ZOw.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/case-information-DQiBFTjF.js](/public/build/assets/case-information-DQiBFTjF.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/case-information-nmOFlgB2.js](/public/build/assets/case-information-nmOFlgB2.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/cell-assignment-0Iw3wnF1.js](/public/build/assets/cell-assignment-0Iw3wnF1.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/cell-assignment-C\_dND05F.js](/public/build/assets/cell-assignment-C_dND05F.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/cell-management-BzQR\_aqz.js](/public/build/assets/cell-management-BzQR_aqz.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/cell-management-CDnBtwpe.js](/public/build/assets/cell-management-CDnBtwpe.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/certificate-of-detention-Dv\_dsBXH.js](/public/build/assets/certificate-of-detention-Dv_dsBXH.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/checkbox-CQkbq8Ug.js](/public/build/assets/checkbox-CQkbq8Ug.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/checkbox-sZP-Rulp.js](/public/build/assets/checkbox-sZP-Rulp.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/circle-alert-nkaXhu1c.js](/public/build/assets/circle-alert-nkaXhu1c.js) | JavaScript | -2 | -4 | -1 | -7 |
| [public/build/assets/circle-check-big-BKf4FuBb.js](/public/build/assets/circle-check-big-BKf4FuBb.js) | JavaScript | -2 | -4 | -1 | -7 |
| [public/build/assets/command-cggK63BW.js](/public/build/assets/command-cggK63BW.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/court-order-Cw2BDQsb.js](/public/build/assets/court-order-Cw2BDQsb.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/court-order-sVuqGVmP.js](/public/build/assets/court-order-sVuqGVmP.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/create-CB62wW8z.js](/public/build/assets/create-CB62wW8z.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/create-event-C7SFgDEz.js](/public/build/assets/create-event-C7SFgDEz.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/create-event-xPFki9ud.js](/public/build/assets/create-event-xPFki9ud.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/create-pdl-information-BAfTGMAf.js](/public/build/assets/create-pdl-information-BAfTGMAf.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/create-pdl-information-CNDMKpML.js](/public/build/assets/create-pdl-information-CNDMKpML.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/dashboard-BD-GlSth.js](/public/build/assets/dashboard-BD-GlSth.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/dashboard-BM4yjk0C.js](/public/build/assets/dashboard-BM4yjk0C.js) | JavaScript | 3 | 8 | 1 | 12 |
| [public/build/assets/dashboard-BlE8Amlw.js](/public/build/assets/dashboard-BlE8Amlw.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/dashboard-D41JX840.js](/public/build/assets/dashboard-D41JX840.js) | JavaScript | -5 | -16 | -1 | -22 |
| [public/build/assets/dashboard-D6LDuMJR.js](/public/build/assets/dashboard-D6LDuMJR.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/data-table-Cnc7GZMm.js](/public/build/assets/data-table-Cnc7GZMm.js) | JavaScript | 6 | 16 | 1 | 23 |
| [public/build/assets/data-table-j-gwovtj.js](/public/build/assets/data-table-j-gwovtj.js) | JavaScript | -6 | -16 | -1 | -23 |
| [public/build/assets/detail-oeYKesmf.js](/public/build/assets/detail-oeYKesmf.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/download-BKqJGcMM.js](/public/build/assets/download-BKqJGcMM.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/dropdown-menu-BQjRxx1t.js](/public/build/assets/dropdown-menu-BQjRxx1t.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/dropdown-menu-CMrTdwkl.js](/public/build/assets/dropdown-menu-CMrTdwkl.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/drug-clearing-certificate-ZD9r5g5Q.js](/public/build/assets/drug-clearing-certificate-ZD9r5g5Q.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/drug-related-cases-monthly-D6xgn0xF.js](/public/build/assets/drug-related-cases-monthly-D6xgn0xF.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/ellipsis-DzfNUrwQ.js](/public/build/assets/ellipsis-DzfNUrwQ.js) | JavaScript | -2 | -4 | -1 | -7 |
| [public/build/assets/eye-B8lowLFn.js](/public/build/assets/eye-B8lowLFn.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/eye-Bac0spqN.js](/public/build/assets/eye-Bac0spqN.js) | JavaScript | -2 | -4 | -1 | -7 |
| [public/build/assets/eye-off-CCxCyiMC.js](/public/build/assets/eye-off-CCxCyiMC.js) | JavaScript | -2 | -4 | -1 | -7 |
| [public/build/assets/eye-off-COyWUic6.js](/public/build/assets/eye-off-COyWUic6.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/forgot-password-BnaBJ1JL.js](/public/build/assets/forgot-password-BnaBJ1JL.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/forgot-password-D8ndBohQ.js](/public/build/assets/forgot-password-D8ndBohQ.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/format-B3rlCQGj.js](/public/build/assets/format-B3rlCQGj.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/format-CpNbv1J2.js](/public/build/assets/format-CpNbv1J2.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/gcta-tastm-report-AME5nrgP.js](/public/build/assets/gcta-tastm-report-AME5nrgP.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/gcta-tastm-report-CdudrF\_a.js](/public/build/assets/gcta-tastm-report-CdudrF_a.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/health-assessment-D4AH\_V49.js](/public/build/assets/health-assessment-D4AH_V49.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/health-assessment-DX5A\_HmF.js](/public/build/assets/health-assessment-DX5A_HmF.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/index-B9NzzXP\_.js](/public/build/assets/index-B9NzzXP_.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/index-BFvJa6MF.js](/public/build/assets/index-BFvJa6MF.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/index-BHiRKjcJ.js](/public/build/assets/index-BHiRKjcJ.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/index-C1uMEMb0.js](/public/build/assets/index-C1uMEMb0.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/index-Cjjgm7p9.js](/public/build/assets/index-Cjjgm7p9.js) | JavaScript | -2 | -4 | -1 | -7 |
| [public/build/assets/index-D790qEjM.js](/public/build/assets/index-D790qEjM.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/index-DlSnFdn1.js](/public/build/assets/index-DlSnFdn1.js) | JavaScript | -2 | -4 | -1 | -7 |
| [public/build/assets/index-LOQAaJzy.js](/public/build/assets/index-LOQAaJzy.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/index-st6-WOiA.js](/public/build/assets/index-st6-WOiA.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/inmates-status-BeJTxs57.js](/public/build/assets/inmates-status-BeJTxs57.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/inmates-status-daily-C91\_7lPc.js](/public/build/assets/inmates-status-daily-C91_7lPc.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/input-BS\_xsQ9S.js](/public/build/assets/input-BS_xsQ9S.js) | JavaScript | 3 | 8 | 1 | 12 |
| [public/build/assets/input-error-CZEZpeJ6.js](/public/build/assets/input-error-CZEZpeJ6.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/input-error-Cvw2w7NP.js](/public/build/assets/input-error-Cvw2w7NP.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/jail-events-sF5wvPxO.js](/public/build/assets/jail-events-sF5wvPxO.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/jail-events-tkt2pR3N.js](/public/build/assets/jail-events-tkt2pR3N.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/label-Br4WJ6FG.js](/public/build/assets/label-Br4WJ6FG.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/label-Cwa1UCo1.js](/public/build/assets/label-Cwa1UCo1.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/layout-BO4G7KCG.js](/public/build/assets/layout-BO4G7KCG.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/layout-C2xyXhiN.js](/public/build/assets/layout-C2xyXhiN.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/list-3g7MBLxu.js](/public/build/assets/list-3g7MBLxu.js) | JavaScript | 3 | 8 | 1 | 12 |
| [public/build/assets/list-C1m4wjk5.js](/public/build/assets/list-C1m4wjk5.js) | JavaScript | 3 | 8 | 1 | 12 |
| [public/build/assets/list-CngERBSS.js](/public/build/assets/list-CngERBSS.js) | JavaScript | -4 | -12 | -1 | -17 |
| [public/build/assets/list-DTRpSB\_L.js](/public/build/assets/list-DTRpSB_L.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/list-Dq9EIPkG.js](/public/build/assets/list-Dq9EIPkG.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/list-HIOex-Cn.js](/public/build/assets/list-HIOex-Cn.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/list-HPlqprTJ.js](/public/build/assets/list-HPlqprTJ.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/list-Kaym5A2z.js](/public/build/assets/list-Kaym5A2z.js) | JavaScript | -2 | -4 | -1 | -7 |
| [public/build/assets/list-of-pdl-reports-CxawSdnt.js](/public/build/assets/list-of-pdl-reports-CxawSdnt.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/list-of-pdl-reports-DgK254WB.js](/public/build/assets/list-of-pdl-reports-DgK254WB.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/loader-circle-BYvY7VOe.js](/public/build/assets/loader-circle-BYvY7VOe.js) | JavaScript | -2 | -4 | -1 | -7 |
| [public/build/assets/loader-circle-D1os5qeW.js](/public/build/assets/loader-circle-D1os5qeW.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/lock-CVLeyUCs.js](/public/build/assets/lock-CVLeyUCs.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/medical-records-CZSaNN-K.js](/public/build/assets/medical-records-CZSaNN-K.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/medical-records-CyfUC6Kd.js](/public/build/assets/medical-records-CyfUC6Kd.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/no-records-certificate-CDYt0RTw.js](/public/build/assets/no-records-certificate-CDYt0RTw.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/password-BZINJoUq.js](/public/build/assets/password-BZINJoUq.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/password-BfJMdPQQ.js](/public/build/assets/password-BfJMdPQQ.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/pdl-archives-Bx0KXhqM.js](/public/build/assets/pdl-archives-Bx0KXhqM.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/pdl-archives-Cn\_iA6V2.js](/public/build/assets/pdl-archives-Cn_iA6V2.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/personal-information-admin-BTFgb7uc.js](/public/build/assets/personal-information-admin-BTFgb7uc.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/personal-information-admin-l0rcEb\_k.js](/public/build/assets/personal-information-admin-l0rcEb_k.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/personal-information-oUiyn4we.js](/public/build/assets/personal-information-oUiyn4we.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/personal-information-t\_lSXI3O.js](/public/build/assets/personal-information-t_lSXI3O.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/physical-characteristics-B98AxxwS.js](/public/build/assets/physical-characteristics-B98AxxwS.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/physical-characteristics-CkMKKUss.js](/public/build/assets/physical-characteristics-CkMKKUss.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/plus-DUoRAMYM.js](/public/build/assets/plus-DUoRAMYM.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/population-report-CTHLGlzi.js](/public/build/assets/population-report-CTHLGlzi.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/population-report-oQOnBEhu.js](/public/build/assets/population-report-oQOnBEhu.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/profie-Dwmf0DJb.js](/public/build/assets/profie-Dwmf0DJb.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/profie-JWp9i\_\_v.js](/public/build/assets/profie-JWp9i__v.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/profile-Di-185Cn.js](/public/build/assets/profile-Di-185Cn.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/profile-bMD9o5q-.js](/public/build/assets/profile-bMD9o5q-.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/profile-management-BzSf09Ym.js](/public/build/assets/profile-management-BzSf09Ym.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/profile-management-DRur2o3G.js](/public/build/assets/profile-management-DRur2o3G.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/progress-LINHkAX9.js](/public/build/assets/progress-LINHkAX9.js) | JavaScript | 7 | 8 | 2 | 17 |
| [public/build/assets/progress-vLvXOkxR.js](/public/build/assets/progress-vLvXOkxR.js) | JavaScript | -5 | 0 | -2 | -7 |
| [public/build/assets/radio-group-C7XEDH3e.js](/public/build/assets/radio-group-C7XEDH3e.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/results-CXRtBJ3Q.js](/public/build/assets/results-CXRtBJ3Q.js) | JavaScript | 3 | 8 | 1 | 12 |
| [public/build/assets/scale-DVrI9DmE.js](/public/build/assets/scale-DVrI9DmE.js) | JavaScript | 5 | 16 | 1 | 22 |
| [public/build/assets/search-HmaTslWG.js](/public/build/assets/search-HmaTslWG.js) | JavaScript | -2 | -4 | -1 | -7 |
| [public/build/assets/select-BBZMYkik.js](/public/build/assets/select-BBZMYkik.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/select-DZJSQo1m.js](/public/build/assets/select-DZJSQo1m.js) | JavaScript | -2 | -4 | -1 | -7 |
| [public/build/assets/separator-CPFO9C7\_.js](/public/build/assets/separator-CPFO9C7_.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/separator-DG4iFyOn.js](/public/build/assets/separator-DG4iFyOn.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/shield-BfSoSboW.js](/public/build/assets/shield-BfSoSboW.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/show-DpTN79ri.js](/public/build/assets/show-DpTN79ri.js) | JavaScript | 3 | 8 | 1 | 12 |
| [public/build/assets/square-pen-CejSo5qV.js](/public/build/assets/square-pen-CejSo5qV.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/table-C22pG3nj.js](/public/build/assets/table-C22pG3nj.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/table-CgMGOAID.js](/public/build/assets/table-CgMGOAID.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/tabs-B1nSmZO\_.js](/public/build/assets/tabs-B1nSmZO_.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/textarea-BmLTENgj.js](/public/build/assets/textarea-BmLTENgj.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/textarea-KTea9Vqs.js](/public/build/assets/textarea-KTea9Vqs.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/transition--NpKdbHO.js](/public/build/assets/transition--NpKdbHO.js) | JavaScript | -5 | 0 | -1 | -6 |
| [public/build/assets/transition-B7SWznhX.js](/public/build/assets/transition-B7SWznhX.js) | JavaScript | 5 | 0 | 1 | 6 |
| [public/build/assets/trending-up-CQfyb\_qf.js](/public/build/assets/trending-up-CQfyb_qf.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/triangle-alert-Cfc0mhXY.js](/public/build/assets/triangle-alert-Cfc0mhXY.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/update-pdl-information-C1L0ymoB.js](/public/build/assets/update-pdl-information-C1L0ymoB.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/update-pdl-information-CUgIyHoo.js](/public/build/assets/update-pdl-information-CUgIyHoo.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/user-CmeQLBVE.js](/public/build/assets/user-CmeQLBVE.js) | JavaScript | 2 | 4 | 1 | 7 |
| [public/build/assets/users-BxYB4q2L.js](/public/build/assets/users-BxYB4q2L.js) | JavaScript | 8 | 28 | 1 | 37 |
| [public/build/assets/users-C5OIh5tf.js](/public/build/assets/users-C5OIh5tf.js) | JavaScript | -3 | -8 | -1 | -12 |
| [public/build/assets/utils-CRZLC5Gr.js](/public/build/assets/utils-CRZLC5Gr.js) | JavaScript | -5 | -16 | -1 | -22 |
| [public/build/assets/view-pdl-information-Cajiu2gE.js](/public/build/assets/view-pdl-information-Cajiu2gE.js) | JavaScript | -1 | 0 | -1 | -2 |
| [public/build/assets/view-pdl-information-ORSLFmmL.js](/public/build/assets/view-pdl-information-ORSLFmmL.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/assets/welcome-BxCpBjqO.js](/public/build/assets/welcome-BxCpBjqO.js) | JavaScript | -2 | -4 | -1 | -7 |
| [public/build/assets/welcome-C06BPBQw.js](/public/build/assets/welcome-C06BPBQw.js) | JavaScript | 1 | 0 | 1 | 2 |
| [public/build/manifest.json](/public/build/manifest.json) | JSON | 489 | 0 | 0 | 489 |
| [resources/js/components/app-sidebar-header.tsx](/resources/js/components/app-sidebar-header.tsx) | TypeScript JSX | 92 | 6 | 8 | 106 |
| [resources/js/components/app-sidebar.tsx](/resources/js/components/app-sidebar.tsx) | TypeScript JSX | 62 | 1 | 8 | 71 |
| [resources/js/components/nav-main.tsx](/resources/js/components/nav-main.tsx) | TypeScript JSX | 1 | 0 | 0 | 1 |
| [resources/js/components/user-menu-content.tsx](/resources/js/components/user-menu-content.tsx) | TypeScript JSX | 55 | 1 | 4 | 60 |
| [resources/js/features/court-hearing/create-event.tsx](/resources/js/features/court-hearing/create-event.tsx) | TypeScript JSX | 89 | 3 | 6 | 98 |
| [resources/js/features/custody/custody-management.tsx](/resources/js/features/custody/custody-management.tsx) | TypeScript JSX | 199 | 6 | 23 | 228 |
| [resources/js/features/time-allowance/manage-time-allowance.tsx](/resources/js/features/time-allowance/manage-time-allowance.tsx) | TypeScript JSX | 27 | 1 | 2 | 30 |
| [resources/js/features/time-allowance/time-allowance-records.tsx](/resources/js/features/time-allowance/time-allowance-records.tsx) | TypeScript JSX | 333 | 2 | 26 | 361 |
| [resources/js/features/verification/verification-card.tsx](/resources/js/features/verification/verification-card.tsx) | TypeScript JSX | 14 | 7 | 2 | 23 |
| [resources/js/pages/admin/archive/list.tsx](/resources/js/pages/admin/archive/list.tsx) | TypeScript JSX | 359 | 11 | 23 | 393 |
| [resources/js/pages/admin/pdl/archive.tsx](/resources/js/pages/admin/pdl/archive.tsx) | TypeScript JSX | 241 | 5 | 16 | 262 |
| [resources/js/pages/admin/pdl/archived.tsx](/resources/js/pages/admin/pdl/archived.tsx) | TypeScript JSX | 236 | 4 | 11 | 251 |
| [resources/js/pages/admin/report/certificate-of-detention.tsx](/resources/js/pages/admin/report/certificate-of-detention.tsx) | TypeScript JSX | 238 | 6 | 30 | 274 |
| [resources/js/pages/admin/report/drug-clearing-certificate.tsx](/resources/js/pages/admin/report/drug-clearing-certificate.tsx) | TypeScript JSX | 335 | 6 | 22 | 363 |
| [resources/js/pages/admin/report/drug-related-cases-monthly.tsx](/resources/js/pages/admin/report/drug-related-cases-monthly.tsx) | TypeScript JSX | -53 | 0 | -1 | -54 |
| [resources/js/pages/admin/report/no-records-certificate.tsx](/resources/js/pages/admin/report/no-records-certificate.tsx) | TypeScript JSX | 292 | 12 | 26 | 330 |
| [resources/js/pages/admin/time-allowance/list.tsx](/resources/js/pages/admin/time-allowance/list.tsx) | TypeScript JSX | 13 | 0 | 2 | 15 |
| [resources/js/pages/admin/verification/list.tsx](/resources/js/pages/admin/verification/list.tsx) | TypeScript JSX | 3 | 0 | 0 | 3 |
| [resources/js/pages/dashboard.tsx](/resources/js/pages/dashboard.tsx) | TypeScript JSX | 54 | 3 | 3 | 60 |
| [resources/js/pages/law-enforcement/dashboard/dashboard.tsx](/resources/js/pages/law-enforcement/dashboard/dashboard.tsx) | TypeScript JSX | 7 | 2 | 1 | 10 |
| [resources/js/pages/records-officer/dashboard/dashboard.tsx](/resources/js/pages/records-officer/dashboard/dashboard.tsx) | TypeScript JSX | -53 | -2 | -3 | -58 |
| [resources/js/pages/records-officer/jail-events/jail-events.tsx](/resources/js/pages/records-officer/jail-events/jail-events.tsx) | TypeScript JSX | 53 | 1 | 5 | 59 |
| [resources/js/pages/records-officer/pdl-management/case-information.tsx](/resources/js/pages/records-officer/pdl-management/case-information.tsx) | TypeScript JSX | 40 | 2 | 3 | 45 |
| [resources/js/pages/records-officer/pdl-management/medical-records.tsx](/resources/js/pages/records-officer/pdl-management/medical-records.tsx) | TypeScript JSX | 40 | 2 | 3 | 45 |
| [resources/js/pages/records-officer/pdl-management/personal-information-admin.tsx](/resources/js/pages/records-officer/pdl-management/personal-information-admin.tsx) | TypeScript JSX | 442 | 8 | 28 | 478 |
| [resources/js/pages/records-officer/pdl-management/personal-information.tsx](/resources/js/pages/records-officer/pdl-management/personal-information.tsx) | TypeScript JSX | 15 | -1 | 2 | 16 |
| [resources/js/pages/records-officer/pdl-management/physical-characteristics.tsx](/resources/js/pages/records-officer/pdl-management/physical-characteristics.tsx) | TypeScript JSX | 40 | 2 | 3 | 45 |
| [resources/js/pages/records-officer/profile-management/profile-management.tsx](/resources/js/pages/records-officer/profile-management/profile-management.tsx) | TypeScript JSX | 0 | 0 | 1 | 1 |
| [resources/views/reports/certificate-of-detention.blade.php](/resources/views/reports/certificate-of-detention.blade.php) | PHP | 159 | 0 | 32 | 191 |
| [resources/views/reports/drug-clearing-certificate.blade.php](/resources/views/reports/drug-clearing-certificate.blade.php) | PHP | 215 | 0 | 36 | 251 |
| [resources/views/reports/inmates-status-daily.blade.php](/resources/views/reports/inmates-status-daily.blade.php) | PHP | 345 | 0 | 35 | 380 |
| [resources/views/reports/no-records-certificate.blade.php](/resources/views/reports/no-records-certificate.blade.php) | PHP | 204 | 0 | 34 | 238 |
| [routes/web.php](/routes/web.php) | PHP | 22 | 1 | 8 | 31 |

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details