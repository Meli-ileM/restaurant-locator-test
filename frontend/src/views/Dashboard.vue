<script setup>
/* Project: TOPOS - Gestion d'emplacements géospatiaux | Author: Melissa */

import { computed, onMounted, ref, watch } from "vue";
import { addRestaurant, filterRestaurantsByCuisine, getRestaurants, searchRestaurants } from "../api/restaurantApi";
import Sidebar from "../components/layout/Sidebar.vue";
import TopBar from "../components/layout/TopBar.vue";
import KpiCard from "../components/ui/KpiCard.vue";
import RestaurantsMap from "../components/ui/RestaurantsMap.vue";
import RestaurantModal from "../components/ui/RestaurantModal.vue";
import RestaurantTable from "../components/ui/RestaurantTable.vue";

const cuisines = ["Française", "Italienne", "Asiatique", "Américaine", "Méditerranéenne", "Autre"];

const activeView = ref("dashboard");
const restaurants = ref([]);
const errorMessage = ref("");
const isLoading = ref(false);
const isModalOpen = ref(false);
const isSubmitting = ref(false);
const searchQuery = ref("");
const selectedCuisine = ref("");
let searchDebounce = null;

const totalRestaurants = computed(() => restaurants.value.length);
const totalCuisines = computed(() => new Set(restaurants.value.map((restaurant) => restaurant.cuisine_type)).size);
const averageLatitude = computed(() => {
  if (!restaurants.value.length) {
    return "-";
  }

  const sum = restaurants.value.reduce((acc, restaurant) => acc + Number(restaurant.latitude), 0);
  return `${(sum / restaurants.value.length).toFixed(2)}°`;
});

const fetchRestaurants = async () => {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    const query = searchQuery.value.trim();
    const cuisine = selectedCuisine.value;
    let data = [];

    if (query) {
      data = await searchRestaurants(query);
      if (cuisine) {
        data = data.filter((restaurant) => restaurant.cuisine_type === cuisine);
      }
    } else if (cuisine) {
      data = await filterRestaurantsByCuisine(cuisine);
    } else {
      data = await getRestaurants();
    }

    restaurants.value = data;
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    isLoading.value = false;
  }
};

const onNavigate = (view) => {
  activeView.value = view;
};

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const createRestaurant = async (payload) => {
  isSubmitting.value = true;
  errorMessage.value = "";

  try {
    await addRestaurant(payload);
    isModalOpen.value = false;
    await fetchRestaurants();
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    isSubmitting.value = false;
  }
};

watch(
  () => [searchQuery.value, selectedCuisine.value],
  () => {
    if (activeView.value !== "dashboard") {
      return;
    }

    if (searchDebounce) {
      clearTimeout(searchDebounce);
    }

    // Un léger debounce évite de saturer l'API pendant la frappe tout en gardant une sensation temps réel.
    searchDebounce = setTimeout(() => {
      fetchRestaurants();
    }, 250);
  }
);

watch(
  () => activeView.value,
  (view) => {
    if (view === "dashboard") {
      fetchRestaurants();
    }
  }
);

onMounted(() => {
  fetchRestaurants();
});
</script>

<template>
  <div class="app-layout">
    <Sidebar :active-view="activeView" @navigate="onNavigate" />

    <div class="content-layout">
      <TopBar :title="activeView === 'dashboard' ? 'Dashboard' : 'Carte'" />

      <main class="content-scroll">
        <section v-if="activeView === 'dashboard'" class="dashboard-view">
          <p v-if="errorMessage" class="error-banner">{{ errorMessage }}</p>

          <div class="kpi-grid">
            <KpiCard label="Restaurants" :value="totalRestaurants" />
            <KpiCard label="Cuisines" :value="totalCuisines" />
            <KpiCard label="Latitude moyenne" :value="averageLatitude" />
          </div>

          <div class="panel-header">
            <div>
              <h1 class="panel-title">Emplacements</h1>
              <p class="panel-subtitle">Recherche par nom ou adresse, filtre par type de cuisine.</p>
            </div>

            <button class="plus-btn" type="button" aria-label="Ajouter un restaurant" @click="openModal">
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
              </svg>
            </button>
          </div>

          <section class="filters-panel">
            <div class="search-wrap">
              <span class="search-icon" aria-hidden="true">
                <svg viewBox="0 0 16 16" fill="none">
                  <circle cx="7" cy="7" r="4.5" stroke="currentColor" stroke-width="1.4" />
                  <path d="m10.5 10.5 3 3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
                </svg>
              </span>
              <input
                v-model.trim="searchQuery"
                type="text"
                class="search-input"
                placeholder="Rechercher par nom ou adresse..."
              />
            </div>

            <div class="select-wrap">
              <select id="cuisine-select" v-model="selectedCuisine">
                <option value="">Toutes les cuisines</option>
                <option v-for="cuisine in cuisines" :key="cuisine" :value="cuisine">{{ cuisine }}</option>
              </select>
            </div>
          </section>

          <RestaurantTable :restaurants="restaurants" :is-loading="isLoading" />
        </section>

        <section v-else class="map-view">
          <div class="map-copy">
            <h1>Carte</h1>
            <p>Vue cartographique des restaurants en base avec marqueurs interactifs.</p>
          </div>
          <RestaurantsMap :restaurants="restaurants" />
        </section>
      </main>
    </div>

    <RestaurantModal
      :open="isModalOpen"
      :submitting="isSubmitting"
      :cuisines="cuisines"
      @close="closeModal"
      @submit="createRestaurant"
    />
  </div>
</template>

<style scoped>
/* Utilisation de scoped CSS pour éviter toute pollution visuelle entre les composants du Dashboard. */
.app-layout {
  width: 100vw;
  height: 100vh;
  display: flex;
  background: var(--ivory-white);
}

.content-layout {
  margin-left: 260px;
  width: calc(100vw - 260px);
  height: 100vh;
  background: var(--ivory-white);
}

.content-scroll {
  height: calc(100vh - 62px);
  overflow-y: auto;
  padding: 18px 22px;
}

.dashboard-view {
  display: grid;
  gap: 14px;
}

.error-banner {
  margin: 0;
  background: color-mix(in srgb, var(--royal-red) 15%, var(--ivory-white));
  color: var(--royal-red);
  border: 1px solid color-mix(in srgb, var(--royal-red) 40%, var(--ivory-white));
  border-radius: 10px;
  padding: 10px 12px;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.panel-title {
  margin: 0;
  color: var(--royal-red);
  font-size: 1.6rem;
}

.panel-subtitle {
  margin: 4px 0 0;
  color: rgba(26, 26, 26, 0.72);
  font-size: 0.92rem;
}

.plus-btn {
  width: 36px;
  height: 36px;
  border: 1px solid var(--royal-red);
  border-radius: 10px;
  background: var(--royal-red);
  color: var(--ivory-white);
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: transform 0.18s ease, filter 0.18s ease;
}

.plus-btn:hover {
  transform: translateY(-1px);
  filter: brightness(1.06);
}

.plus-btn svg {
  width: 16px;
  height: 16px;
}

.filters-panel {
  border: 1px solid var(--line-soft);
  border-radius: 12px;
  background: var(--ivory-white);
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-wrap {
  position: relative;
  flex: 1;
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: var(--royal-red);
  display: inline-flex;
}

.search-icon svg {
  width: 16px;
  height: 16px;
}

.search-input,
.select-wrap select {
  width: 100%;
  border: 1px solid var(--line-soft);
  border-radius: 10px;
  padding: 10px 11px;
  background: var(--ivory-white);
  color: var(--text-anthracite);
}

.search-input {
  padding-left: 34px;
}

.search-input:focus,
.select-wrap select:focus {
  outline: 2px solid var(--line-strong);
  border-color: var(--gold-antique);
}

.select-wrap {
  min-width: 250px;
}

.select-wrap select {
  appearance: none;
  padding-right: 38px;
  background:
    linear-gradient(45deg, transparent 50%, var(--royal-red) 50%),
    linear-gradient(135deg, var(--royal-red) 50%, transparent 50%),
    linear-gradient(to right, color-mix(in srgb, var(--gold-antique) 16%, var(--ivory-white)), color-mix(in srgb, var(--gold-antique) 16%, var(--ivory-white)));
  background-position:
    calc(100% - 18px) calc(50% - 3px),
    calc(100% - 12px) calc(50% - 3px),
    calc(100% - 42px) 50%;
  background-size: 6px 6px, 6px 6px, 1px 55%;
  background-repeat: no-repeat;
  color: var(--royal-red);
}

.map-view {
  display: grid;
  gap: 12px;
}

.map-copy {
  border: 1px solid var(--line-soft);
  border-radius: 14px;
  padding: 18px;
  background: var(--ivory-white);
}

.map-view h1 {
  margin: 0;
  color: var(--royal-red);
}

.map-view p {
  margin: 6px 0 0;
  color: var(--text-anthracite);
}

@media (max-width: 980px) {
  .app-layout {
    display: block;
    width: 100%;
    height: auto;
    min-height: 100vh;
  }

  .content-layout {
    margin-left: 0;
    width: 100%;
    height: auto;
  }

  .content-scroll {
    height: auto;
    min-height: calc(100vh - 62px);
    padding: 12px;
  }

  .kpi-grid {
    grid-template-columns: 1fr;
  }

  .panel-header {
    align-items: flex-start;
  }

  .filters-panel {
    flex-direction: column;
    align-items: stretch;
  }

  .select-wrap {
    min-width: 0;
  }
}
</style>
