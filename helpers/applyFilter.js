const meals = require('../mocks/meals');
const drinks = require('../mocks/drinks');

const mealsQueryParameterToField = {
  c: 'strCategory',
  a: 'strArea',
  i: 'strIngredient',
};

const drinksQueryParameterToField = {
  c: 'strCategory',
  i: 'strIngredient',
};


const applyFilter = (queryParameter, queryValue, dataType = 'meals') => {
  if (dataType === 'meals') {
    const field = mealsQueryParameterToField[queryParameter];
    if (field === 'strIngredient') {
      return meals.meals.filter(meal => {
        const ingredients = [];
        for (let index = 1; index <= 15; index += 1) {
          if (meal[`strIngredient${index}`]) {
            ingredients.push(String(meal[`strIngredient${index}`]).toUpperCase());
          }
        }
        return ingredients.includes(String(queryValue).toUpperCase());
      });
    }
    return meals.meals.filter(meal => meal[field] === queryValue);
  } else if (dataType === 'drinks') {
    const field = drinksQueryParameterToField[queryParameter];
    if (field === 'strIngredient') {
      return drinks.drinks.filter(drink => {
        const ingredients = [];
        for (let index = 1; index <= 15; index += 1) {
          if (drink[`strIngredient${index}`]) {
            ingredients.push(String(drink[`strIngredient${index}`]).toUpperCase());
          }
        }
        return ingredients.includes(String(queryValue).toUpperCase());
      });
    }
    return drinks.drinks.filter(drink => drink[field] === queryValue);
  }
};

module.exports = applyFilter;
