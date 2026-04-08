<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const props = defineProps({
  restaurants: {
    type: Array,
    required: true,
  },
});

const mapElement = ref(null);
let map = null;
let markersLayer = null;

const fallbackCenter = [48.8566, 2.3522];

const boundsPoints = computed(() => {
  return props.restaurants
    .filter((restaurant) => !Number.isNaN(Number(restaurant.latitude)) && !Number.isNaN(Number(restaurant.longitude)))
    .map((restaurant) => [Number(restaurant.latitude), Number(restaurant.longitude)]);
});

const renderMarkers = () => {
  if (!map || !markersLayer) {
    return;
  }

  markersLayer.clearLayers();

  props.restaurants.forEach((restaurant) => {
    const latitude = Number(restaurant.latitude);
    const longitude = Number(restaurant.longitude);

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      return;
    }

    L.marker([latitude, longitude])
      .bindPopup(`
        <strong>${restaurant.name}</strong><br />
        ${restaurant.address}<br />
        ${restaurant.cuisine_type}
      `)
      .addTo(markersLayer);
  });

  if (boundsPoints.value.length) {
    map.fitBounds(boundsPoints.value, { padding: [24, 24], maxZoom: 14 });
  } else {
    map.setView(fallbackCenter, 12);
  }
};

onMounted(() => {
  map = L.map(mapElement.value, {
    zoomControl: true,
    scrollWheelZoom: true,
  }).setView(fallbackCenter, 12);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);

  markersLayer = L.layerGroup().addTo(map);
  renderMarkers();
});

watch(
  () => props.restaurants,
  () => {
    renderMarkers();
  },
  { deep: true }
);

onBeforeUnmount(() => {
  if (map) {
    map.remove();
    map = null;
  }
});
</script>

<template>
  <section class="map-card">
    <div ref="mapElement" class="map-canvas" />
  </section>
</template>

<style scoped>
.map-card {
  border: 1px solid var(--line-soft);
  border-radius: 14px;
  overflow: hidden;
  background: var(--ivory-white);
}

.map-canvas {
  width: 100%;
  height: 520px;
}

:deep(.leaflet-control-zoom a) {
  color: var(--deep-night);
}

:deep(.leaflet-popup-content-wrapper) {
  border-radius: 12px;
}

:deep(.leaflet-popup-content) {
  font-family: var(--font-sans);
  color: var(--text-anthracite);
}

@media (max-width: 980px) {
  .map-canvas {
    height: 420px;
  }
}
</style>
