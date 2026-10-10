# Leads Management System (LMS) - Frontend

A modern, responsive Lead Management System (LMS) web application built with **Next.js (App Router)**, **React**, **TypeScript**, and **Tailwind CSS**.

---

## Features

- **Authentication**: Administrator login flow with cookie/token-based session management and profile overview.
- **Leads Management**:
  - Filter and search leads in real-time with debounced input.
  - Filter by status (`New`, `Contacted`, `Qualified`, `Lost`).
  - Server-side pagination with clean record counts.
  - Add, View (Readonly), Edit, and Delete leads.
- **Lead Notes**:
  - Add notes during lead creation or attach notes to existing leads.
  - Chronological note history display.
- **Responsive UI**: Collapsible sidebar, sticky topbar, custom modal dialogs, and toast notifications.

---

## Getting Started

### 1. Prerequisites

- **Node.js**: v18.17.0 or higher
- **npm**, **yarn**, or **pnpm**
- **LMS Backend**: Ensure the backend server (`lms-be`) is running (default: `http://localhost:5000`).

---

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
NEXT_PUBLIC_BASE_URL=https://lms-be-emi9.onrender.com/api
```

---

### 3. Installation & Run

```bash
# install dependencies
npm install

# start local development server
npm run dev
```

Open [https://lms-fe-rpgd.onrender.com](https://lms-fe-rpgd.onrender.com) in your browser.

---

### 4. Build for Production

```bash
# create production build
npm run build

# run production server
npm run start

# run linter
npm run lint
```

---

## APIs Used in Frontend (with cURL Examples)

All requests interact with the backend API (`https://lms-be-emi9.onrender.com/api`).

---

### 1. Authentication APIs

#### 1.1 Admin Login

Authenticates administrator credentials and sets an HTTP-only authentication cookie (`token`).

```bash
curl -X POST https://lms-be-emi9.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

**Response (`200 OK`):**

```json
{
  "data": {
    "token": "eyJhbGciOi...",
    "admin": {
      "id": "6704b2c1f9...",
      "email": "admin@example.com",
      "role": "admin"
    }
  },
  "message": "Login successful"
}
```

---

#### 1.2 Get Admin Profile

Fetches the currently authenticated administrator's profile data.

```bash
curl -X GET https://lms-be-emi9.onrender.com/api/auth/me \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -H "Cookie: token=<YOUR_JWT_TOKEN>"
```

**Response (`200 OK`):**

```json
{
  "data": {
    "id": "6704b2c1f9...",
    "email": "admin@example.com",
    "role": "admin"
  },
  "message": "Admin profile fetched successfully"
}
```

---

#### 1.3 Admin Logout

Clears the session cookie on the client.

```bash
curl -X POST https://lms-be-emi9.onrender.com/api/auth/logout \
  -H "Cookie: token=<YOUR_JWT_TOKEN>"
```

**Response (`200 OK`):**

```json
{
  "message": "Logout successful"
}
```

---

### 2. Leads APIs

#### 2.1 Get All Leads (with Search, Filter & Pagination)

Retrieves a paginated list of leads with optional search query and status filter.

```bash
curl -X GET "https://lms-be-emi9.onrender.com/api/leads?search=john&status=new&page=1&limit=10"
```

**Response (`200 OK`):**

```json
{
  "data": [
    {
      "_id": "67055ec031a...",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "status": "new",
      "created_at": "2026-10-09T08:00:00.000Z",
      "updated_at": "2026-10-09T08:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

---

#### 2.2 Get Lead by ID

Fetches details of a single lead by ID.

```bash
curl -X GET https://lms-be-emi9.onrender.com/api/leads/67055ec031a...
```

**Response (`200 OK`):**

```json
{
  "data": {
    "_id": "67055ec031a...",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "status": "new",
    "created_at": "2026-10-09T08:00:00.000Z",
    "updated_at": "2026-10-09T08:00:00.000Z"
  }
}
```

---

#### 2.3 Create Lead

Creates a new lead entry.

```bash
curl -X POST https://lms-be-emi9.onrender.com/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "9876543210",
    "status": "new"
  }'
```

**Response (`201 Created`):**

```json
{
  "data": {
    "_id": "670560a129b...",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "9876543210",
    "status": "new",
    "created_at": "2026-10-09T08:30:00.000Z",
    "updated_at": "2026-10-09T08:30:00.000Z"
  },
  "message": "Lead created successfully"
}
```

---

#### 2.4 Update Lead (Partial Update)

Updates specific fields of an existing lead by ID.

```bash
curl -X PATCH https://lms-be-emi9.onrender.com/api/leads/670560a129b... \
  -H "Content-Type: application/json" \
  -d '{
    "status": "contacted"
  }'
```

**Response (`200 OK`):**

```json
{
  "data": {
    "_id": "670560a129b...",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "9876543210",
    "status": "contacted",
    "created_at": "2026-10-09T08:30:00.000Z",
    "updated_at": "2026-10-09T08:45:00.000Z"
  },
  "message": "Lead updated successfully"
}
```

---

#### 2.5 Delete Lead

Permanently deletes a lead and any associated notes.

```bash
curl -X DELETE https://lms-be-emi9.onrender.com/api/leads/670560a129b...
```

**Response (`200 OK`):**

```json
{
  "message": "Lead record deleted successfully"
}
```

---

### 3. Lead Notes APIs

#### 3.1 Get Notes for a Lead

Retrieves all notes recorded for a specific lead.

```bash
curl -X GET https://lms-be-emi9.onrender.com/api/leads/67055ec031a.../notes
```

**Response (`200 OK`):**

```json
{
  "data": [
    {
      "_id": "6705615f21c...",
      "lead_id": "67055ec031a...",
      "content": "Called the client, scheduled demo for Monday.",
      "created_at": "2026-10-09T09:00:00.000Z",
      "updated_at": "2026-10-09T09:00:00.000Z"
    }
  ]
}
```

---

#### 3.2 Add Note to Lead

Creates and attaches a new note to a specific lead.

```bash
curl -X POST https://lms-be-emi9.onrender.com/api/leads/67055ec031a.../notes \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Followed up via email regarding pricing proposal."
  }'
```

**Response (`201 Created`):**

```json
{
  "data": {
    "_id": "670562e154d...",
    "lead_id": "67055ec031a...",
    "content": "Followed up via email regarding pricing proposal.",
    "created_at": "2026-10-09T09:15:00.000Z",
    "updated_at": "2026-10-09T09:15:00.000Z"
  },
  "message": "Note created successfully"
}
```

---

## Project Structure

```text
lms-fe/
├── app/                      # Next.js App Router pages and layouts
│   ├── layout.tsx            # Root layout with fonts & metadata
│   ├── page.tsx              # Dashboard route (leads list)
│   ├── login/                # Authentication page
│   ├── profile/              # Readonly admin user profile page
│   ├── leads/
│   │   ├── add/              # Create new lead page
│   │   └── [id]/             # View & edit lead routes
│   └── not-found.tsx         # Custom 404 page
├── common/                   # Shared types, helpers, constants, modals
│   ├── enums.ts              # Status, mode, and toast enums
│   ├── helper.ts             # Validation regex, error message extractor
│   ├── icon.tsx              # Reusable SVG icon components
│   └── types.ts              # TypeScript domain and state interfaces
├── components/               # Core feature components
│   ├── LeadForm.tsx          # Reusable add/view/edit form with notes
│   ├── LeadsList.tsx         # Filterable leads table with pagination
│   ├── Login.tsx             # Admin login form
│   ├── ManageLead.tsx        # View and edit wrapper with data loader
│   ├── Profile.tsx           # Readonly admin profile details
│   ├── Sidebar.tsx           # Navigation sidebar
│   ├── Topbar.tsx            # Header with breadcrumbs & profile menu
│   └── layout/
│       └── BaseLayout.tsx    # Responsive shell layout
├── micro-components/         # Atomic reusable UI components
│   ├── FormInput.tsx         # Input field with label, icon, and error
│   ├── Pagination.tsx        # Pagination bar with record counter
│   ├── SearchInput.tsx       # Search box with clear button
│   ├── StatusDropdownFilter.tsx # Status filter dropdown for table
│   └── StatusSelect.tsx      # Form status dropdown with color dots
├── libs/
│   └── Apis.tsx              # Axios API functions connecting to backend
└── public/                   # Static assets
```
