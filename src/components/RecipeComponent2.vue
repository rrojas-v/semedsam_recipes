<template>

    <div class="card">
        <DataTable ref="dt" v-model:selection="editingRows" :value="medications" editMode="row" dataKey="id">
            <Column field="OneLine" header="Medicamentos"></Column>

            <!-- <Column :rowEditor="true" style="width: 10%; min-width: 8rem" bodyStyle="text-align:center"></Column> -->
            <Column :exportable="false" style="min-width: 12rem">
                <template #body="slotProps">
                    <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editMedication(slotProps.data)" />
                    <Button icon="pi pi-trash" outlined rounded severity="danger"
                        @click="confirmDeleteSelected(slotProps.data)" />
                </template>
            </Column>

        </DataTable>

        <Toolbar class="mb-6">
            <template #start>
                <Button icon="pi pi-plus" severity="success" class="mr-2" @click="openNew" />
                <!-- <Button label="Delete" icon="pi pi-trash" severity="danger" @click="confirmDeleteSelected"
                    :disabled="!selectedProducts || !selectedProducts.length" /> -->
            </template>
            <template #end>
                <Button label="Guardar Receta" icon="pi pi-check" />
            </template>
        </Toolbar>
    </div>

    <Dialog v-model:visible="medicationDialog" header="Medicamento" :modal="true">
        <div class="formgrid grid">
            <div class="field col">
                <label for="name" class="block font-bold mb-3">Medicamento y presentación</label>
                <InputText id="name" v-model.trim="medication.name" required="true" autofocus
                    :invalid="submitted && !medication.name" fluid />
                <small v-if="submitted && !medication.name" class="text-red-500">Nombre es requerido.</small>
            </div>
        </div>
        <div class="formgrid grid">
            <div class="field col">
                <label for="dosisPresentacion" class="font-bold block mb-2">Cantidad</label>
                <AutoComplete v-model="medication.dosisCantidad" :suggestions="itemsPresentation" dropdown
                    @complete="searchPresentations" />
            </div>
            <div class="field col">
                <label for="DosisCada" class="font-bold block mb-2"> Cada </label>
                <InputNumber v-model="medication.dosisCada" inputId="DosisCada" suffix=" horas " fluid />
            </div>
            <div class="field col">
                <label for="DosisDurante" class="font-bold block mb-2"> Durante </label>
                <InputNumber v-model="medication.dosisDurante" inputId="DosisDurante" suffix=" días " fluid />
            </div>
        </div>
        <div class="formgrid grid">
            <div class="field col">
                <label for="viaAdmin" class="block font-bold mb-3">Vía de admnistración</label>
                <InputText id="viaAdmin" v-model="medication.viaAdmin" required="true" fluid />
            </div>
        </div>

        <template #footer>
            <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
            <Button label="Save" icon="pi pi-check" @click="saveMedication" />
        </template>
    </Dialog>
    <Dialog v-model:visible="deleteMedicationDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
        <div class="flex items-center gap-4">
            <i class="pi pi-exclamation-triangle !text-3xl" />
            <span v-if="medication">¿Está seguro de eliminar <b>{{ medication.name }}</b>?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" text @click="deleteMedicationDialog = false" />
            <Button label="Yes" icon="pi pi-check" @click="deleteSelectedMedications" />
        </template>
    </Dialog>

    <button @click="exportToPDF">Export to PDF</button>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import Toolbar from 'primevue/toolbar'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast';
import Dialog from 'primevue/dialog'
import AutoComplete from 'primevue/autocomplete'

import html2pdf from 'html2pdf.js'

import { MedicationsService } from '@/service/MedicationsService';

const toast = useToast();
const dt = ref();
const medications = ref();
const editingRows = ref([]);
const medication = ref({});
const medicationDialog = ref(false);
const deleteMedicationDialog = ref(false);
const deleteMedicationsDialog = ref(false);
const submitted = ref(false);

const itemsPresentation = ref([])
const dosisPresentation = ['Tabletas', 'Gotas']

onMounted(() => {
    MedicationsService.getMedications().then((data) =>
        medications.value = data
    );
});
const searchPresentations = (event) => {
    itemsPresentation.value = dosisPresentation.map((item) => event.query + ' ' + item);
};
const openNew = () => {
    medication.value = {};
    submitted.value = false;
    medicationDialog.value = true;
};
const hideDialog = () => {
    medicationDialog.value = false;
    submitted.value = false;
};
const createId = () => {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}
const editMedication = (med) => {
    medication.value = { ...med };
    medicationDialog.value = true;
};
const saveMedication = () => {
    submitted.value = true;

    console.log('saveMedication', medication.value)
    if (medication?.value.name?.trim()) {
        if (medication.value.id) {
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Actualizado', life: 3000 });
        }
        else {
            medication.value.id = createId();
            medication.value.code = createId();
            medication.value.OneLine = `${medication.value.name}, TOMAR: ${medication.value.dosisCantidad} CADA: ${medication.value.dosisCada} HORAS DURANTE: ${medication.value.dosisDurante} DÍAS.VÍA DE ADMINISTRACIÓN: ${medication.value.viaAdmin}.`;
            medications.value.push(medication.value);
            toast.add({ severity: 'success', summary: 'Se guardó', detail: 'Medicamento agregado', life: 3000 });
        }

        console.log('saveMedication', medications.value)

        medicationDialog.value = false;
        medication.value = {};
    }
};
const confirmDeleteSelected = () => {
    deleteMedicationDialog.value = true;
};
const deleteSelectedMedications = () => {
    medications.value = medications.value.filter(val => !editingRows.value.includes(val));
    deleteMedicationsDialog.value = false;
    //editingRows.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
};
const exportToPDF = () => {

    let elEvens = document.querySelectorAll('tr.p-row-odd')
    elEvens.forEach((e) => e.setAttribute("style", "background-color:#ffffff; color:#000000 !important"))
    let elOdds = document.querySelectorAll('tr.p-row-even')
    elOdds.forEach((e) => e.setAttribute("style", "background-color:#ffffff; color:#000000 !important"))

    let toPrint = document.querySelectorAll('tbody.p-datatable-tbody')[0]
    console.log(toPrint)

    html2pdf(toPrint, {
        margin: 20,
        filename: "generated-pdf.pdf",
    });

}
</script>
