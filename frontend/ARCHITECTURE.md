# Frontend Architecture Documentation

## 📁 Project Structure

The frontend follows a professional, scalable architecture aligned with industry best practices:

```
src/
├── api/                    # API configuration
│   └── axiosConfig.js     # Axios instance with interceptors
├── components/            # Reusable UI components
│   ├── JobCard.jsx
│   ├── PageWrapper.jsx
│   └── Sidebar.jsx
├── constants/             # Application constants (aligned with backend)
│   ├── config.js         # API URLs, polling intervals, pagination
│   ├── enums.js          # Status enums, types (matches backend constants)
│   ├── routes.js         # Route definitions
│   └── index.js          # Barrel export
├── context/              # React Context for global state
│   └── UserContext.jsx   # User authentication context
├── hooks/                # Custom React hooks
│   ├── useFetch.js       # Data fetching hook
│   ├── useForm.js        # Form state management hook
│   ├── usePolling.js     # Polling hook for real-time updates
│   ├── useDebounce.js    # Debounce hook
│   └── index.js          # Barrel export
├── layout/               # Layout components
│   └── MainLayout.jsx    # Main application layout
├── pages/                # Page components (route components)
│   ├── ChatInterface.jsx
│   ├── CollabRequests.jsx
│   ├── EditJob.jsx
│   ├── JobBoard.jsx
│   ├── JobDetails.jsx
│   ├── Login.jsx
│   └── PostJob.jsx
├── services/             # API service layer (business logic)
│   ├── api/
│   │   └── axiosConfig.js
│   ├── authService.js
│   ├── chatService.js
│   ├── collaborationService.js
│   ├── jobPostService.js
│   ├── userService.js
│   └── index.js          # Barrel export
├── utils/                # Utility functions
│   ├── alertUtils.js     # SweetAlert2 wrappers
│   ├── dateUtils.js      # Date formatting and manipulation
│   ├── stringUtils.js    # String operations
│   ├── userUtils.js      # User-related utilities
│   ├── validationUtils.js # Form validation
│   └── index.js          # Barrel export
├── App.jsx               # Root component with routing
├── main.jsx              # Application entry point
└── index.css             # Global styles
```

## 🏗️ Architecture Principles

### 1. **Separation of Concerns**
- **Services Layer**: All API calls are abstracted into service classes
- **Components**: Purely presentational, delegate business logic to services
- **Utils**: Reusable helper functions isolated from components
- **Constants**: Centralized configuration and enums

### 2. **DRY (Don't Repeat Yourself)**
- Reusable hooks for common patterns (fetching, polling, forms)
- Utility functions for repetitive operations
- Barrel exports (`index.js`) for clean imports

### 3. **Alignment with Backend**
The frontend structure mirrors the backend architecture:

**Backend** ➜ **Frontend**
- `constant/` ➜ `constants/` (enums match exactly)
- `controller/` ➜ `services/` (API layer)
- `dto/` ➜ Handled in services
- `util/` ➜ `utils/`

### 4. **Professional Standards**
- ✅ Service layer pattern
- ✅ Custom hooks for logic reuse
- ✅ Centralized API configuration
- ✅ Environment-based configuration
- ✅ Error handling with interceptors
- ✅ Type-safe constants
- ✅ Utility functions for common operations

## 📦 Service Layer

### Services Pattern
Each service is a singleton class handling a specific domain:

```javascript
// Example: jobPostService.js
import axiosInstance from './api/axiosConfig';

class JobPostService {
  async getAllJobPosts() {
    const response = await axiosInstance.get('/job-post');
    return response.data;
  }
  
  async createJobPost(formData) {
    const response = await axiosInstance.post('/job-post', formData);
    return response.data;
  }
}

export default new JobPostService();
```

### Available Services
- **authService**: Authentication operations
- **jobPostService**: Job post CRUD operations
- **collaborationService**: Collaboration request management
- **chatService**: Chat and messaging operations
- **userService**: User-related operations

### Usage in Components
```javascript
import { jobPostService } from '../services';

// In component
const data = await jobPostService.getAllJobPosts();
```

## 🔧 Utilities

### Date Utilities
```javascript
import { formatDate, getRelativeTime, isPastDate } from '../utils';

formatDate(new Date()); // "Jan 4, 2026"
getRelativeTime(new Date()); // "2 hours ago"
isPastDate(someDate); // true/false
```

### String Utilities
```javascript
import { truncateText, parseSkills, toTitleCase } from '../utils';

truncateText(longText, 100); // "Text..."
parseSkills("React, Node.js, MongoDB"); // ["React", "Node.js", "MongoDB"]
toTitleCase("hello world"); // "Hello World"
```

### Alert Utilities (SweetAlert2 Wrappers)
```javascript
import { showSuccess, showError, showConfirmation } from '../utils';

showSuccess('Job Posted!', 'Your job has been posted successfully');
showError('Error', 'Something went wrong');
const confirmed = await showConfirmation('Delete?', 'Are you sure?');
```

### User Utilities
```javascript
import { getUserId, isResourceOwner } from '../utils';

const userId = getUserId(user); // Handles both id and _id
const isOwner = isResourceOwner(user, resourceUserId);
```

## 🎣 Custom Hooks

### useFetch
```javascript
import { useFetch } from '../hooks';

const { data, loading, error, refetch } = useFetch(
  () => jobPostService.getAllJobPosts(),
  []
);
```

### useForm
```javascript
import { useForm } from '../hooks';

const { values, handleChange, handleSubmit, reset } = useForm({
  title: '',
  description: ''
});
```

### usePolling
```javascript
import { usePolling } from '../hooks';
import { POLLING_INTERVALS } from '../constants';

usePolling(fetchMessages, POLLING_INTERVALS.MESSAGES, [chatId]);
```

## 🔐 Constants

### Configuration
```javascript
import { API_CONFIG, POLLING_INTERVALS } from '../constants';

// API_CONFIG.BASE_URL
// POLLING_INTERVALS.MESSAGES
```

### Enums (Aligned with Backend)
```javascript
import { CollaborationStatus, MessageStatus, UserType } from '../constants';

// CollaborationStatus.PENDING
// MessageStatus.SENT
// UserType.MUSICIAN
```

## 🌐 Environment Configuration

Create a `.env` file in the frontend root:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_OAUTH2_URL=http://localhost:8080/oauth2/authorization
```

## 🔄 Migration from Old Structure

### Before
```javascript
// Direct axios calls in components
axios.get('http://localhost:8080/api/job-post', { withCredentials: true })
  .then(res => setJobs(res.data))
```

### After
```javascript
// Clean service layer
import { jobPostService } from '../services';

const jobs = await jobPostService.getAllJobPosts();
setJobs(jobs);
```

## 📝 Best Practices

1. **Always use services**: Never make direct axios calls in components
2. **Use utility functions**: Don't duplicate date formatting, string operations
3. **Leverage hooks**: Extract reusable logic into custom hooks
4. **Import from barrel exports**: Use `from '../services'` not `from '../services/jobPostService'`
5. **Use constants**: Never hardcode URLs, intervals, or enums
6. **Handle errors gracefully**: Use alertUtils for user feedback
7. **Keep components clean**: Delegate business logic to services and hooks

## 🚀 Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file with your configuration

3. Start development server:
   ```bash
   npm run dev
   ```

## 📚 Additional Resources

- [React Best Practices](https://react.dev/)
- [Axios Documentation](https://axios-http.com/)
- [Vite Configuration](https://vitejs.dev/)

---

**Note**: This architecture is designed to scale with your application. As you add features, follow the established patterns to maintain code quality and consistency.
