const fs = require("fs")
const path = require("path")

// Create data directory and sample data for testing
const dataDir = path.join(process.cwd(), "data")

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
  console.log("Created data directory")
}

// Sample users
const sampleUsers = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
  },
  {
    id: "2",
    name: "John Doe",
    email: "john@example.com",
    password: "user123",
    role: "user",
  },
]

// Sample grievances
const sampleGrievances = [
  {
    id: "1",
    title: "Office AC not working",
    description:
      "The air conditioning in the main office has been broken for 3 days. It's getting very hot and uncomfortable to work.",
    department: "Maintenance",
    status: "Pending",
    submittedAt: new Date().toISOString(),
    userId: "2",
  },
  {
    id: "2",
    title: "Salary discrepancy",
    description:
      "There seems to be an error in my salary calculation for this month. The amount is less than expected.",
    department: "Human Resources",
    status: "In Progress",
    submittedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    userId: "2",
    adminResponse: "We are reviewing your salary details and will get back to you within 2 business days.",
    respondedAt: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
  },
]

// Write sample data
fs.writeFileSync(path.join(dataDir, "users.json"), JSON.stringify(sampleUsers, null, 2))
fs.writeFileSync(path.join(dataDir, "grievances.json"), JSON.stringify(sampleGrievances, null, 2))

console.log("Sample data created successfully!")
console.log("You can now login with:")
console.log("Admin: admin@example.com / admin123")
console.log("User: john@example.com / user123")
