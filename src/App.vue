<script setup>
//import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

const texto = ref('');
</script>

<template>
  <header>
    <!-- <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div> -->
  </header>
  <main>
    <InputText v-model="texto" />
    <Button label="Guardar" />
    {{ texto }}
  </main>

  <RouterView />
</template>
