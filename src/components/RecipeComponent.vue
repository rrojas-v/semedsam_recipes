<template>
    <Panel>
        <template #header>
            <div class="flex items-center gap-2">
                <span class="font-bold">Paciente</span>
            </div>
        </template>
        <template #icons>
            <Button v-if="selectedPacient?.code" icon="pi pi-user-edit" @click="showPacientDialog" severity="contrast"
                text rounded aria-label="" size="large" />
            <Button icon="pi pi-user-plus" @click="showPacientDialog(true)" severity="contrast" text rounded
                aria-label="" size="large" />
            <Button icon="pi pi-search" @click="showPacientSearchDialog" class="mr-2" severity="contrast" text rounded
                aria-label="" size="large" />
        </template>

        <div class="m-0">
            <div class="grid">
                <div class="col">
                    Nombre:<span v-if="selectedPacient" class="text-left p-3 border-round-sm bg-primary font-bold">{{
                        pacientFullName }}</span>
                </div>

            </div>
            <div class="grid">
                <div class="col">
                    Sexo:<span v-if="selectedPacient" class="text-left p-3 border-round-sm bg-primary font-bold">{{
                        selectedPacient.sexo?.name }}</span>
                </div>
                <div class="col">
                    Edad:<span v-if="selectedPacient" class="text-left p-3 border-round-sm bg-primary font-bold">
                        {{ pacientAge }} años</span>
                </div>
                <div class="col">
                    Fecha de nacimiento:<span v-if="selectedPacient"
                        class="text-left p-3 border-round-sm bg-primary font-bold">
                        {{ pacientFnacimientoDate }}</span>
                </div>
            </div>
        </div>
    </Panel>
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

    <!-- <Dialog v-model:visible="medicationDialog" :style="{ width: '50%' }" header="Detalle del medicamento" :modal="true">
        <div class="formgrid grid">
            <div class="field col">
                <label for="nombre" class="block font-bold mb-3">Medicamento y presentación</label>
                <InputText id="nombre" v-model.trim="medication.nombre" required="true" autofocus
                    :invalid="submitted && !medication.nombre" fluid />
                <small v-if="submitted && !medication.nombre" class="text-red-500">Nombre es requerido.</small>
            </div>
        </div>

        <template #footer>
            <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog" />
            <Button label="Guardar" icon="pi pi-check" @click="saveMedication" />
        </template>
    </Dialog> -->

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

    <Dialog v-model:visible="pacientDialog" header="Información del Paciente" :modal="true">
        <div class="formgrid grid">
            <div class="field col">
                <label for="nombre" class="block font-bold mb-2">Nombre</label>
                <InputText id="nombre" v-model.trim="selectedPacient.nombre" required="true" autofocus
                    :invalid="!selectedPacient.nombre" fluid />
                <small v-if="submittedPacient && !selectedPacient.nombre" class="text-red-500">Capture para
                    continuar.</small>
            </div>
            <div class="field col">
                <label for="apaterno" class="block font-bold mb-2">Apellido paterno</label>
                <InputText id="apaterno" v-model.trim="selectedPacient.apaterno" required="true"
                    :invalid="!selectedPacient.apaterno" fluid />
                <small v-if="submittedPacient && !selectedPacient.apaterno" class="text-red-500">Capture para
                    continuar.</small>
            </div>
            <div class="field col">
                <label for="amaterno" class="block font-bold mb-2">Apellido materno</label>
                <InputText id="amaterno" v-model.trim="selectedPacient.amaterno" fluid />
            </div>
        </div>

        <div class="formgrid grid">
            <div class="field col">
                <div class="field col">
                    <label for="FNacimiento" class="font-bold block mb-2"> F. Nacimiento </label>
                    <DatePicker id="fnacimiento" v-model="selectedPacient.fnacimiento" showIcon
                        :invalid="!selectedPacient.fnacimiento" fluid iconDisplay="input" :maxDate="new Date()" />
                    <small v-if="submittedPacient && !selectedPacient.fnacimiento" class="text-red-500">Seleccione una
                        fecha para continuar.</small>
                </div>
            </div>
            <div class="field col">
                <label for="sexo" class="font-bold block mb-2"> Sexo </label>
                <Select id="sexo" v-model="selectedPacient.sexo" :options="sexoSelectOps" optionLabel="name"
                    placeholder="Seleccione uno" class="w-full md:w-56" :invalid="!selectedPacient.sexo" />
                <small v-if="submittedPacient && !selectedPacient.sexo" class="text-red-500">Seleccione uno para
                    continuar.</small>
            </div>
            <div class="field col"></div>
        </div>

        <template #footer>
            <Button label="Cancelar" icon="pi pi-times" text @click="hidePacientDialog" />
            <Button label="Guardar" icon="pi pi-check" @click="savePacient" />
        </template>
    </Dialog>

    <Dialog v-model:visible="showSearchPacientDialogVisible" header="Listado de pacientes" :style="{ width: '75vw' }"
        maximizable modal :contentStyle="{ height: '300px' }">
        <DataTable v-model:selection="selectSearchPacient" :value="pacients" data-key="code" scrollable
            scrollHeight="flex" tableStyle="min-width: 50rem">
            <Column selectionMode="single" headerStyle="width: 3rem"></Column>
            <Column field="nombre" header="Nombres"></Column>
            <Column field="apaterno" header="Apellido paterno"></Column>
            <Column field="amaterno" header="Apellido materno"></Column>
            <Column field="fnacimientoDate" header="Fecha nacimiento"></Column>
        </DataTable>
        <template #footer>
            <Button label="Ok" icon="pi pi-check" @click="clicSearchPacient" />
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

import DatePicker from 'primevue/datepicker'
import Select from 'primevue/select'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'
import Panel from 'primevue/panel'
import InputNumber from 'primevue/inputnumber'

import { ref, onMounted, computed } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';

import { MedicationsService } from '@/service/MedicationsService';
import { PacientService } from "@/service/PacientService"
import { RecipesService } from '@/service/RecipeService';

import router from '@/router'
import html2pdf from 'html2pdf.js'
import RecipePrintComponent from './RecipePrintComponent.vue'
import { database } from "@/firebase";
import { addDoc, collection } from 'firebase/firestore/lite'

onMounted(() => {
    MedicationsService.getMedications().then((data) => (medications.value = data));
});

const pacients = ref([]);
const selectedPacient = ref({});

const pacientDialog = ref(false);
const submittedPacient = ref(false);

const showSearchPacientDialogVisible = ref(false)
const selectSearchPacient = ref()

const toast = useToast();
const dt = ref();

const medications = ref();
//const medicationDialog = ref(false);
const deleteMedicationDialog = ref(false);
const deleteMedicationsDialog = ref(false);
const medication = ref({});
const selectedMedications = ref();
const newRecipe = ref({})
const filters = ref({
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
});
//const submittedProduct = ref(false);
const printDialog = ref(false)

const askAmountDialog = ref(false)
const amount = ref(0)

const columns = ref([
    { field: 'medication', header: 'Medicamento', },
    { field: 'dosis', header: 'Dosis' }
]);
const sexoSelectOps = ref([
    { name: 'Masculino' },
    { name: 'Femenino' }
])

//ToDo: Add lazy loading
const showPacientSearchDialog = () => {
    showSearchPacientDialogVisible.value = true
    PacientService.getPacients().then((data) => pacients.value = data)
}
const clicSearchPacient = () => {
    showSearchPacientDialogVisible.value = false
    selectedPacient.value = selectSearchPacient.value;
}

//pacient begin
const showPacientDialog = () => {
    submittedPacient.value = false
    pacientDialog.value = true
};
const hidePacientDialog = () => {
    submittedPacient.value = false;
    pacientDialog.value = false;
};

const pacientFullName = computed(() => {
    if (selectedPacient.value && selectedPacient.value.nombre && selectedPacient.value.apaterno) {
        return selectedPacient.value.nombre + ' ' + selectedPacient.value.apaterno + ' ' + selectedPacient.value.amaterno
    }
    else {
        return null
    }
})
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
const pacientFnacimientoDate = computed(() => {
    if (selectedPacient.value.fnacimiento) {
        return selectedPacient.value.fnacimiento.toLocaleDateString()
    }
    else {
        return null
    }
})

const savePacient = () => {
    submittedPacient.value = true
    console.log("savePacient", selectedPacient.value.code)
    if (selectedPacient.value.nombre &&
        selectedPacient.value.apaterno &&
        selectedPacient.value.fnacimiento &&
        selectedPacient.value.sexo) {
        if (!selectedPacient.value.code) {
            selectedPacient.value.code = createCode()
            pacients.value.push(selectedPacient.value)
            PacientService.saveNewPacientToDatabase(selectedPacient.value)
        }
        else {
            pacients.value[findIndexById(pacients.value.code)] = pacients.value;
        }
        hidePacientDialog()
    }
}
//pacient end

// const medicationCaptured = computed({
//     get() {
//         return medications.value.length > 0 && medications.value[0].nombre
//     }
// })

// const hideDialog = () => {
//     medicationDialog.value = false;
//     submitted.value = false;
// };
// const saveMedication = () => {
//     submittedProduct.value = true;
//     if (medication?.value.nombre?.trim()) {
//         //medication.value.nombre = medication.value.nombre.toUpperCase()
//         if (medication.value.id) {
//             medications.value[findIndexById(medication.value.id)] = medication.value;
//             toast.add({ severity: 'success', summary: 'Successful', detail: 'Medication Updated', life: 3000 });
//         }
//         else {
//             medication.value.id = createId(medication);
//             medication.value.code = createCode();
//             medication.value.OneLine = `${medication.value.nombre}, TOMAR: ${medication.value.cantidad} CADA: ${medication.value.cada} HORAS DURANTE: ${medication.value.durante} DÍAS.VÍA DE ADMINISTRACIÓN: ${medication.value.viaAdmin}.`;
//             medications.value.push(medication.value);
//             toast.add({ severity: 'success', summary: 'Successful', detail: 'Medication Created', life: 3000 });
//         }

//         medicationDialog.value = false;
//         medication.value = {};
//     }
// };
const addMedication = (medication) => {
    //console.log('addmedication', newRecipe.value.medications)
    const index = findIndexById(medication.id)
    const newMedication = { id: createCode(), nombre: '' }
    medications.value.splice(index + 1, 0, newMedication)
}
// const editMedication = (medication) => {
//     medication.value = { ...medication };
//     medicationDialog.value = true;
// };
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
const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < medications.value.length; i++) {
        if (medications.value[i].id === id) {
            index = i;
            break;
        }
    }

    return index;
};
const createId = (object) => {
    console.log('create id', object)
    if (object.id) {
        return object.length + 1
    }
    else {
        return 1
    }
}
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

    const saleTicket = {}
    saleTicket.invoice = ''
    saleTicket.status = 'ACTIVO'
    saleTicket.date = new Date()

    // saleTicket.id = createId(saleTicket);
    saleTicket.code = createCode();

    saleTicket.amount = amount.value
    const servicio = { id: 1, name: 'Consulta Externa' }
    saleTicket.servicio = servicio // 'Consulta Externa'

    console.log("saveSaleTicket", saleTicket)
    const docRef = await addDoc(collection(database, "tickets"), saleTicket);
    console.log("New sale ticket written with ID: ", docRef.id);

}
const saveAndDownload = async () => {
    console.log("saveAndDownload", newRecipe.value);

    newRecipe.value.uid = createRecipeCode()
    const docRef = await addDoc(collection(database, "recipes"), newRecipe.value);
    console.log("New recipe written with ID: ", docRef.id);

    RecipesService.addRecipe(newRecipe)

    const fileName = "receta-" + newRecipe.value.uid + "-" + selectedPacient.value.nombre + ' ' + selectedPacient.value.apaterno + ' ' + selectedPacient.value.amaterno
    console.log('VOY A IMPRIMIR', newRecipe.value.uid)
    html2pdf(document.querySelector('#printable'), {
        margin: 5,
        filename: fileName + ".pdf",
    });
    printDialog.value = false

    saveSaleTicket()

    router.push('/')
}

const isPositiveInteger = (val) => {
    let str = String(val);

    str = str.trim();

    if (!str) {
        return false;
    }

    str = str.replace(/^0+/, '') || '0';
    var n = Math.floor(Number(str));

    return n !== Infinity && String(n) === str && n >= 0;
};
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
