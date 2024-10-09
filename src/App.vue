<script setup>
//import { storeLogin } from "@/store/storeLogin";
import Button from 'primevue/button';
import Toolbar from 'primevue/toolbar';
import router from '@/router'

// const buttons = ref([
//   {
//     label: 'Salir',
//     icon: 'pi pi-power-off',
//     command: () => {
//       //toast.add({ severity: 'info', summary: 'Add', detail: 'Data Added', life: 3000 });
//     }
//   },
//   {
//     label: 'Configuración',
//     icon: 'pi pi-cog',
//     command: () => {
//       //toast.add({ severity: 'success', summary: 'Update', detail: 'Data Updated', life: 3000 });
//     }
//   },
// ])

const showList = () => {
  router.push('/');
}
const showNew = () => {
  router.push('/newrecipe')
}
</script>

<template>
  <header>
    <div class="grid">
      <div class="col">
        <div class="text-center p-3 border-round-sm bg-primary font-bold ">RECEPTARIO ELECTRÓNICO SEMEDSAM</div>
      </div>
    </div>
    <div class="grid">
      <div class="col">
        <Toolbar>
          <template #start>
            <Button icon="pi pi-home" class="mr-2" severity="secondary" text size="large" />
            <Button label="Listado de Recetas" icon="pi pi-address-book" icon-pos="top" class="mr-2"
              severity="secondary" text size="large" @click="showList" />
            <Button label="Nueva Receta" icon="pi pi-file-plus" icon-pos="top" class="mr-2" severity="secondary" text
              size="large" @click="showNew" />
          </template>
          <template #end>
            <Button icon="pi pi-power-off" severity="contrast" text rounded aria-label="" />
          </template>
        </Toolbar>
      </div>
    </div>
  </header>

  <RouterView />
</template>
