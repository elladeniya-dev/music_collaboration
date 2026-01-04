# Harmonix Collaboration - Frontend

A modern musician collaboration platform built with React, Vite, and Tailwind CSS.

## Features

### Job Management
- **Job Board**: Browse and search for music collaboration opportunities
- **Post Jobs**: Create job postings with detailed requirements
- **Job Details**: View comprehensive job information with skills, genres, and budget
- **Apply to Jobs**: Submit applications with cover letters and portfolio links

### Application System
- **My Applications**: Track status of your submitted applications
- **Received Applications**: Manage applications for your job posts
- **Status Tracking**: Real-time updates for application lifecycle (Pending, Under Review, Shortlisted, Accepted, Rejected)
- **Withdrawal**: Withdraw applications if needed

### User Profiles
- **Musician Profiles**: Showcase instruments, genres, and experience
- **Experience Levels**: Beginner, Intermediate, Advanced, Professional
- **External Links**: Connect Spotify, YouTube, SoundCloud, Instagram, and personal websites
- **Profile Editing**: Update bio, skills, and social links

### Notifications
- **Real-time Notifications**: Get notified about application status changes
- **Notification Bell**: Unread count badge with dropdown
- **Auto-refresh**: Polls for new notifications every 30 seconds
- **Notification Types**: Application accepted, shortlisted, rejected, messages, job closed

### Messaging & Collaboration
- **Chat Interface**: Real-time messaging with other musicians
- **Collaboration Requests**: Send and manage collaboration requests

## Tech Stack

- **React 19**: Latest React with hooks
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Axios**: HTTP client for API calls

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── ApplicationModal.jsx
│   ├── NotificationBell.jsx
│   ├── Sidebar.jsx
│   └── ...
├── pages/            # Page components
│   ├── Applications.jsx
│   ├── JobBoard.jsx
│   ├── JobDetails.jsx
│   ├── UserProfile.jsx
│   └── ...
├── services/         # API service layers
│   ├── applicationService.js
│   ├── notificationService.js
│   ├── userService.js
│   └── ...
├── context/          # React Context providers
│   └── UserContext.jsx
└── layout/           # Layout components
    └── MainLayout.jsx
```

## API Integration

All API calls are configured to use the backend at `http://localhost:8080/api`. Update `src/services/api/axiosConfig.js` to change the base URL.

### Available Services
- `applicationService`: Submit, track, and manage job applications
- `notificationService`: Fetch and manage notifications
- `userService`: User profiles and authentication
- `jobPostService`: Job posting CRUD operations
- `chatService`: Messaging functionality

## Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## Features by Page

### Job Board (`/job`)
- Browse all job postings
- Filter by genre, job type, paid/unpaid
- Search functionality

### Job Details (`/jobs/:id`)
- View full job description
- See required and preferred skills
- Check budget and deadline
- Apply to jobs with ApplicationModal

### Applications (`/applications`)
- **My Applications Tab**: View applications you've submitted
- **Received Applications Tab**: Manage applications for your jobs
- Update application status (for job owners)
- Withdraw applications
- View applicant profiles

### User Profile (`/profile` or `/profile/:userId`)
- View your own profile or other users
- Edit profile information
- Update instruments, genres, experience
- Add social media links
- Bio and location information

## Styling

The app uses a dark theme with purple/pink gradient accents:
- Background: `gray-900` (dark)
- Cards: `gray-800` (slightly lighter)
- Accent: `purple-600` to `pink-600` gradients
- Text: `white`, `gray-300`, `gray-400` for hierarchy

## Contributing

1. Follow the existing code structure
2. Use Tailwind CSS for styling (no inline styles)
3. Create reusable components when possible
4. Add proper error handling and loading states
5. Keep components under 300 lines when possible

## License

MIT
