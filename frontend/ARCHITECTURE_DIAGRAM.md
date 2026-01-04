# Frontend Architecture Alignment

## Backend ↔️ Frontend Alignment

```
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND (Spring Boot)                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────┐    ┌──────────┐    ┌──────────┐               │
│  │ Controller │ ←→ │  Service │ ←→ │Repository│               │
│  └────────────┘    └──────────┘    └──────────┘               │
│        ↓                                                         │
│  ┌────────────┐    ┌──────────┐    ┌──────────┐               │
│  │   Entity   │    │   DTO    │    │  Mapper  │               │
│  └────────────┘    └──────────┘    └──────────┘               │
│        ↓                                                         │
│  ┌────────────┐    ┌──────────┐    ┌──────────┐               │
│  │  Constant  │    │   Util   │    │  Config  │               │
│  └────────────┘    └──────────┘    └──────────┘               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                            ↕ HTTP/REST API
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React + Vite)                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────┐    ┌──────────┐    ┌──────────┐               │
│  │   Pages    │ ←→ │ Services │ ←→ │  Axios   │               │
│  └────────────┘    └──────────┘    └──────────┘               │
│        ↓                 ↓                                       │
│  ┌────────────┐    ┌──────────┐    ┌──────────┐               │
│  │ Components │    │  Hooks   │    │  Utils   │               │
│  └────────────┘    └──────────┘    └──────────┘               │
│        ↓                                                         │
│  ┌────────────┐    ┌──────────┐    ┌──────────┐               │
│  │ Constants  │    │ Context  │    │  Layout  │               │
│  └────────────┘    └──────────┘    └──────────┘               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        REQUEST FLOW                              │
└─────────────────────────────────────────────────────────────────┘

User Action
    ↓
┌─────────────┐
│   Page/     │  - JobBoard.jsx
│  Component  │  - PostJob.jsx
└─────────────┘  - ChatInterface.jsx
    ↓
┌─────────────┐
│   Service   │  - jobPostService.getAllJobPosts()
│   Layer     │  - chatService.sendMessage()
└─────────────┘  - authService.getCurrentUser()
    ↓
┌─────────────┐
│   Axios     │  - Interceptors for auth
│  Instance   │  - Error handling
└─────────────┘  - withCredentials: true
    ↓
┌─────────────┐
│   Backend   │  - /api/job-post
│   REST API  │  - /api/messages
└─────────────┘  - /api/auth/me
    ↓
┌─────────────┐
│   Spring    │  - @RestController
│  Controller │  - @GetMapping, @PostMapping
└─────────────┘
    ↓
Response Data
    ↓
Service → Component → UI Update
```

## Professional Frontend Structure

```
src/
│
├── 📁 services/           ← API LAYER (Business Logic)
│   ├── api/
│   │   └── axiosConfig.js      ← Axios setup + interceptors
│   ├── authService.js          ← Authentication APIs
│   ├── jobPostService.js       ← Job CRUD operations
│   ├── collaborationService.js ← Collaboration requests
│   ├── chatService.js          ← Chat/messaging
│   ├── userService.js          ← User operations
│   └── index.js                ← Barrel export
│
├── 📁 constants/          ← CONFIGURATION & ENUMS
│   ├── config.js               ← API URLs, intervals
│   ├── enums.js                ← Status enums (matches backend!)
│   ├── routes.js               ← Route definitions
│   └── index.js
│
├── 📁 utils/              ← HELPER FUNCTIONS
│   ├── dateUtils.js            ← formatDate, getRelativeTime
│   ├── stringUtils.js          ← truncateText, parseSkills
│   ├── userUtils.js            ← getUserId, isResourceOwner
│   ├── alertUtils.js           ← showSuccess, showError
│   ├── validationUtils.js      ← Form validators
│   └── index.js
│
├── 📁 hooks/              ← CUSTOM REACT HOOKS
│   ├── useFetch.js             ← Data fetching pattern
│   ├── useForm.js              ← Form state management
│   ├── usePolling.js           ← Real-time updates
│   ├── useDebounce.js          ← Input debouncing
│   └── index.js
│
├── 📁 pages/              ← ROUTE COMPONENTS
│   ├── Login.jsx
│   ├── JobBoard.jsx
│   ├── PostJob.jsx
│   ├── EditJob.jsx
│   ├── JobDetails.jsx
│   ├── CollabRequests.jsx
│   └── ChatInterface.jsx
│
├── 📁 components/         ← REUSABLE UI COMPONENTS
│   ├── JobCard.jsx
│   ├── Sidebar.jsx
│   └── PageWrapper.jsx
│
├── 📁 context/            ← GLOBAL STATE
│   └── UserContext.jsx
│
├── 📁 layout/             ← LAYOUT COMPONENTS
│   └── MainLayout.jsx
│
├── App.jsx                ← ROUTER SETUP
├── main.jsx               ← ENTRY POINT
└── index.css              ← GLOBAL STYLES
```

## Key Architecture Patterns

### 1. Service Layer Pattern
```javascript
// ❌ OLD WAY - Direct axios in components
axios.get('http://localhost:8080/api/job-post', { withCredentials: true })
  .then(res => setJobs(res.data))

// ✅ NEW WAY - Clean service abstraction
import { jobPostService } from '../services';
const jobs = await jobPostService.getAllJobPosts();
```

### 2. Constants for Configuration
```javascript
// ❌ OLD WAY - Hardcoded values
<MenuItem value="Remote">Remote</MenuItem>
const interval = 2000;

// ✅ NEW WAY - Type-safe constants
import { CollaborationType, POLLING_INTERVALS } from '../constants';
<MenuItem value={CollaborationType.REMOTE}>{CollaborationType.REMOTE}</MenuItem>
usePolling(fetchData, POLLING_INTERVALS.MESSAGES);
```

### 3. Utility Functions
```javascript
// ❌ OLD WAY - Duplicate logic
const date = new Date(job.availability).toLocaleDateString('en-US', {
  month: 'short', day: 'numeric', year: 'numeric'
});
const skills = job.skillsNeeded?.split(',').map(s => s.trim());

// ✅ NEW WAY - Reusable utilities
import { formatDate, parseSkills } from '../utils';
const date = formatDate(job.availability);
const skills = parseSkills(job.skillsNeeded);
```

### 4. Custom Hooks
```javascript
// ❌ OLD WAY - Duplicate state logic
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
useEffect(() => { /* fetch logic */ }, []);

// ✅ NEW WAY - Reusable hook
import { useFetch } from '../hooks';
const { data, loading, error, refetch } = useFetch(fetchFunction, []);
```

## Backend-Frontend Mapping

| Backend (Java)              | Frontend (JavaScript)        |
|-----------------------------|------------------------------|
| `@RestController`           | `services/*.js`              |
| `@Service`                  | Services call backend        |
| `constant/`                 | `constants/`                 |
| `CollaborationStatus.java`  | `enums.js` (same values!)    |
| `AppConstants.java`         | `config.js`                  |
| `util/`                     | `utils/`                     |
| `dto/request/`              | Payload in service methods   |
| `dto/response/`             | Response in service methods  |
| `SecurityConfig.java`       | `axiosConfig.js` interceptors|

## Benefits Summary

✅ **Maintainability**: Changes isolated to service layer
✅ **Testability**: Services/utils can be unit tested
✅ **Consistency**: Shared utilities ensure uniform behavior
✅ **Scalability**: Clear structure for growth
✅ **Type Safety**: Constants prevent errors
✅ **DRY**: No code duplication
✅ **Separation**: UI separate from business logic
✅ **Alignment**: Mirrors backend structure

---

This architecture follows enterprise-level standards used by companies like:
- Google, Facebook, Netflix (Component-based architecture)
- Airbnb (Service layer pattern)
- Uber (Utility-first approach)
- Microsoft (Separation of concerns)
