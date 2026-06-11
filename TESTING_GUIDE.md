# Testing Guide - Complete Walkthrough

## Prerequisites

✅ Backend running on http://localhost:5000  
✅ MongoDB running locally  
✅ Frontend ready to start  

---

## Step 1: Start the Backend

```bash
cd backend
npm start
```

Expected output:
```
MongoDB Connected: localhost
================================================================
Server running on port 5000
Database Mode: MONGODB
Health Check: http://localhost:5000/api/health
================================================================
```

---

## Step 2: Start the Frontend (New Terminal)

```bash
cd frontend
npm run dev
```

Expected output:
```
VITE v... ready in ... ms

➜  Local:   http://localhost:5173/
```

---

## Step 3: Test Registration Flow

### 3.1 Open Registration Page
- URL: http://localhost:5173/register
- You should see a "Create Account" form

### 3.2 Fill Registration Form
- **Full Name:** John Doe
- **Email:** john@example.com
- **Password:** password123
- **Confirm Password:** password123

### 3.3 Submit Registration
- Click "Sign Up" button
- Expected: ✅ Success alert: "Registration successful! Please login with your credentials."
- Expected: Redirected to login page

### 3.4 Verify Database
- Check MongoDB that user was created with:
  - ✅ Password hashed (not plain text)
  - ✅ Avatar URL generated from DiceBear API
  - ✅ Email stored in lowercase
  - ✅ Created timestamps

**Database Query:**
```bash
# In MongoDB shell
db.users.findOne({ email: "john@example.com" })

# Expected response:
{
  "_id": ObjectId(...),
  "name": "John Doe",
  "email": "john@example.com",
  "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=John%20Doe",
  "password": "$2a$10$...[hashed password]...",
  "role": "user",
  "createdAt": ISODate(...),
  "updatedAt": ISODate(...)
}
```

---

## Step 4: Test Login Flow

### 4.1 Open Login Page
- Already on http://localhost:5173/login
- You should see "Welcome Back" form

### 4.2 Enter Credentials
- **Email:** john@example.com
- **Password:** password123
- **Remember Me:** Checked

### 4.3 Submit Login
- Click "Sign In" button
- Expected: 
  - ✅ JWT token received
  - ✅ Redirected to dashboard
  - ✅ Navbar appears at top

### 4.4 Verify Token Storage
Open browser DevTools (F12):
```javascript
// In Console:
localStorage.getItem('token')
// Should return: jwt_token_here
```

---

## Step 5: Test Navbar & User Profile

### 5.1 Check Navbar Components
On dashboard, navbar should show:
- ✅ Task Manager logo
- ✅ User avatar (generated from DiceBear API)
- ✅ User name: "John Doe"
- ✅ User email: "john@example.com"
- ✅ Dark mode toggle button (Moon/Sun icon)
- ✅ Sign Out button (Red with LogOut icon)

### 5.2 Verify Avatar Display
- Avatar should be a unique SVG image based on username
- Try registering with different names to see different avatars
- Avatar should display as rounded square image

### 5.3 Avatar URL Format
Expected format:
```
https://api.dicebear.com/7.x/avataaars/svg?seed=John%20Doe
```

---

## Step 6: Test Dark Mode Toggle

### 6.1 Default Theme
- By default, should be in **dark mode**
- Background: dark blue (#0b0f19)
- Text: light gray

### 6.2 Click Dark Mode Toggle
- Click the Sun/Moon button in navbar
- Expected: Immediate theme switch to **light mode**
- Background: light gray (#f9fafb)
- Text: dark gray

### 6.3 Toggle Back
- Click button again
- Expected: Back to **dark mode**

### 6.4 Verify Persistence
- Refresh the page (F5)
- Expected: Theme preference persists
- Check localStorage:
```javascript
// In Console:
localStorage.getItem('theme-mode')
// Should return: 'dark' or 'light'
```

---

## Step 7: Test Sign Out

### 7.1 Click Sign Out Button
- Click red "Sign Out" button in navbar
- Expected:
  - ✅ Token cleared from localStorage
  - ✅ User data cleared
  - ✅ Redirected to login page

### 7.2 Verify Token Cleared
Open DevTools Console:
```javascript
localStorage.getItem('token')
// Should return: null
```

### 7.3 Try to Access Dashboard
- Try to navigate to http://localhost:5173/dashboard
- Expected: 
  - ✅ Redirected to login page
  - ✅ Cannot access protected route

---

## Step 8: Test Multiple User Registration

### 8.1 Register Second User
- Go to http://localhost:5173/register
- **Name:** Jane Smith
- **Email:** jane@example.com
- **Password:** password456

### 8.2 After Registration
- Go to login page
- Login as Jane Smith

### 8.3 Verify Different Avatar
- Avatar should be different from John Doe's
- Different seed = different avatar visual

### 8.4 Check Database
```bash
# In MongoDB
db.users.find({})
# Should return both users with different avatars
```

---

## Step 9: Error Handling Tests

### 9.1 Test Duplicate Email Registration
- Try to register with already-used email
- Expected error: "User already exists with this email"

### 9.2 Test Invalid Email
- Try registering with invalid email (e.g., "notanemail")
- Expected error: "Please enter a valid email"

### 9.3 Test Password Too Short
- Try registering with password < 6 characters
- Expected error: "Password must be at least 6 characters"

### 9.4 Test Missing Fields
- Try registering without filling all fields
- Expected error: "Please add all fields"

### 9.5 Test Wrong Login Password
- Try logging in with correct email but wrong password
- Expected error: "Invalid email or password"

### 9.6 Test Non-existent Email Login
- Try logging in with email that doesn't exist
- Expected error: "Invalid email or password"

---

## Step 10: Mobile Responsiveness Test

### 10.1 Open DevTools Mobile View
- Press F12
- Click device toolbar (mobile view)
- Select any mobile device

### 10.2 Check Navbar on Mobile
- Navbar should show hamburger menu icon
- Logo should be smaller
- Click hamburger to open mobile menu

### 10.3 Mobile Menu Features
- Should show user profile section
- Should show dark mode toggle
- Should show sign out button
- All items should be clickable

### 10.4 Test Mobile Registration/Login
- Should work on mobile screen sizes
- Form should be responsive
- Buttons should be touch-friendly

---

## Step 11: API Endpoint Testing (Optional - Postman)

### 11.1 Test Registration Endpoint
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

Expected response:
```json
{
  "success": true,
  "message": "Registration successful! Please login.",
  "token": "eyJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Test User",
    "email": "test@example.com",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Test%20User"
  }
}
```

### 11.2 Test Login Endpoint
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

Expected response: Same user object with avatar

### 11.3 Test Protected Endpoint
```bash
GET http://localhost:5000/api/auth/me
Authorization: Bearer eyJhbGc...
Content-Type: application/json
```

Expected response: User profile with avatar

---

## Step 12: Performance Check

### 12.1 Check Network Requests
- Open DevTools Network tab
- Register/Login
- Verify:
  - ✅ API calls complete in < 1 second
  - ✅ No 404 errors
  - ✅ Avatar loads from CDN

### 12.2 Check Console for Errors
- Open DevTools Console
- Should have NO errors
- Only expected warnings are OK

### 12.3 Check Loading States
- Registration/Login should show loading spinner
- Should disable button while loading
- Should re-enable after completion

---

## Step 13: Data Validation Tests

### 13.1 Email Uniqueness
- Try registering two users with same email
- Second one should fail

### 13.2 Password Hashing
- Never store plain text password
- Verify with bcrypt comparison on login

### 13.3 Token Verification
- Invalid tokens should be rejected
- Expired tokens should be rejected (30 days)

---

## Checklist - All Tests

- [ ] Registration successful with avatar
- [ ] Registration redirects to login
- [ ] Login works with correct credentials
- [ ] JWT token stored in localStorage
- [ ] Navbar displays user info
- [ ] Avatar displays correctly
- [ ] Dark mode toggle works
- [ ] Dark mode persists after refresh
- [ ] Sign out clears token and redirects
- [ ] Protected routes blocked when logged out
- [ ] Multiple users have different avatars
- [ ] Error messages display correctly
- [ ] Mobile responsive navbar
- [ ] API endpoints return avatar
- [ ] No console errors
- [ ] Performance acceptable

---

## Common Issues & Solutions

### Issue: Avatar not showing
**Solution:** Check if avatar URL is valid
```javascript
// In browser console while logged in:
// Check user data
JSON.stringify(JSON.parse(localStorage.getItem('user')), null, 2)
```

### Issue: Dark mode not persisting
**Solution:** Clear localStorage and refresh
```javascript
localStorage.clear()
// Refresh page
```

### Issue: Login fails after registration
**Solution:** Check password hashing
```bash
# In MongoDB console
db.users.findOne({email: "test@example.com"})
# Should have hashed password starting with $2a$
```

### Issue: Navbar not showing
**Solution:** Verify you're logged in
```javascript
localStorage.getItem('token')
// Should return a token, not null
```

---

## Success Criteria

✅ All 8 issues resolved  
✅ Registration flow complete  
✅ Login flow complete  
✅ Avatar auto-generated  
✅ Navbar displays all elements  
✅ Dark mode toggle works  
✅ Sign out functional  
✅ Mobile responsive  
✅ No console errors  
✅ All API endpoints return avatar  

---

**Test Date:** [Fill in]  
**Tester Name:** [Fill in]  
**Status:** ✅ READY FOR TESTING

---

## Next Testing Phase

After all above tests pass:
1. Load testing with multiple users
2. Security testing (OWASP)
3. Browser compatibility testing
4. Performance optimization review
5. User acceptance testing (UAT)
