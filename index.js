const express = require('express');
const app = express();
const applyFilter = require('./helpers/applyFilter');
const meals = require('./mocks/meals.json');
const drinks = require('./mocks/drinks.json');
const emptyMeals = require('./mocks/emptyMeals.json');
const emptyDrinks = require('./mocks/emptyDrinks.json');
const drinkCategories = require('./mocks/drinkCategories.json');
const drinkIngredients = require('./mocks/drinkIngredients.json');
const mealIngredients = require('./mocks/mealIngredients.json');
const mealCategories = require('./mocks/mealCategories.json');
const areas = require('./mocks/areas.json');
const { getMeals, getDrinks } = require('./helpers/pagination');

// add cors headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Method', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

app.get('/meals/:token/list.php', (req, res) => {
  if (req.query.c) {
    return res.json(getMeals(mealCategories));
  } else if (req.query.i) {
    return res.json(getMeals(mealIngredients));
  } else if (req.query.a) {
    return res.json(getMeals(areas));
  }
  res.json();
});

app.get('/drinks/:token/list.php', (req, res) => {
  if (req.query.c) {
    return res.json(getDrinks(drinkCategories));
  } else if (req.query.i) {
    return res.json(getDrinks(drinkIngredients));
  }
  res.json();
});

app.get('/meals/:token/filter.php', (req, res) => {
  const queryParameter = Object.keys(req.query)[0];
  const mealsFound = applyFilter(queryParameter, req.query[queryParameter]);

  if (mealsFound.length > 0) {
    return res.json(getMeals({ meals: mealsFound }));
  }
  res.json(emptyMeals);
});

app.get('/drinks/:token/filter.php', (req, res) => {
  const queryParameter = Object.keys(req.query)[0];
  const drinksFound = applyFilter(queryParameter, req.query[queryParameter], 'drinks');

  if (drinksFound.length > 0) {
    return res.json(getDrinks({ drinks: drinksFound }));
  }
  res.json(emptyDrinks);
});

app.get('/meals/:token/search.php', (req, res) => {
  const mealsFound = meals.meals.filter((meal) => meal.strMeal.toLowerCase().includes(req.query.s.toLowerCase()));
  if (mealsFound.length > 0) {
    return res.json(getMeals({ meals: mealsFound }));
  }
  res.json(emptyMeals);
});

app.get('/drinks/:token/search.php', (req, res) => {
  const drinksFound = drinks.drinks.filter((drink) => drink.strDrink.toLowerCase().includes(req.query.s.toLowerCase()));
  if (drinksFound.length > 0) {
    return res.json(getDrinks({ drinks: drinksFound }));
  }
  res.json(emptyDrinks);
});

app.get('/meals/:token/random.php', (req, res) => {
  const randomIndex = Math.floor(Math.random() * meals.meals.length);

  res.json(getMeals({ meals: [meals.meals[randomIndex]] }));
});

app.get('/drinks/:token/random.php', (req, res) => {
  const randomIndex = Math.floor(Math.random() * drinks.drinks.length);

  res.json(getDrinks({ drinks: [drinks.drinks[randomIndex]] }));
});

app.get('/meals/:token/lookup.php', (req, res) => {
  const meal = meals.meals.find((meal) => String(meal.idMeal) == String(req.query.i));
  if (meal) {
    return res.json({meals: [meal]});
  }
  res.json(emptyMeals);
});

app.get('/drinks/:token/lookup.php', (req, res) => {
  if (req.query.i) {
    const drink = drinks.drinks.find((drink) => String(drink.idDrink) == String(req.query.i));
    if (drink) {
      return res.json({ drinks: [drink] });
    }
  } else if (req.query.iid) {
    const drink = drinks.drinks.find((drink) => String(drink.idDrink) == String(req.query.iid));
    if (drink) {
      return res.json({ drinks: [drink] });
    }
  }
  res.json(emptyDrinks);
});

module.exports = app;
