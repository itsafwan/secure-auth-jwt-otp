# secure-auth-jwt-otp
A production-ready secure authentication backend built with Node.js, TypeScript, and MongoDB. Features JWT Access/Refresh Token Rotation, Session Management (Logout from all devices), and OTP verification.

## Key Features
* **Secure OTP Verification:** Email verification using Nodemailer (OAuth2 Gmail API) with custom TTL (Time-To-Live) automatic database expiration.
* **JWT Token Rotation:** Implementation of Access and Refresh tokens for high-security identity management.
* **Device Session Management:** Secure logout mechanisms, including the ability to log out from a single device or all active devices.
* **Data Security:** Password hashing using Crypto/Bcrypt and TypeScript type-safety across all routes and controllers.

## Tech Stack
* **Backend:** Node.js, Express.js (TypeScript)
* **Database:** MongoDB (Mongoose ORM)
* **Authentication:** JWT (JsonWebToken), OAuth2

## ⚙️ Environment Variables Required
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
GOOGLE_USER=your_gmail_address
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REFRESH_TOKEN=your_refresh_token
```

## API Endpoints

### Auth Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/verify-otp` | Verify email OTP |
| POST | `/api/auth/login` | Login (returns access + refresh token) |
| POST | `/api/auth/refresh` | Rotate access token |
| POST | `/api/auth/logout` | Logout current device |
| POST | `/api/auth/logout-all` | Logout all devices |
