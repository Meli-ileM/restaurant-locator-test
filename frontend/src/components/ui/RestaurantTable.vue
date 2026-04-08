<script setup>
defineProps({
  restaurants: {
    type: Array,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});

const cuisineClass = (cuisine) => {
  const classes = {
    "Française": "badge-fr",
    Italienne: "badge-it",
    Asiatique: "badge-as",
    Américaine: "badge-am",
    "Méditerranéenne": "badge-me",
    Autre: "badge-au",
  };

  return classes[cuisine] || "badge-au";
};

const formatCoordinate = (value) => Number(value).toFixed(4);
</script>

<template>
  <section class="table-panel">
    <table v-if="restaurants.length && !isLoading" class="table">
      <thead>
        <tr>
          <th>Nom</th>
          <th>Cuisine</th>
          <th>Coordonnées</th>
          <th>Téléphone</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="restaurant in restaurants" :key="restaurant.id">
          <td>{{ restaurant.name }}</td>
          <td>
            <span class="badge" :class="cuisineClass(restaurant.cuisine_type)">
              {{ restaurant.cuisine_type }}
            </span>
          </td>
          <td class="coord">{{ formatCoordinate(restaurant.latitude) }}, {{ formatCoordinate(restaurant.longitude) }}</td>
          <td>{{ restaurant.phone_number || "-" }}</td>
        </tr>
      </tbody>
    </table>

    <p v-else-if="isLoading" class="empty">Chargement des restaurants...</p>
    <p v-else class="empty">Aucun restaurant trouvé.</p>
  </section>
</template>

<style scoped>
.table-panel {
  border: 1px solid var(--line-soft);
  border-radius: 14px;
  background: var(--ivory-white);
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

th {
  padding: 11px 12px;
  text-align: left;
  font-size: 0.76rem;
  color: var(--royal-red);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border-bottom: 1px solid var(--line-strong);
}

td {
  padding: 12px;
  border-bottom: 1px solid var(--line-soft);
  color: var(--text-anthracite);
  font-size: 0.93rem;
}

tbody tr:last-child td {
  border-bottom: none;
}

tbody tr {
  transition: background-color 0.2s ease;
}

tbody tr:hover {
  background: var(--hover-soft);
}

.badge {
  display: inline-block;
  border-radius: 999px;
  padding: 3px 10px;
  font-size: 0.75rem;
}

.badge-fr {
  background: var(--pale-gold);
  color: var(--deep-night);
}

.badge-it {
  background: color-mix(in srgb, var(--royal-red) 20%, var(--ivory-white));
  color: var(--royal-red);
}

.badge-as {
  background: color-mix(in srgb, var(--gold-antique) 25%, var(--ivory-white));
  color: var(--deep-night);
}

.badge-am {
  background: color-mix(in srgb, var(--royal-red) 28%, var(--ivory-white));
  color: var(--deep-night);
}

.badge-me {
  background: color-mix(in srgb, var(--deep-night) 13%, var(--ivory-white));
  color: var(--deep-night);
}

.badge-au {
  background: color-mix(in srgb, var(--gold-antique) 16%, var(--ivory-white));
  color: var(--deep-night);
}

.coord {
  font-family: var(--font-mono);
  font-size: 0.78rem;
}

.empty {
  margin: 0;
  padding: 28px 16px;
  text-align: center;
  color: var(--royal-red);
}
</style>
