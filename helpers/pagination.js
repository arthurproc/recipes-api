export const getMeals = (mealsResponse, page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const meals = mealsResponse.meals;
  return {
    meals: meals.slice(startIndex, endIndex),
  }
}

export const getDrinks = (drinksResponse, page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const drinks = drinksResponse.drinks;
  return {
    drinks: drinks.slice(startIndex, endIndex),
  }
}
