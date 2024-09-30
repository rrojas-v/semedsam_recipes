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
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} recipes">
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <!-- <h4 class="m-0">Administración de Recetas Médicas</h4> -->
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Search..." />
                        </IconField>
                    </div>
                </template>

                <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
                <Column field="code" header="Code" sortable style="min-width: 12rem"></Column>
                <Column field="name" header="Name" sortable style="min-width: 16rem"></Column>

            </DataTable>
        </div>

        <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="recipe">Are you sure you want to delete <b>{{ recipe.name }}</b>?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteProductDialog = false" />
                <Button label="Yes" icon="pi pi-check" @click="deleteProduct" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteRecipesDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="recipe">Are you sure you want to delete the selected recipes?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteRecipesDialog = false" />
                <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedRecipes" />
            </template>
        </Dialog>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { RecipesService } from '@/service/RecipeService';

import Button from 'primevue/button';
//import Toolbar from 'primevue/toolbar';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import IconField from 'primevue/iconfield';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
//import router from '@/router';

onMounted(() => {
    RecipesService.getRecipes().then((data) => (recipes.value = data));
});

const toast = useToast();
const dt = ref();
const recipes = ref();
const deleteProductDialog = ref(false);
const deleteRecipesDialog = ref(false);
const recipe = ref({});
const selectedRecipes = ref();
const filters = ref({
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
});

// const openNew = () => {
//     router.push({ 'path': 'newrecipe' })
// };

const deleteProduct = () => {
    recipes.value = recipes.value.filter(val => val.id !== recipe.value.id);
    deleteProductDialog.value = false;
    recipe.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
};
const deleteSelectedRecipes = () => {
    recipes.value = recipes.value.filter(val => !selectedRecipes.value.includes(val));
    deleteRecipesDialog.value = false;
    selectedRecipes.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Recipes Deleted', life: 3000 });
};

</script>
