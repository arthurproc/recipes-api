const fs = require('fs');
const currentDrinksData = require('./mocks/drinks.json');
const currentDrinks = currentDrinksData.drinks;


const waitMs = (ms) => new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, ms);
});

const getDetails = async (drinks) => {
  const drinksWithDetails = [];
  for (let index = 0; index < drinks.length; index += 1) {
    const drink = drinks[index];
    if (currentDrinks.find((currentDrink) => currentDrink.idDrink === drink.idDrink)) {
      console.log(`Skipping ${drink.strDrink}...`);
      continue;
    }
    await waitMs(200);
    console.log(`Fetching Details ${drink.strDrink}...`);
    try {
      const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drink.idDrink}`);
      const data = await response.json();
      if (data.drinks.length === 0) {
        continue;
      }
      drinksWithDetails.push(data.drinks[0]);
    } catch (error) {
      console.log(`Error fetching ${drink.strDrink}`);
      continue;
    }
  }
  return drinksWithDetails;
}

const getByIngredientes = async (ingredient) => {
  try {
    const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ingredient}`);
    const data = await response.json();
    const drinks = data.drinks;
    const drinksWithDetails = await getDetails(drinks.slice(0, 10));
    if (drinksWithDetails.length == 0) {
      return [];
    }
    return drinksWithDetails;
  } catch (error) {
    console.log(error);
    return [];
  }
}

const getIngredients = async () => {
  try {
    const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list');
    const data = await response.json();
    if (!data.drinks) {
      return [];
    }
    return data.drinks;
  } catch (error) {
    console.log('Error fetching ingredients');
    return [];
  }
}

const removeRepeated = (drinks) => {
  const ids = [];
  const filteredDrinks = [];
  for (let index = 0; index < drinks.length; index += 1) {
    const drink = drinks[index];
    if (!ids.includes(drink.idDrink)) {
      ids.push(drink.idDrink);
      filteredDrinks.push(drink);
    }
  }
  return filteredDrinks;
}

const findByIngredient = (drinks, ingredient) => {
  return drinks.filter(drink => {
    const ingredients = [];
    for (let index = 1; index <= 15; index += 1) {
      if (drink[`strIngredient${index}`]) {
        ingredients.push(String(drink[`strIngredient${index}`]).toUpperCase());
      }
    }
    return ingredients.includes(String(ingredient).toUpperCase());
  });
}

const getByCategories = async (category) => {
  try {
    const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${category}`);
    const data = await response.json();
    const drinks = data.drinks;
    const drinksWithDetails = await getDetails(drinks.slice(0, 10));
    if (drinksWithDetails.length == 0) {
      return [];
    }
    return drinksWithDetails;
  } catch (error) {
    console.log(error);
    return [];
  }
}

const getCategories = async () => {
  try {
    const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list');
    const data = await response.json();
    if (!data.drinks) {
      return [];
    }
    return data.drinks;
  } catch (error) {
    console.log('Error fetching ingredients');
    return [];
  }
}


const executeCategories = async () => {
  const categories = await getCategories();

  const drinks = [];
  for (let index = 0; index < categories.length; index += 1) {
    const category = categories[index];
    await waitMs(200);
    console.log(`Fetching Category ${category.strCategory}`);
    const drinksFromRequest = await getByCategories(category.strCategory);
    console.log(`Fetched ${drinksFromRequest.length} drinks from ${category.strCategory}`);
    drinks.push(...drinksFromRequest);
    console.log(`Total drinks: ${drinks.length}`);
  }


  
  // console.log('Fetched: ', drinks.find(drink => drink.idDrink === '15300'));
  // console.log('On JSON: ', currentDrinks.find(drink => drink.idDrink === '15300'));
  console.log(`Current drinks: ${currentDrinks.length}`);
  console.log(`New drinks: ${drinks.length}`);
  const allDrinks = removeRepeated([...currentDrinks, ...drinks]);
  console.log(`Total drinks: ${allDrinks.length}`);
  const allDrinksData = { drinks: allDrinks };
  fs.writeFileSync('./mocks/drinks.json', JSON.stringify(allDrinksData));
};

executeCategories();


const executeIngredients = async () => {
  const ingredients = await getIngredients();

  const drinks = [];
  for (let index = 0; index < ingredients.length; index += 1) {
    const ingredient = ingredients[index];
    await waitMs(200);
    console.log(`Fetching Ingredient ${ingredient.strIngredient1}`);
    const drinksFromRequest = await getByIngredientes(ingredient.strIngredient1);
    console.log(`Fetched ${drinksFromRequest.length} drinks from ${ingredient.strIngredient1}`);
    drinks.push(...drinksFromRequest);
    console.log(`Total drinks: ${drinks.length}`);
  }


  
  // console.log('Fetched: ', drinks.find(drink => drink.idDrink === '15300'));
  // console.log('On JSON: ', currentDrinks.find(drink => drink.idDrink === '15300'));
  console.log(`Current drinks: ${currentDrinks.length}`);
  console.log(`New drinks: ${drinks.length}`);
  const allDrinks = removeRepeated([...currentDrinks, ...drinks]);
  console.log(`Total drinks: ${allDrinks.length}`);
  const allDrinksData = { drinks: allDrinks };
  fs.writeFileSync('./mocks/drinks.json', JSON.stringify(allDrinksData));
};

// executeIngredients();

