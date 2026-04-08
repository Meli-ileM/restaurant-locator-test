<script setup>
import LogoTopos from "../LogoTopos.vue";

defineProps({
  activeView: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["navigate"]);

const goTo = (view) => emit("navigate", view);
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-inner">
      <div class="logo-wrap">
        <LogoTopos tone="gold" compact />
      </div>

      <nav class="menu">
        <button class="menu-btn" :class="{ active: activeView === 'dashboard' }" type="button" @click="goTo('dashboard')">
          <span class="icon" aria-hidden="true">
            <svg viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.2" />
              <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.2" />
              <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.2" />
              <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.2" />
            </svg>
          </span>
          Dashboard
        </button>
        <button class="menu-btn" :class="{ active: activeView === 'map' }" type="button" @click="goTo('map')">
          <span class="icon" aria-hidden="true">
            <svg viewBox="0 0 16 16" fill="none">
              <path d="M2.5 3.5 6 2l4 1.5L13.5 2v10.5L10 14l-4-1.5L2.5 14V3.5Z" stroke="currentColor" stroke-width="1.2" />
              <path d="M6 2v10.5M10 3.5V14" stroke="currentColor" stroke-width="1.2" />
            </svg>
          </span>
          Carte
        </button>
      </nav>

      <p class="sidebar-note">@meli-ilem 2026 · test Geoptis</p>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  position: fixed;
  inset: 0 auto 0 0;
  width: 260px;
  padding: 22px 0;
  background: var(--deep-night);
  border-right: 1px solid var(--line-soft);
  z-index: 20;
}

.sidebar-inner {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.logo-wrap {
  padding: 0 18px 14px;
  border-bottom: 1px solid var(--line-soft);
}

.menu {
  display: grid;
  gap: 6px;
  padding: 18px 14px;
  flex: 1;
  align-content: start;
}

.menu-btn {
  border: 1px solid var(--line-soft);
  background: transparent;
  color: var(--pale-gold);
  border-radius: 8px;
  padding: 6px 9px;
  cursor: pointer;
  text-align: left;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  min-height: 32px;
  font-size: 0.9rem;
  width: 100%;
}

.menu-btn:hover {
  border-color: var(--gold-antique);
  background: var(--hover-soft);
}

.menu-btn.active {
  background: var(--gold-antique);
  color: var(--deep-night);
  border-color: var(--gold-antique);
}

.icon {
  width: 14px;
  height: 14px;
  display: inline-flex;
}

.icon svg {
  width: 14px;
  height: 14px;
}

.sidebar-note {
  margin: auto 16px 0;
  padding-top: 16px;
  border-top: 1px solid var(--line-soft);
  color: rgba(232, 201, 138, 0.72);
  font-size: 0.78rem;
  letter-spacing: 0.04em;
}

@media (max-width: 980px) {
  .sidebar {
    position: static;
    width: 100%;
    padding: 12px;
    border-right: none;
    border-bottom: 1px solid var(--line-soft);
  }

  .menu {
    grid-template-columns: 1fr;
    padding: 12px 0 0;
    flex: none;
  }

  .logo-wrap {
    padding: 0 0 12px;
  }

  .sidebar-note {
    margin: 16px 0 0;
  }
}
</style>
