# Musikglädjen Teacher App

![Expo](https://img.shields.io/badge/Built%20With-Expo%2054-000020?logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js)

**Musikglädjen Teacher App** is a fullstack mobile application designed for music teachers to manage their students, schedules, and lesson planning. Built with a React Native frontend and a TypeScript Express backend, it integrates with Airtable for data management and Firebase for cloud storage.

## Features

- **Interactive Teacher Dashboard:** Overview of upcoming and recent lessons with custom notification stacks.
- **Student Management:** Detailed student profiles including guardian info, notes, and terminal goals.
- **Lesson Scheduling:** Tools to create, adjust, or cancel recurring lessons for the entire semester.
- **Geospatial Student Search:** Interactive map to find and apply for new students based on location and instrument.
- **Push Notifications:** Real-time alerts for schedule changes and new inquiries via Airtable webhooks.
- **Document Management:** Securely view teaching agreements and background checks.

## Installation

To set up the project locally:

1. **Clone the repository**

```bash
git clone https://github.com/lucasmusikgladjen/lararapp.git
cd lararapp
```

2. **Setup Backend**

```bash
cd backend
npm install
```

3. **Setup Frontend**

```bash
cd frontend
npm install
```

## Environment Variables

You must configure environment variables for both the frontend and backend to function correctly.

### Backend (/backend/.env)

##### Create a `.env` file in the root of your `backend` project

```env
# Port where the server will run
PORT=3000

# Airtable - Get these from your Airtable Developer Hub
AIRTABLE_API_KEY=your_actual_pat_key_here
AIRTABLE_BASE_ID=your_base_id_here

# Access token settings (Use a long random string for the secret)
ACCESS_TOKEN_LIFETIME="30d"
ACCESS_TOKEN_SECRET=generate_a_random_string_here

# Airtable Webhook Secret
AIRTABLE_WEBHOOK_SECRET=your_webhook_secret_here
```

### Frontend (/frontend/.env)

##### Create a `.env` file in the root of your `frontend` project

```env
# --------------- API CONFIGURATION ---------------

# Use your local IP or the production URL
EXPO_PUBLIC_API_URL=https://your-api-url.com/api

# ANDROID EMULATOR (Uncomment if needed)
# EXPO_PUBLIC_API_URL=http://10.0.2.2:3000/api


# --------------- FIREBASE CONFIGURATION ---------------
# Get these from your Firebase Console Settings

EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Running the Project

### Start the Backend

```bash
cd backend
npm run dev
```

### Start the Frontend

```bash
cd frontend
npx expo start
```

### Start Frontend (Clean Cache)

If you encounter UI glitches or stale assets, use the `--clear` flag to reset the bundler cache:

```bash
cd frontend
npx expo start --clear
```

## Directory Structure

### Frontend (React Native / Expo)

```text
frontend/
├── app/                          # Expo Router File-based Navigation
│   ├── (auth)/                   # Protected Routes (Require Login)
│   │   ├── (tabs)/               # Bottom Tab Bar Navigation
│   │   │   ├── find-students.tsx # Map-based student search
│   │   │   ├── index.tsx         # Teacher Dashboard
│   │   │   ├── settings.tsx      # Profile Hub / Settings
│   │   │   └── students.tsx      # List of assigned students
│   │   ├── notification/         # Dynamic notification action pages
│   │   ├── onboarding/           # Instrument selection step
│   │   ├── schedule/             # Global lesson scheduling tool
│   │   └── student/              # Detailed student profile view
│   ├── (public)/                 # Public Routes (Entry & Registration)
│   │   ├── login.tsx             # Login form
│   │   └── register.tsx          # Account creation
│   └── _layout.tsx               # Root App layout and Providers
├── assets/                       # Images, Icons, and Splash graphics
└── src/                          # Core Logic and Components
    ├── components/               # Modular UI Components
    ├── hooks/                    # Custom React Hooks for data & mutations
    ├── services/                 # API communication layer
    ├── store/                    # Global state management (Zustand)
    ├── types/                    # Frontend TypeScript interfaces
    └── utils/                    # Shared helper functions
```

### Backend (Node.js / Express)

```text
backend/
├── src/                          # Server Source Code
│   ├── controllers/              # Request handlers (MVC - Controller layer)
│   ├── middlewares/              # Express middlewares (JWT & Auth)
│   ├── routes/                   # API Endpoint definitions
│   ├── services/                 # Business logic and Airtable integration
│   ├── validations/              # Request validation logic
│   ├── app.ts                    # Express application setup
│   └── server.ts                 # HTTP Server entry point
```

## Technologies Used

### Frontend

- **Core:** React 19, React Native 0.81, Expo 54
- **State & Data:** Zustand, TanStack React Query (v5), Axios
- **UI & Styling:** NativeWind (Tailwind CSS), React Native Reanimated, React Native SVG
- **Navigation:** Expo Router
- **Features:** React Native Maps, Expo Location, Expo Notifications

### Backend

- **Core:** Express 5, TypeScript, Node.js
- **Database:** Airtable.js
- **Auth:** JSON Web Token (JWT), Bcryptjs
