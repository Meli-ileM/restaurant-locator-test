<script setup>
import { computed, ref, watch } from "vue";

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  submitting: {
    type: Boolean,
    default: false,
  },
  cuisines: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["close", "submit"]);

const form = ref({
  name: "",
  address: "",
  latitude: "",
  longitude: "",
  cuisine_type: "Française",
  phone_number: "",
});
const formError = ref("");

const canRender = computed(() => props.open);

const resetForm = () => {
  form.value = {
    name: "",
    address: "",
    latitude: "",
    longitude: "",
    cuisine_type: "Française",
    phone_number: "",
  };
  formError.value = "";
};

watch(
  () => props.open,
  (value) => {
    if (value) {
      formError.value = "";
      return;
    }

    resetForm();
  }
);

const onSubmit = () => {
  const payload = {
    name: form.value.name.trim(),
    address: form.value.address.trim(),
    latitude: Number(form.value.latitude),
    longitude: Number(form.value.longitude),
    cuisine_type: form.value.cuisine_type,
    phone_number: form.value.phone_number.trim(),
  };

  if (payload.name.length < 3) {
    formError.value = "Le nom doit contenir au moins 3 caractères.";
    return;
  }

  if (payload.address.length < 10) {
    formError.value = "L'adresse doit contenir au moins 10 caractères.";
    return;
  }

  if (Number.isNaN(payload.latitude) || payload.latitude < -90 || payload.latitude > 90) {
    formError.value = "Latitude invalide : valeur attendue entre -90 et 90.";
    return;
  }

  if (Number.isNaN(payload.longitude) || payload.longitude < -180 || payload.longitude > 180) {
    formError.value = "Longitude invalide : valeur attendue entre -180 et 180.";
    return;
  }

  if (payload.phone_number) {
    const phoneRegex = /^\+?[0-9().\-\s]{6,20}$/;
    if (!phoneRegex.test(payload.phone_number)) {
      formError.value = "Numéro de téléphone invalide.";
      return;
    }
  }

  emit("submit", payload);
};
</script>

<template>
  <teleport to="body">
    <div v-if="canRender" class="overlay" @click.self="emit('close')">
      <section class="modal">
        <header class="modal-header">
          <h2>Ajouter un restaurant</h2>
          <button class="close-btn" type="button" @click="emit('close')">Fermer</button>
        </header>

        <p v-if="formError" class="form-error">{{ formError }}</p>

        <form class="form-grid" @submit.prevent="onSubmit">
          <input v-model.trim="form.name" type="text" placeholder="Nom du restaurant" minlength="3" required />
          <input v-model.trim="form.address" type="text" placeholder="Adresse" minlength="10" required />
          <input v-model="form.latitude" type="number" step="any" min="-90" max="90" placeholder="Latitude" required />
          <input v-model="form.longitude" type="number" step="any" min="-180" max="180" placeholder="Longitude" required />
          <select v-model="form.cuisine_type" required>
            <option v-for="cuisine in cuisines" :key="cuisine" :value="cuisine">{{ cuisine }}</option>
          </select>
          <input v-model.trim="form.phone_number" type="text" placeholder="Téléphone (optionnel)" />

          <button class="submit-btn" type="submit" :disabled="submitting">
            {{ submitting ? "Enregistrement..." : "Enregistrer" }}
          </button>
        </form>
      </section>
    </div>
  </teleport>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: var(--overlay);
  backdrop-filter: blur(5px);
  display: grid;
  place-items: center;
  z-index: 50;
  padding: 18px;
}

.modal {
  width: min(720px, 100%);
  border-radius: 16px;
  border: 1px solid var(--line-strong);
  background: var(--ivory-white);
  box-shadow: var(--shadow-gold);
  padding: 16px;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
}

h2 {
  margin: 0;
  color: var(--royal-red);
  font-size: 1.25rem;
}

.close-btn {
  border: 1px solid var(--line-soft);
  background: transparent;
  color: var(--deep-night);
  border-radius: 8px;
  padding: 7px 10px;
  cursor: pointer;
}

.close-btn:hover {
  border-color: var(--gold-antique);
  background: var(--hover-soft);
}

.form-error {
  margin: 0 0 8px;
  padding: 9px 10px;
  border-radius: 8px;
  background: color-mix(in srgb, var(--royal-red) 15%, var(--ivory-white));
  color: var(--royal-red);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.form-grid input,
.form-grid select {
  width: 100%;
  border: 1px solid var(--line-soft);
  border-radius: 10px;
  padding: 10px 11px;
  background: var(--ivory-white);
  color: var(--text-anthracite);
}

.form-grid input:focus,
.form-grid select:focus {
  outline: 2px solid var(--line-strong);
  border-color: var(--gold-antique);
}

.submit-btn {
  grid-column: 1 / -1;
  border: 1px solid var(--royal-red);
  background: var(--royal-red);
  color: var(--ivory-white);
  border-radius: 10px;
  padding: 11px;
  cursor: pointer;
}

.submit-btn:hover {
  filter: brightness(1.08);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 760px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
