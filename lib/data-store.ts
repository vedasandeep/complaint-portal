import fs from "fs"
import path from "path"

// File paths for data storage
const DATA_DIR = path.join(process.cwd(), "data")
const USERS_FILE = path.join(DATA_DIR, "users.json")
const GRIEVANCES_FILE = path.join(DATA_DIR, "grievances.json")

export interface User {
  id: string
  name: string
  email: string
  password: string
  role: "user" | "admin"
}

export interface Grievance {
  id: string
  title: string
  description: string
  department: string
  status: "Pending" | "In Progress" | "Resolved"
  submittedAt: string
  userId: string
  adminResponse?: string
  respondedAt?: string
}

// Check if system is initialized (has users)
export const isSystemInitialized = (): boolean => {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, "utf8")
      const users = JSON.parse(data)
      return users.length > 0
    }
  } catch (error) {
    console.error("Error checking system initialization:", error)
  }
  return false
}

// Ensure data directory exists
const ensureDataDir = () => {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
      console.log("Created data directory:", DATA_DIR)
    }
  } catch (error) {
    console.error("Error creating data directory:", error)
  }
}

// Initialize with sample data if files don't exist
const initializeSampleData = () => {
  ensureDataDir()

  // Sample users
  if (!fs.existsSync(USERS_FILE)) {
    const sampleUsers: User[] = [
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

    try {
      fs.writeFileSync(USERS_FILE, JSON.stringify(sampleUsers, null, 2))
      console.log("Created sample users file")
    } catch (error) {
      console.error("Error creating users file:", error)
    }
  }

  // Sample grievances
  if (!fs.existsSync(GRIEVANCES_FILE)) {
    const sampleGrievances: Grievance[] = [
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

    try {
      fs.writeFileSync(GRIEVANCES_FILE, JSON.stringify(sampleGrievances, null, 2))
      console.log("Created sample grievances file")
    } catch (error) {
      console.error("Error creating grievances file:", error)
    }
  }
}

// Load data from files
const loadUsers = (): User[] => {
  try {
    // Only initialize sample data if system is not initialized
    if (!isSystemInitialized()) {
      initializeSampleData()
    }

    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, "utf8")
      return JSON.parse(data)
    }
  } catch (error) {
    console.error("Error loading users:", error)
  }
  return []
}

const loadGrievances = (): Grievance[] => {
  try {
    ensureDataDir()

    if (fs.existsSync(GRIEVANCES_FILE)) {
      const data = fs.readFileSync(GRIEVANCES_FILE, "utf8")
      return JSON.parse(data)
    }
  } catch (error) {
    console.error("Error loading grievances:", error)
  }
  return []
}

// Save data to files
const saveUsers = (users: User[]) => {
  try {
    ensureDataDir()
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2))
  } catch (error) {
    console.error("Error saving users:", error)
  }
}

const saveGrievances = (grievances: Grievance[]) => {
  try {
    ensureDataDir()
    fs.writeFileSync(GRIEVANCES_FILE, JSON.stringify(grievances, null, 2))
  } catch (error) {
    console.error("Error saving grievances:", error)
  }
}

// Helper functions
export const findUserByEmail = (email: string): User | undefined => {
  const users = loadUsers()
  return users.find((user) => user.email === email)
}

export const findUserById = (id: string): User | undefined => {
  const users = loadUsers()
  return users.find((user) => user.id === id)
}

export const addUser = (user: User): void => {
  const users = loadUsers()
  users.push(user)
  saveUsers(users)
}

export const addGrievance = (grievance: Grievance): void => {
  const grievances = loadGrievances()
  grievances.push(grievance)
  saveGrievances(grievances)
}

export const findGrievanceById = (id: string): Grievance | undefined => {
  const grievances = loadGrievances()
  return grievances.find((grievance) => grievance.id === id)
}

export const updateGrievance = (id: string, updates: Partial<Grievance>): Grievance | null => {
  const grievances = loadGrievances()
  const index = grievances.findIndex((grievance) => grievance.id === id)
  if (index === -1) return null

  grievances[index] = { ...grievances[index], ...updates }
  saveGrievances(grievances)
  return grievances[index]
}

export const getGrievancesByUserId = (userId: string): Grievance[] => {
  const grievances = loadGrievances()
  return grievances.filter((grievance) => grievance.userId === userId)
}

export const getAllGrievances = (): Grievance[] => {
  return loadGrievances()
}

export const getAllUsers = (): User[] => {
  return loadUsers()
}

// Reset data function for testing (only available in development)
export const resetData = () => {
  try {
    if (fs.existsSync(USERS_FILE)) {
      fs.unlinkSync(USERS_FILE)
    }
    if (fs.existsSync(GRIEVANCES_FILE)) {
      fs.unlinkSync(GRIEVANCES_FILE)
    }
    console.log("Data files deleted")
    initializeSampleData()
    console.log("Sample data recreated")
  } catch (error) {
    console.error("Error resetting data:", error)
  }
}
