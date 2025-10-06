if (localStorage.getItem("currentUser")) {
  window.location.href = "home.html"
}

const loginForm = document.getElementById("loginForm")
const registerForm = document.getElementById("registerForm")
const loginUsernameInput = document.getElementById("loginUsername")
const loginPasswordInput = document.getElementById("loginPassword")
const firstNameInput = document.getElementById("firstName")
const lastNameInput = document.getElementById("lastName")
const usernameInput = document.getElementById("username")
const emailInput = document.getElementById("email")
const passwordInput = document.getElementById("password")
const confirmPasswordInput = document.getElementById("confirmPassword")
const loginButton = document.getElementById("loginButton")
const registerButton = document.getElementById("registerButton")
const loginButtonText = document.getElementById("loginButtonText")
const registerButtonText = document.getElementById("registerButtonText")
const loginSpinner = document.getElementById("loginSpinner")
const registerSpinner = document.getElementById("registerSpinner")
const errorMessage = document.getElementById("errorMessage")
const successMessage = document.getElementById("successMessage")
const passwordStrength = document.getElementById("passwordStrength")
const tabButtons = document.querySelectorAll(".tab-button")
const loginHint = document.getElementById("loginHint")

// Show/hide error message
function showError(message) {
  errorMessage.textContent = message
  errorMessage.classList.add("show")
  successMessage.classList.remove("show")
  setTimeout(() => errorMessage.classList.remove("show"), 3000)
}

// Show/hide success message
function showSuccess(message) {
  successMessage.textContent = message
  successMessage.classList.add("show")
  errorMessage.classList.remove("show")
  setTimeout(() => successMessage.classList.remove("show"), 3000)
}

// Set loading state
function setLoading(button, text, spinner, isLoading) {
  button.disabled = isLoading
  text.classList.toggle("hidden", isLoading)
  spinner.classList.toggle("hidden", !isLoading)
}

// Validate email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Password strength checker
function updatePasswordStrength(password) {
  let strength = ""
  if (password.length < 6) {
    strength = "Weak"
    passwordStrength.style.color = "var(--error-color)"
  } else if (password.length < 10) {
    strength = "Medium"
    passwordStrength.style.color = "#f1c40f"
  } else {
    strength = "Strong"
    passwordStrength.style.color = "var(--success-color)"
  }
  passwordStrength.textContent = password ? `Password Strength: ${strength}` : ""
}

// Get/set registered users
function getRegisteredUsers() {
  const users = localStorage.getItem("registeredUsers")
  return users ? JSON.parse(users) : []
}

function saveRegisteredUsers(users) {
  localStorage.setItem("registeredUsers", JSON.stringify(users))
}

// Get local user by username
function getLocalUser(username) {
  const users = getRegisteredUsers()
  return users.find(user => user.username === username)
}

// Check if user exists
async function checkUserExists(username, email) {
  const localUsers = getRegisteredUsers()
  const localUsernameExists = localUsers.some((user) => user.username === username)
  const localEmailExists = localUsers.some((user) => user.email === email)
  if (localUsernameExists) return { exists: true, message: "Username already taken" }
  if (localEmailExists) return { exists: true, message: "Email already registered" }

  try {
    const response = await fetch("https://dummyjson.com/users")
    if (!response.ok) throw new Error("Failed to connect to server")
    const { users } = await response.json()
    const apiUsernameExists = users.some((user) => user.username === username)
    const apiEmailExists = users.some((user) => user.email === email)
    if (apiUsernameExists) return { exists: true, message: "Username already taken" }
    if (apiEmailExists) return { exists: true, message: "Email already registered" }
    return { exists: false }
  } catch {
    return { exists: false } // Fallback to local check if API fails
  }
}

// Authenticate user
async function authenticateUser(username, password) {
  if (!password || password.trim() === "") return { success: false, message: "Password cannot be empty" }

  // Check local users first
  const localUser = getLocalUser(username)
  if (localUser) {
    if (localUser.password === password) {
      return { success: true, firstName: localUser.firstName, message: "Login successful!" }
    } else {
      return { success: false, message: "Incorrect password" }
    }
  }

  // Check API users
  try {
    const response = await fetch("https://dummyjson.com/users")
    if (!response.ok) throw new Error("Failed to connect to server")
    const { users } = await response.json()
    const apiUser = users.find((u) => u.username === username)
    if (!apiUser) return { success: false, message: "Username not found" }
    if (apiUser.password !== password) return { success: false, message: "Incorrect password" }
    return { success: true, firstName: apiUser.firstName, message: "Login successful!" }
  } catch (error) {
    return { success: false, message: "Connection error: " + error.message }
  }
}

// Register user
function registerUser(userData) {
  const users = getRegisteredUsers()
  users.push(userData)
  saveRegisteredUsers(users)
  localStorage.setItem("currentUser", JSON.stringify(userData))
  localStorage.setItem("firstName", userData.firstName)
  return { success: true, message: "Registration successful!" }
}

function setupPasswordToggle(input, toggle) {
  toggle.addEventListener("click", () => {
    const isPassword = input.type === "password"
    input.type = isPassword ? "text" : "password"

    // Toggle between eye and eye-off by changing the SVG path
    const svg = toggle.querySelector("svg")
    if (isPassword) {
      // Eye-off icon (crossed out)
      svg.innerHTML = `
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
      `
    } else {
      // Eye icon (normal)
      svg.innerHTML = `
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      `
    }
  })
}

// Tab switching
function switchTab(tab) {
  loginForm.style.display = tab === "login" ? "block" : "none"
  registerForm.style.display = tab === "register" ? "block" : "none"
  tabButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === tab)
    btn.setAttribute("aria-selected", btn.dataset.tab === tab)
  })
  loginHint.innerHTML =
    tab === "login"
      ? `Don't have an account? <span class="tab-link" data-tab="register">Register here</span>.`
      : `Already have an account? <span class="tab-link" data-tab="login">Login here</span>.`
  errorMessage.classList.remove("show")
  successMessage.classList.remove("show")
}

// Tab button event listeners
tabButtons.forEach((button) => {
  button.addEventListener("click", () => switchTab(button.dataset.tab))
})

// Tab link in hint
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("tab-link")) {
    switchTab(e.target.dataset.tab)
  }
})

// Password toggle setup
setupPasswordToggle(loginPasswordInput, document.getElementById("loginPasswordToggle"))
setupPasswordToggle(passwordInput, document.getElementById("passwordToggle"))
setupPasswordToggle(confirmPasswordInput, document.getElementById("confirmToggle"))

// Login form submission
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault()
  const username = loginUsernameInput.value.trim()
  const password = loginPasswordInput.value

  if (!username) {
    showError("Please enter your username")
    return
  }
  if (!password) {
    showError("Please enter your password")
    return
  }

  setLoading(loginButton, loginButtonText, loginSpinner, true)

  const result = await authenticateUser(username, password)

  setLoading(loginButton, loginButtonText, loginSpinner, false)

  if (result.success) {
    localStorage.setItem("currentUser", JSON.stringify({ username }))
    localStorage.setItem("firstName", result.firstName)
    showSuccess(result.message)
    setTimeout(() => (window.location.href = "home.html"), 1000)
  } else {
    showError(result.message)
  }
})

// Register form submission
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault()
  const firstName = firstNameInput.value.trim()
  const lastName = lastNameInput.value.trim()
  const username = usernameInput.value.trim()
  const email = emailInput.value.trim()
  const password = passwordInput.value
  const confirmPassword = confirmPasswordInput.value

  if (!firstName) {
    showError("Please enter your first name")
    return
  }
  if (!lastName) {
    showError("Please enter your last name")
    return
  }
  if (!username) {
    showError("Please enter a username")
    return
  }
  if (username.length < 3) {
    showError("Username must be at least 3 characters")
    return
  }
  if (!email) {
    showError("Please enter your email")
    return
  }
  if (!isValidEmail(email)) {
    showError("Please enter a valid email address")
    return
  }
  if (!password) {
    showError("Please enter a password")
    return
  }
  if (password.length < 6) {
    showError("Password must be at least 6 characters")
    return
  }
  if (password !== confirmPassword) {
    showError("Passwords do not match")
    return
  }

  setLoading(registerButton, registerButtonText, registerSpinner, true)

  const userCheck = await checkUserExists(username, email)
  if (userCheck.exists) {
    setLoading(registerButton, registerButtonText, registerSpinner, false)
    showError(userCheck.message)
    return
  }

  const userData = {
    firstName,
    lastName,
    username,
    email,
    password,
    registeredAt: new Date().toISOString(),
  }

  const result = registerUser(userData)

  setLoading(registerButton, registerButtonText, registerSpinner, false)

  if (result.success) {
    showSuccess(result.message)
    setTimeout(() => (window.location.href = "home.html"), 1000)
  } else {
    showError(result.message)
  }
})

// Real-time validation
;[
  loginUsernameInput,
  loginPasswordInput,
  firstNameInput,
  lastNameInput,
  usernameInput,
  emailInput,
  passwordInput,
  confirmPasswordInput,
].forEach((input) => {
  input.addEventListener("input", () => {
    errorMessage.classList.remove("show")
    if (input === passwordInput) updatePasswordStrength(input.value)
  })
})

// Password strength on input
passwordInput.addEventListener("input", () => updatePasswordStrength(passwordInput.value))