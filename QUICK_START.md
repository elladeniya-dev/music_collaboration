# Harmonix Platform - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- **Java 21** (for backend)
- **Node.js 18+** (for frontend)
- **MongoDB Atlas** account (or local MongoDB)
- **Maven** (for backend build)
- **npm or yarn** (for frontend)

---

## Backend Setup

### 1. Configure MongoDB

Update `backend/src/main/resources/application.properties`:

```properties
# MongoDB Configuration
spring.data.mongodb.uri=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority

# JWT Configuration
jwt.secret=your-secret-key-here-minimum-256-bits
jwt.expiration=86400000

# Server Configuration
server.port=8080
```

### 2. Build and Run Backend

```bash
cd backend

# Using Maven wrapper
./mvnw clean install

# Run the application
./mvnw spring-boot:run

# Or run the JAR
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

Backend will start on **http://localhost:8080**

### 3. Verify Backend

Check health:
```bash
curl http://localhost:8080/api/health
```

---

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure API URL

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### 3. Run Frontend

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Frontend will start on **http://localhost:5173**

---

## 🧪 Testing the Platform

### 1. Create a User Account

**POST** `http://localhost:8080/api/auth/register`

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "userRole": "CREATOR"
}
```

### 2. Login

**POST** `http://localhost:8080/api/auth/login`

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "user123",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

### 3. Update Your Profile

**PUT** `http://localhost:8080/api/users/profile`

Headers:
```
Authorization: Bearer {your-token}
```

Body:
```json
{
  "bio": "Guitarist with 10 years of experience",
  "instruments": ["Guitar", "Bass"],
  "genres": ["Rock", "Blues", "Jazz"],
  "experienceLevel": "PROFESSIONAL",
  "yearsOfExperience": 10,
  "location": "Los Angeles, CA",
  "timezone": "America/Los_Angeles",
  "spotifyUrl": "https://open.spotify.com/artist/...",
  "youtubeUrl": "https://youtube.com/@musician"
}
```

### 4. Create a Job Post

**POST** `http://localhost:8080/api/job-posts`

Headers:
```
Authorization: Bearer {your-token}
```

Body:
```json
{
  "title": "Need a drummer for recording session",
  "description": "Looking for an experienced drummer for a 2-day recording session. We're recording a rock album with blues influences.",
  "skillsNeeded": "Rock, Blues, Jazz drumming",
  "requiredSkills": ["Drumming", "Studio Recording"],
  "preferredSkills": ["Jazz Experience", "Improvisation"],
  "genres": ["Rock", "Blues"],
  "isPaid": true,
  "budgetRange": "$500-$1000",
  "deadline": "2025-02-15T00:00:00Z",
  "estimatedDuration": "2 days",
  "jobTypes": ["ONE_TIME_GIG", "PAID"],
  "visibility": "PUBLIC"
}
```

### 5. Apply to a Job

**POST** `http://localhost:8080/api/applications`

Headers:
```
Authorization: Bearer {your-token}
```

Body:
```json
{
  "jobPostId": "job123",
  "coverLetter": "I'm very interested in this recording session. I have 10 years of experience in rock and blues drumming, and I've recorded 5 albums in professional studios.",
  "proposedRate": 750.0,
  "portfolioUrl": "https://soundcloud.com/drummer"
}
```

### 6. Check Notifications

**GET** `http://localhost:8080/api/notifications`

Headers:
```
Authorization: Bearer {your-token}
```

Query params:
- `page=0`
- `size=10`
- `unreadOnly=true` (optional)
- `type=APPLICATION_SUBMITTED` (optional)

---

## 🎨 Using the Frontend

### 1. Open Browser

Navigate to **http://localhost:5173**

### 2. Login

Use the credentials you created in the backend test.

### 3. Navigate the Platform

- **Job Board** (`/job`): Browse available jobs
- **Post Job** (`/post`): Create a new job posting
- **Applications** (`/applications`):
  - **My Applications**: See jobs you've applied to
  - **Received Applications**: Manage applications for your jobs
- **Profile** (`/profile`): View and edit your musician profile
- **Messages** (`/chat`): Chat with other musicians
- **Collab Requests** (`/requests`): Manage collaboration requests

### 4. Test Application Flow

1. Go to Job Board
2. Click on a job
3. Click "Apply Now"
4. Fill out the application form
5. Submit
6. Check NotificationBell (top right) for updates
7. Go to Applications page to see your application

### 5. Test Job Owner Flow

1. Post a new job
2. Wait for applications (or apply with another account)
3. Check NotificationBell for new application
4. Go to Applications → Received Applications
5. Click "Update Status"
6. Select status (UNDER_REVIEW, SHORTLISTED, ACCEPTED, or REJECTED)
7. Applicant will receive notification

---

## 📝 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get JWT |
| POST | `/api/auth/refresh` | Refresh JWT token |
| POST | `/api/auth/logout` | Logout user |

### User Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/profile` | Get own profile |
| GET | `/api/users/profile/{userId}` | Get user profile |
| PUT | `/api/users/profile` | Update profile |
| GET | `/api/users/email/{email}` | Find user by email |
| POST | `/api/users/bulk` | Get multiple users |

### Job Post Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/job-posts` | Get all jobs (paginated) |
| GET | `/api/job-posts/{id}` | Get single job |
| POST | `/api/job-posts` | Create job |
| PUT | `/api/job-posts/{id}` | Update job |
| DELETE | `/api/job-posts/{id}` | Delete job |
| PUT | `/api/job-posts/{id}/close` | Close job |
| GET | `/api/job-posts/owner/{ownerId}` | Get owner's jobs |

### Application Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/applications` | Submit application |
| GET | `/api/applications/{id}` | Get application |
| GET | `/api/applications/job/{jobId}` | Get job applications |
| GET | `/api/applications/my-applications` | Get my applications |
| GET | `/api/applications/received` | Get received applications |
| PUT | `/api/applications/{id}/status` | Update status |
| PUT | `/api/applications/{id}/withdraw` | Withdraw application |
| GET | `/api/applications/check` | Check if applied |

### Notification Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | Get notifications (paginated) |
| GET | `/api/notifications/unread-count` | Get unread count |
| PUT | `/api/notifications/{id}/read` | Mark as read |
| PUT | `/api/notifications/mark-all-read` | Mark all as read |
| DELETE | `/api/notifications/read` | Delete read notifications |

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: MongoDB connection failed
```
Solution: Check your connection string in application.properties
Verify MongoDB Atlas IP whitelist includes your IP
```

**Problem**: JWT token invalid
```
Solution: Check jwt.secret is at least 256 bits
Ensure token is sent in Authorization header: Bearer {token}
```

**Problem**: @CurrentUser returns null
```
Solution: Verify CurrentUserArgumentResolver is registered in CorsConfig
Check JWT token is valid and not expired
```

### Frontend Issues

**Problem**: API calls return 401 Unauthorized
```
Solution: Check token is stored in localStorage
Verify axiosInstance interceptor is adding token
Login again to refresh token
```

**Problem**: NotificationBell not updating
```
Solution: Check browser console for API errors
Verify polling interval is running (every 30 seconds)
Check backend notifications endpoint is accessible
```

**Problem**: ApplicationModal not submitting
```
Solution: Check cover letter is filled (required field)
Verify proposedRate is a number for paid jobs
Check browser console for validation errors
```

---

## 🔧 Development Tips

### Backend Development

1. **Use Lombok**: Already configured for reducing boilerplate
2. **DTOs for API**: Always use Request/Response DTOs, never expose entities
3. **@CurrentUser**: Use this annotation instead of manual SecurityContext access
4. **Pagination**: Use `Pageable` for list endpoints
5. **Validation**: Add `@Valid` to request DTOs for automatic validation

### Frontend Development

1. **API Services**: Create service files for each backend controller
2. **Error Handling**: Always catch API errors and show user-friendly messages
3. **Loading States**: Show loading indicators during API calls
4. **Tailwind CSS**: Use utility classes, avoid custom CSS
5. **Component Size**: Keep components under 300 lines, split if larger

### Testing

1. **Backend**: Use `@SpringBootTest` for integration tests
2. **Frontend**: Use React Testing Library for component tests
3. **E2E**: Consider Cypress or Playwright for full flow testing
4. **API**: Use Postman or Bruno for manual API testing

---

## 📚 Additional Resources

- [Spring Boot Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

## 🎯 What's Next?

Now that you have the platform running, you can:

1. **Add more features**: File uploads, video intros, ratings
2. **Implement search**: Full-text search on jobs and profiles
3. **Add filters**: Genre, location, budget filters on job board
4. **Enhance notifications**: Email notifications, push notifications
5. **Add analytics**: Dashboard for job owners with metrics
6. **Improve UX**: Loading skeletons, optimistic updates
7. **Deploy**: Deploy to production (AWS, Azure, Heroku)

Happy coding! 🚀
