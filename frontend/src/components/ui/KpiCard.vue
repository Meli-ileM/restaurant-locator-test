<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number],
    required: true,
  },
});
</script>

<template>
  <article class="kpi-card">
    <p class="value">{{ value }}</p>
    <p class="label">{{ label }}</p>
  </article>
</template>

<style scoped>
.kpi-card {
  border: 1px solid var(--line-strong);
  border-radius: 12px;
  padding: 12px;
  background: var(--ivory-white);
}

.value {
  margin: 0;
  line-height: 1;
  font-size: 1.9rem;
  color: var(--royal-red);
}

.label {
  margin: 4px 0 0;
  font-size: 0.8rem;
  color: var(--deep-night);
}
</style>
