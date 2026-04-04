# Employee Management System

## Project Structure
- **Backend**: Django 6.0 + Django REST Framework 3.17 (in `/ems_backend/` and `/api/`)
- **Frontend**: Angular 21 + PrimeNG 21 + Bootstrap 5 (in `/ems-frontend/`)
- **Database**: PostgreSQL

## Development Setup

### Backend
```bash
cd "Employee Management System"
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
Backend runs on `http://localhost:8000`

### Frontend
```bash
cd ems-frontend
npm install
ng serve
```
Frontend runs on `http://localhost:4200`

## Key Architecture Decisions
- Custom User model (`api.User`) extends `AbstractUser` — USERNAME_FIELD is `username`
- `EmployeeProfile` has a one-to-one relation with `User` (user is the primary key)
- Token-based authentication via DRF's `TokenAuthentication`
- Role-based access: `is_staff=True` = admin, `is_staff=False` = regular employee
- Angular standalone components (no NgModules)
- Environment variables loaded via `python-dotenv` (see `.env`)

## API Endpoints
- `POST /api-token-auth/` — Login, returns token + user data
- `/api/users/` — CRUD for users (admin only)
- `POST /api/users/{id}/change-credentials/` — Change password
- `/api/employees/` — CRUD for employee profiles
- `POST /api/employees/create_full_employee/` — Create user + profile in one call (admin only)

## Common Commands
```bash
# Run backend
python manage.py runserver

# Run frontend
cd ems-frontend && ng serve

# Run migrations
python manage.py makemigrations && python manage.py migrate

# Create superuser
python manage.py createsuperuser
```

## Important Notes
- Default password for new employees created by admin: `defaultpassword123`
- Database credentials are in `.env` (not committed to git)
- CORS is configured only for `http://localhost:4200`
- Frontend auth token is stored in `localStorage`
