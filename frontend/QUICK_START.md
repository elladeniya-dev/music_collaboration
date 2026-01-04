# 🚀 Quick Start Guide - Refactored Frontend

## ✅ What's New

Your frontend has been completely refactored with **professional architecture**! Here's what you need to know:

## 📋 Checklist

### 1. Review New Structure (5 min)
- [ ] Open `ARCHITECTURE.md` - Read the overview
- [ ] Open `ARCHITECTURE_DIAGRAM.md` - See visual structure
- [ ] Open `REFACTORING_SUMMARY.md` - Understand changes
- [ ] Open `BEFORE_AFTER.md` - Compare old vs new code

### 2. Setup Environment (2 min)
- [ ] Copy `.env.example` to `.env`
- [ ] Update `VITE_API_BASE_URL` if needed (default: `http://localhost:8080/api`)
- [ ] Update `VITE_OAUTH2_URL` if needed

### 3. Test the Application (10 min)
```bash
# Make sure you're in the frontend directory
cd frontend

# Install dependencies (if needed)
npm install

# Start development server
npm run dev
```

Then test:
- [ ] Login with Google OAuth
- [ ] View job board
- [ ] Create a new job post
- [ ] Edit an existing job
- [ ] Delete a job
- [ ] View job details
- [ ] Create collaboration request
- [ ] Accept/reject requests
- [ ] Start a new chat
- [ ] Send messages
- [ ] Delete chat

### 4. Explore New Features (10 min)

#### Service Layer
```javascript
import { jobPostService, chatService, authService } from '../services';

// Get all jobs
const jobs = await jobPostService.getAllJobPosts();

// Send a message
const message = await chatService.sendMessage(messageData);

// Get current user
const user = await authService.getCurrentUser();
```

#### Utilities
```javascript
import { formatDate, parseSkills, showSuccess, getUserId } from '../utils';

// Format dates consistently
const date = formatDate(job.availability); // "Jan 4, 2026"

// Parse skills
const skills = parseSkills("React, Node, MongoDB"); // ["React", "Node", "MongoDB"]

// Show alerts
showSuccess('Success!', 'Job posted successfully');
showError('Error!', 'Something went wrong');

// Get user ID (handles both id and _id)
const userId = getUserId(user);
```

#### Constants
```javascript
import { CollaborationType, MessageStatus, POLLING_INTERVALS } from '../constants';

// Use in forms
<MenuItem value={CollaborationType.REMOTE}>{CollaborationType.REMOTE}</MenuItem>

// Use in logic
if (message.status === MessageStatus.SENT) { ... }

// Use for polling
setInterval(fetchData, POLLING_INTERVALS.MESSAGES);
```

#### Custom Hooks
```javascript
import { useFetch, useForm, usePolling } from '../hooks';

// Fetch data with loading state
const { data, loading, error, refetch } = useFetch(
  () => jobPostService.getAllJobPosts(),
  []
);

// Manage form state
const { values, handleChange, handleSubmit } = useForm(initialValues);

// Poll for real-time updates
usePolling(fetchMessages, POLLING_INTERVALS.MESSAGES, [chatId]);
```

## 🎯 Key Changes

### No More Direct Axios Calls!
❌ **OLD:**
```javascript
axios.get('http://localhost:8080/api/job-post', { withCredentials: true })
```

✅ **NEW:**
```javascript
import { jobPostService } from '../services';
jobPostService.getAllJobPosts();
```

### No More Hardcoded Values!
❌ **OLD:**
```javascript
<MenuItem value="Remote">Remote</MenuItem>
setInterval(fetch, 2000);
```

✅ **NEW:**
```javascript
import { CollaborationType, POLLING_INTERVALS } from '../constants';
<MenuItem value={CollaborationType.REMOTE}>{CollaborationType.REMOTE}</MenuItem>
setInterval(fetch, POLLING_INTERVALS.MESSAGES);
```

### No More Duplicate Code!
❌ **OLD:**
```javascript
const date = new Date(job.availability).toLocaleDateString('en-US', {
  month: 'short', day: 'numeric', year: 'numeric'
});
```

✅ **NEW:**
```javascript
import { formatDate } from '../utils';
const date = formatDate(job.availability);
```

## 📁 New File Organization

```
src/
├── services/        # All API calls go here
├── constants/       # Configuration & enums
├── utils/           # Helper functions
├── hooks/           # Custom React hooks
├── pages/           # Page components (refactored)
├── components/      # UI components (refactored)
├── context/         # Global state
└── layout/          # Layout components
```

## 🎨 Coding Patterns to Follow

### 1. Always Use Services
```javascript
// ✅ Correct
import { jobPostService } from '../services';
const jobs = await jobPostService.getAllJobPosts();

// ❌ Wrong - Don't do this anymore!
import axios from 'axios';
axios.get('http://localhost:8080/api/job-post')
```

### 2. Always Use Constants
```javascript
// ✅ Correct
import { CollaborationType } from '../constants';
value={CollaborationType.REMOTE}

// ❌ Wrong
value="Remote"
```

### 3. Always Use Utilities
```javascript
// ✅ Correct
import { formatDate, parseSkills } from '../utils';
const date = formatDate(job.availability);

// ❌ Wrong - Don't duplicate this logic
const date = new Date(job.availability).toLocaleDateString(...)
```

### 4. Import from Index Files
```javascript
// ✅ Correct
import { jobPostService, chatService } from '../services';
import { formatDate, showSuccess } from '../utils';

// ❌ Wrong (but works)
import jobPostService from '../services/jobPostService';
import { formatDate } from '../utils/dateUtils';
```

## 🐛 Troubleshooting

### Issue: Can't login
- Check `.env` file has correct OAuth URL
- Make sure backend is running on port 8080

### Issue: API calls fail
- Check `VITE_API_BASE_URL` in `.env`
- Verify backend is running
- Check browser console for CORS errors

### Issue: Environment variables not working
- Restart dev server after changing `.env`
- Vite requires `VITE_` prefix for env vars

### Issue: Import errors
- Make sure to use correct import paths
- Services: `from '../services'`
- Utils: `from '../utils'`
- Constants: `from '../constants'`

## 📚 Documentation Files

1. **ARCHITECTURE.md** - Complete architecture documentation
2. **REFACTORING_SUMMARY.md** - What was changed and why
3. **ARCHITECTURE_DIAGRAM.md** - Visual architecture diagrams
4. **BEFORE_AFTER.md** - Code comparison examples
5. **QUICK_START.md** (this file) - Get started quickly

## 💡 Pro Tips

1. **Explore the services**: Look at `services/*.js` to see all available methods
2. **Use constants**: Check `constants/enums.js` for all status types
3. **Reuse utilities**: Browse `utils/*.js` before writing custom functions
4. **Custom hooks**: Use `hooks/*.js` for common patterns
5. **Follow patterns**: New code should follow the same structure

## 🎓 Learning Path

1. **Day 1**: Understand service layer pattern
2. **Day 2**: Learn utility functions
3. **Day 3**: Explore custom hooks
4. **Day 4**: Master constants and configuration
5. **Day 5**: Build new features using these patterns!

## ✨ Next Steps

### When Adding New Features:

1. **New API endpoint?**
   - Add method to appropriate service (or create new service)
   - Example: `jobPostService.js` → `async searchJobs(query)`

2. **New enum/constant?**
   - Add to `constants/enums.js` or `constants/config.js`
   - Match backend constants exactly!

3. **New utility needed?**
   - Add to appropriate file in `utils/`
   - Example: `dateUtils.js` for date operations

4. **Reusable logic?**
   - Create custom hook in `hooks/`
   - Example: `useInfiniteScroll.js`

## 🎉 You're Ready!

Your frontend now has:
- ✅ Enterprise-level architecture
- ✅ Professional code organization
- ✅ Backend alignment
- ✅ Reusable components
- ✅ Clean separation of concerns
- ✅ Easy to maintain and scale

**Happy Coding!** 🚀

---

**Questions?** Review the documentation files or check the code examples in `BEFORE_AFTER.md`
