const fs = require('fs');
const currentMealsData = require('./mocks/meals.json');
const currentMeals = currentMealsData.meals;


const waitMs = (ms) => new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, ms);
});

const getDetails = async (meals) => {
  const mealsWithDetails = [];
  for (let index = 0; index < meals.length; index += 1) {
    const meal = meals[index];
    if (currentMeals.find((currentMeal) => currentMeal.idMeal === meal.idMeal)) {
      console.log(`Skipping ${meal.strMeal}...`);
      continue;
    }
    await waitMs(200);
    console.log(`Fetching Details ${meal.strMeal}...`);
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`);
      const data = await response.json();
      if (data.meals.length === 0) {
        continue;
      }
      mealsWithDetails.push(data.meals[0]);
    } catch (error) {
      console.log(`Error fetching ${meal.strMeal}`);
      continue;
    }
  }
  return mealsWithDetails;
}

const getByIngredientes = async (ingredient) => {
  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
    const data = await response.json();
    const meals = data.meals;
    const mealsWithDetails = await getDetails(meals.slice(0, 10));
    if (mealsWithDetails.length == 0) {
      return [];
    }
    return mealsWithDetails;
  } catch (error) {
    console.log(error);
    return [];
  }
}

const getIngredients = async () => {
  try {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list');
    const data = await response.json();
    if (!data.meals) {
      return [];
    }
    return data.meals;
  } catch (error) {
    console.log('Error fetching ingredients');
    return [];
  }
}

const removeRepeated = (meals) => {
  const ids = [];
  const filteredMeals = [];
  for (let index = 0; index < meals.length; index += 1) {
    const meal = meals[index];
    if (!ids.includes(meal.idMeal)) {
      ids.push(meal.idMeal);
      filteredMeals.push(meal);
    }
  }
  return filteredMeals;
}

const findByIngredient = (meals, ingredient) => {
  return meals.filter(meal => {
    const ingredients = [];
    for (let index = 1; index <= 15; index += 1) {
      if (meal[`strIngredient${index}`]) {
        ingredients.push(String(meal[`strIngredient${index}`]).toUpperCase());
      }
    }
    return ingredients.includes(String(ingredient).toUpperCase());
  });
}

const getByCategories = async (category) => {
  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
    const data = await response.json();
    const meals = data.meals;
    const mealsWithDetails = await getDetails(meals.slice(0, 10));
    if (mealsWithDetails.length == 0) {
      return [];
    }
    return mealsWithDetails;
  } catch (error) {
    console.log(error);
    return [];
  }
}

const getCategories = async () => {
  try {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list');
    const data = await response.json();
    if (!data.meals) {
      return [];
    }
    return data.meals;
  } catch (error) {
    console.log('Error fetching ingredients');
    return [];
  }
}


const executeCategories = async () => {
  const categories = await getCategories();

  const meals = [];
  for (let index = 0; index < categories.length; index += 1) {
    const category = categories[index];
    await waitMs(200);
    console.log(`Fetching Category ${category.strCategory}`);
    const mealsFromRequest = await getByCategories(category.strCategory);
    console.log(`Fetched ${mealsFromRequest.length} meals from ${category.strCategory}`);
    meals.push(...mealsFromRequest);
    console.log(`Total meals: ${meals.length}`);
  }

  console.log(`Current meals: ${currentMeals.length}`);
  console.log(`New meals: ${meals.length}`);
  const allMeals = removeRepeated([...currentMeals, ...meals]);
  console.log(`Total meals: ${allMeals.length}`);
  const allMealsDAta = { meals: allMeals };
  fs.writeFileSync('./mocks/meals.json', JSON.stringify(allMealsDAta));
};

const executeIngredients = async () => {
  const ingredients = (await getIngredients()).slice(0, 100);

  const meals = [];
  for (let index = 0; index < ingredients.length; index += 1) {
    const ingredient = ingredients[index];
    await waitMs(200);
    console.log(`Fetching Ingredient ${ingredient.strIngredient}`);
    const mealsFromRequest = await getByIngredientes(ingredient.strIngredient);
    console.log(`Fetched ${mealsFromRequest.length} meals from ${ingredient.strIngredient}`);
    meals.push(...mealsFromRequest);
    console.log(`Total meals: ${meals.length}`);
  }


  console.log(`Current meals: ${currentMeals.length}`);
  console.log(`New meals: ${meals.length}`);
  const allMeals = removeRepeated([...currentMeals, ...meals]);
  console.log(`Total meals: ${allMeals.length}`);
  const allMealsData = { meals: allMeals };
  fs.writeFileSync('./mocks/meals.json', JSON.stringify(allMealsData));
};

executeIngredients();
