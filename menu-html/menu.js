const bar = document.querySelector(".fa-bars");
const cross = document.querySelector("#hdcross");
const headerbar = document.querySelector(".headerbar");

bar.addEventListener("click", () => {
  setTimeout(() => {
    cross.style.display = "block";
  });
  headerbar.style.right = "0%";
});

cross.addEventListener("click", () => {
  cross.style.display = "none";
  headerbar.style.right = "-100%";
});

// meals

const searchBtn = document.getElementById("searchButton");
const title = document.querySelector(".title");
const mealList = document.getElementById("meal");
const mealDetailsContent = document.querySelector(".meal-details-content");
const recipeCloseBtn = document.getElementById("recipe-close-btn");
const container = document.querySelector(".container");

// event

searchBtn.addEventListener("click", getMealList);
mealList.addEventListener("click", getMealRecipe);
recipeCloseBtn.addEventListener("click", removeReceipt);

// meal items

async function mealitems() {
  try {
    const response = await fetch(
      "https://themealdb.com/api/json/v1/1/categories.php"
    );
    const data = await response.json();

    let html = "";
    if (data.categories) {
      data.categories.forEach((meal) => {
        html += `
        <div class="meal-item" data-id="${meal.idCategory}">
          <div class="meal-img">
            <img src="${meal.strCategoryThumb}" alt="food" style="width:100%;" />
          </div>
          <div class="meal-name">
            <h3>${meal.strCategory}</h3>
          </div>
        </div>
        `;
      });
    }
    mealList.innerHTML = html;
  } catch (error) {
    console.error("Error fetching meal items:", error);
  }
}

mealitems();

// get meal list with the ingredients

async function getMealList() {
  try {
    let searchInput = document.getElementById("searchBar").value.trim();
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInput}`
    );
    const data = await response.json();

    let html = "";
    if (data.meals) {
      data.meals.forEach((meal) => {
        html += `
          <div class="meal-item" data-id= "${meal.idMeal}">
            <div class="meal-img">
              <img src="${meal.strMealThumb}" alt="food" />
            </div>
            <div class="meal-name">
              <h3>${meal.strMeal}</h3>
              <a href="#" class="recipe-btn">რეცეპტის ნახვა</a>
            </div>
          </div>
        `;
      });
      mealList.classList.remove("notFound");
    } else {
      container.style.height = "100vh";
      html = "კერძი ვერ მოიძებნა";
      mealList.classList.add("notFound");
    }
    mealList.innerHTML = html;
  } catch (error) {
    console.error("Error fetching meal list:", error);
  }
}

// get recipe of the meal

async function getMealRecipe(e) {
  e.preventDefault();
  if (e.target.classList.contains("recipe-btn")) {
    let mealItem = e.target.parentElement.parentElement;
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`
      );
      const data = await response.json();
      mealRecipeModal(data.meals);
    } catch (error) {
      console.error("Error fetching meal recipe:", error);
    }
  }
}

// create a modal

function mealRecipeModal(meal) {
  meal = meal[0];
  let html = `
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
  mealDetailsContent.innerHTML = html;
  mealDetailsContent.parentElement.classList.add("showRecipe");
}

// remove receipt

function removeReceipt() {
  mealDetailsContent.parentElement.classList.remove("showRecipe");
}
