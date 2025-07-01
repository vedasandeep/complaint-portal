# Online Grievance Redressal System

A simple Next.js application for managing grievances with admin functionality.

## Quick Start

1. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Run the development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

3. **First-time setup:**
   - Open your browser to [http://localhost:3000](http://localhost:3000)
   - On first visit, you'll see a setup prompt
   - Choose "Initialize with Sample Data" for quick testing
   - Or "Register New Account" to start fresh

## Test Accounts (after sample data setup)

- **Admin:** admin@example.com / admin123
- **User:** john@example.com / user123

## Features

- **Smart Initialization**: Automatically detects if setup is needed
- **User registration and authentication**
- **File grievances with department selection**
- **Admin dashboard to manage and respond to grievances**
- **File-based data storage (no database required)**
- **Role-based access control**
- **Clean interface without persistent setup buttons**

## How It Works

### First Visit
- System detects no existing data
- Shows setup options on home page
- Setup button only appears when needed

### After Setup
- Normal application interface
- No setup buttons cluttering the UI
- All functionality available based on user role

### Data Storage
- Automatic file-based storage in `data/` directory
- `data/users.json` - User accounts
- `data/grievances.json` - Grievance records
- Data persists between server restarts

## Usage

### Initial Setup (First Time Only)
1. Visit the application homepage
2. Choose "Initialize with Sample Data" for testing
3. Or choose "Register New Account" to start fresh
4. Setup interface disappears after initialization

### For Regular Users:
1. Register with "Regular User" role or use sample account
2. Login with your credentials
3. File grievances using the "File Grievance" button
4. View your grievances and admin responses in "My Grievances"

### For Administrators:
1. Register with "Administrator" role or use sample admin account
2. Login and access the "Admin Dashboard"
3. View all grievances from all users
4. Click on any grievance to respond and update status
5. Track grievance statistics

## Clean Interface

- Setup options only appear when system is uninitialized
- Once data exists, normal application interface is shown
- No persistent setup buttons cluttering the navigation
- Professional appearance for production use

## Troubleshooting

If you need to reset the system:
1. Stop the development server
2. Delete the `data/` directory
3. Restart the server
4. Setup options will appear again on first visit

## Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   ├── file-grievance/    # Grievance submission
│   ├── login/             # Login page
│   ├── my-grievances/     # User grievances
│   ├── register/          # Registration page
│   └── setup/             # Setup page (only when needed)
├── components/            # Reusable components
├── contexts/              # React contexts
├── lib/                   # Utility functions and data store
└── data/                  # JSON data files (created at runtime)
