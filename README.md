# 🎵 Harmonix – Musician Collaboration Platform

A comprehensive platform connecting musicians for collaborations, gigs, and projects. Built with enterprise-grade architecture featuring advanced application management, real-time notifications, and rich musician profiles.

---

## 🌟 Key Features

### 🎸 For Musicians
- **Rich Profiles**: Showcase your instruments, genres, and experience
- **Job Applications**: Apply to opportunities with cover letters and portfolios
- **Real-time Notifications**: Get instant updates on application status
- **Messaging System**: Chat with potential collaborators
- **Application Tracking**: Monitor all your applications in one place

### 🎤 For Job Posters
- **Structured Job Posts**: Create detailed postings with skills, genres, and budgets
- **Application Management**: Review and manage applications efficiently
- **Status Updates**: Track applicants through 7 lifecycle stages
- **Collaboration Requests**: Send and receive collaboration proposals
- **Analytics**: View counts and application metrics

---

## 🏗️ Architecture

### Backend (Spring Boot 3.4.5 + Java 21)
- **REST API**: 25+ endpoints with pagination support
- **Authentication**: JWT-based with role-based access control
- **Database**: MongoDB Atlas for flexible schema
- **Notifications**: Real-time notification system with 10 types
- **Security**: @CurrentUser annotation, CORS configuration

### Frontend (React 19 + Vite + Tailwind CSS)
- **Modern UI**: Dark theme with purple/pink gradient accents
- **Real-time Updates**: Auto-polling notifications every 30 seconds
- **Responsive Design**: Mobile-friendly layout
- **Component-based**: Reusable components with clean architecture

---

## 📊 Core Entities

### User
- Profile: name, email, bio, location, timezone
- Music: instruments, genres, experience level, years of experience
- Links: Spotify, YouTube, SoundCloud, Instagram, website
- Role: USER, CREATOR, ADMIN

### Job Post
- Details: title, description, required/preferred skills
- Music: genres, job types (COLLABORATION, GIG, REMOTE, etc.)
- Compensation: isPaid, budgetRange, deadline
- Visibility: PUBLIC, FOLLOWERS_ONLY, PRIVATE
- Stats: viewCount, applicationCount, isClosed

### Application
- Content: coverLetter, proposedRate, portfolioUrl
- Status: PENDING → UNDER_REVIEW → SHORTLISTED → ACCEPTED/REJECTED
- Metadata: appliedAt, updatedAt, rejectionReason
- Relationships: applicant, jobPost

### Notification
- Types: 10 types (application updates, messages, job closed, etc.)
- Content: type, message, relatedEntityId
- Status: isRead
- Auto-cleanup: Deletes read notifications after 30 days

---

## 🚀 Quick Start

### Prerequisites
- Java 21+
- Node.js 18+
- MongoDB Atlas account
- Maven

### Backend Setup

```bash
cd backend

# Configure MongoDB connection in application.properties
# Set your MongoDB URI and JWT secret

./mvnw clean install
./mvnw spring-boot:run
```

Backend runs on **http://localhost:8080**

### Frontend Setup

```bash
cd frontend

npm install
npm run dev
```

Frontend runs on **http://localhost:5173**

See [QUICK_START.md](QUICK_START.md) for detailed setup instructions.

---

## 📱 Pages & Features

### Job Board (`/job`)
- Browse all job postings
- Filter by genre, type, and budget
- View job stats

### Job Details (`/jobs/:id`)
- Full job description
- Required and preferred skills
- Budget and deadline
- Apply with ApplicationModal

### Applications (`/applications`)
- **My Applications**: Track your applications
- **Received Applications**: Manage applications for your jobs
- Update status with rejection reasons
- Withdraw applications

### User Profile (`/profile`)
- View and edit profile
- Update instruments, genres, experience
- Add social media links

### Messages & Collaboration
- Real-time chat interface
- Collaboration request management

---

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with credentials
- `POST /api/auth/refresh` - Refresh JWT token

### Users
- `GET /api/users/profile` - Get own profile
- `GET /api/users/profile/{userId}` - Get user profile
- `PUT /api/users/profile` - Update profile

### Job Posts
- `GET /api/job-posts` - Get all jobs (paginated)
- `GET /api/job-posts/{id}` - Get single job
- `POST /api/job-posts` - Create job
- `PUT /api/job-posts/{id}/close` - Close job

### Applications
- `POST /api/applications` - Submit application
- `GET /api/applications/my-applications` - Get my applications
- `GET /api/applications/received` - Get received applications
- `PUT /api/applications/{id}/status` - Update status

### Notifications
- `GET /api/notifications` - Get notifications (paginated)
- `GET /api/notifications/unread-count` - Get unread count
- `PUT /api/notifications/{id}/read` - Mark as read

See [FEATURE_SUMMARY.md](FEATURE_SUMMARY.md) for complete API documentation.

---

## 🎨 Tech Stack

### Backend
- Spring Boot 3.4.5
- Java 21
- MongoDB (Spring Data MongoDB)
- Spring Security + JWT
- Lombok
- Cloudinary (media storage)

### Frontend
- React 19
- Vite
- Tailwind CSS
- React Router
- Axios
- Context API

---

## 📂 Project Structure

```
harmonix-collaboration/
├── backend/
│   ├── src/main/java/com/harmonix/
│   │   ├── controller/        # REST API controllers
│   │   ├── service/           # Business logic
│   │   ├── repository/        # MongoDB repositories
│   │   ├── entity/            # Domain models
│   │   ├── dto/               # Request/Response DTOs
---

## 📚 Documentation

- **[FEATURE_SUMMARY.md](FEATURE_SUMMARY.md)** - Complete feature list with examples
- **[ARCHITECTURE_DIAGRAM.md](ARCHITECTURE_DIAGRAM.md)** - System architecture and data flows
- **[QUICK_START.md](QUICK_START.md)** - Detailed setup and testing guide
- **[backend/ARCHITECTURE.md](backend/ARCHITECTURE.md)** - Backend architecture details
- **[backend/ENV_SETUP.md](backend/ENV_SETUP.md)** - Environment configuration guide
- **[frontend/README.md](frontend/README.md)** - Frontend documentation

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- **Backend**: Follow Spring Boot best practices, use Lombok
- **Frontend**: Use Tailwind CSS, no inline styles
- **API**: Always use DTOs, never expose entities
- **Testing**: Write tests for new features

---

## 🐛 Known Issues & Limitations

- Search and filtering endpoints not yet implemented
- Email notifications not enabled (only in-app)
- File upload limited to Cloudinary
- No WebSocket for real-time chat (polling only)
- Mobile app not available (web only)

---

## 🔮 Future Enhancements

### Phase 1
- [ ] Advanced search and filtering
- [ ] Email notifications
- [ ] File attachments for applications
- [ ] Video introductions

### Phase 2
- [ ] Rating and review system
- [ ] Payment integration
- [ ] Contract management
- [ ] Calendar integration

### Phase 3
- [ ] Mobile apps (iOS/Android)
- [ ] WebSocket for real-time updates
- [ ] AI-powered matching
- [ ] Analytics dashboard

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👥 Team & Support

- **Documentation**: See docs folder for detailed guides
- **Issues**: Report bugs via GitHub Issues
- **Questions**: Contact the development team

---

## 🎉 Acknowledgments

- Spring Boot team for the excellent framework
- React team for the amazing UI library
- Tailwind CSS for utility-first CSS
- MongoDB for flexible database
- All contributors to this project

---

**Built with ❤️ by musicians, for musicians** 🎸🎹🎤🥁🎺
│   │   ├── config/            # Spring configuration
│   │   └── exception/         # Error handling
│   └── src/main/resources/
│       └── application.properties
│
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API service layer
│   │   ├── context/           # React Context
│   │   └── layout/            # Layout components
│   └── package.json
│
├── FEATURE_SUMMARY.md         # Complete feature list
├── ARCHITECTURE_DIAGRAM.md    # System architecture
├── QUICK_START.md             # Setup guide
└── README.md                  # This file
```

---

## 🔐 Security

- **JWT Authentication**: Token-based authentication with refresh
- **Password Hashing**: BCrypt for secure password storage
- **CORS Configuration**: Frontend integration enabled
- **Role-based Access**: USER, CREATOR, ADMIN roles
- **@CurrentUser**: Clean annotation-based user injection

---

## 📈 Application Lifecycle

```
PENDING
   ↓
UNDER_REVIEW
   ↓
SHORTLISTED
   ↓
ACCEPTED ✅  or  REJECTED ❌

User can WITHDRAW at any time before ACCEPTED
```

---

## 🎯 Notification Types

1. APPLICATION_SUBMITTED - New application received
2. APPLICATION_ACCEPTED - Application accepted
3. APPLICATION_REJECTED - Application rejected
4. APPLICATION_SHORTLISTED - Shortlisted for consideration
5. APPLICATION_WITHDRAWN - Application withdrawn
6. NEW_MESSAGE - New chat message
7. JOB_POST_CLOSED - Job post closed
8. COLLABORATION_REQUEST_RECEIVED - New collaboration request
9. COLLABORATION_REQUEST_ACCEPTED - Collaboration accepted
10. COLLABORATION_REQUEST_REJECTED - Collaboration rejected

---
│   ├── CollaborationRequestController.java
│   ├── ChatHeadController.java
│   └── MessageController.java
├── model/
│   ├── CollaborationRequest.java
│   ├── ChatHead.java
│   └── Message.java
├── service/
│   ├── CollaborationRequestService.java
│   ├── ChatHeadService.java
│   └── MessageService.java
├── repository/
│   ├── CollaborationRequestRepository.java
│   ├── ChatHeadRepository.java
│   └── MessageRepository.java
🔐 Security
JWT tokens are validated and decoded to extract authenticated user data.

Ownership is checked before allowing actions like chat or request access.

🚀 Status
✅ Completed: Backend logic
🧩 In Progress: Frontend integration for viewing requests, inbox, and chat
📅 Planned: Request status management (Pending / Accepted / Rejected)

