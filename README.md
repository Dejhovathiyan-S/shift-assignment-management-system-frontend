# Shift Assignment Management System - Frontend

A modern, responsive React + TypeScript web application where managers create work shifts and staff request shifts they want to work. Built with Vite, React Router, TailwindCSS, and Axios.

##  Tech Stack

- **Framework:** React 18.2
- **Language:** TypeScript 5.3
- **Build Tool:** Vite 5.1
- **Routing:** React Router DOM 6.22
- **Styling:** TailwindCSS 3.4
- **HTTP Client:** Axios 1.6
- **Notifications:** React Hot Toast 2.4
- **Icons:** React Icons 5.0
- **State Management:** React Context API

##  Project Structure

```
FRONTEND/
├── index.html                  # Entry HTML file
├── package.json                # Dependencies
├── .env                        # Environment variables
├── .gitignore                  # Git ignore file
├── vite.config.ts              # Vite configuration
├── tailwind.config.js          # TailwindCSS configuration
├── postcss.config.js           # PostCSS configuration
├── tsconfig.json               # TypeScript configuration
├── public/
│   └── vite.svg                # Public assets
├── src/
│   ├── main.tsx                # React app entry point
│   ├── App.tsx                 # Main App component with routing
│   ├── index.css               # Global styles + Tailwind imports
│   ├── vite-env.d.ts           # Vite environment types
│   ├── components/
│   │   ├── Navbar.tsx          # Navigation bar component
│   │   ├── ProtectedRoute.tsx  # Route protection wrapper
│   │   ├── ShiftCard.tsx       # Shift display card component
│   │   └── StatCard.tsx        # Statistics card component
│   ├── context/
│   │   └── AuthContext.tsx     # Authentication context provider
│   ├── services/
│   │   └── api.ts              # Axios API service layer
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   └── pages/
│       ├── auth/
│       │   ├── Login.tsx       # Login page
│       │   ├── Register.tsx    # Registration page
│       │   └── ForgotPassword.tsx  # Password recovery page
│       ├── staff/
│       │   ├── StaffDashboard.tsx      # Staff dashboard
│       │   ├── AvailableShifts.tsx     # Browse available shifts
│       │   ├── MyRequests.tsx          # View shift requests
│       │   └── MyShifts.tsx            # View assigned shifts
│       └── manager/
│           ├── ManagerDashboard.tsx    # Manager dashboard
│           ├── CreateShift.tsx         # Create new shift
│           ├── AllShifts.tsx           # View all shifts
│           ├── PendingRequests.tsx     # Approve/reject requests
│           └── Assignments.tsx         # View all assignments
```

##  User Roles & Features

### STAFF Role
- ✅ Register & Login
- ✅ View Dashboard with Statistics
- ✅ Browse Available Shifts
- ✅ Request Shifts with Reason
- ✅ View Request Status (Pending/Approved/Rejected)
- ✅ Cancel Pending Requests
- ✅ View Assigned Shifts
- ✅ Profile Management

### MANAGER Role
- ✅ Login to System
- ✅ View Dashboard with Analytics
- ✅ Create New Shifts
- ✅ View All Shifts
- ✅ Update/Delete Shifts
- ✅ View Pending Shift Requests
- ✅ Approve/Reject Requests with Reason
- ✅ View All Assignments
- ✅ Manage Staff Assignments

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/Dejhovathiyan-S/shift-assignment-management-system-frontend.git
cd shift-assignment-management-system-frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create `.env` file
Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:4000
```

### 4. Run development server
```bash
npm run dev
```

### 5. Access the application
Open your browser and navigate to:
```
http://localhost:3000
```

##  Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (port 3000) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

##  Application Routes

### Public Routes
| Route | Component | Description |
|-------|-----------|-------------|
| `/login` | Login | User login page |
| `/register` | Register | User registration (Staff only) |
| `/forgot-password` | ForgotPassword | Password recovery |

### Staff Routes (Protected)
| Route | Component | Description |
|-------|-----------|-------------|
| `/staff` | StaffDashboard | Staff home dashboard |
| `/staff/available-shifts` | AvailableShifts | Browse & request shifts |
| `/staff/my-requests` | MyRequests | View request history |
| `/staff/my-shifts` | MyShifts | View assigned shifts |

### Manager Routes (Protected)
| Route | Component | Description |
|-------|-----------|-------------|
| `/manager` | ManagerDashboard | Manager home dashboard |
| `/manager/create-shift` | CreateShift | Create new shift |
| `/manager/all-shifts` | AllShifts | Manage all shifts |
| `/manager/pending-requests` | PendingRequests | Approve/reject requests |
| `/manager/assignments` | Assignments | View all assignments |

##  Authentication Flow

### Registration (Staff)
1. Navigate to `/register`
2. Fill in: Name, Email, Password, Age
3. Role is automatically set to `STAFF`
4. Submit form
5. Redirect to login page

### Login
1. Navigate to `/login`
2. Enter email and password
3. On success:
   - Token stored in `localStorage`
   - User data stored in Context
   - Redirect to role-based dashboard
     - STAFF → `/staff`
     - MANAGER → `/manager`

### Protected Routes
- Uses `ProtectedRoute` component
- Checks authentication status
- Validates user role
- Redirects unauthorized users to `/login`

##  API Integration

The frontend connects to the backend API via Axios:

**Base URL:** `http://localhost:4000` (configurable via `.env`)

### API Service Structure
```typescript
// src/services/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});
```

### Authentication Headers
```typescript
// Automatically added to protected requests
headers: {
  Authorization: `Bearer ${localStorage.getItem('token')}`
}
```

### API Endpoints Used

#### Authentication
- `POST /users/signup` - Register user
- `POST /users/login` - Login user
- `GET /users/me` - Get current user
- `POST /users/logout` - Logout user

#### Shifts
- `GET /shifts/all` - Get all shifts
- `GET /shifts/available` - Get available shifts
- `POST /shifts/create` - Create shift (Manager)
- `PUT /shifts/:id` - Update shift (Manager)
- `DELETE /shifts/:id` - Delete shift (Manager)

#### Shift Requests
- `POST /shift-requests/create` - Request shift (Staff)
- `GET /shift-requests/my-requests` - Get my requests (Staff)
- `GET /shift-requests/pending` - Get pending requests (Manager)
- `PUT /shift-requests/approve/:id` - Approve request (Manager)
- `PUT /shift-requests/reject/:id` - Reject request (Manager)
- `DELETE /shift-requests/cancel/:id` - Cancel request (Staff)

#### Assignments
- `GET /assignments/my-assignments` - Get my assignments (Staff)
- `GET /assignments/all` - Get all assignments (Manager)

##  UI/UX Features

### Design System
- **Color Scheme:** Custom primary colors with TailwindCSS
- **Typography:** Modern, readable fonts
- **Spacing:** Consistent padding and margins
- **Responsive:** Mobile-first design

### Components

#### Navbar
- Role-based navigation links
- User profile display
- Logout functionality
- Responsive mobile menu

#### StatCard
- Dashboard statistics display
- Icon integration
- Color-coded metrics
- Hover effects

#### ShiftCard
- Shift details display
- Status badges
- Action buttons (Request/Approve/Reject)
- Responsive layout

### Notifications
- Success messages (green)
- Error messages (red)
- Info messages (blue)
- Auto-dismiss (3 seconds)
- Toast notifications via React Hot Toast

##  Configuration Files

### Vite Config (`vite.config.ts`)
```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
});
```

### TailwindCSS Config (`tailwind.config.js`)
```javascript
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { /* custom colors */ },
      },
    },
  },
  plugins: [],
};
```

### TypeScript Config (`tsconfig.json`)
- Strict mode enabled
- ES2020 target
- React JSX support
- Path aliases configured

##  Build & Deployment

### Production Build
```bash
npm run build
```
Output: `dist/` folder

### Preview Production Build
```bash
npm run preview
```

### Deployment Platforms
- **Vercel:** Automatic deployment from Git
- **Netlify:** Continuous deployment
- **GitHub Pages:** Static hosting
- **Render:** Full-stack hosting

### Environment Variables for Production
```env
VITE_API_URL=https://your-backend-api.com
```

##  Responsive Design

The application is fully responsive and works on:
-  Mobile devices (320px+)
-  Tablets (768px+)
-  Laptops (1024px+)
-  Desktops (1280px+)

##  Testing Guidelines

### Manual Testing Steps

#### Staff User Flow
1. **Register:**
   - Go to `/register`
   - Create account
   - Verify success message

2. **Login:**
   - Go to `/login`
   - Enter credentials
   - Verify redirect to `/staff`

3. **Request Shift:**
   - Navigate to "Available Shifts"
   - Click "Request Shift"
   - Fill reason
   - Submit request

4. **View Requests:**
   - Navigate to "My Requests"
   - Verify pending status
   - Try canceling pending request

5. **View Assignments:**
   - Navigate to "My Shifts"
   - View approved assignments

#### Manager User Flow
1. **Login:**
   - Use manager credentials
   - Verify redirect to `/manager`

2. **Create Shift:**
   - Navigate to "Create Shift"
   - Fill form (title, date, start/end time)
   - Submit

3. **View Requests:**
   - Navigate to "Pending Requests"
   - View all pending requests

4. **Approve/Reject:**
   - Click "Approve" or "Reject"
   - Add reason (for rejection)
   - Verify status update

5. **View Assignments:**
   - Navigate to "Assignments"
   - View all assignments

##  Security Features

- ✅ JWT Token Authentication
- ✅ Protected Routes with Role-Based Access
- ✅ Token stored in localStorage
- ✅ Automatic token inclusion in API requests
- ✅ 401/403 error handling
- ✅ Automatic logout on token expiry
- ✅ XSS protection via React
- ✅ CSRF protection

##  Common Issues & Solutions

### Issue: Cannot connect to backend
**Solution:** Verify `.env` file has correct `VITE_API_URL` and backend is running

### Issue: 401 Unauthorized errors
**Solution:** Check token in localStorage, try logging out and logging in again

### Issue: Build errors
**Solution:** 
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Issue: Port already in use
**Solution:** Change port in `vite.config.ts` or kill process on port 3000
```bash
lsof -ti:3000 | xargs kill
```

##  Dependencies

### Production Dependencies
```json
{
  "axios": "^1.6.7",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-hot-toast": "^2.4.1",
  "react-icons": "^5.0.1",
  "react-router-dom": "^6.22.0"
}
```

### Development Dependencies
```json
{
  "@types/react": "^18.2.55",
  "@types/react-dom": "^18.2.19",
  "@vitejs/plugin-react": "^4.2.1",
  "autoprefixer": "^10.4.17",
  "postcss": "^8.4.35",
  "tailwindcss": "^3.4.1",
  "typescript": "^5.3.3",
  "vite": "^5.1.0"
}
```

##  Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

##  License

This project is licensed under the ISC License.

##  Author

**Dejhovathiyan S**
- GitHub: [@Dejhovathiyan-S](https://github.com/Dejhovathiyan-S)
- Repository: [shift-assignment-management-system-frontend](https://github.com/Dejhovathiyan-S/shift-assignment-management-system-frontend)

##  Related Projects

- **Backend API:** [shift-assignment-management-system-backend](https://github.com/Dejhovathiyan-S/shift-assignment-management-system-backend)
- **Live Demo:** Coming soon...


