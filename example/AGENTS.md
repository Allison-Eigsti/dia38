<!-- BEGIN:nextjs-agent-rules -->

AGENTS.md
Project Overview
Build a full-stack blog application using Next.js, React, Node.js, MongoDB, JWT authentication, and Tailwind CSS. Do not use TypeScript.

This project is primarily a learning project. The implementation should favor clear, conventional, easy-to-understand patterns over clever abstractions or excessive complexity.

The goal is to demonstrate how a developer familiar with:

React

Express

REST APIs

MongoDB

can transition to building a full-stack application with Next.js.

The coding agent should therefore make architectural decisions explicit and use standard Next.js conventions wherever possible.

Assignment Requirements
The application is a blog where registered users can create posts and comments.

Public users
Unauthenticated users can:

View all posts

View individual posts

View comments

Read the author information associated with posts/comments

Unauthenticated users cannot:

Create posts

Edit posts

Delete posts

Create comments

Edit comments

Delete comments

Authenticated users
Authenticated users can:

Register

Log in

Log out

Create their own posts

Edit their own posts

Delete their own posts

Create comments

Edit their own comments

Delete their own comments

Users must not be able to edit or delete content belonging to another user.

Backend requirements
The application must provide functionality for:

User registration

User login

Creating posts

Editing posts

Deleting posts

Creating comments

Editing comments

Deleting comments

Listing posts with their respective comments

Authentication must use JWT.

Protected operations must require authentication.

Post images are mandatory and must be stored in MongoDB as Base64 data.

Frontend requirements
The frontend must:

Provide registration and login pages

Display posts publicly

Display comments publicly

Allow authenticated users to manage their own posts

Allow authenticated users to create comments

Allow authenticated users to manage their own comments

Maintain authentication state globally

Persist the session across browser refreshes

Use Tailwind CSS

Deployment
Both frontend and backend must be deployable to Vercel.

The README must contain:

Project description

Technologies used

Installation instructions

Development instructions

Frontend deployment URL

Backend deployment URL

Optional screenshots

Primary Learning Goal
Do not treat this as an Express application that happens to use React.

The developer already understands the following concepts:

Express routing

REST endpoints

Middleware

Controllers

MongoDB

React components

React state

The purpose of this project is to learn how these concepts map onto a modern Next.js application.

When choosing between multiple valid approaches, prefer the approach that makes the relationship between:

Next.js page → component → client/server boundary → API → database

easy to understand.

Avoid unnecessary abstractions.

Technology Stack
Use:

Next.js with the App Router

React

Tailwind CSS

MongoDB

Mongoose

JWT

bcrypt/bcryptjs for password hashing

Zod for request/form validation where useful

ESLint

Vercel

Prefer the latest stable versions compatible with the project.

Do not introduce additional major frameworks unless there is a compelling reason.

## Project Architecture:

Use the Next.js App Router.

The project should have a structure similar to:

/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   │
│   ├── posts/
│   │   ├── page.tsx
│   │   ├── new/
│   │   │   └── page.tsx
│   │   └── [postId]/
│   │       ├── page.tsx
│   │       └── edit/
│   │           └── page.tsx
│   │
│   ├── layout.tsx
│   ├── page.tsx
│   └── providers.tsx
│
├── app/api/
│   ├── auth/
│   │   ├── register/
│   │   │   └── route.ts
│   │   ├── login/
│   │   │   └── route.ts
│   │   └── logout/
│   │       └── route.ts
│   │
│   ├── posts/
│   │   ├── route.ts
│   │   └── [postId]/
│   │       ├── route.ts
│   │       └── comments/
│   │           └── route.ts
│   │
│   └── comments/
│       └── [commentId]/
│           └── route.ts
│
├── components/
│   ├── auth/
│   ├── posts/
│   ├── comments/
│   ├── layout/
│   └── ui/
│
├── lib/
│   ├── db.ts
│   ├── auth.ts
│   ├── jwt.ts
│   └── validation/
│
├── models/
│   ├── User.ts
│   ├── Post.ts
│   └── Comment.ts
│
├── hooks/
│   └── ...
│
├── types/
│   └── ...
│
├── public/
│
├── .env.local
├── .env.example
├── next.config.ts
├── package.json
└── README.md


This is a guideline rather than an absolute requirement. If the agent changes the structure, explain why.

Important Next.js Concepts
The implementation should intentionally demonstrate the following concepts.

App Router
Use the app/ directory and Next.js App Router.

Do not use the old Pages Router.

Server Components
Prefer Server Components by default.

For example, pages that simply retrieve and display public posts should generally be Server Components when practical.

Example:

```
export default async function PostsPage() {
  const posts = await getPosts();

  return <PostList posts={posts} />;
}
```

Do not add "use client" to every component.


Client Components
Use "use client" only when the component actually requires browser/client functionality, such as:

React state

React event handlers

Forms requiring client interaction

Context

Browser APIs

Client-side authentication state

For example:

```
"use client";

export function LoginForm() {
  // Interactive form logic
}
```

Keep the client/server boundary as small as practical.

API Routes
Use Next.js Route Handlers for backend API endpoints.

Example:

app/api/posts/route.ts

can implement:

GET  /api/posts
POST /api/posts

And:

app/api/posts/[postId]/route.ts

can implement:

GET    /api/posts/:postId
PATCH  /api/posts/:postId
DELETE /api/posts/:postId

Use standard HTTP methods and status codes.

For example:

GET     /api/posts
GET     /api/posts/:id
POST    /api/posts
PATCH   /api/posts/:id
DELETE  /api/posts/:id

POST    /api/posts/:id/comments
PATCH   /api/comments/:id
DELETE  /api/comments/:id

POST    /api/auth/register
POST    /api/auth/login
POST    /api/auth/logout

Keep API route handlers relatively thin.

Business logic should be moved into reusable server-side functions when the logic becomes non-trivial.

API Response Format
Use consistent JSON responses.

Successful response:

{
  "data": {}
}

Error response:

{
  "error": "Human-readable error message"
}

For validation errors, provide enough information for the frontend to display useful feedback.

Use appropriate HTTP status codes:

200 OK
201 Created
204 No Content
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
500 Internal Server Error

Database
Use MongoDB with Mongoose.

Create a reusable MongoDB connection helper.

Do not create a new database connection for every request.

The connection helper should safely reuse the connection during development and work correctly in the serverless environment used by Vercel.

Example conceptual structure:

lib/db.ts
models/User.ts
models/Post.ts
models/Comment.ts

Data Models
Use three primary models.

User
Suggested fields:

_id
name
email
passwordHash
createdAt
updatedAt

Never store plaintext passwords.

Post
Suggested fields:

_id
title
content
image
author
createdAt
updatedAt

The image is required.

Store the image in MongoDB as a Base64 string as required by the assignment.

Consider also storing a MIME type:

imageData
imageMimeType

This makes rendering the image easier.

For example:

data:image/jpeg;base64,...

Do not store uploaded images on the local filesystem because the assignment specifically requires database storage.

Comment
Suggested fields:

_id
content
author
post
createdAt
updatedAt

author should reference the User.

post should reference the Post.

Authentication
Use JWT-based authentication.

Authentication should be implemented on the server.

Recommended flow:

Register
   ↓
Hash password
   ↓
Create User
   ↓
Login
   ↓
Verify password
   ↓
Create JWT
   ↓
Set secure HTTP-only cookie
   ↓
Browser automatically sends cookie
   ↓
Server verifies JWT
   ↓
Protected route proceeds

Prefer storing the JWT in an HTTP-only cookie rather than localStorage.

Reasons:

JavaScript cannot directly access HTTP-only cookies

Better protection against token theft through common XSS scenarios

Cookies integrate naturally with Next.js server-side request handling

Use appropriate cookie settings:

httpOnly
secure in production
sameSite
appropriate expiration

Do not expose the JWT secret to the client.

Authentication Helpers
Create a small authentication abstraction in something like:

lib/auth.ts
lib/jwt.ts

The project should make it easy to understand how a protected request works.

Conceptually:

const user = await getAuthenticatedUser();

if (!user) {
  return unauthorizedResponse();
}

Avoid duplicating JWT parsing and verification in every route.

Authorization
Authentication answers:

"Who is this user?"

Authorization answers:

"Is this user allowed to perform this action?"

Implement both.

For example, when editing a post:

1. Verify JWT
2. Find current user
3. Find post
4. Verify post.author === currentUser.id
5. Update post

A user must never be able to modify another user's posts simply by changing the post ID in the URL.

The same applies to comments.

Authentication State
Use a React Context provider for the first version.

This is intentional because the project is educational and the developer wants to understand global state in Next.js.

Example:

app/providers.tsx
context/AuthContext.tsx

The provider can expose:

{
  user,
  isLoading,
  isAuthenticated,
  login,
  logout,
  register,
  refreshUser
}

Do not introduce Redux unless there is a genuine reason.

Context is sufficient for authentication state in this application.

Session Persistence
The session must survive a browser refresh.

Do not rely solely on React state.

Because authentication is stored in an HTTP-only cookie, the frontend should have a mechanism to retrieve the currently authenticated user from the server.

For example:

GET /api/auth/me

The AuthProvider can call this endpoint when it initializes.

Conceptually:

Browser refresh
      ↓
AuthProvider mounts
      ↓
GET /api/auth/me
      ↓
Browser sends auth cookie
      ↓
Server verifies JWT
      ↓
Server returns current user
      ↓
React stores user in context

This demonstrates an important Next.js concept:

the browser session and React state are different things.

Middleware
Do not use Next.js middleware simply because it exists.

For this project, prefer server-side authentication checks inside protected API handlers and server components.

Middleware may be introduced later if there is a clear use case, such as redirecting unauthenticated users away from protected pages.

The initial implementation should prioritize clarity.

Frontend Data Fetching
Keep data fetching straightforward.

Do not introduce React Query, SWR, Redux Toolkit, or another data-fetching framework unless there is a strong reason.

For this learning project, standard:

fetch()

is sufficient.

This lets the developer understand:

browser requests

server requests

API endpoints

HTTP methods

cookies

JSON responses

loading states

error handling

before introducing another abstraction.

Pages
Create a simple but complete set of pages.

Suggested routes:

/                       → Home / post list
/login                  → Login
/register               → Registration
/posts/[postId]         → Post details
/posts/new              → Create post
/posts/[postId]/edit    → Edit post

The home page should display public posts.

Post details should display:

title

image

content

author

created date

comments

Authenticated users should see controls appropriate to their permissions.

Components
Prefer components organized by feature.

For example:

components/
├── auth/
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   └── LogoutButton.tsx
│
├── posts/
│   ├── PostCard.tsx
│   ├── PostList.tsx
│   ├── PostForm.tsx
│   ├── DeletePostButton.tsx
│   └── PostImage.tsx
│
├── comments/
│   ├── CommentList.tsx
│   ├── CommentItem.tsx
│   ├── CommentForm.tsx
│   └── DeleteCommentButton.tsx
│
├── layout/
│   ├── Navbar.tsx
│   └── Footer.tsx
│
└── ui/
    ├── Button.tsx
    ├── Input.tsx
    ├── Textarea.tsx
    └── ...

Do not create a component for every HTML element.

Create components when they represent:

reusable UI

a meaningful feature

a meaningful piece of application behavior

Forms
Forms should have:

client-side validation

loading states

server error handling

success handling where appropriate

disabled submission while submitting

Use Zod for validation where practical.

Important:

Client-side validation is for user experience.

Server-side validation is for security and correctness.

Never rely exclusively on client-side validation.

Image Uploads
Images are mandatory for posts.

The implementation should:

Allow the user to select an image.

Validate the file type.

Validate a reasonable maximum file size.

Convert the file to Base64.

Send the Base64 data to the backend.

Validate it again on the server.

Store it in MongoDB.

Render it from the stored Base64 data.

Do not store image files in:

/public

or on the server filesystem as the permanent source of truth.

The assignment explicitly requires Base64 storage in the database.

Because Base64 can significantly increase database size, keep the implementation simple and enforce a reasonable file-size limit.

Security
Never:

store plaintext passwords

expose password hashes in API responses

expose JWT secrets to the browser

trust a user ID sent from the client for authorization

trust client-side authorization checks

allow users to edit/delete resources they do not own

construct MongoDB queries directly from unvalidated user input

return unnecessary sensitive user information

Sanitize/validate request bodies using schemas.

Error Handling
API routes should gracefully handle:

malformed JSON

validation errors

missing authentication

invalid authentication

missing resources

unauthorized resource access

database failures

unexpected server errors

Do not expose stack traces or internal database details to clients in production responses.

Log useful server-side information for debugging.

Environment Variables
Use environment variables for secrets and configuration.

Example:

MONGODB_URI=
JWT_SECRET=

If the project needs additional configuration, add it to:

.env.example

Never commit:

.env.local

Never hard-code:

MongoDB credentials

JWT secrets

API keys

production URLs that should be configurable

TypeScript
Use TypeScript throughout the project.

Avoid:

any

unless there is a strong justification.

Create shared types where useful:

types/

Examples:

type User
type Post
type Comment
type AuthUser

Be careful not to confuse:

MongoDB/Mongoose documents

API response objects

client-side types

Only expose the fields the frontend actually needs.

Server vs Client Data Access
Prefer this mental model:

                 Next.js
                    │
       ┌────────────┴────────────┐
       │                         │
 Server Components         Client Components
       │                         │
       │                         │
 Server-side logic        fetch('/api/...')
       │                         │
       └────────────┬────────────┘
                    ↓
             Route Handlers
                    ↓
             Authentication
                    ↓
               Validation
                    ↓
              Business Logic
                    ↓
                MongoDB

The codebase should make these boundaries understandable.

API vs Direct Database Access
Do not access MongoDB directly from client components.

The browser should never receive database credentials or a MongoDB connection.

Client components communicate with the application through HTTP/API boundaries.

Server components may sometimes retrieve data directly on the server when appropriate.

However, for the purposes of learning the full-stack architecture, keep the API layer explicit enough that the developer can understand the backend contract.

Do not create unnecessary duplication solely for architectural purity.

REST API Documentation
Document the API in the README.

Include a table similar to:

Method	Endpoint	Auth	Description
POST	/api/auth/register	No	Register user
POST	/api/auth/login	No	Login
POST	/api/auth/logout	Yes	Logout
GET	/api/auth/me	Yes	Get current user
GET	/api/posts	No	List posts
POST	/api/posts	Yes	Create post
GET	/api/posts/:id	No	Get post
PATCH	/api/posts/:id	Yes	Update own post
DELETE	/api/posts/:id	Yes	Delete own post
POST	/api/posts/:id/comments	Yes	Create comment
PATCH	/api/comments/:id	Yes	Update own comment
DELETE	/api/comments/:id	Yes	Delete own comment

If the implementation differs, update the documentation.

HTTP and REST Conventions
Use HTTP methods semantically.

Prefer:

GET     → retrieve
POST    → create
PATCH   → partially update
DELETE  → delete

Do not create endpoints such as:

POST /api/deletePost
POST /api/updatePost

when a conventional REST endpoint would be clearer.

Authorization Rules
The backend is the source of truth.

For posts:

POST   /api/posts              → authenticated
PATCH  /api/posts/:id          → authenticated + owner
DELETE /api/posts/:id          → authenticated + owner

For comments:

POST   /api/posts/:id/comments → authenticated
PATCH  /api/comments/:id       → authenticated + owner
DELETE /api/comments/:id       → authenticated + owner

A client-side button being hidden does NOT count as authorization.

UI Authorization
The frontend may hide controls based on authentication state:

Not logged in:
    Login
    Register

Logged in:
    Create Post
    Logout

Own post:
    Edit
    Delete

Other user's post:
    No Edit/Delete

But these UI checks are purely for user experience.

The backend must independently enforce all authorization rules.

Styling
Use Tailwind CSS.

Keep the UI intentionally simple.

The purpose of the assignment is architecture, not visual design.

Use a consistent design system for:

buttons

forms

inputs

cards

errors

loading states

navigation

Avoid spending excessive effort on animations or elaborate design systems.

Loading and Error States
The application should have useful states for:

loading posts

loading a post

submitting forms

deleting posts

submitting comments

authentication requests

failed API requests

empty post lists

empty comment lists

Use Next.js loading/error conventions where appropriate:

loading.tsx
error.tsx
not-found.tsx

when they improve the architecture.

Optional Features
Only implement optional features after the required functionality works.

Potential additions:

Pagination
Implement pagination for posts.

For example:

GET /api/posts?page=1&limit=10

Do not add pagination before the basic API is working.

Admin
An admin system can be added later with fields such as:

User.role = "user" | "admin"

Admin functionality should include proper server-side authorization.

Testing
At minimum, manually verify:

Authentication
Register successfully

Prevent duplicate email registration

Login successfully

Reject invalid credentials

Refresh browser while logged in

Logout successfully

Posts
Public users can view posts

Authenticated users can create posts

Images are required

Images are stored as Base64

Users can edit their own posts

Users can delete their own posts

Users cannot edit another user's post

Users cannot delete another user's post

Comments
Public users can read comments

Authenticated users can create comments

Users can edit their own comments

Users can delete their own comments

Users cannot edit another user's comments

Users cannot delete another user's comments

Deployment
Test both deployments independently.

Code Quality Rules
Prefer:

simple
explicit
typed
conventional
readable

over:

clever
abstract
highly generic
over-engineered

Do not introduce abstractions until there is repetition or a clear architectural reason.

For example, do not create:

BaseRepository
BaseController
BaseService
GenericCrudService

unless the project genuinely benefits from them.

This is a learning project.

The code should teach the developer how the application works.

Comments and Documentation
Add comments when a piece of code demonstrates an important Next.js concept.

Good comment:

// Route handlers run on the server, so this is safe for
// accessing MongoDB and verifying the HTTP-only auth cookie.

Avoid comments that merely restate the code:

// Set user to response.user
setUser(response.user);

The README should explain the architecture at a high level.

README Requirements
The README should include:

Project Description
Explain what the application does.

Technologies
List:

Next.js

React

TypeScript

MongoDB

Mongoose

JWT

Tailwind CSS

Vercel

Architecture
Briefly explain:

Next.js App Router
        ↓
React components
        ↓
Route Handlers
        ↓
Authentication
        ↓
Mongoose
        ↓
MongoDB

Installation
Document:

git clone ...
cd ...
npm install

Then explain environment variables.

Development
Document the command:

npm run dev

API
Document the endpoints and authentication requirements.

Deployment
Include:

Frontend: https://...
Backend: https://...

If the frontend and backend are both contained in one Next.js application, explain that clearly rather than pretending they are separate applications.

Screenshots
Optional screenshots may be included.

Git and Project Hygiene
Do not commit:

.env
.env.local
node_modules/
.next/

Keep .env.example committed.

Use meaningful commits where practical.

Important Architectural Decision
This project should use one Next.js application containing both the frontend and backend unless there is a specific reason to split them.

That means:

Next.js
├── React UI
├── Server Components
├── Client Components
├── Route Handlers
├── Authentication
├── Database access
└── Deployment

The assignment says that both frontend and backend must be deployed to Vercel.

If everything lives inside one Next.js application, a single Vercel deployment can serve both the UI and API.

The README should explicitly explain this architectural choice.

If the assignment instructor explicitly requires two separate Vercel projects, then split the application into:

frontend/
backend/

Otherwise, prefer the single Next.js application because it is the more educational approach for learning full-stack Next.js.

Development Workflow for the Coding Agent
Implement the project incrementally.

Do not generate the entire application in one enormous change.

Recommended sequence:

Step 1 — Project setup
Create:

Next.js app

TypeScript

Tailwind

ESLint

basic folder structure

Make sure the application runs.

Step 2 — Database
Implement:

MongoDB connection

User model

Post model

Comment model

Verify the database connection.

Step 3 — Authentication
Implement:

registration

password hashing

login

JWT

HTTP-only cookie

logout

/api/auth/me

Verify authentication independently before building the rest of the application.

Step 4 — Posts API
Implement:

list posts

get post

create post

update post

delete post

Add authorization checks.

Step 5 — Comments API
Implement:

list comments through post

create comment

update comment

delete comment

Add authorization checks.

Step 6 — Authentication UI
Build:

login page

registration page

AuthProvider

navigation

logout

Verify session persistence.

Step 7 — Posts UI
Build:

post list

post details

create post

edit post

delete post

image upload

Step 8 — Comments UI
Build:

comment list

comment form

edit comment

delete comment

Step 9 — Validation and error states
Add:

frontend validation

backend validation

loading states

error states

empty states

Step 10 — Polish and documentation
Add:

responsive styling

README

API documentation

deployment instructions

screenshots if desired

Agent Behavior
When working on this project, the coding agent should:

Explain important architectural decisions.

Prefer standard Next.js patterns.

Avoid unnecessary dependencies.

Keep server/client boundaries clear.

Keep authentication logic on the server.

Keep database access on the server.

Validate all untrusted input.

Enforce authorization on the server.

Use TypeScript properly.

Keep components reasonably small.

Avoid over-engineering.

Update documentation when architecture changes.

Explain unfamiliar Next.js concepts when introducing them.

When there are multiple valid implementations, choose the one that is:

easiest to understand,

idiomatic for modern Next.js,

secure,

maintainable,

appropriate for a small-to-medium application.

Learning Mode
Because this repository is intended as a learning exercise, the agent should not silently make major architectural decisions.

Before introducing a significant abstraction or technology, briefly explain:

What problem it solves

Why it is needed

What the simpler alternative would be

Why this project is choosing it

For example:

We could use Redux for authentication, but Context is sufficient here because authentication is small global state. Using Context also keeps the project focused on learning Next.js rather than introducing another state-management library.

Similarly, explain important boundaries such as:

This component is a Client Component because it needs useState and form event handlers. The parent page remains a Server Component.

The goal is not merely to produce working code.

The goal is for the developer to understand why the code is structured this way.

Final Standard
Before considering the project complete, verify that:

 The application runs locally

 MongoDB connects successfully

 Users can register

 Passwords are hashed

 Users can log in

 JWT authentication works

 Authentication persists after refresh

 Users can log out

 Public users can read posts

 Public users can read comments

 Authenticated users can create posts

 Authenticated users can edit their own posts

 Authenticated users can delete their own posts

 Images are mandatory

 Images are stored as Base64 in MongoDB

 Authenticated users can create comments

 Users can edit their own comments

 Users can delete their own comments

 Users cannot modify other users' content

 API validation exists

 Frontend validation exists

 Loading states exist

 Error states exist

 Tailwind is used

 README is complete

 Environment variables are documented

 Vercel deployment works

 Deployment URLs are documented

The finished project should look like a realistic, conventional Next.js full-stack application, while remaining simple enough that a developer coming from Express + React can understand every major piece.

A couple of deliberate choices in this AGENTS.md are especially important for your learning goal: I would use one Next.js app, Route Handlers for the API, App Router, Server Components by default, Client Components only where needed, Context for auth state, and HTTP-only JWT cookies.

That gives you a very useful mental translation from what you already know:

Express                         Next.js
────────────────────────────────────────────────
express.Router()        →      app/api/**/route.ts
Controller              →      route handler / server function
Express middleware      →      auth helper / middleware
React Router            →      app/**/page.tsx
React components        →      components/**
MongoDB service         →      lib/db.ts + models/**
req.body                →      await request.json()
req.params              →      route params
res.json()              →      NextResponse.json()



<!-- END:nextjs-agent-rules -->
