// Check if user is logged in
const currentUser = localStorage.getItem("currentUser")
const firstName = localStorage.getItem("firstName")
if (!currentUser || !firstName) {
  window.location.href = "index.html"
}

// Display user name in navbar
document.getElementById("userName").textContent = `Welcome, ${firstName}`

// Logout functionality
document.getElementById("logoutButton").addEventListener("click", () => {
  localStorage.removeItem("firstName")
  localStorage.removeItem("currentUser")
  window.location.href = "index.html"
})

// Global variables
let allRecipes = []
let filteredRecipes = []
let displayedRecipes = []
let currentIndex = 0
const recipesPerPage = 9

// DOM elements
const recipesGrid = document.getElementById("recipesGrid")
const searchInput = document.getElementById("searchInput")
const cuisineFilter = document.getElementById("cuisineFilter")
const showMoreButton = document.getElementById("showMoreButton")
const showMoreContainer = document.getElementById("showMoreContainer")
const loadingState = document.getElementById("loadingState")
const errorState = document.getElementById("errorState")
const retryButton = document.getElementById("retryButton")
const recipeModal = document.getElementById("recipeModal")
const modalClose = document.querySelector(".modal-close")

// Function to fetch recipes
async function fetchRecipes() {
  try {
    loadingState.classList.remove("hidden")
    errorState.classList.add("hidden")
    recipesGrid.innerHTML = ""

    const response = await fetch("https://dummyjson.com/recipes")

    if (!response.ok) {
      throw new Error("Failed to fetch recipes")
    }

    const data = await response.json()
    allRecipes = data.recipes
    filteredRecipes = [...allRecipes]

    // Populate cuisine filter
    populateCuisineFilter()

    // Display initial recipes
    displayRecipes()

    loadingState.classList.add("hidden")
  } catch (error) {
    console.error("Error fetching recipes:", error)
    loadingState.classList.add("hidden")
    errorState.classList.remove("hidden")
  }
}

// Function to populate cuisine filter dropdown
function populateCuisineFilter() {
  const cuisines = [...new Set(allRecipes.map((recipe) => recipe.cuisine))].sort()

  cuisines.forEach((cuisine) => {
    const option = document.createElement("option")
    option.value = cuisine
    option.textContent = cuisine
    cuisineFilter.appendChild(option)
  })
}

// Function to create star rating
function createStarRating(rating) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  let stars = ""

  for (let i = 0; i < fullStars; i++) {
    stars += "★"
  }

  if (hasHalfStar) {
    stars += "☆"
  }

  const emptyStars = 5 - Math.ceil(rating)
  for (let i = 0; i < emptyStars; i++) {
    stars += "☆"
  }

  return stars
}

// Function to create recipe card
function createRecipeCard(recipe) {
  const card = document.createElement("div")
  card.className = "recipe-card"

  const ingredientsList = recipe.ingredients.slice(0, 5).join(", ") + (recipe.ingredients.length > 5 ? "..." : "")

  card.innerHTML = `
        <img src="${recipe.image}" alt="${recipe.name}" class="recipe-image">
        <div class="recipe-content">
            <div class="recipe-header">
                <h3 class="recipe-name">${recipe.name}</h3>
            </div>
            <div class="recipe-meta">
                <span class="meta-item">⏱️ ${recipe.prepTimeMinutes + recipe.cookTimeMinutes} mins</span>
                <span class="meta-item">👨‍🍳 ${recipe.difficulty}</span>
            </div>
            <span class="recipe-cuisine">${recipe.cuisine}</span>
            <div class="recipe-rating">
                <span class="stars">${createStarRating(recipe.rating)}</span>
                <span class="rating-value">${recipe.rating.toFixed(1)}</span>
            </div>
            <div class="recipe-ingredients">
                <h4>Ingredients:</h4>
                <p class="ingredients-list">${ingredientsList}</p>
            </div>
            <button class="btn-view-recipe" data-recipe-id="${recipe.id}">View Full Recipe</button>
        </div>
    `

  // Add click event for "View Full Recipe" button
  const viewButton = card.querySelector(".btn-view-recipe")
  viewButton.addEventListener("click", (e) => {
    e.stopPropagation()
    showRecipeModal(recipe)
  })

  return card
}

// Function to display recipes
function displayRecipes() {
  const recipesToShow = filteredRecipes.slice(0, currentIndex + recipesPerPage)
  displayedRecipes = recipesToShow

  recipesGrid.innerHTML = ""

  if (recipesToShow.length === 0) {
    recipesGrid.innerHTML =
      '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-secondary);">No recipes found matching your criteria.</p>'
    showMoreContainer.classList.add("hidden")
    return
  }

  recipesToShow.forEach((recipe) => {
    const card = createRecipeCard(recipe)
    recipesGrid.appendChild(card)
  })

  currentIndex = recipesToShow.length

  // Show or hide "Show More" button
  if (currentIndex < filteredRecipes.length) {
    showMoreContainer.classList.remove("hidden")
  } else {
    showMoreContainer.classList.add("hidden")
  }
}

// Function to show recipe modal (fixed rendering)
function showRecipeModal(recipe) {
  const modalContent = document.querySelector(".modal-content")

  // Clear previous content except the close button
  while (modalContent.children.length > 1) {
    modalContent.removeChild(modalContent.lastChild)
  }

  // Create and append new modal body
  const modalBody = document.createElement("div")
  modalBody.innerHTML = `
        <img src="${recipe.image}" alt="${recipe.name}" class="modal-recipe-image">
        <h2 class="modal-recipe-name">${recipe.name}</h2>
        <div class="modal-recipe-meta">
            <div class="meta-item">
                <strong>Prep Time:</strong> ${recipe.prepTimeMinutes} mins
            </div>
            <div class="meta-item">
                <strong>Cook Time:</strong> ${recipe.cookTimeMinutes} mins
            </div>
            <div class="meta-item">
                <strong>Servings:</strong> ${recipe.servings}
            </div>
            <div class="meta-item">
                <strong>Difficulty:</strong> ${recipe.difficulty}
            </div>
            <div class="meta-item">
                <strong>Cuisine:</strong> ${recipe.cuisine}
            </div>
            <div class="meta-item">
                <strong>Calories per Serving:</strong> ${recipe.caloriesPerServing}
            </div>
        </div>
        <div class="recipe-rating">
            <span class="stars">${createStarRating(recipe.rating)}</span>
            <span class="rating-value">${recipe.rating.toFixed(1)} (${recipe.reviewCount} reviews)</span>
        </div>
        <div class="modal-section">
            <h3>Ingredients</h3>
            <ul>
                ${recipe.ingredients.map((ingredient) => `<li>${ingredient}</li>`).join("")}
            </ul>
        </div>
        <div class="modal-section">
            <h3>Instructions</h3>
            <ul>
                ${recipe.instructions.map((instruction) => `<li>${instruction}</li>`).join("")}
            </ul>
        </div>
        <div class="modal-section">
            <h3>Tags</h3>
            <div class="modal-tags">
                ${recipe.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
            </div>
        </div>
    `

  modalContent.appendChild(modalBody)
  recipeModal.classList.remove("hidden")
}

// Close modal
modalClose.addEventListener("click", () => {
  recipeModal.classList.add("hidden")
})

recipeModal.addEventListener("click", (e) => {
  if (e.target === recipeModal) {
    recipeModal.classList.add("hidden")
  }
})

// Debounce function for search
function debounce(func, delay) {
  let timeoutId
  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(this, args), delay)
  }
}

// Search functionality
function performSearch(searchTerm) {
  const term = searchTerm.toLowerCase().trim()
  const selectedCuisine = cuisineFilter.value

  filteredRecipes = allRecipes.filter((recipe) => {
    const matchesSearch =
      !term ||
      recipe.name.toLowerCase().includes(term) ||
      recipe.cuisine.toLowerCase().includes(term) ||
      recipe.ingredients.some((ing) => ing.toLowerCase().includes(term)) ||
      recipe.tags.some((tag) => tag.toLowerCase().includes(term))

    const matchesCuisine = !selectedCuisine || recipe.cuisine === selectedCuisine

    return matchesSearch && matchesCuisine
  })

  currentIndex = 0
  displayRecipes()
}

// Debounced search
const debouncedSearch = debounce(performSearch, 300)

searchInput.addEventListener("input", (e) => {
  debouncedSearch(e.target.value)
})

// Cuisine filter
cuisineFilter.addEventListener("change", () => {
  performSearch(searchInput.value)
})

// Show more button
showMoreButton.addEventListener("click", () => {
  displayRecipes()
})

// Retry button
retryButton.addEventListener("click", () => {
  fetchRecipes()
})

// Initialize app
fetchRecipes()