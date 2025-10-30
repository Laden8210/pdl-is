# PDL Information System - AI Development Guide

## System Architecture

This is a **Laravel + React + Inertia.js** PDL (Persons Deprived of Liberty) Information System for South Cotabato Rehabilitation and Detention Center. The system manages inmate records, court orders, medical records, and administrative functions.

### Key Stack Components
- **Backend**: Laravel 12 with PHP 8.2
- **Frontend**: React 19 + TypeScript with Inertia.js for SPA-like experience
- **UI**: Tailwind CSS 4 + shadcn/ui components + Radix UI primitives
- **Build**: Vite with SSR support enabled
- **Database**: MySQL with Laravel Eloquent ORM

## Role-Based Access Control

The system has **three distinct user roles** with separate middleware and route prefixes:

```php
// User positions defined in Personnel model
'admin'           // Full system access
'record-officer'  // PDL management, reports, verification
'law-enforcement' // PDL creation, case management, medical records
```

**Route Structure**:
- `/admin/*` - Admin-only routes (middleware: `auth,admin`)
- `/record-officer/*` - Record officer routes (middleware: `auth,record.officer`)
- `/law-enforcement/*` - Law enforcement routes (middleware: `auth,law.enforcement`)

**Authentication Model**: `App\Models\Personnel` (not User) with `position` field determining access level.

## Core Domain Models

### Primary Entity: PDL (Persons Deprived of Liberty)
```php
// app/Models/Pdl.php - Central entity
$pdl->courtOrders()     // Multiple court orders per PDL
$pdl->cases()           // Multiple cases per PDL  
$pdl->medicalRecords()  // Medical history
$pdl->physicalCharacteristics()
$pdl->timeAllowances()  // GCTA/TASTM calculations
$pdl->assignments()     // Cell assignments
```

### Key Relationships
- **PDL → Cases**: One-to-many (PDLs can have multiple criminal cases)
- **PDL → Court Orders**: One-to-many (multiple court documents)
- **PDL → Medical Records**: One-to-many (ongoing medical history)
- **Personnel → PDL**: One-to-many (personnel creates/manages PDLs)

## Philippines Location Integration (PSGC)

**Critical Pattern**: Address fields use **Philippine Standard Geographic Classification (PSGC) API**

```tsx
// Custom hook: resources/js/hooks/usePSGCLocation.ts
const { provinces, citiesMunicipalities, barangays, handleProvinceChange } = usePSGCLocation();

// API: https://psgc.gitlab.io/api
// - provinces.json
// - cities-municipalities.json  
// - cities-municipalities/{code}/barangays.json
```

**Address Data Flow**: Select Province → Loads Cities → Select City → Loads Barangays
- Frontend stores PSGC codes, backend stores human-readable names
- Always validate province→city→barangay hierarchy

## Frontend Patterns

### Component Architecture
```
resources/js/
├── components/ui/        # shadcn/ui components (Button, Input, etc.)
├── features/            # Feature-specific components
├── hooks/              # Custom hooks (usePSGCLocation, etc.)
├── layouts/            # Page layouts (auth, app)
├── pages/              # Inertia.js pages by role
│   ├── admin/
│   ├── records-officer/
│   └── law-enforcement/
└── types/              # TypeScript definitions
```

### Form Patterns
- **Multi-step forms**: Used extensively (see `create-pdl-information.tsx` - 6 steps)
- **Dynamic arrays**: Court orders, cases, medical records can be added/removed
- **File uploads**: Mugshots, court documents, medical files with preview
- **Inertia forms**: Use `useForm()` hook, not native React state for server communication

### shadcn/ui Usage
```tsx
// Consistent patterns across codebase
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem } from '@/components/ui/select'
import { cn } from '@/lib/utils' // Tailwind class merging utility
```

## Development Workflow

### Local Development Setup
```bash
# Start all services (defined in composer.json)
composer run dev
# Runs: Laravel server + queue worker + Vite dev server concurrently

# Database operations
php artisan migrate
php artisan db:seed
```

### File Storage Patterns
```php
// Storage routes for file access (see routes/web.php)
storage/mugshots/{filename}
storage/court_documents/{filename} 
storage/medical_documents/{filename}
storage/profile_images/{filename}
```

## PDF Reporting System

**Report Generation**: Uses `barryvdh/laravel-dompdf` for government reports
- Templates in `resources/views/reports/` 
- Includes official letterheads and logos (`public/images/pgo.jpg`, `scrdc.jpg`)
- Reports: Inmate population, drug-related cases, certificates, status reports

## Security & Logging

- **Request logging**: `SystemLogRequestsMiddleware` logs all operations with user context
- **Sensitive data filtering**: Passwords, tokens automatically filtered from logs  
- **Archive system**: PDLs can be archived with court orders rather than deleted
- **File validation**: Strict file type checking for uploads (mugshots: jpg/png, documents: pdf/doc/jpg)

## Search & Notifications

- **Global search**: Searches across PDLs, cases, personnel (`SearchController`)
- **Real-time notifications**: `SystemNotification` model with role-based filtering
- **Verification workflow**: PDL records require admin approval before going live

## Testing & Quality

- **Pest PHP**: Testing framework configured (`pest.php`, `phpunit.xml`)
- **Code formatting**: Prettier + ESLint for TypeScript/React
- **Type safety**: Full TypeScript coverage with strict mode

## Common Pitfalls

1. **Don't use generic `User` model** - Authentication uses `Personnel` model
2. **Address validation** - Always use PSGC hierarchy, don't allow free-text addresses  
3. **File paths** - Use storage routes, not direct file system access
4. **Role middleware** - Check route middleware carefully, roles have specific access patterns
5. **Inertia forms** - Use `useForm()` hook, handle processing states properly
6. **Multi-step forms** - Maintain state consistency across steps, validate per-step
