const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const parseResponse = async (response, fallbackMessage) => {
  if (response.ok) {
    return await response.json();
  }

  let errorMessage = fallbackMessage;
  try {
    const error = await response.json();
    errorMessage = error.error || fallbackMessage;
  } catch {
    errorMessage = fallbackMessage;
  }

  throw new Error(errorMessage);
};

export const getRestaurants = async () => {
  const response = await fetch(`${API_BASE_URL}/restaurants`);
  return parseResponse(response, "Impossible de charger les restaurants");
};

export const searchRestaurants = async (query) => {
  const encodedQuery = encodeURIComponent(query);
  const response = await fetch(`${API_BASE_URL}/restaurants/search?q=${encodedQuery}`);
  return parseResponse(response, "Impossible de rechercher les restaurants");
};

export const filterRestaurantsByCuisine = async (cuisine) => {
  const encodedCuisine = encodeURIComponent(cuisine);
  const response = await fetch(`${API_BASE_URL}/restaurants/filter?cuisine=${encodedCuisine}`);
  return parseResponse(response, "Impossible de filtrer les restaurants");
};

export const addRestaurant = async (data) => {
  const response = await fetch(`${API_BASE_URL}/restaurants`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return parseResponse(response, "Erreur lors de l'ajout du restaurant");
};

