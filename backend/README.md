# AI Orchestrator Backend - Feedback System

## Setup Instructions

### 1. Install Dependencies
```bash
cd frontend/backend
npm install
```

### 2. Configure Gmail
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Enable 2-Factor Authentication
3. Go to [App Passwords](https://myaccount.google.com/apppasswords)
4. Generate a new app password for "Mail"
5. Copy the 16-character password

### 3. Configuration
The Gmail credentials are already configured in `config.js`:
- Gmail User: aiorchestratoor@gmail.com
- App Password: Already set
- Port: 3001

No additional configuration needed!

### 4. Start Backend
```bash
npm start
```

### 5. Start Frontend
```bash
cd ..
npm run dev
```

## How It Works
- Backend runs on port 3001
- Frontend sends feedback to backend
- Backend sends email to aiorchestratoor@gmail.com
- User gets confirmation email

## Testing
- Visit http://localhost:3001/api/health
- Submit feedback through frontend
- Check your email!
