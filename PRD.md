# Product Requirements Document (PRD)

## Employee Management System

**Version:** 1.0
**Date:** April 13, 2026
**Status:** Released

---

## 1. Overview

The Employee Management System (EMS) is an internal web application for managing employee records, profiles, and access roles within an organization. It provides a centralized platform where administrators can create, update, and delete employee records while employees can view and maintain their own profile information.

### 1.1 Problem Statement

Organizations need a streamlined way to manage employee data — onboarding new hires, maintaining up-to-date profiles, handling role assignments, and enabling employees to self-service their own information. Without a dedicated system, this data lives in spreadsheets, emails, or disconnected tools, leading to stale records, manual overhead, and security gaps.

### 1.2 Goals

- Provide administrators with full CRUD capabilities over employee records
- Allow employees to view and update their own profile details
- Enforce role-based access control (admin vs. employee)
- Deliver a responsive, modern web interface for day-to-day use
- Secure all operations behind token-based authentication

### 1.3 Non-Goals

- Payroll processing or salary management
- Time tracking or attendance
- Leave/vacation management
- Performance reviews or appraisals
- Recruitment/hiring pipeline
- Notifications (email, SMS, push)
- Multi-tenancy or multi-organization support

---

## 2. Tech Stack

| Layer      | Technology                                    |
| ---------- | --------------------------------------------- |
| Backend    | Django 6.0, Django REST Framework 3.17        |
| Frontend   | Angular 21, PrimeNG 21, Bootstrap 5           |
| Database   | PostgreSQL 15+                                |
| Auth       | DRF Token Authentication                      |
| Styling    | SCSS, PrimeNG Aura theme, PrimeIcons          |
| Build      | Angular CLI 21, TypeScript 5.9                |
| Env Config | python-dotenv (.env)                          |

---

## 3. User Roles

### 3.1 Administrator (`is_staff = true`)

Full access to all system features. Can manage all employee records and admin privileges.

### 3.2 Employee (`is_staff = false`)

Limited access — can only view and edit their own profile and change their own password.

---

## 4. Features & Functional Requirements

### 4.1 Authentication

#### FR-AUTH-01: Login

- Users authenticate with username and password
- On success, the system returns an auth token and user metadata (id, username, role)
- Token and user data are persisted in browser localStorage
- Admins are routed to the Dashboard; employees are routed to View Details

#### FR-AUTH-02: Logout

- Clears token and user data from localStorage
- Redirects to the Login page

#### FR-AUTH-03: Route Protection

- All routes except Login are protected by an auth guard
- Unauthenticated users are redirected to Login
- All API requests include the auth token via an HTTP interceptor

---

### 4.2 Dashboard (Admin Only)

#### FR-DASH-01: Employee List

- Displays a paginated, sortable, searchable table of all employees
- Columns: Employee ID, Name, Email, Position, Actions
- Default pagination: 5 rows per page (options: 5, 10, 20)
- Global search filters across all visible columns
- Sortable by: Employee ID, Name, Email, Position

#### FR-DASH-02: Row Actions

- **View** — navigates to the read-only detail page for that employee
- **Edit** — navigates to the employee form pre-populated with existing data
- **Delete** — shows a confirmation dialog, then deletes the user and associated profile

#### FR-DASH-03: Add Employee

- "Add Employee" button navigates to a blank employee creation form

---

### 4.3 Employee Form (Create / Edit)

#### FR-FORM-01: Create Employee (Admin Only)

- Admin fills in: username (required), role (admin/employee), first name, last name, email, phone number, position, department, joining date, date of birth
- On submit, creates a User and EmployeeProfile atomically via `create_full_employee`
- New users receive the default password `defaultpassword123`
- If profile creation fails, the user creation is rolled back

#### FR-FORM-02: Edit Employee

- Pre-populates all fields from the existing employee record
- Admins can edit all fields including username and role
- Employees can edit their own profile fields but **cannot** change their username or role
- On submit, patches the existing employee profile

#### FR-FORM-03: Reset Password (Admin Only)

- Visible only to admins when editing an employee
- Shows a confirmation dialog, then resets the employee's password to `defaultpassword123`

#### FR-FORM-04: Form Validation

- Username: required
- Email: valid email format
- All other fields: optional
- Submit button is disabled while the form is invalid
- Inline error messages displayed below invalid fields

---

### 4.4 View Details

#### FR-DETAIL-01: Employee Profile View

- Displays a read-only card with all employee information
- Fields: Employee ID, Username, Role (Admin/Employee), Email, First Name, Last Name, Phone Number, Position, Department, Date of Birth, Joining Date
- Empty fields display a "Not available" badge
- Dates are formatted as medium date (e.g., "Apr 13, 2026")

#### FR-DETAIL-02: Access Control

- Admins can view any employee's details (via Dashboard row action)
- Employees can only view their own details

---

### 4.5 Manage Admins (Admin Only)

#### FR-ADMIN-01: Admin List

- Displays a table of all users with admin privileges (`is_staff = true`)
- Columns: Employee ID, Username, Name, Position, Remove Access
- Paginated and searchable

#### FR-ADMIN-02: Remove Admin Access

- "Remove Access" button demotes an admin to a regular employee
- Shows a confirmation dialog before executing
- Patches the user's `is_staff` field to `false`

---

### 4.6 Reset Credentials (Self-Service)

#### FR-CRED-01: Change Own Password

- Any authenticated user can change their own password
- Form fields: New Password, Confirm Password
- Validation: new password required (min 8 characters), passwords must match
- Cross-field validator prevents submission when passwords differ
- Success/error feedback via toast notifications

---

## 5. Data Model

### 5.1 User

| Field         | Type         | Constraints                 |
| ------------- | ------------ | --------------------------- |
| id            | Integer      | Auto-generated primary key  |
| username      | CharField    | Max 150, unique, required   |
| password      | CharField    | Max 128, hashed             |
| email         | EmailField   | Nullable, blank             |
| first_name    | CharField    | Max 150, blank              |
| last_name     | CharField    | Max 150, blank              |
| is_staff      | BooleanField | Default false (role flag)   |
| is_active     | BooleanField | Default true                |
| is_superuser  | BooleanField | Default false               |
| last_login    | DateTime     | Nullable, auto              |
| date_joined   | DateTime     | Auto-set on creation        |

### 5.2 EmployeeProfile

| Field         | Type         | Constraints                        |
| ------------- | ------------ | ---------------------------------- |
| user          | OneToOneField| Primary key, cascades on delete    |
| email         | EmailField   | Unique, nullable                   |
| first_name    | CharField    | Max 50, nullable                   |
| last_name     | CharField    | Max 50, nullable                   |
| phone_number  | CharField    | Max 10, nullable                   |
| position      | CharField    | Max 20, nullable                   |
| department    | CharField    | Max 10, nullable                   |
| joining_date  | DateField    | Nullable, blank                    |
| date_of_birth | DateField    | Nullable, blank                    |

### 5.3 Relationship

- `EmployeeProfile.user` → `User` (one-to-one, User PK = Profile PK)
- Deleting a User cascades to delete the associated EmployeeProfile

---

## 6. API Endpoints

| Method | Endpoint                               | Auth       | Description                           |
| ------ | -------------------------------------- | ---------- | ------------------------------------- |
| POST   | `/api-token-auth/`                     | Public     | Login, returns token + user data      |
| GET    | `/api/users/`                          | Admin      | List all users                        |
| POST   | `/api/users/`                          | Admin      | Create a user                         |
| GET    | `/api/users/{id}/`                     | Admin      | Get user detail                       |
| PUT    | `/api/users/{id}/`                     | Admin      | Full update user                      |
| PATCH  | `/api/users/{id}/`                     | Admin      | Partial update user                   |
| DELETE | `/api/users/{id}/`                     | Admin      | Delete user (cascades to profile)     |
| POST   | `/api/users/{id}/change-credentials/`  | Authenticated | Change password (owner or admin)   |
| GET    | `/api/employees/`                      | Authenticated | List employees (scoped by role)    |
| POST   | `/api/employees/`                      | Authenticated | Create employee profile             |
| GET    | `/api/employees/{id}/`                 | Authenticated | Get employee detail (owner/admin)  |
| PATCH  | `/api/employees/{id}/`                 | Authenticated | Update employee (owner/admin)      |
| DELETE | `/api/employees/{id}/`                 | Authenticated | Delete employee profile             |
| POST   | `/api/employees/create_full_employee/` | Admin      | Create user + profile atomically      |

---

## 7. Frontend Routes

| Path                     | Component        | Access        | Description                     |
| ------------------------ | ---------------- | ------------- | ------------------------------- |
| `/login`                 | Login            | Public        | Authentication page             |
| `/dashboard`             | Dashboard        | Admin         | Employee list with CRUD actions |
| `/employee-form`         | EmployeeForm     | Authenticated | Create new employee             |
| `/employee-form/:id`     | EmployeeForm     | Authenticated | Edit existing employee          |
| `/manage-admins`         | ManageAdmins     | Admin         | Manage admin privileges         |
| `/view-details`          | MyDetails        | Authenticated | View own profile                |
| `/view-details/:id`      | MyDetails        | Authenticated | View employee profile (admin)   |
| `/reset-credentials`     | ResetCredentials | Authenticated | Change own password             |

---

## 8. UI / UX Requirements

### 8.1 Design Language

- **Color palette:** Primary gradient from `#667eea` (blue) to `#764ba2` (purple); white surfaces; light gray backgrounds (`#f8f9fc`)
- **Typography:** Segoe UI, sans-serif
- **Iconography:** PrimeIcons
- **Component library:** PrimeNG with custom Aura theme preset
- **Layout:** Fixed sidebar (220px) + scrollable content area with fixed top bar

### 8.2 Navigation

- Persistent sidebar with role-conditional menu items
- Admin sees: Home, Add Employee, Manage Admins, Update Details, View Details, Reset Password
- Employee sees: View Details, Update Details, Reset Password
- Top bar displays the current page title and a Logout button
- Active route is visually highlighted in the sidebar

### 8.3 Feedback & States

- **Loading:** Info message displayed while data fetches
- **Error:** Error message displayed on API failure
- **Empty:** Warning message when no records exist
- **Success/Error Toasts:** Bottom-right toast notifications (success: 3s, error: 4s)
- **Confirmation Dialogs:** Required before destructive actions (delete, remove access, reset password)

### 8.4 Responsive Design

- Two-column grid layout for forms on desktop
- Bootstrap grid system for responsive breakpoints
- Tables use horizontal scroll on narrow viewports

---

## 9. Security Requirements

### 9.1 Authentication

- Token-based authentication (DRF TokenAuthentication)
- Tokens stored in browser localStorage
- All API requests include `Authorization: Token {token}` header via interceptor

### 9.2 Authorization

- Backend enforces permissions on every endpoint:
  - `IsAdminUser` for admin-only operations
  - `IsAuthenticated` for logged-in user operations
  - `IsOwnerOrAdmin` (custom) for profile access scoping
- Frontend auth guard prevents unauthenticated route access
- Employees cannot access or modify other employees' data

### 9.3 Password Policy

- Minimum 8 characters (frontend validation)
- Default password for admin-created accounts: `defaultpassword123`
- Password change requires current authentication

### 9.4 CORS

- Only `http://localhost:4200` is allowed as an origin

---

## 10. Infrastructure & Configuration

### 10.1 Backend

- Django dev server on `http://localhost:8000`
- PostgreSQL database configured via `.env` file
- Environment variables: `DJANGO_SECRET_KEY`, `DEBUG`, `ALLOWED_HOSTS`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`

### 10.2 Frontend

- Angular dev server on `http://localhost:4200`
- API base URLs hardcoded in services (`http://localhost:8000` / `http://127.0.0.1:8000`)

---

## 11. Known Limitations

1. **No environment-based API URLs** — frontend API URLs are hardcoded, not configurable per environment
2. **No email verification** — email fields are not validated against actual delivery
3. **No password complexity rules** — only minimum length is enforced on the frontend
4. **No audit logging** — changes to employee records are not tracked
5. **No file/photo uploads** — employee profiles do not support profile pictures or document attachments
6. **No pagination metadata** — frontend relies on PrimeNG client-side pagination after full data fetch
7. **localStorage token storage** — tokens are not stored in httpOnly cookies, making them accessible to XSS
8. **Single-server deployment** — no containerization, CI/CD, or production deployment configuration
9. **No frontend role-based route guards** — only the auth guard exists; admin routes are not guarded on the frontend (backend enforces permissions)
10. **Default password is hardcoded** — `defaultpassword123` is not configurable

---

## 12. Future Considerations

- Environment-based configuration for API URLs (Angular environments)
- Profile photo uploads
- Audit trail / change history
- Email notifications for account creation and password resets
- Advanced search and filtering (by department, position, date range)
- Bulk import/export of employee data (CSV/Excel)
- Two-factor authentication
- Session timeout and token refresh
- Production deployment with Docker and CI/CD
- Unit and integration test suites
