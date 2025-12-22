# Domnor - Personal Link-in-Bio Platform

Domnor is a full-stack web application that allows users to create customizable personal profile pages with links, social media integrations, and payment QR codes (Bakong KHQR). Think of it as a self-hosted alternative to Linktree with enhanced features.

## 🌟 Features

### Core Features
- **Custom Profile Pages**: Create personalized profile pages with unique usernames
- **Link Management**: Add, edit, and delete custom links with titles, descriptions, and images
- **Social Media Integration**: Connect multiple social media platforms (Facebook, Instagram, X, TikTok, YouTube, LinkedIn, GitHub, Telegram)
- **Profile Customization**: Upload profile pictures, add bio, and customize themes
- **Bakong KHQR Integration**: Generate payment QR codes for Cambodian users (supports both individual and merchant accounts)
- **Profile View Tracking**: Track profile visits with cookie-based analytics
- **Internationalization (i18n)**: Multi-language support powered by next-intl
- **Google OAuth**: Sign in with Google for quick authentication
- **Email/Password Authentication**: Traditional authentication with JWT tokens

### Security Features
- **JWT-based Authentication**: Secure access and refresh token mechanism
  - Access tokens expire in 15 minutes
  - Refresh tokens expire in 7 days
  - HttpOnly cookies for token storage
- **Rate Limiting**: Redis-backed rate limiting (100 requests per 15 minutes per IP)
- **Password Hashing**: Bcrypt with salt rounds for secure password storage
- **Google Safe Browsing API**: Validates URLs against malicious threats before saving
- **Content Filtering**: Bad words filter for usernames, bios, and other user content
- **Input Sanitization**: XSS prevention through HTML escaping and input validation
- **Reserved Username Protection**: Prevents registration of reserved/protected usernames
- **Role-Based Access Control (RBAC)**: Admin and User roles with protected routes
- **Account Deactivation**: Admin capability to deactivate/reactivate user accounts
- **Secure Cookie Configuration**: 
  - SameSite protection
  - Secure flag in production
  - HttpOnly flags on authentication cookies
- **CORS Protection**: Configured CORS with credentials support
- **MongoDB Injection Prevention**: Mongoose schema validation and sanitization
- **Cloudinary Integration**: Secure image upload with signed URLs
- **Docker Security**: Non-root user execution in containers

### Technical Features
- **RESTful API**: Well-structured API endpoints with proper HTTP methods
- **Database Relations**: MongoDB with Mongoose ODM for data relationships
- **Image Upload & Management**: Cloudinary integration for profile pictures and QR codes
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Type Safety**: Full TypeScript implementation on both frontend and backend
- **Testing**: Vitest for both backend and frontend testing
- **Docker Support**: Multi-stage Docker builds with development and production configurations
- **Hot Reloading**: Development setup with nodemon and Next.js hot reload

## 🏗️ Project Structure

```
domnor/
├── backend/                    # Express.js backend
│   ├── src/
│   │   ├── config/            # Configuration files (passport, env, reserved names)
│   │   ├── controllers/       # Request handlers (user, profile, KHQR, cloudinary)
│   │   ├── helpers/           # Utility functions (cookies, link safety checks)
│   │   ├── https/             # HTTP clients and services
│   │   ├── middleware/        # Auth, rate limiting, admin auth, profile view tracking
│   │   ├── model/             # Mongoose models (User, Profile, Link, Role)
│   │   ├── routes/            # API routes
│   │   ├── types/             # TypeScript type definitions
│   │   ├── utils/             # Utility functions (tokens, sanitization, Google Safe Browsing)
│   │   └── index.ts           # Application entry point
│   ├── tests/                 # Backend tests
│   ├── Dockerfile             # Multi-stage Docker build
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/domnor/           # Next.js frontend
│   ├── app/                   # Next.js 14 App Router
│   │   └── [locale]/         # Internationalized routes
│   │       ├── about/        # About page
│   │       ├── create-profile/ # Profile creation
│   │       ├── dashboard/    # User dashboard
│   │       └── [userProfile]/ # Dynamic profile pages
│   ├── components/            # React components
│   ├── config/                # Frontend configuration
│   ├── helpers/               # Helper functions
│   ├── i18n/                  # Internationalization setup
│   ├── lib/                   # Libraries and utilities
│   ├── messages/              # i18n message files
│   ├── providers/             # React context providers
│   ├── public/                # Static assets
│   ├── types/                 # TypeScript types
│   ├── utils/                 # Utility functions
│   ├── validationSchema/      # Zod validation schemas
│   ├── Dockerfile             # Multi-stage Docker build
│   ├── next.config.ts         # Next.js configuration
│   └── package.json
│
├── docker-compose.yml         # MongoDB service
├── docker-compose.dev.yml     # Development configuration
└── docker-compose.prod.yml    # Production configuration
```

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v20 or higher
- **MongoDB**: v8.0 or higher (or MongoDB Atlas account)
- **Redis**: For rate limiting (Redis Cloud or local instance)
- **Cloudinary Account**: For image uploads
- **Google OAuth Credentials**: For Google authentication
- **Google Safe Browsing API Key**: For URL validation

### Environment Variables

#### Backend (.env)
Create a `.env` file in the `backend/` directory:

```env
# Database
MONGO_URI=mongodb://localhost:27017/domnorDB
# or use MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/domnorDB

# JWT Secrets (generate strong random strings)
JWT_SECRET=your_jwt_secret_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Google Safe Browsing API
GOOGLE_SB_API=your_google_safe_browsing_api_key

# Server Configuration
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Cloudinary
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
CLOUDINARY_CLOUD_NAME=your_cloud_name
PUBLIC_CLOUDINARY_UPLOAD_ENDPOINT=https://api.cloudinary.com/v1_1/your_cloud_name/upload

# Redis (for rate limiting)
USERNAME=default
PASSWORD=your_redis_password
SOCKET_HOST=your_redis_host
REDIS_PORT=6379
```

#### Frontend (.env)
Create a `.env` file in the `frontend/domnor/` directory:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000

# Cloudinary (public keys)
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_cloudinary_api_key
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_ENDPOINT=https://api.cloudinary.com/v1_1/your_cloud_name/upload

# Cloudinary (private - for server-side)
NEXT_CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NEXT_CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
```

### Installation

#### Option 1: Local Development

1. **Clone the repository**
```bash
git clone <repository-url>
cd domnor
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd ../frontend/domnor
npm install
```

4. **Set up environment variables** (as described above)

5. **Start MongoDB locally** (if not using MongoDB Atlas)
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:8.0-noble
```

6. **Start Redis locally** (or use Redis Cloud)
```bash
# Using Docker
docker run -d -p 6379:6379 --name redis redis:latest
```

7. **Run backend development server**
```bash
cd backend
npm run dev
```

8. **Run frontend development server** (in a new terminal)
```bash
cd frontend/domnor
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

#### Option 2: Docker Development

1. **Clone the repository**
```bash
git clone <repository-url>
cd domnor
```

2. **Set up environment variables** in `backend/.env` and `frontend/domnor/.env`

3. **Start all services with Docker Compose**
```bash
# Start MongoDB
docker-compose up -d

# Start backend in development mode with hot reload
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up backend
```

Note: The frontend development is typically run locally for better hot-reload performance. If you want to run it in Docker, uncomment the frontend service in `docker-compose.dev.yml`.

#### Option 3: Docker Production

1. **Build and run production containers**
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build
```

This will:
- Build optimized production images
- Run the backend on port 4000
- Run MongoDB on port 27017
- Use compiled/transpiled code (no hot reload)

## 📚 API Documentation

### Authentication Endpoints

#### Create User
```http
POST /api/create-user
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

#### Login
```http
POST /api/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

#### Google OAuth
```http
GET /api/auth/google
# Redirects to Google OAuth consent screen

GET /api/auth/google/callback
# Callback URL after Google authentication
```

#### Logout
```http
POST /api/logout
Cookie: access_token=<token>
```

#### Refresh Token
```http
POST /api/refresh-token
Cookie: refresh_token=<token>
```

#### Get User Role
```http
GET /api/user/role
Authorization: Bearer <token>
```

### Profile Endpoints

#### Create Profile
```http
POST /api/create-profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "johndoe",
  "displayName": "John Doe",
  "bio": "Software Developer",
  "profilePictureUrl": "https://cloudinary.com/...",
  "socials": {
    "github": "https://github.com/johndoe",
    "x": "https://x.com/johndoe"
  },
  "theme": "classic dark"
}
```

#### Get Profile by Username
```http
GET /api/:username
# Example: GET /api/johndoe
```

#### Get Current User Profile
```http
GET /api/me
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /api/update-profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "displayName": "John Smith",
  "bio": "Updated bio"
}
```

#### Update Profile Picture
```http
PATCH /api/profile/picture
Authorization: Bearer <token>
Content-Type: application/json

{
  "profilePictureUrl": "https://cloudinary.com/new-image.jpg"
}
```

### Link Management Endpoints

#### Create Link
```http
POST /api/create-link
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My Portfolio",
  "url": "https://example.com",
  "description": "Check out my work",
  "imageUrl": "https://cloudinary.com/image.jpg"
}
```

#### Get Profile Links
```http
GET /api/profile/:username/links
# Example: GET /api/profile/johndoe/links
```

#### Delete Link
```http
DELETE /api/profile/links/:linkId
Authorization: Bearer <token>
```

### Payment (KHQR) Endpoints

#### Create Bakong KHQR
```http
POST /api/khqr
Authorization: Bearer <token>
Content-Type: application/json

{
  "accountType": "individual",
  "bakongAccountID": "user@aba",
  "merchantName": "John Doe",
  "merchantCity": "Phnom Penh",
  "currency": "KHR",
  "amount": 10000
}
```

### Cloudinary Endpoints

#### Get Upload Signature
```http
GET /api/sign-upload
Authorization: Bearer <token>
```

### Admin Endpoints

#### Deactivate Account
```http
PATCH /api/admin/deactivate/:username
Authorization: Bearer <admin-token>
```

#### Reactivate Account
```http
PATCH /api/admin/reactivate/:username
Authorization: Bearer <admin-token>
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test              # Run tests
npm run test:ui       # Run tests with UI
```

### Frontend Tests
```bash
cd frontend/domnor
npm test              # Run tests
```

## 🔒 Security Best Practices

1. **Environment Variables**: Never commit `.env` files. Use strong, randomly generated secrets.
2. **JWT Secrets**: Generate cryptographically secure random strings (minimum 32 characters).
3. **HTTPS**: Always use HTTPS in production. Update `NODE_ENV=production` and configure proper CORS.
4. **Redis Password**: Use a strong password for Redis in production.
5. **MongoDB**: Use MongoDB Atlas with IP whitelist or secure your local MongoDB instance.
6. **Rate Limiting**: Adjust rate limits based on your needs in `backend/src/middleware/rateLimit.ts`.
7. **Google OAuth**: Configure authorized redirect URIs in Google Cloud Console.
8. **Cloudinary**: Keep API secrets private and use signed uploads for production.
9. **Docker**: The application runs as non-root users in production containers for security.

## 🛠️ Technologies Used

### Backend
- **Express.js 5.x**: Web framework
- **TypeScript**: Type safety
- **MongoDB 8.x**: Database
- **Mongoose**: ODM for MongoDB
- **Passport.js**: Authentication middleware
  - passport-local: Email/password authentication
  - passport-jwt: JWT strategy
  - passport-google-oauth20: Google OAuth
- **bcrypt**: Password hashing
- **jsonwebtoken**: JWT token generation
- **Redis**: Rate limiting store
- **Cloudinary**: Image storage and management
- **Bakong KHQR**: Payment QR code generation for Cambodia
- **bad-words**: Content filtering
- **validator**: Input validation
- **Zod**: Schema validation
- **Google Safe Browsing API**: URL safety validation
- **Vitest**: Testing framework

### Frontend
- **Next.js 16**: React framework with App Router
- **React 19**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS 4**: Utility-first CSS
- **next-intl**: Internationalization
- **React Hook Form**: Form management
- **Zod**: Form validation
- **TanStack Query**: Data fetching and caching
- **Axios**: HTTP client
- **Cloudinary React SDK**: Image upload components
- **react-image-crop**: Image cropping
- **react-draggable**: Drag-and-drop functionality
- **GSAP**: Animation library
- **Lucide React**: Icon library
- **react-toastify**: Toast notifications
- **Vitest**: Testing framework

### DevOps
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **Node.js 22**: Runtime environment
- **tsx**: TypeScript execution for development
- **nodemon**: File watching and auto-restart

## 📝 Scripts

### Backend Scripts
```bash
npm run dev          # Start development server with tsx watch
npm run dev:docker   # Start development server for Docker
npm run build        # Build TypeScript to JavaScript
npm run start        # Start production server
npm test             # Run tests
npm run test:ui      # Run tests with UI
npm run clean        # Remove dist folder
```

### Frontend Scripts
```bash
npm run dev          # Start Next.js development server
npm run dev:docker   # Start Next.js for Docker
npm run build        # Build for production
npm run start        # Start production server
npm test             # Run tests
npm run lint         # Run ESLint
```

## 🌐 Deployment

### Environment Configuration
1. Set `NODE_ENV=production` in backend
2. Update `FRONTEND_URL` to your production domain
3. Configure CORS with your production domain
4. Use HTTPS for all endpoints
5. Enable secure cookies (handled automatically when `NODE_ENV=production`)

### Docker Production Deployment
```bash
# Build and start production containers
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# View logs
docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs -f

# Stop services
docker-compose -f docker-compose.yml -f docker-compose.prod.yml down
```

### Considerations
- Use a process manager (PM2) or container orchestration (Kubernetes, Docker Swarm)
- Set up monitoring and logging (e.g., Datadog, New Relic)
- Configure proper backup strategies for MongoDB
- Use a CDN for static assets
- Implement SSL/TLS certificates (Let's Encrypt)
- Set up CI/CD pipelines for automated deployments

## 📄 License

ISC License

## 👤 Author

**Sarin Dararith**

## ⚠️ Known Issues

As documented in the TODO file:
1. Rate limiting needs refinement
2. Preview draggable doesn't work on mobile devices
3. Tests need to be reworked

## 🔮 Future Enhancements

- Analytics dashboard for profile views and link clicks
- Custom themes and template builder
- QR code customization options
- Link scheduling (publish/unpublish at specific times)
- Link click tracking
- Integration with more payment systems
- Email verification
- Password reset functionality
- Two-factor authentication
- API rate limit customization per user tier
- Profile templates marketplace

---

**Note**: This project is under active development. Please check the TODO file for current development priorities and known issues.
