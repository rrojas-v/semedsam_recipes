<template>
    <PacientComponent />
    <div class="card">
        <DataTable ref="dt" v-model:selection="selectedMedications" :value="medications" dataKey="id" :paginator="true"
            :rows="5" :filters="filters"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[5, 10, 25]"
            currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords} registros" editMode="cell"
            @cell-edit-complete="onCellEditComplete" :pt="{
                table: { style: 'min-width: 35rem' },
                column: {
                    bodycell: ({ state }) => ({
                        class: [{ 'pt-0 pb-0': state['d_editing'] }]
                    })
                }
            }" showGridlines>
            <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header" style="width: 50%">
                <template #editor="{ data, field }">
                    <template v-if="field !== 'id'">
                        <InputText v-model="data[field]" autofocus fluid />
                    </template>
                </template>
            </Column>
            <Column :exportable="false">
                <template #body="slotProps">
                    <Button icon="pi pi-plus" size="small" outlined rounded @click="addMedication(slotProps.data)" />
                </template>
            </Column>
            <Column :exportable="false">
                <template #body="slotProps">
                    <Button icon="pi pi-trash" size="small" outlined rounded severity="danger"
                        @click="confirmDeleteMedication(slotProps.data)" />
                </template>
            </Column>
        </DataTable>
        <Toolbar>
            <template #start>
                <Button label="Guardar Receta" icon="pi pi-check" severity="contrast" @click="showPreview()" text
                    rounded aria-label="" :disabled="!selectedPacient" />
            </template>
        </Toolbar>
    </div>

    <Dialog v-model:visible="deleteMedicationDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
        <div class="flex items-center gap-4">
            <i class="pi pi-exclamation-triangle !text-3xl" />
            <span v-if="medication">¿Esta seguro de quitar <b>{{ medication.nombre }}</b>?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" text @click="deleteMedicationDialog = false" />
            <Button label="Yes" icon="pi pi-check" @click="deleteMedication" />
        </template>
    </Dialog>

    <Dialog v-model:visible="deleteMedicationsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
        <div class="flex items-center gap-4">
            <i class="pi pi-exclamation-triangle !text-3xl" />
            <span v-if="medication">¿Esta seguro de quitar los medicamentos seleccionados?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" text @click="deleteMedicationsDialog = false" />
            <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedMedications" />
        </template>
    </Dialog>

    <Dialog v-model:visible="printDialog" modal header="Header" :breakpoints="{ '1199px': '385vw', '575px': '90vw' }">
        <template #header>
            <Button @click="saveAndDownload">Guardar y descargar receta</Button>
        </template>
        <RecipePrintComponent :recipe="newRecipe" />
    </Dialog>

    <Dialog v-model:visible="askAmountDialog" modal header="Recetas electrónicas"
        :breakpoints="{ '300px': '75vw', '475px': '90vw' }">
        <div class="formgrid grid">
            <div class="field col">
                <label for="amount" class="font-bold block mb-2"> Monto </label>
                <InputNumber autofocus v-model="amount" inputId="amount" :minFractionDigits="1" :maxFractionDigits="2"
                    fluid />
            </div>
        </div>
        <div class="formgrid grid">
            <div class="col align-items-center justify-content-center">
                <div class="max-w-full flex align-items-center justify-content-center">
                    <Button label="Continuar" icon="pi pi-check" @click="askAmountDialog = false" />
                </div>
            </div>
        </div>
    </Dialog>

</template>

<script setup>
//ToDo: limit to 5 medications per recipe
import Button from 'primevue/button'
import Toolbar from 'primevue/toolbar'
import InputText from 'primevue/inputtext'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'
import InputNumber from 'primevue/inputnumber'

import { ref, onMounted, computed } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';

import { MedicationsService } from '@/service/MedicationsService';
import { RecipesService } from '@/service/RecipeService';

import router from '@/router'
import html2pdf from 'html2pdf.js'
import RecipePrintComponent from '@/components/RecipePrintComponent.vue'
import { database } from "@/firebase";
import { addDoc, collection, doc, setDoc } from 'firebase/firestore/lite'
import PacientComponent from '@/components/PacientComponent.vue'
import { selectedPacient } from '@/store/store'

onMounted(() => {
    MedicationsService.getMedications().then((data) => (medications.value = data));
});

const toast = useToast();
const dt = ref();

const medications = ref();
const deleteMedicationDialog = ref(false);
const deleteMedicationsDialog = ref(false);
const medication = ref({});
const selectedMedications = ref();
const newRecipe = ref({})
const filters = ref({
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const printDialog = ref(false)

const askAmountDialog = ref(false)
const amount = ref(0)

const columns = ref([
    { field: 'medication', header: 'Medicamento', },
    { field: 'dosis', header: 'Dosis' }
]);
function getAge(d1) {
    let diff = (new Date()).getTime() - d1.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}
const pacientAge = computed(() => {
    if (selectedPacient.value.fnacimiento) {
        return getAge(selectedPacient.value.fnacimiento);
    }
    else {
        return null
    }
})

const addMedication = (medication) => {
    const index = findMedicationIndexById(medication.id)
    const newMedication = { id: createCode(), nombre: '' }
    medications.value.splice(index + 1, 0, newMedication)
}
const confirmDeleteMedication = (medication) => {
    medication.value = medication;
    deleteMedicationDialog.value = true;
};
const deleteMedication = () => {
    medications.value = medications.value.filter(val => val.id !== medication.value.id);
    deleteMedicationDialog.value = false;
    medication.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Medication Deleted', life: 3000 });
};
const findMedicationIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < medications.value.length; i++) {
        if (medications.value[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
};
const createCode = () => {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}
const createRecipeCode = () => {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 32; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}
const deleteSelectedMedications = () => {
    medications.value = medications.value.filter(val => !selectedMedications.value.includes(val));
    deleteMedicationsDialog.value = false;
    selectedMedications.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Medications Deleted', life: 3000 });
};
const showPreview = () => {
    askAmountDialog.value = true

    newRecipe.value.fecha = new Date() //ToDo: use server date time instead
    newRecipe.value.pacient = selectedPacient.value
    newRecipe.value.medications = medications.value.map(medication => medication)
    newRecipe.value.pacient.age = pacientAge
    newRecipe.value.clinica = 'Mérida'
    newRecipe.value.employeeId = 1; // {1, Dr. Angel de la Luz Ramirez}

    printDialog.value = true
}
const saveSaleTicket = async () => {

    const servicio = { id: 1, name: 'Consulta Externa' }
    const code = createCode();
    await setDoc(doc(database, "tickets", code), {
        code: code,
        invoice: '',
        status: 'ACTIVO',
        date: new Date(),
        amount: amount.value,
        service: servicio
    });

}
const saveAndDownload = async () => {
    console.log("saveAndDownload", newRecipe.value);

    newRecipe.value.uid = createRecipeCode()
    const docRef = await addDoc(collection(database, "recipes"), newRecipe.value);
    console.log("New recipe written with ID: ", docRef.id);

    RecipesService.addRecipe(newRecipe)

    const fileName = "receta-" + newRecipe.value.uid + "-" + selectedPacient.nombre + ' ' + selectedPacient.apaterno + ' ' + selectedPacient.amaterno

    html2pdf(document.querySelector('#printable'), {
        margin: 5,
        filename: fileName + ".pdf",
    });
    printDialog.value = false

    saveSaleTicket()

    router.push('/')
}

// const isPositiveInteger = (val) => {
//     let str = String(val);

//     str = str.trim();

//     if (!str) {
//         return false;
//     }

//     str = str.replace(/^0+/, '') || '0';
//     var n = Math.floor(Number(str));

//     return n !== Infinity && String(n) === str && n >= 0;
// };
const onCellEditComplete = (event) => {
    let { data, newValue, field } = event;
    switch (field) {
        case 'medication':
        case 'dosis':
            data[field] = newValue.toUpperCase()
            break;

        default:
            if (newValue.trim().length > 0) data[field] = newValue;
            else event.preventDefault();
            break;
    }
};

</script>
