const inputText = document.getElementById("search-input");
const inputBtn = document.getElementById("search-btn");
const resultsContainer = document.querySelector(".results-container");
const mealDetailsConent = document.getElementById("meal-details");
const noMealContainer = document.getElementById("no-meals");
let availableMealsCount = 0;

inputBtn.addEventListener("click", () => {
  render(inputText.value);
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    render(inputText.value);
  }
});

async function fetchData(foodKeyword) {
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${foodKeyword}`,
    );

    if (!response.ok) {
      throw new Error(`can't fetch, HTTP Status: ${response.status}`);
    }

    const data = await response.json();
    // console.log(data);
    return data;
  } catch (error) {
    console.log("Fetch error: ", error);
    return "";
  }
}

async function render(foodKeyword) {
  const data = await fetchData(foodKeyword);
  resultsContainer.innerHTML = "";
  if (data.meals) {
    const meals = data.meals;
    meals.map((meal) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
            <img src=${meal.strMealThumb} alt=${meal.strMeal} />
            <h2 class="card-name">${meal.strMeal}</h2>
            <p class="card-breif">
              ${meal.strArea} | ${meal.strCategory}
            </p>
        `;
      resultsContainer.appendChild(card);
      card.addEventListener("click", (event) => {
        goToMealMainSection(meal);
      });
    });
    availableMealsCount = meals.length;
  } else {
    availableMealsCount = 0;
    mealDetailsConent.classList.remove("show");
  }
  console.log(availableMealsCount);
  checkEmpty();
}

function goToMealMainSection(meal) {
  let ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`,
      );
    } else {
      break;
    }
  }

  const html = `
        <div class="meal-details-content">
            <h2 class="recipe-title">${meal.strMeal}</h2>
            <p class="recipe-category">${meal.strCategory}</p>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <div class="recipe-instruct">
                <h3>Instructions</h3>
                <p>${meal.strInstructions}</p>
            </div>
            <div class="ingredients-list">
                <h3>Ingredients</h3>
                <ul>
                    ${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
                </ul>
            </div>
        </div>
    `;
  // 3. Inject and Show
  mealDetailsConent.innerHTML = html;
  mealDetailsConent.classList.add("show");
  // 4. Scroll to section
  mealDetailsConent.scrollIntoView({ behavior: "smooth" });
}

function checkEmpty() {
  if (availableMealsCount === 0) {
    noMealContainer.classList.add("show");
  } else {
    noMealContainer.classList.remove("show");
  }
}

window.addEventListener("load", checkEmpty);