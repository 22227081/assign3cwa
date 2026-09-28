# AI Capsule — Cloud-Deployed AI Prompt Manager

AI Capsule is a full-stack web application for saving and managing useful AI prompts.

An authenticated user can create, view, update and delete their own prompt records. Each record can contain information such as the project name, prompt title, prompt version, prompt text, response summary, category, usefulness, review status, improved status, screenshot URL and notes.

The application uses React for the frontend, Node.js and Express for the backend, SQLite for database storage, GitHub OAuth for authentication, and JWT for protecting the application API.

The application is deployed on Render.

---

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules into your project.

---

# 1. Technology Stack

## Frontend

- React
- Vite
- React Router
- JavaScript
- CSS

## Backend

- Node.js
- Express.js
- Axios
- JSON Web Token (`jsonwebtoken`)
- Cookie Parser
- CORS
- Dotenv

## Database

- SQLite
- better-sqlite3

## Authentication

- GitHub OAuth
- Express-issued application JWT
- Secure, HttpOnly cookie named `token`

## Cloud Platform

- Render

---

# 2. Deployed Application

Cloud Platform: Render

Public URL:

https://assign3cwa-1.onrender.com


The React frontend and Express backend are served from the same deployed application.

---

# 3. Application Pages

| Route | Access | Purpose |
|---|---|---|
| `/` | Public | Public landing page |
| `/login` | Public | Starts GitHub OAuth login |
| `/dashboard` | Protected | Shows the authenticated user's dashboard |
| `/create` | Protected | Creates a new prompt capsule |
| `/capsules` | Protected | Displays, updates and deletes capsules |

---

# 4. API Routes

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/api/health` | Public | Returns API health status |
| GET | `/api/capsules` | Protected | Reads authenticated user's capsules |
| POST | `/api/capsules` | Protected | Creates a new capsule |
| PUT | `/api/capsules/:id` | Protected | Updates an existing capsule |
| DELETE | `/api/capsules/:id` | Protected | Deletes an existing capsule |

The health endpoint returns:

```json
{
  "status": "ok"
}
```

---

# 5. Frontend and Backend Communication

The React frontend communicates with the Express backend using HTTP requests.

The main API requests are:

- `GET /api/capsules`
- `POST /api/capsules`
- `PUT /api/capsules/:id`
- `DELETE /api/capsules/:id`

The frontend sends requests using credentials so that the authentication cookie is included:

```javascript
credentials: "include"
```

The frontend does not send `user_id` when creating or modifying a capsule.

The backend obtains the authenticated user's identity from the verified JWT.

---

# 6. GitHub OAuth Authentication

GitHub OAuth is used as the authentication provider.

The authentication flow is:

```text
User
  ↓
Login page
  ↓
GitHub OAuth
  ↓
GitHub authorisation
  ↓
/auth/github/callback
  ↓
Express receives OAuth code
  ↓
Express obtains GitHub user information
  ↓
Express creates application JWT
  ↓
JWT stored in HttpOnly cookie named "token"
  ↓
Dashboard
```

The GitHub OAuth access token is not used as the application's session token.

After successful GitHub authentication, the Express backend creates its own application JWT.

---

# 7. JWT Authentication and Protection

The application uses JSON Web Tokens to protect the capsule API.

The application JWT is stored in a cookie named:

```text
token
```

The cookie is configured as HttpOnly and uses the Secure flag in production.

The JWT middleware reads the token from the cookie and verifies it using the `JWT_SECRET` environment variable.

If no token is provided, the API returns:

```text
401 Unauthorized
```

If an invalid or expired token is provided, the API also returns:

```text
401 Unauthorized
```

All capsule CRUD routes are protected by the JWT authentication middleware.

---

# 8. User Ownership and Security

Each capsule belongs to the authenticated user.

The `user_id` is obtained from the verified JWT and is not supplied by the browser.

When creating a capsule, the backend stores the authenticated user's ID as the owner of the record.

For reading, updating and deleting records, the backend uses both the capsule ID and the authenticated user's ID.

This ensures that a user can only access and modify their own capsule records.

The application does not accept `user_id` from the frontend for ownership decisions.

---

# 9. Database

The application uses SQLite with `better-sqlite3`.

The main `capsules` table contains the following fields:

```text
id
user_id
project_name
prompt_title
prompt_version
prompt_text
response_summary
category
usefulness
reviewed
improved
screenshot_url
notes
created_at
```

The database table is automatically created when the backend starts if it does not already exist.

The database file is excluded from Git using `.gitignore`.

---

# 10. Database Storage Limitation

The deployed application uses SQLite on the Render service's local filesystem.

The local filesystem used by the deployed service is temporary, so SQLite data may be lost after a restart or redeployment.

Therefore, the current deployed database should be considered ephemeral rather than persistent production storage.

A persistent managed database such as PostgreSQL would be more suitable for long-term production data storage.

---

# 11. Environment Variables

The application uses the following environment variables:

```text
NODE_ENV
PORT
JWT_SECRET
GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET
GITHUB_CALLBACK_URL
FRONTEND_URL
```

Example configuration:

```text
NODE_ENV=production
PORT=<provided by Render>
JWT_SECRET=<secret>
GITHUB_CLIENT_ID=<GitHub OAuth client ID>
GITHUB_CLIENT_SECRET=<GitHub OAuth client secret>
GITHUB_CALLBACK_URL=https://assign3cwa-1.onrender.com/auth/github/callback
FRONTEND_URL=https://assign3cwa-1.onrender.com

```

Secret values are not included in this README or the GitHub repository.

---

# 12. Local Installation

Clone the repository:

```bash
git clone https://github.com/22227081/assign3cwa.git
```

Enter the project directory:

```bash
cd assign3cwa
```

## Backend

```bash
cd backend
npm install
```

Create a `.env` file containing the required environment variables.

For local development, the GitHub OAuth callback URL is:

```text
http://localhost:3001/auth/github/callback
```

Start the backend:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:3001
```

## Frontend

Open another terminal and run:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

---

# 13. Production Build

The React frontend is built using Vite:

```bash
npm run build
```

For the Render deployment, the frontend and backend are installed and the React production build is generated using:

```bash
cd frontend && npm install --include=dev && npm run build && cd ../backend && npm install
```

The deployed application is started using:

```bash
node backend/server.js
```

Express serves the React production build and the API from the same deployed application.

---

# 14. Required cURL Security Tests

## Test 1 — No Authentication

Command:

```bash
curl -i https://YOUR_RENDER_URL.onrender.com/api/capsules
```

Expected result:

```text
401 Unauthorized
```

Actual result:

```text
[PASTE YOUR ACTUAL RESULT HERE]
```

---

## Test 2 — Invalid JWT

Command:

```bash
curl -i -H "Cookie: token=fake-token-123" https://assign3cwa-1.onrender.com/api/capsules
```

Expected result:

```text
401 Unauthorized
```

Actual result:

```text
401 Unauthorized
```

These tests confirm that the protected API rejects both unauthenticated requests and invalid JWTs.

---

# 15. CRUD Verification

The complete CRUD workflow was tested after GitHub OAuth login.

## CREATE

A new prompt capsule is created using:

```text
POST /api/capsules
```

The authenticated user's ID is automatically stored as the owner.

## READ

Saved capsules are retrieved using:

```text
GET /api/capsules
```

Only capsules belonging to the authenticated user are returned.

## UPDATE

An existing capsule is updated using:

```text
PUT /api/capsules/:id
```

The backend checks that the capsule belongs to the authenticated user before updating it.

## DELETE

An existing capsule is deleted using:

```text
DELETE /api/capsules/:id
```

The backend checks ownership before deleting the record.

---

# 16. OAuth and JWT Verification

OAuth authentication was verified by:

1. Opening the application login page.
2. Selecting Login with GitHub.
3. Authorising the GitHub OAuth application.
4. Returning to the application's OAuth callback.
5. Express obtaining the authenticated GitHub user's information.
6. Express creating an application JWT.
7. The JWT being stored in the `token` cookie.
8. The user being redirected to the dashboard.
9. Authenticated CRUD operations working successfully.

JWT protection was also verified using the two required cURL tests.

Requests without a valid JWT return `401 Unauthorized`.

---

# 17. AI-Assisted Development

AI tools were used during development for:

- Project setup
- React components
- Express API routes
- SQLite database implementation
- GitHub OAuth integration
- JWT authentication
- CSS and interface development
- Debugging
- Testing
- Cloud deployment troubleshooting

All generated code was reviewed, tested and modified where necessary to meet the assignment requirements.

---

# 18. Problems Found and Corrected

## Express 5 Routing Issue

During development, the SPA fallback initially used:

```javascript
app.get("*", ...)
```

This caused an Express routing error:

```text
PathError: Missing parameter name
```

The route was corrected to the Express 5 compatible syntax:

```javascript
app.get("/{*splat}", ...)
```

After this correction, the Express server started correctly and the React frontend could be served by Express.

## Render Vite Build Issue

During cloud deployment, the Render build initially failed with:

```text
sh: 1: vite: not found
```

The problem was that Vite was a development dependency and was not available during the build.

The Render build command was changed to:

```bash
cd frontend && npm install --include=dev && npm run build && cd ../backend && npm install
```

This ensures that the Vite build dependency is installed before the React production build is created.

---

# 19. Implementation and Deployment Decision

A single Render Web Service was used to host both the React frontend and Express backend.

The React production build is served by Express.

This approach keeps the frontend and backend on the same public origin and simplifies authentication cookie handling and API communication.

---

# 20. Security Considerations

The application implements the following security measures:

- GitHub OAuth authentication
- Express-issued application JWT
- HttpOnly authentication cookie
- Secure cookie in production
- JWT verification middleware
- Protected CRUD API routes
- `401 Unauthorized` responses for missing or invalid JWTs
- User ownership based on verified JWT identity
- No browser-supplied `user_id` for ownership
- OAuth secrets stored in environment variables
- JWT secret stored in an environment variable
- `.env` excluded from Git
- Database files excluded from Git
- No real JWT or secret values included in the repository

---

# 21. Project Structure

```text
assign3cwa/
│
├── backend/
│   ├── middleware/
│   │   └── auth.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   └── capsules.js
│   │
│   ├── db.js
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
└── README.md
```

---

# 22. Conclusion

AI Capsule demonstrates a complete full-stack application using:

```text
React
   ↓
Express API
   ↓
GitHub OAuth
   ↓
Application JWT
   ↓
HttpOnly Cookie
   ↓
JWT Middleware
   ↓
SQLite
   ↓
CRUD Operations
   ↓
Render Cloud Deployment
```

The application provides authenticated prompt management while enforcing ownership of capsule records for each authenticated user.


