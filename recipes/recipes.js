const currentUser = localStorage.getItem("currentUser");
const firstName = localStorage.getItem("firstName");
if (!currentUser || !firstName) {
    window.location.href = "../login/login.html";
}

document.getElementById("userName").innerHTML = `Welcome, <span style="font-weight: 1000;">${firstName}</span>`;

document.getElementById("logoutButton").addEventListener("click", () => {
    localStorage.removeItem("firstName");
    localStorage.removeItem("currentUser");
    window.location.href = "../home/home.html";
});

document.addEventListener('DOMContentLoaded', () => {
    const themeToggleButton = document.getElementById('themeToggleButton');
    const body = document.body;

    const savedTheme = localStorage.getItem('theme') || 'dark';
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggleButton.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        const icon = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        const color = theme === 'dark' ? 'white' : 'black';
        themeToggleButton.innerHTML = `<i class="${icon}" style="color: ${color};"></i>`;
    }
});

let allRecipes = [];
let filteredRecipes = [];
let displayedRecipes = [];
let currentIndex = 0;
const recipesPerPage = 9;

const recipesGrid = document.getElementById("recipesGrid");
const searchInput = document.getElementById("searchInput");
const cuisineFilter = document.getElementById("cuisineFilter");
const showMoreButton = document.getElementById("showMoreButton");
const showMoreContainer = document.getElementById("showMoreContainer");
const loadingState = document.getElementById("loadingState");
const errorState = document.getElementById("errorState");
const retryButton = document.getElementById("retryButton");
const recipeModal = document.getElementById("recipeModal");
const modalClose = document.querySelector(".modal-close");

async function fetchRecipes() {
    try {
        loadingState.classList.remove("hidden");
        errorState.classList.add("hidden");
        recipesGrid.innerHTML = "";

        const response = await fetch("https://dummyjson.com/recipes");

        if (!response.ok) {
            throw new Error("Failed to fetch recipes");
        }

        const data = await response.json();
        allRecipes = data.recipes;
        filteredRecipes = [...allRecipes];

        populateCuisineFilter();

        displayRecipes();

        loadingState.classList.add("hidden");
    } catch (error) {
        console.error("Error fetching recipes:", error);
        loadingState.classList.add("hidden");
        errorState.classList.remove("hidden");
    }
}


let pageheader = document.getElementById('page-header')
let leaf = document.getElementById('leaf')
let hill1 = document.getElementById('hill1')
let hill4 = document.getElementById('hill4')
let hill5 = document.getElementById('hill5')
let food1 = document.querySelector('.food-1');
let food2 = document.querySelector('.food-2');
let food3 = document.querySelector('.food-3');
let food4 = document.querySelector('.food-4');
let food5 = document.querySelector('.food-5');

window.addEventListener('scroll', () => {
    let scrollY = window.scrollY;

    pageheader.style.marginTop = scrollY * 2.5 + 'px';
    leaf.style.top = scrollY * -1.5 + 'px';
    leaf.style.left = scrollY * 1.5 + 'px';
    hill5.style.left = scrollY * 1.5 + 'px';
    hill4.style.left = scrollY * -1.5 + 'px';
    hill1.style.top = scrollY * 1 + 'px';

    food1.style.transform = `translate(-50%, calc(-50% + ${scrollY * 0.2}px))`;
    food2.style.transform = `translate(50%, calc(-50% + ${scrollY * 0.25}px))`;
    food3.style.transform = `translate(-50%, calc(-50% + ${scrollY * 0.3}px))`;
    food4.style.transform = `translate(50%, calc(-50% + ${scrollY * 0.35}px))`;
    food5.style.transform = `translate(-50%, calc(-50% + ${scrollY * 0.3}px))`;
});

const selectContainer = document.querySelector('.select-container');
const cuisineSelect = document.getElementById('cuisineFilter');

cuisineSelect.addEventListener('mousedown', () => {
    selectContainer.classList.toggle('open');
});

cuisineSelect.addEventListener('change', () => {
    selectContainer.classList.remove('open');
});

document.addEventListener('click', (e) => {
    if (!selectContainer.contains(e.target)) {
        selectContainer.classList.remove('open');
    }
});



function populateCuisineFilter() {
    cuisineFilter.innerHTML = '';
    
    const allOption = document.createElement("option");
    allOption.value = "";
    allOption.textContent = "All Cuisines";
    cuisineFilter.appendChild(allOption);

    const cuisines = [...new Set(allRecipes.map((recipe) => recipe.cuisine))].sort();

    cuisines.forEach((cuisine) => {
        const option = document.createElement("option");
        option.value = cuisine;
        option.textContent = cuisine;
        cuisineFilter.appendChild(option);
    });
}

function createStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = "";

    for (let i = 0; i < fullStars; i++) {
        stars += "★";
    }

    if (hasHalfStar) {
        stars += "☆";
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += "☆";
    }

    return stars;
}

function createRecipeCard(recipe) {
    const card = document.createElement("div");
    card.className = "recipe-card";

    const ingredientsList =
        recipe.ingredients.slice(0, 5).join(", ") +
        (recipe.ingredients.length > 5 ? "..." : "");

    const difficultyClass = recipe.difficulty.toLowerCase() === "easy" ? "easy" : 
                          recipe.difficulty.toLowerCase() === "medium" ? "medium" : "";

    card.innerHTML = `
        <img src="${recipe.image}" alt="${recipe.name}" class="recipe-image">
        <div class="recipe-content">
            <div class="recipe-header">
                <h3 class="recipe-name">${recipe.name}</h3>
            </div>
            <div class="recipe-meta">
            <span class="meta-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                    viewBox="0 0 24 24" style="vertical-align: middle; margin-right: 6px;">
                <path d="M12 1a11 11 0 1 0 11 11A11 11 0 0 0 12 1Zm0 20a9 9 0 1 1 9-9a9 9 0 0 1-9 9Zm.5-9.79V7a.5.5 0 0 0-1 0v4.5a.5.5 0 0 0 .15.35l3.5 3.5a.5.5 0 0 0 .7-.7Z"/>
                </svg>
                ${recipe.prepTimeMinutes + recipe.cookTimeMinutes} mins
            </span>

            <span class="meta-item difficulty ${difficultyClass}">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                    viewBox="0 0 24 24" style="vertical-align: middle; margin-right: 6px;">
                <path d="M19 10a3.5 3.5 0 0 0-1.93-6.44a3.5 3.5 0 0 0-6.3 0A3.5 3.5 0 0 0 5 10v1a1 1 0 0 0 1 1h1v5a3 3 0 0 0 3 3h4a3 3 0 0 0 3-3v-5h1a1 1 0 0 0 1-1Zm-4 7a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-5h6Z"/>
                </svg>
                ${recipe.difficulty}
            </span>
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
    `;

    const viewButton = card.querySelector(".btn-view-recipe");
    viewButton.addEventListener("click", (e) => {
        e.stopPropagation();
        showRecipeModal(recipe);
    });

    return card;
}

function displayRecipes() {
    const recipesToShow = filteredRecipes.slice(0, currentIndex + recipesPerPage);
    displayedRecipes = recipesToShow;

    recipesGrid.innerHTML = "";

    if (recipesToShow.length === 0) {
        recipesGrid.innerHTML =
            '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-secondary);">No recipes found matching your criteria.</p>';
        showMoreContainer.classList.add("hidden");
        return;
    }

    recipesToShow.forEach((recipe) => {
        const card = createRecipeCard(recipe);
        recipesGrid.appendChild(card);
    });

    currentIndex = recipesToShow.length;

    if (currentIndex < filteredRecipes.length) {
        showMoreContainer.classList.remove("hidden");
    } else {
        showMoreContainer.classList.add("hidden");
    }
}

function showRecipeModal(recipe) {
    const modalContent = document.querySelector(".modal-content");

    while (modalContent.children.length > 1) {
        modalContent.removeChild(modalContent.lastChild);
    }

    const difficultyClass = recipe.difficulty.toLowerCase() === "easy" ? "easy" : 
                          recipe.difficulty.toLowerCase() === "medium" ? "medium" : "";

    const modalBody = document.createElement("div");
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
            <div class="meta-item difficulty ${difficultyClass}">
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
    `;

    modalContent.appendChild(modalBody);
    recipeModal.classList.remove("hidden");
}

modalClose.addEventListener("click", () => {
    recipeModal.classList.add("hidden");
});

recipeModal.addEventListener("click", (e) => {
    if (e.target === recipeModal) {
        recipeModal.classList.add("hidden");
    }
});

function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

function performSearch(searchTerm) {
    const term = searchTerm.toLowerCase().trim();
    const selectedCuisine = cuisineFilter.value;

    filteredRecipes = allRecipes.filter((recipe) => {
        const matchesSearch =
            !term ||
            recipe.name.toLowerCase().includes(term) ||
            recipe.cuisine.toLowerCase().includes(term) ||
            recipe.ingredients.some((ing) => ing.toLowerCase().includes(term)) ||
            recipe.tags.some((tag) => tag.toLowerCase().includes(term));

        const matchesCuisine = !selectedCuisine || recipe.cuisine === selectedCuisine;

        return matchesSearch && matchesCuisine;
    });

    currentIndex = 0;
    displayRecipes();
}

const debouncedSearch = debounce(performSearch, 300);

searchInput.addEventListener("input", (e) => {
    debouncedSearch(e.target.value);
});

cuisineFilter.addEventListener("change", () => {
    performSearch(searchInput.value);
});

showMoreButton.addEventListener("click", () => {
    displayRecipes();
});

retryButton.addEventListener("click", () => {
    fetchRecipes();
});

fetchRecipes();