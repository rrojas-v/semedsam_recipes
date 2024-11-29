<script setup>
//import { storeLogin } from "@/store/storeLogin";
import Button from 'primevue/button';
import Toolbar from 'primevue/toolbar';
import router from '@/router'

import Divider from 'primevue/divider';

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
const showListSales = () => {
  router.push('/saletickets')
}
const showEstadisticas = () => {
  router.push('/estadisticas')
}
const showMedicalRecord = () => {
  router.push('/medicalrecord')
}
const showMembresias = () => {
  router.push('/membership')
}
// const showCalendario = () => {
//   router.push('/calendar')
// }
const showBitacora = () => {
  router.push('/binacle')
}
</script>

<template>
  <header>
    <div class="grid">
      <div class="col">
        <div class="text-center p-3 border-round-sm bg-primary font-bold text-2xl">
          SEMEDSAM
        </div>
      </div>
    </div>
    <div class="grid">
      <div class="col">
        <Toolbar>
          <template #start>
            <!-- <Button icon="pi pi-home" class="mr-2" severity="secondary" text size="large" /> -->
            <Button label="Bitacora" icon-pos="top" class="mr-2" severity="secondary" text size="large"
              @click="showBitacora" />
            <!-- <Button label="Agenda" icon="pi pi-file-plus" icon-pos="top" class="mr-2" severity="secondary" text
              size="large" @click="showCalendario" /> -->
            <Button label="Recetas" icon-pos="top" class="mr-2" severity="secondary" text size="large"
              @click="showList" />
            <Button label="Tickets de Venta" icon-pos="top" class="mr-2" severity="secondary" text size="large"
              @click="showListSales" />

            <Divider layout="vertical" />
            <Button label="Estadisticas" icon-pos="top" class="mr-2" severity="secondary" text size="large"
              @click="showEstadisticas" />
            <Button label="Membresías" icon-pos="top" class="mr-2" severity="secondary" text size="large"
              @click="showMembresias" />

            <Button label="Expedientes" icon="pi pi-address-book" icon-pos="top" class="mr-2" severity="secondary" text
              size="large" @click="showMedicalRecord" />

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
