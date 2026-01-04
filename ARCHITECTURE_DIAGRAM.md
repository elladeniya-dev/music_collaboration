# Harmonix Platform Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND (React + Vite)                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌─────────────────┐  ┌──────────────────┐  ┌─────────────────┐            │
│  │   Components    │  │      Pages       │  │     Layout      │            │
│  ├─────────────────┤  ├──────────────────┤  ├─────────────────┤            │
│  │ NotificationBell│  │ JobBoard         │  │ MainLayout      │            │
│  │ ApplicationModal│  │ JobDetails       │  │ Sidebar         │            │
│  │ JobCard         │  │ Applications     │  └─────────────────┘            │
│  │ PageWrapper     │  │ UserProfile      │                                  │
│  │ Sidebar         │  │ PostJob          │                                  │
│  └─────────────────┘  │ EditJob          │                                  │
│                       │ ChatInterface    │                                  │
│                       │ CollabRequests   │                                  │
│                       │ Login            │                                  │
│                       └──────────────────┘                                  │
│                                                                               │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                      Services (API Layer)                              │  │
│  ├───────────────────────────────────────────────────────────────────────┤  │
│  │ applicationService  │ notificationService │ userService               │  │
│  │ jobPostService      │ chatService         │ authService               │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                    │                                          │
│                                    │ HTTP (Axios + JWT)                       │
│                                    ↓                                          │
└─────────────────────────────────────────────────────────────────────────────┘

                                    ↓
                             
┌─────────────────────────────────────────────────────────────────────────────┐
│                          BACKEND (Spring Boot 3.4.5)                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                      Controllers (REST API)                            │  │
│  ├───────────────────────────────────────────────────────────────────────┤  │
│  │ /api/users           │ /api/applications  │ /api/notifications        │  │
│  │ /api/job-posts       │ /api/messages      │ /api/auth                 │  │
│  │ /api/chat-heads      │ /api/collab        │                           │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                    │                                          │
│                                    ↓                                          │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                            Services                                    │  │
│  ├───────────────────────────────────────────────────────────────────────┤  │
│  │ UserService          │ ApplicationService  │ NotificationService       │  │
│  │ JobPostService       │ MessageService      │ ChatHeadService           │  │
│  │ CollaborationService │                     │                           │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                    │                                          │
│                                    ↓                                          │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                          Repositories                                  │  │
│  ├───────────────────────────────────────────────────────────────────────┤  │
│  │ UserRepository       │ ApplicationRepository │ NotificationRepository  │  │
│  │ JobPostRepository    │ MessageRepository     │ ChatHeadRepository      │  │
│  │ CollaborationRepository │                    │                         │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                    │                                          │
│                                    ↓                                          │
└─────────────────────────────────────────────────────────────────────────────┘

                                    ↓
                             
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DATABASE (MongoDB Atlas)                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │    users     │  │  job_posts   │  │ applications │  │notifications │   │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤  ├──────────────┤   │
│  │ id           │  │ id           │  │ id           │  │ id           │   │
│  │ name         │  │ title        │  │ jobPostId    │  │ userId       │   │
│  │ email        │  │ description  │  │ applicantId  │  │ type         │   │
│  │ instruments[]│  │ requiredSkills[]│ coverLetter  │  │ message      │   │
│  │ genres[]     │  │ genres[]     │  │ proposedRate │  │ isRead       │   │
│  │ experienceLevel│ isPaid       │  │ status       │  │ createdAt    │   │
│  │ bio          │  │ budgetRange  │  │ appliedAt    │  └──────────────┘   │
│  │ location     │  │ deadline     │  └──────────────┘                       │
│  │ spotifyUrl   │  │ isClosed     │                                         │
│  │ ...          │  │ viewCount    │  ┌──────────────┐  ┌──────────────┐   │
│  └──────────────┘  │ ...          │  │   messages   │  │  chat_heads  │   │
│                    └──────────────┘  ├──────────────┤  ├──────────────┤   │
│                                      │ id           │  │ id           │   │
│                                      │ senderId     │  │ user1Id      │   │
│                                      │ receiverId   │  │ user2Id      │   │
│                                      │ content      │  │ lastMessage  │   │
│                                      │ status       │  │ unreadCount  │   │
│                                      │ isDeleted    │  │ ...          │   │
│                                      └──────────────┘  └──────────────┘   │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘


════════════════════════════════════════════════════════════════════════════════
                              DATA FLOW EXAMPLES
════════════════════════════════════════════════════════════════════════════════

1. USER APPLIES TO JOB
   ────────────────────
   JobDetails Page
        ↓ (User clicks Apply)
   ApplicationModal opens
        ↓ (User fills form)
   applicationService.submitApplication()
        ↓ (POST /api/applications)
   ApplicationController.submitApplication()
        ↓ (@CurrentUser injected)
   ApplicationService.submitApplication()
        ↓ (Validate, create Application)
   ApplicationRepository.save()
        ↓ (MongoDB insert)
   NotificationService.createNotification()
        ↓ (Notify job owner)
   NotificationRepository.save()
        ↓ (Return ApplicationResponse)
   Frontend: Close modal, update UI


2. NOTIFICATION POLLING
   ────────────────────
   NotificationBell component
        ↓ (Every 30 seconds)
   notificationService.getUnreadCount()
        ↓ (GET /api/notifications/unread-count)
   NotificationController.getUnreadCount()
        ↓ (@CurrentUser injected)
   NotificationService.getUnreadCount()
        ↓ (Count where userId = X AND isRead = false)
   NotificationRepository.countByUserIdAndIsReadFalse()
        ↓ (Return count)
   Frontend: Update badge number


3. UPDATE APPLICATION STATUS
   ─────────────────────────
   Applications Page (Received Tab)
        ↓ (Job owner clicks Update Status)
   Status Modal opens
        ↓ (Select status, add rejection reason)
   applicationService.updateApplicationStatus()
        ↓ (PUT /api/applications/{id}/status)
   ApplicationController.updateApplicationStatus()
        ↓ (@CurrentUser validates ownership)
   ApplicationService.updateApplicationStatus()
        ↓ (Update status, save)
   ApplicationRepository.save()
        ↓ (Create notification for applicant)
   NotificationService.createNotification()
        ↓ (Type: APPLICATION_ACCEPTED/REJECTED/etc)
   NotificationRepository.save()
        ↓ (Return updated ApplicationResponse)
   Frontend: Refresh list, close modal


4. VIEW USER PROFILE
   ─────────────────
   Applications Page
        ↓ (Click "View Profile" on applicant)
   Navigate to /profile/{userId}
        ↓
   UserProfile component loads
        ↓
   userService.getProfile(userId)
        ↓ (GET /api/users/profile/{userId})
   UserController.getUserProfile()
        ↓
   UserService.getUserProfile()
        ↓ (Find by ID)
   UserRepository.findById()
        ↓ (Return public profile data)
   Frontend: Display profile with instruments, genres, links


════════════════════════════════════════════════════════════════════════════════
                           AUTHENTICATION FLOW
════════════════════════════════════════════════════════════════════════════════

Login Page
    ↓ (User enters credentials)
authService.login(email, password)
    ↓ (POST /api/auth/login)
AuthController.login()
    ↓ (Validate credentials)
Spring Security AuthenticationManager
    ↓ (Generate JWT)
Return { token, user }
    ↓
Frontend: Store token in localStorage
    ↓
axiosInstance interceptor adds token to all requests
    ↓ (Authorization: Bearer {token})
Backend: JwtAuthenticationFilter validates token
    ↓
SecurityContext populated with UserPrincipal
    ↓
@CurrentUser annotation injects user in controller methods


════════════════════════════════════════════════════════════════════════════════
                              KEY FEATURES
════════════════════════════════════════════════════════════════════════════════

✅ Complete Application Lifecycle Management
   - 7 status states (PENDING → ACCEPTED/REJECTED)
   - Cover letters, portfolio links, proposed rates
   - Withdrawal and status update capabilities

✅ Real-time Notifications
   - 10 notification types
   - Auto-polling every 30 seconds
   - Unread count badge
   - Mark as read functionality

✅ Rich Musician Profiles
   - Instruments, genres, experience levels
   - External links (Spotify, YouTube, SoundCloud, Instagram)
   - Bio, location, timezone
   - Years of experience

✅ Advanced Job Postings
   - Required and preferred skills
   - Genre tagging
   - Budget ranges and deadlines
   - Paid/unpaid designation
   - View and application counts
   - Close to new applications

✅ Secure Authentication
   - JWT token-based auth
   - Role-based access control
   - @CurrentUser annotation for clean controller code
   - Automatic token refresh

✅ Responsive UI
   - Dark theme with purple/pink gradients
   - Tailwind CSS for consistent styling
   - Mobile-friendly design
   - Smooth animations and transitions

✅ Comprehensive API
   - 25+ REST endpoints
   - Pagination support
   - Status filtering
   - Standardized response format
   - Proper error handling
```
