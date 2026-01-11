# Khnhom - Digital Identity Platform for Cambodia

## Overview

Khnhom (ខ្ញុំ - meaning "I/Me" in Khmer). I built Khnhom because I wanted more Cambodian to have an easier time sharing everything about themselves without worrying about language barriers or payment hassles. It combines link aggregation, KHQR payment integration, and social media management into a single link.

## Live Demo

**Live Demo**: [Live Demo](https://khnhom.com)

### Screenshots

![Homepage](https://res.cloudinary.com/dosj9q3zb/image/upload/v1768037390/homepage_nk5f9u.png)
_Homepage with locale selection_

![Profile Dashboard](https://res.cloudinary.com/dosj9q3zb/image/upload/v1768037391/dashboard_kuw1cc.png)
_User dashboard for managing profile_

![Public Profile](https://res.cloudinary.com/dosj9q3zb/image/upload/v1768037391/profile_apimkk.png)
_Example public profile with multiple templates_

![KHQR Integration](https://res.cloudinary.com/dosj9q3zb/image/upload/v1768037391/khqr_lcf2up.png)
_Bakong KHQR payment integration_

### Key Highlights

- **Multiple custom templates** for unique profile styles
- **Support for English and Khmer** languages
- **Official KHQR integration** with Bakong API
- **Cloudinary integration** for image management
- **Profile analytics** with view tracking (currently hidden)
- **Secure authentication** with Google OAuth and JWT

---

### The Problem

I noticed that content creators and small businesses in Cambodia were struggling with some pretty frustrating issues. They had to manually share multiple social media links every time someone asked. Opening their banking app just to share a payment QR code got old fast. And honestly, there weren't many tools out there that really understood the Khmer context or offered proper localization. Most importantly, there was no easy way to create a unified digital presence that felt authentically Cambodian.

### The Solution

So I built Khnhom to solve these problems:

- **One Link to Rule Them All**: Share a single URL that showcases everything about you
- **No More Banking App Gymnastics**: Generate KHQR payment codes right from your profile using official Bakong services

---

## Key Features

### 🔗 Link Management

- Centralized link aggregation for all social platforms
- Custom link titles and URLs with validation
- Drag and drop link reordering (upcoming)

### KHQR Payment Integration

- Generate KHQR codes using official Bakong API
- Support for both individual and merchant accounts
- Multiple currency support (KHR/USD)
- Secure, server side QR generation

### Profile Customization

- Multiple pre designed templates
- Custom themes with color schemes
- Background image uploads via Cloudinary
- Profile picture management

### Authentication & Security

- Google OAuth 2.0 integration
- JWT based authentication with refresh tokens
- HTTP only cookies for token storage
- Role based access control (User/Admin)

### Internationalization

- Full English/Khmer localization using `next-intl`
- URL based locale routing (`/en/*`, `/kh/*`)

### Analytics & Monetization

- Profile view tracking (Hidden at the moment)
- Verified badge system
- Contribution tracking

### Content Safety

- Google Safe Browsing API integration
- URL validation and sanitization
- Malicious link detection

---

## Tech Stack

### Frontend

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks, Context API
- **Internationalization**: next-intl
- **HTTP Client**: Axios
- **Image Management**: Cloudinary

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Passport.js (Google OAuth), JWT
- **File Upload**: Cloudinary
- **Security**: Helmet, CORS, express validator
- **Testing**: Vitest
- **Development**: Nodemon, ts-node

### DevOps & Infrastructure

- **Containerization**: Docker, Docker Compose
- **Environment Management**: dotenv
- **API Documentation**: Swagger/OpenAPI (planned)
- **CI/CD**: GitHub Actions (planned)

---

## Project Structure

```
khnhom/
├── backend/
│   ├── src/
│   │   ├── config/           # Database, passport, Redis configuration
│   │   ├── controllers/      # Request handlers (user, profile, KHQR, cloudinary)
│   │   ├── helpers/          # Utility functions
│   │   ├── https/            # External API clients
│   │   ├── middleware/       # Express middleware (auth, rate limiting)
│   │   ├── model/            # Mongoose schemas
│   │   │   └── types-for-models/
│   │   ├── routes/           # API route definitions
│   │   ├── types/            # TypeScript type definitions
│   │   └── utils/            # Helper utilities
│   ├── tests/                # Test suites
│   │   ├── controllerTests/
│   │   ├── middlewareTests/
│   │   ├── modelTests/
│   │   └── utiltests/
│   └── [config files]        # Dockerfile, package.json, tsconfig.json, etc.
│
├── frontend/src/
│   ├── app/
│   │   └── [locale]/         # Next.js App Router with i18n
│   │       ├── about/
│   │       ├── contact/
│   │       ├── create-profile/
│   │       ├── dashboard/
│   │       ├── privacy/
│   │       ├── terms/
│   │       └── [userProfile]/
│   ├── components/           # React components
│   │   ├── badge/
│   │   ├── createProfile/
│   │   ├── footer/
│   │   ├── googleLogin/
│   │   ├── home/
│   │   ├── nav/
│   │   ├── profileEditor/
│   │   ├── templates/
│   │   ├── ui/
│   │   └── [more components]
│   ├── config/
│   ├── gsap/
│   ├── helpers/
│   ├── hooks/
│   ├── https/                # API client
│   ├── i18n/                 # Internationalization config
│   ├── lib/
│   ├── messages/             # i18n translations (en.json, kh.json)
│   ├── providers/
│   ├── public/
│   ├── tests/
│   ├── types/                # TypeScript type definitions
│   ├── utils/
│   ├── validationSchema/
│   └── [config files]        # next.config.ts, tailwind.config.ts, etc.
│
├── docker-compose.dev.yml
├── docker-compose.prod.yml
├── docker-compose.yml
└── README.md
```

---

## 📡 API Documentation

### Authentication Endpoints

#### Google OAuth

```http
GET /api/auth/google
GET /api/auth/google/callback
```

#### Refresh Token

```http
POST /api/auth/refresh-token
Cookie: refresh_token=<token>
```

#### Logout

```http
POST /api/logout
Cookie: access_token=<token>
```

### Profile Endpoints

#### Create Profile

```http
POST /api/create-profile
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "username": "myusername",
  "displayName": "My Display Name",
  "bio": "My bio",
  "socials": {
    "facebook": "https://facebook.com/username"
  }
}
```

#### Get Profile by Username

```http
GET /api/:username
```

#### Get Current User Profile

```http
GET /api/me
Authorization: Bearer <access_token>
```

#### Update Profile

```http
PUT /api/update-profile
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "displayName": "Updated Name",
  "bio": "Updated bio",
  "socials": {
    "facebook": "https://facebook.com/updated"
  }
}
```

#### Update Profile Picture

```http
PATCH /api/profile/picture
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "profilePictureUrl": "https://cloudinary.com/image.jpg"
}
```

### Link Endpoints

#### Add Link

```http
POST /api/create-link
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "link": {
    "title": "My Website",
    "url": "https://example.com"
  }
}
```

#### Get Profile Links

```http
GET /api/profile/:username/links
```

#### Delete Link

```http
DELETE /api/profile/links/:linkId
Authorization: Bearer <access_token>
```

### KHQR Endpoints

#### Generate KHQR (Individual or Merchant)

```http
POST /api/khqr
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "accountType": "individual",
  "bakongAccountID": "user@bank",
  "merchantName": "John Doe",
  "amount": "10.00",
  "currency": "USD"
}
```

#### Generate KHQR for Donation

```http
POST /api/user/generate-donation-khqr
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "amount": "10.00"
}
```

**Response:**

```json
{
  "qrData": "data:image/png;base64,...",
  "md5": "hash_value"
}
```

#### Check Payment Status

```http
GET /api/payment/status/:md5
```

**Response (Pending):**

```json
{
  "status": "PENDING"
}
```

**Response (Completed):**

```json
{
  "status": "COMPLETED",
  "amount": 10.0
}
```

**Response (Expired):**

```json
{
  "status": "EXPIRED"
}
```

### Cloudinary Endpoints

#### Get Upload Signature

```http
GET /api/sign-upload
Authorization: Bearer <access_token>
```

**Response:**

```json
{
  "signature": "signature_string",
  "timestamp": 1234567890,
  "publicId": "user_123_profile"
}
```

### User Management Endpoints

#### Get User Role

```http
GET /api/user/role
Authorization: Bearer <access_token>
```

**Response:**

```json
{
  "role": "user" | "admin"
}

```

### Public Endpoints

#### Get Public Profiles (For Sitemap)

```http
GET /profiles/public
```

**Response:**

```json
{
  "status": "success",
  "data": [
    {
      "username": "user1",
      "updatedAt": "2026-01-10T12:00:00.000Z"
    },
    {
      "username": "user2",
      "updatedAt": "2026-01-09T15:30:00.000Z"
    }
  ]
}
```

---

## Testing

### Backend Tests

```bash
cd backend
npm run test            # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
```

Test structure:

- **Controller Tests**: API endpoint behavior
- **Middleware Tests**: Authentication, validation
- **Model Tests**: Database operations
- **Utility Tests**: Helper functions

### Frontend Tests (Planned)

```bash
cd frontend/src
npm run test            # Run all tests
```

---

## Security Considerations

### Implemented

**Authentication**

- JWT with short-lived access tokens (15 min)
- HTTP only cookies for token storage
- Refresh token rotation with grace period
- Secure cookie attributes (`secure`, `sameSite`)

**Input Validation**

- express validator for all inputs
- URL sanitization and HTTPS enforcement
- MongoDB injection prevention
- XSS protection via Helmet

**API Security**

- CORS with whitelist
- Rate limiting
- Request size limits
- Google Safe Browsing integration

**Data Privacy**

- User owned data model
- No third-party data sharing
- Profile deactivation support

---

## What I Learned

### Technical Skills

**Full-Stack Development**

- Built a production ready application using modern tech stack
- Implemented complex authentication flow with JWT and OAuth 2.0
- Designed and optimized database schemas with Mongoose

**API Design**

- RESTful API principles and best practices
- Request validation and error handling
- Cookie based authentication vs token based

**Frontend Architecture**

- Next.js 15 App Router and server components
- Internationalization with next-intl
- State management patterns in React

**Payment Integration**

- KHQR implementation using official Bakong API
- QR code generation and validation
- Handling different payment scenarios (individual/merchant)

**DevOps**

- Docker containerization and orchestration
- Multi stage Docker builds
- Environment based configuration

**Security**

- Implementing secure authentication patterns
- Protecting against common vulnerabilities (XSS, CSRF, injection)
- Content validation with third party APIs

### Soft Skills

**Problem-Solving**

- Debugging complex authentication issues
- Optimizing database queries for performance
- Handling edge cases in user flows

**Project Management**

- Breaking down features into manageable tasks
- Prioritizing features based on user needs

---

## Future Enhancements

I've got some exciting ideas for where Khnhom is headed:

- [ ] **Analytics Dashboard**: See exactly which links are getting clicked and when
- [ ] **More Templates**: Because variety is the spice of life
- [ ] **Mobile App**: A native mobile experience using React Native
- [ ] **Advanced Analytics**: Understand who's visiting and where they're coming from
- [ ] **Data Export**: Your data is yours—export it whenever you want
- [ ] **Webhook Integration**: Get real-time notifications when things happen
- [ ] **Public API**: Let developers build cool stuff with Khnhom
- [ ] **Integration Marketplace**: Connect with all your favorite services

---

## Author

**Sarin Dararith**

- Email: sarindararith5540@gmail.com

---

## Acknowledgments

- Built with love for the Cambodian digital community
- Inspired by Linktree, Beacons, and other link-in-bio tools
- Khmer fonts: Noto Sans Khmer, Khmer OS

---

<div align="center">

Made with ❤️ in Cambodia

</div>
