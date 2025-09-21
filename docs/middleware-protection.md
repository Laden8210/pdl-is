# Protected Route Middleware Documentation

## Overview
This Laravel application now has a comprehensive middleware system to protect routes based on user authentication and role-based access control. The system prevents unauthorized users from accessing private routes and ensures users can only access routes appropriate for their role.

## Middleware Components

### 1. Authentication Middleware (`Authenticate`)
- **File**: `app/Http/Middleware/Authenticate.php`
- **Purpose**: Ensures users are logged in before accessing protected routes
- **Behavior**: 
  - Redirects unauthenticated users to login page
  - Returns JSON error for API requests
  - Shows appropriate error messages

### 2. Role-Based Middleware

#### Admin Middleware (`EnsureUserIsAdmin`)
- **File**: `app/Http/Middleware/EnsureUserIsAdmin.php`
- **Purpose**: Restricts access to admin-only routes
- **Required Role**: `admin`
- **Behavior**: Redirects non-admin users to their appropriate dashboard

#### Record Officer Middleware (`EnsureUserIsRecordOfficer`)
- **File**: `app/Http/Middleware/EnsureUserIsRecordOfficer.php`
- **Purpose**: Restricts access to record officer routes
- **Required Role**: `record-officer`
- **Behavior**: Redirects non-record-officer users to their appropriate dashboard

#### Law Enforcement Middleware (`EnsureUserIsLawEnforcement`)
- **File**: `app/Http/Middleware/EnsureUserIsLawEnforcement.php`
- **Purpose**: Restricts access to law enforcement routes
- **Required Role**: `law-enforcement`
- **Behavior**: Redirects non-law-enforcement users to their appropriate dashboard

## Middleware Registration

The middleware is registered in `bootstrap/app.php` with the following aliases:

```php
$middleware->alias([
    'auth' => Authenticate::class,
    'admin' => EnsureUserIsAdmin::class,
    'record.officer' => EnsureUserIsRecordOfficer::class,
    'law.enforcement' => EnsureUserIsLawEnforcement::class,
]);
```

## Route Protection

### Admin Routes
All admin routes are protected with `['auth', 'admin']` middleware:
- Dashboard: `/admin/dashboard`
- User Management: `/admin/user-management`
- PDL Management: `/admin/pdl-management/*`
- Reports: `/admin/report/*`
- Cell Management: `/admin/cell-management`
- Verification: `/admin/verification`

### Record Officer Routes
All record officer routes are protected with `['auth', 'record.officer']` middleware:
- Dashboard: `/record-officer/dashboard`
- Jail Events: `/record-officer/jail-events`
- PDL Archives: `/record-officer/pdl-archives`
- PDL Management: `/record-officer/pdl-management/*`

### Law Enforcement Routes
All law enforcement routes are protected with `['auth', 'law.enforcement']` middleware:
- Dashboard: `/law-enforcement/dashboard`
- PDL Management: `/law-enforcement/pdl-management/*`
- Medical Records: `/law-enforcement/medical-records`
- Physical Characteristics: `/law-enforcement/pdl-management/physical-characteristics`

### Shared Routes
Some routes require authentication but no specific role:
- Notifications: `/notifications`
- Profile updates (shared across roles)

## User Model
The application uses the `Personnel` model for authentication instead of a traditional `User` model. The `position` field determines the user's role:
- `admin`: Full system access
- `record-officer`: Record management access
- `law-enforcement`: Law enforcement specific access

## Security Features

1. **Authentication Check**: All protected routes verify user login status
2. **Role Verification**: Routes check user's position/role before allowing access
3. **Automatic Redirects**: Users are redirected to appropriate dashboards based on their role
4. **Error Handling**: Proper error messages for both web and API requests
5. **Session Management**: Integrates with Laravel's session-based authentication

## Usage Examples

### Protecting a New Admin Route
```php
Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    Route::get('/new-admin-feature', [Controller::class, 'method']);
});
```

### Protecting a New Record Officer Route
```php
Route::middleware(['auth', 'record.officer'])->prefix('record-officer')->group(function () {
    Route::get('/new-record-feature', [Controller::class, 'method']);
});
```

### Protecting a Route for All Authenticated Users
```php
Route::middleware(['auth'])->group(function () {
    Route::get('/shared-feature', [Controller::class, 'method']);
});
```

## Testing the Middleware

1. **Unauthenticated Access**: Try accessing any protected route without logging in - should redirect to login
2. **Role-Based Access**: 
   - Login as admin and try accessing record-officer routes - should redirect to admin dashboard
   - Login as record-officer and try accessing admin routes - should redirect to record-officer dashboard
3. **Proper Access**: Login with correct role and access appropriate routes - should work normally

## Benefits

1. **Security**: Prevents unauthorized access to sensitive data and functionality
2. **User Experience**: Users are automatically redirected to appropriate sections
3. **Maintainability**: Centralized access control logic
4. **Scalability**: Easy to add new roles and permissions
5. **Compliance**: Ensures proper access control for sensitive systems
