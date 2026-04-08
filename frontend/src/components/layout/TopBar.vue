<script setup>
defineProps({
  title: {
    type: String,
    default: "Dashboard",
  },
});
</script>

<template>
  <header class="topbar">
    <span class="view-title">{{ title }}</span>
    <div class="avatar">G</div>
  </header>
</template>

<style scoped>
.topbar {
  position: sticky;
  top: 0;
  z-index: 10;
  height: 62px;
  border-bottom: 1px solid var(--line-soft);
  background: var(--ivory-white);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 22px;
}

.view-title {
  color: var(--royal-red);
  font-size: 0.9rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--gold-antique);
  color: var(--deep-night);
  display: grid;
  place-items: center;
  font-weight: 700;
}

@media (max-width: 980px) {
  .topbar {
    padding: 0 12px;
  }
}
</style>
