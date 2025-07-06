# Fatoora - Modern Invoice Management (Beta)

Fatoora is a modern, multilingual invoice management system designed for freelancers and businesses, with special focus on Moroccan business needs (ICE/IF number support).

🚀 **Currently in Public Beta** - Free access to all features!

## Features

- **Smart Invoice Generation**: Professional PDF invoices with automatic numbering
- **Client Management**: Complete client database with ICE/IF number support
- **Real-time Analytics**: Track revenue and payment status
- **Multilingual Support**: Arabic, French, and English with RTL support
- **Secure Authentication**: Google and Apple sign-in via Firebase
- **Export & Backup**: CSV and PDF export capabilities

## Tech Stack

### Frontend
- React 19+ with Vite
- Tailwind CSS for styling
- React Router for navigation
- React i18next for internationalization
- Lucide React for icons
- Firebase for authentication

### Backend
- Flask (Python)
- SQLAlchemy with PostgreSQL
- Firebase Admin SDK
- WeasyPrint for PDF generation
- Flask-Migrate for database migrations

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.9+
- PostgreSQL

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Add your Firebase configuration to `.env`:
```bash
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-domain.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-bucket.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

5. Start development server:
```bash
npm run dev
```

### Backend Setup

1. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables in `backend/.env`:
```
DATABASE_URL=postgresql://username:password@localhost/fatoora
FIREBASE_ADMIN_CREDENTIALS=path/to/firebase-admin-credentials.json
```

4. Run database migrations:
```bash
cd backend
flask db upgrade
```

5. Start the backend server:
```bash
python app.py
```

## Project Structure

```
fatoora_beta/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── Landing.jsx # Public landing page
│   │   │   ├── Login.jsx   # Authentication page
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Clients.jsx
│   │   │   ├── Invoices.jsx
│   │   │   └── Export.jsx
│   │   ├── locales/        # Translation files
│   │   └── lib/            # Utilities
│   └── package.json
├── backend/                 # Flask backend
│   ├── models/             # Database models
│   ├── routes/             # API endpoints
│   ├── utils/              # Utilities (PDF, auth)
│   └── app.py
└── README.md
```

## Routes

- `/` - Public landing page
- `/login` - Authentication page
- `/app/*` - Protected application routes (requires authentication)
  - `/app/` - Dashboard
  - `/app/clients` - Client management
  - `/app/invoices` - Invoice management
  - `/app/export` - Data export
  - `/app/team` - Team management

## Beta Program

Fatoora is currently in public beta. This means:

- ✅ **Free access** to all features
- ✅ **Unlimited invoices** and clients
- ✅ **Full export capabilities**
- ✅ **Priority support** for beta users
- ✅ **Early access** to new features

## Contributing

We welcome contributions! Since we're in beta, user feedback is especially valuable.

## License

This project is proprietary software. All rights reserved.

## Support

For beta support, please contact us through the application or create an issue in this repository. 