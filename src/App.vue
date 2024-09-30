<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Breadcrumb from 'primevue/breadcrumb';
import { ref } from "vue";
//import { storeLogin } from "@/store/storeLogin";

//import SpeedDial from 'primevue/speeddial';
import Button from 'primevue/button';

const home = ref({
  icon: 'pi pi-home',
  route: '/login'
});

const items = ref([
  { label: 'Recetas', route: '/' },
  { label: 'Nueva', route: '/newrecipe' }
]);

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

</script>

<template>
  <header>
    <div class="grid">
      <div class="col">
        <div class="text-left p-3">
          <Breadcrumb :home="home" :model="items">
            <template #item="{ item, props }">
              <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                <a :href="href" v-bind="props.action" @click="navigate">
                  <span :class="[item.icon, 'text-color']" />
                  <span class="text-primary font-semibold">{{ item.label }}</span>
                </a>
              </router-link>
              <a v-else :href="item.url" :target="item.target" v-bind="props.action">
                <span class="text-surface-700 dark:text-surface-0">{{ item.label }}</span>
              </a>
            </template>
          </Breadcrumb>
        </div>
      </div>
      <div class="col">
        <div class="text-center p-3 border-round-sm bg-primary font-bold ">RECEPTARIO ELECTRÓNICO SEMEDSAM</div>
      </div>
      <div class="col flex align-items-center justify-content-end">
        <!-- <SpeedDial :model="buttons" direction="down" style="position: absolute; right: calc(50% - 2rem); right: 0"
          class="pr-3" /> -->
        <Button icon="pi pi-power-off" severity="contrast" text rounded aria-label="" />
      </div>
    </div>
  </header>

  <main>
  </main>
  <footer>
  </footer>

  <RouterView />
</template>
