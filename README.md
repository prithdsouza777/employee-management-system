# Employee Management System

A full-stack employee management application with role-based access control, built with Django REST Framework and Angular.

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Backend | Django | 6.0.3 |
| API | Django REST Framework | 3.17.1 |
| Frontend | Angular | 21 |
| UI Components | PrimeNG | 21 |
| CSS | Bootstrap | 5.3 |
| Database | PostgreSQL | 15+ |
| Auth | Token Authentication | DRF built-in |

## Features

### Admin
- Create, view, edit, and delete employee profiles
- Search and filter employees
- Manage admin access (promote/demote users)
- Reset employee passwords

### Employee
- View and edit own profile
- Change own password

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 20+
- PostgreSQL 15+

### 1. Clone the repository
```bash
git clone https://github.com/prithdsouza777/ems.git
cd ems
```

### 2. Backend setup
```bash
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in the project root:
```env
DJANGO_SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DB_NAME=ems_db
DB_USER=postgres
DB_PASSWORD=your-db-password
DB_HOST=localhost
DB_PORT=5432
```

Run migrations and start the server:
```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### 3. Frontend setup
```bash
cd ems-frontend
npm install
ng serve
```

Open `http://localhost:4200` in your browser.

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api-token-auth/` | Login | Public |
| GET/POST | `/api/users/` | List/Create users | Admin |
| GET/PUT/DELETE | `/api/users/{id}/` | User detail | Admin |
| POST | `/api/users/{id}/change-credentials/` | Change password | Owner/Admin |
| GET/POST | `/api/employees/` | List/Create profiles | Authenticated |
| GET/PUT/DELETE | `/api/employees/{id}/` | Profile detail | Owner/Admin |
| POST | `/api/employees/create_full_employee/` | Create full employee | Admin |

## Project Structure
```
Employee Management System/
├── api/                    # Django app (models, views, serializers, urls)
├── ems_backend/            # Django project settings
├── ems-frontend/           # Angular 20 frontend
│   └── src/app/
│       ├── components/     # Angular components
│       ├── services/       # API and auth services
│       ├── guards/         # Route guards
│       └── interceptors/   # HTTP interceptors
├── manage.py
├── requirements.txt
└── .env                    # Environment variables (not in git)
```

## License

This project is for educational purposes.
