<template>
    <div>
        <div class="card">
            <!-- <Toolbar class="mb-6">
                <template #start>
                    <Button label="New" icon="pi pi-plus" class="mr-2" @click="openNew" />
                </template>
</Toolbar> -->

            <DataTable ref="dt" v-model:selection="selectedRecipes" :value="recipes" dataKey="id" :paginator="true"
                :rows="10" :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="{first} - {last} de {totalRecords} registros">
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <!-- <h4 class="m-0">Administración de Recetas Médicas</h4> -->
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Busqueda..." />
                        </IconField>
                    </div>
                </template>

                <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
                <Column field="pacient.nombre" header="Paciente" sortable style="min-width: 16rem"></Column>

            </DataTable>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { RecipesService } from '@/service/RecipeService';

import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import IconField from 'primevue/iconfield';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

onMounted(() => {
    console.log("onMounted");
    RecipesService.getRecipes().then((data) => (recipes.value = data));
    console.log("onMounted", recipes);
});

const dt = ref();
const recipes = ref();
const selectedRecipes = ref();
const filters = ref({
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
});

// const openNew = () => {
//     router.push({ 'path': 'newrecipe' })
// };

</script>
