class UIController {
  constructor() {
    this.elements = {
      bar: document.querySelector(".fa-bars"),
      cross: document.querySelector("#hdcross"),
      headerbar: document.querySelector(".headerbar"),
      searchBtn: document.getElementById("searchButton"),
      title: document.querySelector(".title"),
      mealList: document.getElementById("meal"),
      mealDetailsContent: document.querySelector(".meal-details-content"),
      recipeCloseBtn: document.getElementById("recipe-close-btn"),
      container: document.querySelector(".container"),
      searchBar: document.getElementById("searchBar")
    };

    this.initializeEvents();
  }

  initializeEvents() {
    this.elements.bar.addEventListener("click", () => {
      setTimeout(() => {
        this.elements.cross.style.display = "block";
      });
      this.elements.headerbar.style.right = "0%";
    });

    this.elements.cross.addEventListener("click", () => {
      this.elements.cross.style.display = "none";
      this.elements.headerbar.style.right = "-100%";
    });

    this.elements.recipeCloseBtn.addEventListener("click", () => {
      this.removeReceipt();
    });
  }

  displayMeals(meals, isSearchResult = false) {
    let html = "";
    if (meals) {
      meals.forEach((meal) => {
        const mealData = isSearchResult ? {
          id: meal.idMeal,
          thumb: meal.strMealThumb,
          name: meal.strMeal,
          showRecipeBtn: true
        } : {
          id: meal.idCategory,
          thumb: meal.strCategoryThumb,
          name: meal.strCategory,
          showRecipeBtn: false
        };

        html += `
          <div class="meal-item" data-id="${mealData.id}">
            <div class="meal-img">
              <img src="${mealData.thumb}" alt="food" style="width:100%;" />
            </div>
            <div class="meal-name">
              <h3>${mealData.name}</h3>
              ${mealData.showRecipeBtn ? '<a href="#" class="recipe-btn">რეცეპტის ნახვა</a>' : ''}
            </div>
          </div>
        `;
      });
      this.elements.mealList.classList.remove("notFound");
    } else {
      this.elements.container.style.height = "100vh";
      html = "კერძი ვერ მოიძებნა";
      this.elements.mealList.classList.add("notFound");
    }
    this.elements.mealList.innerHTML = html;
  }

  displayRecipe(meal) {
    const html = `
      <p class="recipe-category">${meal.strCategory}</p>
      <h2 class="recipe-title">${meal.strMeal}</h2>
      <div class="recipe-meal-img">
        <img src="${meal.strMealThumb}" alt="" />
      </div>
      <div class="recipe-instruct">
        <h3>მომზადების ინსტრუქცია</h3>
        <p>${meal.strInstructions}</p>
      </div>
      <div class="recipe-link">
        <a href="${meal.strYoutube}" target="_blank">Watch Video </br><i class="fa-brands fa-youtube"></i></a>
      </div>
    `;
    this.elements.mealDetailsContent.innerHTML = html;
    this.elements.mealDetailsContent.parentElement.classList.add("showRecipe");
  }

  removeReceipt() {
    this.elements.mealDetailsContent.parentElement.classList.remove("showRecipe");
  }
}

class MealService {
  constructor() {
    this.baseUrl = "https://www.themealdb.com/api/json/v1/1";
  }

  async fetchCategories() {
    try {
      const response = await fetch(`${this.baseUrl}/categories.php`);
      const data = await response.json();
      return data.categories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return null;
    }
  }

  async searchByIngredient(ingredient) {
    try {
      const response = await fetch(`${this.baseUrl}/filter.php?i=${ingredient}`);
      const data = await response.json();
      return data.meals;
    } catch (error) {
      console.error("Error searching meals:", error);
      return null;
    }
  }

  async getMealById(id) {
    try {
      const response = await fetch(`${this.baseUrl}/lookup.php?i=${id}`);
      const data = await response.json();
      return data.meals[0];
    } catch (error) {
      console.error("Error fetching meal details:", error);
      return null;
    }
  }
}

class App {
  constructor() {
    this.ui = new UIController();
    this.mealService = new MealService();
    this.initializeApp();
  }

  async initializeApp() {
    const categories = await this.mealService.fetchCategories();
    this.ui.displayMeals(categories);

    this.ui.elements.searchBtn.addEventListener("click", () => this.handleSearch());

    this.ui.elements.mealList.addEventListener("click", (e) => this.handleRecipeView(e));
  }

  async handleSearch() {
    const searchInput = this.ui.elements.searchBar.value.trim();
    if (searchInput) {
      const meals = await this.mealService.searchByIngredient(searchInput);
      this.ui.displayMeals(meals, true);
    }
  }

  async handleRecipeView(e) {
    e.preventDefault();
    if (e.target.classList.contains("recipe-btn")) {
      const mealItem = e.target.parentElement.parentElement;
      const meal = await this.mealService.getMealById(mealItem.dataset.id);
      if (meal) {
        this.ui.displayRecipe(meal);
      }
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new App();
});