let sideBarWidth = $(".sideBar-inner").innerWidth();
let homePage = $("#homePage");
let search = $("#search");

let animationDuration;

$(document).ready(function () {
  searchName("");
  animationDuration = 0;
  autoToggleSideBar();
});

// ==========================================================

// ------------Side Bar functions ------------------------

// auto side bar toggler

function autoToggleSideBar() {
  $("#sideBar").animate({ left: -sideBarWidth }, animationDuration);
}

// toggle side bar on click

$("#sideBar .fa-bars").click(function () {
  if ($("#sideBar").css("left") == "0px") {
    $("#sideBar").animate({ left: -sideBarWidth }, 500);
  } else {
    $("#sideBar").animate({ left: 0 }, 500);
  }
});

// Trigger functions when side bar list item clicked

$("#sideBar ul li").click(function () {
  animationDuration = 500;
  autoToggleSideBar();
  search.html("");

  let liText = $(this).text();

  if (liText == "Home") {
    searchName("");
  } else if (liText == "Search") {
    displaySearchPage();
  } else if (liText == "Categories") {
    fetchCategories();
  } else if (liText == "Area") {
    fetchAreas();
  } else if (liText == "Ingredients") {
    fetchIngredients();
  } else if (liText == "Contact Us") {
    displayContacts();
  }
});

// ==========================================================

// -------------- APIs ------------------

// ---------- Search API -------------

// By meal name
async function searchName(name) {
  let apiResponse = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`
  );
  let apiData = await apiResponse.json();
  let meals = apiData.meals;
  if (meals) {
    displayDefault(meals);
  } else {
    displayDefault([]);
  }
}

// By meal first letter

async function searchLetter(letter) {
  if (letter != "") {
    let apiResponse = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`
    );
    let apiData = await apiResponse.json();
    let meals = apiData.meals;

    if (meals) {
      displayDefault(meals);
    } else {
      displayDefault([]);
    }
  }
}

// ---------- Lookup meal API --------------

async function lookupMeal(mealId) {
  let apiResponse = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
  );
  let apiData = await apiResponse.json();
  let meal = apiData.meals[0];
  displayLookUpMeal(meal);
}

// ----------Categories API--------------
async function fetchCategories() {
  let apiResponse = await fetch(
    `https://www.themealdb.com/api/json/v1/1/categories.php`
  );
  let apiData = await apiResponse.json();
  let categories = apiData.categories;
  displayCategoriesPage(categories);
}

async function fetchCategoryMeals(category) {
  let apiResponse = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
  );
  let apiData = await apiResponse.json();
  let meals = apiData.meals;
  displayDefault(meals);
}

// ---------Area API---------------

async function fetchAreas() {
  let apiResponse = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
  );
  let apiData = await apiResponse.json();
  let areas = apiData.meals;
  displayAreasPage(areas);
}

async function fetchAreaMeals(area) {
  let apiResponse = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
  );
  let apiData = await apiResponse.json();
  let meals = apiData.meals;
  displayDefault(meals);
}

// ---------Ingredients API---------------

async function fetchIngredients() {
  let apiResponse = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
  );
  let apiData = await apiResponse.json();
  let ingredients = apiData.meals;
  displayIngredientsPage(ingredients);
}

async function fetchIngredientMeals(ingredient) {
  let apiResponse = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`
  );
  let apiData = await apiResponse.json();
  let meals = apiData.meals;
  displayDefault(meals);
}

// ==========================================================

// ---------------- Display data functions -------------------

// ------ Display meals on website home page by default (search api) -----

function displayDefault(meals) {
  let homePageBox = "";

  for (const meal of meals) {
    homePageBox += `
        <div class="col-md-3">
                <div data-id="${meal.idMeal}" class="meal-card  position-relative overflow-hidden rounded-4">
                    <img class="w-100" src="${meal.strMealThumb}" alt="delicious meal">
                    <div class="meal-info position-absolute d-flex align-items-center justify-content-center text-black p-2 w-100 h-100 bg-white opacity-50">
                        <h3>${meal.strMeal}</h3>
                    </div>
                </div>
        </div>
        `;
  }
  homePage.html(homePageBox);
  $("div[data-id]").click(function () {
    let mealId = this.dataset.id;
    lookupMeal(mealId);
  });
}

// -------------- Display meal details when clicked (lookup api)---------------

function displayLookUpMeal(meal) {
  let mealIngredients = "";
  let mealDetails = "";

  for (let i = 0; i < 21; i++) {
    if (meal[`strIngredient${i}`]) {
      mealIngredients += `<li class="alert alert-info m-2">${
        meal[`strMeasure${i}`]
      } ${meal[`strIngredient${i}`]}</li>`;
    }
  }

  mealDetails += `
  <div class="col-md-4">
                <img class="w-100 rounded-4" src="${meal.strMealThumb}"
                    alt="">
                    <h2 class="text-center">${meal.strMeal}</h2>
            </div>
            <div class="col-md-8">
                <h2>Instructions</h2>
                <p class="lh-lg">${meal.strInstructions}</p>
                <h3>Area&#128073; ${meal.strArea}</h3>
                <h3>Category&#128073; ${meal.strCategory}</h3>
                <h3>Recipes&#128071;</h3>
                <ul class="list-unstyled d-flex flex-wrap">
                ${mealIngredients}
                </ul>
                <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
                <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
            </div>
  `;

  homePage.html(mealDetails);
}

// -------------- Display meal search page when search clicked ---------------

function displaySearchPage() {
  let searchPage = `
  <div class="row py-4 ">
  <div class="col-md-6 ">
      <input id="nameInput" class="form-control" type="text" placeholder="Search By Name">
  </div>
  <div class="col-md-6">
      <input  id="letterInput" class="form-control" type="text" placeholder="Search By First Letter">
  </div>
</div>
  `;
  search.html(searchPage);
  homePage.html("");

  $(document).ready(function () {
    $("#nameInput").keyup(function () {
      const inputText = $(this).val();
      homePage.html(searchName(inputText));
    });
  });

  $(document).ready(function () {
    // on letter input allowed
    $("#letterInput").on("input", function () {
      const inputText = $(this).val();
      const inputLength = inputText.length;

      if (inputLength > 1) {
        $(this).val(inputText.slice(0, 1));
      }
    });
  });

  $(document).ready(function () {
    $("#letterInput").keyup(function () {
      const inputText = $(this).val();
      homePage.html(searchLetter(inputText));
    });
  });
}

// -------------- Display meal Categories page when Categories clicked ---------------

function displayCategoriesPage(categories) {
  let categoryPage = "";

  for (const category of categories) {
    categoryPage += `
      <div class="col-md-3">
      <div data-category= "${category.strCategory}")" class="category-card position-relative overflow-hidden rounded-4 ">
          <img class="w-100" src="${category.strCategoryThumb}" alt="Meals Category">
          <div class="category-info position-absolute d-flex align-items-center justify-content-center text-black p-2 w-100 h-100 bg-white opacity-50">
              <h3>${category.strCategory}</h3>
          </div>
      </div>
  </div>
      `;
  }

  homePage.html(categoryPage);

  $("div[data-category]").click(function () {
    let mealCategory = this.dataset.category;
    fetchCategoryMeals(mealCategory);
  });
}

// -------------- Display meal Areas page when Areas clicked ---------------

function displayAreasPage(areas) {
  let areaPage = "";

  for (const area of areas) {
    areaPage += `
    <div class="col-md-3 mb-5">
                <div data-areas="${area.strArea}" class="area-card rounded-4 text-center ">
                <i class="fa-solid fa-earth-africa fs-1 mb-3"></i>
                <h3>${area.strArea}</h3>
                </div>
        </div>
    `;
  }

  homePage.html(areaPage);

  $("div[data-areas]").click(function () {
    let mealArea = this.dataset.areas;
    fetchAreaMeals(mealArea);
  });
}

// -------------- Display meal Ingredients page when Ingredients clicked ---------------

function displayIngredientsPage(ingredients) {
  let ingredientsPage = "";

  for (const ingredient of ingredients) {
    ingredientsPage += `
    <div class="col-md-3 mb-5">
    <div data-ingredient="${ingredient.strIngredient}"  class="ingredient-card rounded-4 text-center">
    <i class="fa-solid fa-bell-concierge fs-1 mb-3"></i>
            <h3>${ingredient.strIngredient}</h3>
            
    </div>
</div>
    `;
  }

  homePage.html(ingredientsPage);

  $("div[data-ingredient]").click(function () {
    let mealIngredient = this.dataset.ingredient;
    console.log(mealIngredient);
    fetchIngredientMeals(mealIngredient);
  });
}

// -------------- Display Contacts page when Contacts clicked ---------------

function displayContacts() {
  contactPage = `
  <h2 class="text-center">Contact Us</h2>

  <div class="d-flex justify-content-center align-items-center text-center">
    <div class="container w-75">
        <div class="row g-4">
            <div class="col-md-6">
                <input class="form-control" id="nameInput" type="text" placeholder="Enter Your Name">
                <p id="nameError" class="alert alert-danger mt-3 d-none">
                    Please type your real name (only 3 names and each name must start with uppercase letter).
                </p>
            </div>
            <div class="col-md-6">
                <input class="form-control" id="emailInput" type="email" placeholder="Enter Your Email">
                <p id="emailError" class="alert alert-danger mt-3 d-none">
                    Please type a valid email.
                </p>
            </div>
            <div class="col-md-6">
                <input class="form-control" id="phoneInput" type="text" placeholder="Enter Your Phone">
                <p id="phoneError" class="alert alert-danger mt-3 d-none">
                Please type a valid phone number (Country code must start with +).
                </p>
            </div>
            <div class="col-md-6">
                <input class="form-control" id="ageInput" type="number" placeholder="Enter Your Age">
                <p id="ageError" class="alert alert-danger mt-3 d-none">
                Please type a valid age (between 16 to 100).
                </p>
            </div>
            <div class="col-md-6">
                <input class="form-control"  id="passwordInput" type="password" placeholder="Enter Your Password">
                <p id="passwordError" class="alert alert-danger mt-3 d-none">
                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                </p>
            </div>
            <div class="col-md-6">
                <input  id="rePasswordInput"  type="password" class="form-control " placeholder="Retype your Password">
                <p id="rePasswordError" class="alert alert-danger mt-3 d-none">
                    Password doesn't match. Please check your password
                </p>
            </div>
        </div>
        <button id="btn" class="btn btn-outline-danger px-3 mt-5">Send</button>
    </div>
</div>
  `;

  homePage.html(contactPage);

  $("#nameInput").keyup(function () {
    if (validateName()) {
      $("#nameError").removeClass("d-block");
      $("#nameError").addClass("d-none");
    } else {
      $("#nameError").removeClass("d-none");
      $("#nameError").addClass("d-block");
    }
    updateButton();
  });

  $("#emailInput").keyup(function () {
    if (validateEmail()) {
      $("#emailError").removeClass("d-block");
      $("#emailError").addClass("d-none");
    } else {
      $("#emailError").removeClass("d-none");
      $("#emailError").addClass("d-block");
    }
    updateButton();
  });

  $("#phoneInput").keyup(function () {
    if (validatePhoneNumber()) {
      $("#phoneError").removeClass("d-block");
      $("#phoneError").addClass("d-none");
    } else {
      $("#phoneError").removeClass("d-none");
      $("#phoneError").addClass("d-block");
    }
    updateButton();
  });

  $("#ageInput").keyup(function () {
    if (validateAge()) {
      $("#ageError").removeClass("d-block");
      $("#ageError").addClass("d-none");
    } else {
      $("#ageError").removeClass("d-none");
      $("#ageError").addClass("d-block");
    }
    updateButton();
  });

  $("#passwordInput").keyup(function () {
    if (validatePassword()) {
      $("#passwordError").removeClass("d-block");
      $("#passwordError").addClass("d-none");
    } else {
      $("#passwordError").removeClass("d-none");
      $("#passwordError").addClass("d-block");
    }
    updateButton();
  });

  $("#rePasswordInput").keyup(function () {
    if (validateRePassword()) {
      $("#rePasswordError").removeClass("d-block");
      $("#rePasswordError").addClass("d-none");
    } else {
      $("#rePasswordError").removeClass("d-none");
      $("#rePasswordError").addClass("d-block");
    }
    updateButton();
  });
  updateButton();
}

function updateButton() {
  if (
    validateName() &&
    validateEmail() &&
    validatePhoneNumber() &&
    validateAge() &&
    validatePassword() &&
    validateRePassword()
  ) {
    $("#btn").prop("disabled", false);
  } else {
    $("#btn").prop("disabled", true);
  }
}

// ------------------Regex--------------------------

function validateName() {
  return /^[A-Z][a-z]{0,}\s[A-Z][a-z]{0,}(\s[A-Z][a-z]{0,})?$/.test(
    $("#nameInput").val()
  );
}

function validateEmail() {
  return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
    $("#emailInput").val()
  );
}

function validatePhoneNumber() {
  return /^\+(?:[0-9]●?){6,14}[0-9]$/.test($("#phoneInput").val());
}

function validateAge() {
  return /^(1[6-9]|[2-9][0-9]|100)$/.test($("#ageInput").val());
}

function validatePassword() {
  return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+={}|[\]\\;:'"`,./<>?]).{8,16}$/.test(
    $("#passwordInput").val()
  );
}

function validateRePassword() {
  return $("#passwordInput").val() == $("#rePasswordInput").val();
}
