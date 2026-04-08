<script setup>
import { computed } from "vue";

const props = defineProps({
  tone: {
    type: String,
    default: "gold",
    validator: (value) => ["gold", "red"].includes(value),
  },
  compact: {
    type: Boolean,
    default: false,
  },
});

const palette = computed(() => {
  if (props.tone === "red") {
    return {
      ring: "var(--royal-red)",
      pin: "var(--royal-red)",
      wordmark: "var(--royal-red)",
      tagline: "var(--gold-antique)",
      haloOpacity: "0.08",
      strokeOpacity: "0.5",
    };
  }

  return {
    ring: "var(--gold-antique)",
    pin: "var(--royal-red)",
    wordmark: "var(--gold-antique)",
    tagline: "var(--pale-gold)",
    haloOpacity: "0.15",
    strokeOpacity: "0.6",
  };
});
</script>

<template>
  <div class="logo-topos" :class="{ compact }" aria-label="TOPOS Restaurant Locator">
    <svg class="logo-icon" viewBox="0 0 38 38" role="img" aria-hidden="true">
      <circle cx="19" cy="19" r="18" :fill="palette.ring" :opacity="palette.haloOpacity" />
      <circle cx="19" cy="19" r="14" fill="none" :stroke="palette.ring" stroke-width="1.2" />
      <ellipse
        cx="19"
        cy="19"
        rx="7"
        ry="14"
        fill="none"
        :stroke="palette.ring"
        stroke-width="0.8"
        :opacity="palette.strokeOpacity"
      />
      <line x1="5" y1="19" x2="33" y2="19" :stroke="palette.ring" stroke-width="0.8" :opacity="palette.strokeOpacity" />
      <circle cx="19" cy="13" r="3.5" :fill="palette.pin" />
      <line x1="19" y1="16.5" x2="19" y2="22" :stroke="palette.pin" stroke-width="1.5" stroke-linecap="round" />
    </svg>

    <div class="logo-texts">
      <p class="wordmark" :style="{ color: palette.wordmark }">TOPOS</p>
      <p class="tagline" :style="{ color: palette.tagline }">RESTAURANT LOCATOR</p>
    </div>
  </div>
</template>

<style scoped>
.logo-topos {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
}

.wordmark {
  font-family: "Cinzel", Georgia, serif;
  font-size: 1.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  line-height: 1;
}

.tagline {
  margin-top: 3px;
  font-size: 0.62rem;
  letter-spacing: 0.2em;
  line-height: 1;
}

.logo-topos.compact .logo-icon {
  width: 24px;
  height: 24px;
}

.logo-topos.compact .wordmark {
  font-size: 1.1rem;
}

.logo-topos.compact .tagline {
  display: none;
}
</style>
