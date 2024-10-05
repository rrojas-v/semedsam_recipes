<template>
    <Panel>
        <template #header>
            <div class="flex items-center gap-2">
                <span class="font-bold">Paciente</span>
            </div>
        </template>
        <template #icons>
            <Button icon="pi pi-user-plus" @click="showPacientDialog" severity="contrast" text rounded aria-label=""
                size="large" />
            <Button icon="pi pi-search" @click="showSearchPacientDialogVisible = true" class="mr-2" severity="contrast"
                text rounded aria-label="" size="large" />
        </template>

        <div class="m-0">
            <div class="grid">
                <div class="col">
                    Nombre:<span v-if="selectedPacient" class="text-left p-3 border-round-sm bg-primary font-bold">{{
                        pacientfullName }}</span>
                </div>

            </div>
            <div class="grid">
                <div class="col">
                    Sexo:<span v-if="selectedPacient" class="text-left p-3 border-round-sm bg-primary font-bold">{{
                        selectedPacient.sexo.name }}</span>
                </div>
                <div class="col">
                    Edad:<span v-if="selectedPacient" class="text-left p-3 border-round-sm bg-primary font-bold">{{
                        pacientAge }} años</span>
                </div>
                <div class="col">
                    Fecha de nacimiento:<span v-if="selectedPacient"
                        class="text-left p-3 border-round-sm bg-primary font-bold">{{
    pacientFechaNacimiento }}</span>
                </div>
            </div>
        </div>

        <!-- <template #content>
            {{ selectedPacient }}
            <div class="card flex justify-center">
                <div class="card flex justify-center">
                    -->

        <!-- <h4></h4> -->
        <!-- <AutoComplete v-model="newPacient" optionLabel="nombre" :suggestions="filteredPacients"
                        @complete="searchByKeyPacient" class="pr-2" /> -->
        <!-- </div>
            </div>
        </template> -->
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
            <template #header>
                <!-- <Toolbar>
                    <template #start>
                        <Button label="Agregar" icon="pi pi-plus" class="mr-2" @click="openNew" severity="contrast" text
                            rounded aria-label="" />
                        <Button label="Borrar" icon="pi pi-trash" severity="danger" outlined
                            @click="confirmDeleteSelected"
                            :disabled="!selectedMedications || !selectedMedications.length" text rounded
                            aria-label="" />
                    </template>
        <template #end>
                                    <Button label="Guardar Receta" icon="pi pi-check" severity="contrast" @click="saveRecipe" text
                                        rounded aria-label="" />
                                </template>
        </Toolbar> -->
            </template>

            <!--<Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
            <Column field="id" header="id" sortable style="min-width: 12rem"></Column>
            <Column field="OneLine" header="" sortable style="min-width: 16rem"></Column>
            -->
            <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header" style="width: 90%">
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
                    <Button icon="pi pi-pencil" size="small" outlined rounded @click="editMedication(slotProps.data)" />
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
                <Button label="Guardar Receta" icon="pi pi-check" severity="contrast" @click="saveRecipe" text rounded
                    aria-label="" :disabled="!selectedPacient" />
            </template>
        </Toolbar>
    </div>

    <Dialog v-model:visible="medicationDialog" :style="{ width: '50%' }" header="Detalle del medicamento" :modal="true">
        <div class="formgrid grid">
            <div class="field col">
                <label for="nombre" class="block font-bold mb-3">Medicamento y presentación</label>
                <InputText id="nombre" v-model.trim="medication.nombre" required="true" autofocus
                    :invalid="submitted && !medication.nombre" fluid />
                <small v-if="submitted && !medication.nombre" class="text-red-500">Nombre es requerido.</small>
            </div>
        </div>
        <!-- <div class="formgrid grid">
            <div class="field col">
                <label for="cantidad" class="font-bold block mb-2">Cantidad</label>
                <AutoComplete v-model="medication.cantidad" :suggestions="itemsCantidad" dropdown
                    @complete="searchCantidad" />
            </div>
            <div class="field col">
                <label for="Cada" class="font-bold block mb-2"> Cada </label>
                <InputNumber v-model="medication.cada" inputId="cada" suffix=" horas" fluid />
            </div>
            <div class="field col">
                <label for="durante" class="font-bold block mb-2"> Durante </label>
                <InputNumber v-model="medication.durante" inputId="durante" suffix=" días" fluid />
            </div>
        </div>
        <div class="formgrid grid">
            <div class="field col">
                <label for="viaAdmin" class="block font-bold mb-3">Vía de admnistración</label>
                <InputText id="viaAdmin" v-model="medication.viaAdmin" required="true" fluid />
            </div>
        </div> -->

        <template #footer>
            <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog" />
            <Button label="Guardar" icon="pi pi-check" @click="saveMedication" />
        </template>
    </Dialog>

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
                <InputText id="nombre" v-model.trim="newPacient.nombre" required="true" autofocus
                    :invalid="newPacient && !newPacient.nombre" fluid />
                <small v-if="newPacient && !newPacient.nombre" class="text-red-500">Capture para
                    continuar.</small>
            </div>
            <div class="field col">
                <label for="apaterno" class="block font-bold mb-2">Apellido paterno</label>
                <InputText id="apaterno" v-model.trim="newPacient.apaterno" required="true" autofocus
                    :invalid="newPacient && !newPacient.apaterno" fluid />
                <small v-if="newPacient && !newPacient.apaterno" class="text-red-500">Capture para
                    continuar.</small>
            </div>
            <div class="field col">
                <label for="amaterno" class="block font-bold mb-2">Apellido materno</label>
                <InputText id="amaterno" v-model.trim="newPacient.amaterno" required="true" autofocus fluid />
            </div>
        </div>

        <div class="formgrid grid">
            <div class="field col">
                <div class="field col">
                    <label for="FNacimiento" class="font-bold block mb-2"> F. Nacimiento </label>
                    <DatePicker id="fnacimiento" v-model="newPacient.fnacimiento" showIcon
                        :invalid="newPacient && !newPacient.fnacimiento" fluid iconDisplay="input"
                        :maxDate="new Date()" />
                    <small v-if="newPacient && !newPacient.fnacimiento" class="text-red-500">Seleccione una
                        fecha para continuar.</small>
                </div>
            </div>
            <div class="field col">
                <label for="sexo" class="font-bold block mb-2"> Sexo </label>
                <Select id="sexo" v-model="newPacient.sexo" :options="sexoSelectOps" optionLabel="name"
                    placeholder="Seleccione uno" class="w-full md:w-56"
                    :invalid="newPacient && !newPacient.fnacimiento" />
                <small v-if="newPacient && !newPacient.sexo" class="text-red-500">Seleccione uno para
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
        <DataTable v-model:selection="selectSearchPacient" :value="pacients" data-key="id" scrollable
            scrollHeight="flex" tableStyle="min-width: 50rem">
            <Column selectionMode="single" headerStyle="width: 3rem"></Column>
            <Column field="nombre" header="Nombres"></Column>
            <Column field="apaterno" header="Apellido paterno"></Column>
            <Column field="amaterno" header="Apellido materno"></Column>
            <!-- <Column field="fnacimiento" header="Fecha nacimiento" ></Column> -->
        </DataTable>
        <template #footer>
            <Button label="Ok" icon="pi pi-check" @click="clicSearchPacient" />
        </template>
    </Dialog>


</template>

<script setup>

import Button from 'primevue/button'
import Toolbar from 'primevue/toolbar'
import InputText from 'primevue/inputtext'

import DatePicker from 'primevue/datepicker'
import Select from 'primevue/select'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'
import Panel from 'primevue/panel'

import { ref, onMounted, computed } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';

import { MedicationsService } from '@/service/MedicationsService';
import { PacientService } from "@/service/PacientService"
import { RecipesService } from '@/service/RecipeService';

import router from '@/router'
import html2pdf from 'html2pdf.js'

import { database } from "@/firebase.js";
import { addDoc, collection } from 'firebase/firestore/lite'

onMounted(() => {
    PacientService.getPacients().then((data) => (pacients.value = data));
    MedicationsService.getMedications().then((data) => (medications.value = data));
});

const pacients = ref([]);
const selectedPacient = ref();
const newPacient = ref();
const filteredPacients = ref();
const pacientDialog = ref(false);
const submittedPacient = ref(false);

const showSearchPacientDialogVisible = ref(false)
const selectSearchPacient = ref()

const toast = useToast();
const dt = ref();

const medications = ref();
const medicationDialog = ref(false);
const deleteMedicationDialog = ref(false);
const deleteMedicationsDialog = ref(false);
const medication = ref({});
const selectedMedications = ref();
const filters = ref({
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const submitted = ref(false);

// const dosisCantidad = ['Tabletas', 'Gotas']
// const itemsCantidad = ref([])
// const searchCantidad = (event) => {
//     itemsCantidad.value = dosisCantidad.map((item) => event.query + ' ' + item);
// };

const columns = ref([
    // { field: 'id', header: 'ID', style: 'width: 10px;' },
    { field: 'nombre', header: 'Medicamento', },
    // { field: 'cantidad', header: 'Cantidad', },
    // { field: 'cada', header: 'Cada', },
    // { field: 'durante', header: 'Durante', },
    // { field: 'viaAdmin', header: 'Via', },
]);
const sexoSelectOps = ref([
    { name: 'Masculino' },
    { name: 'Femenino' }
])

const clicSearchPacient = () => {
    console.log('clicSearchPacient', selectSearchPacient.value)
    showSearchPacientDialogVisible.value = false

    selectedPacient.value = selectSearchPacient.value;
}

//pacient begin
const searchByKeyPacient = (event) => {
    setTimeout(() => {
        if (!event.query.trim().length) {
            filteredPacients.value = [...pacients.value];
        } else
        //if (event.query.trim().length > 3) 
        {
            filteredPacients.value = pacients.value.filter((pacient) => {
                return pacient.nombre.toLowerCase().startsWith(event.query.toLowerCase());
            });
        }
    }, 250);
}
const searchByButtonPacient = () => {
    if (selectedPacient.value.trim().length) {
        filteredPacients.value = [...pacients.value];
    } else {
        filteredPacients.value = pacients.value.filter((pacient) => {
            return pacient.nombre.toLowerCase().startsWith(selectedPacient.value.toLowerCase());
        });
    }
}
const showPacientDialog = () => {
    newPacient.value = {}
    submittedPacient.value = false
    pacientDialog.value = true
};
const hidePacientDialog = () => {
    submittedPacient.value = false;
    pacientDialog.value = false;
};
const savePacient = () => {
    if (newPacient.value.nombre && newPacient.value.apaterno && newPacient.value.fnacimiento && newPacient.value.sexo) {
        submittedPacient.value = true
        selectedPacient.value = {}
        selectedPacient.value.id = createCode()
        selectedPacient.value.nombre = newPacient.value.nombre
        selectedPacient.value.apaterno = newPacient.value.apaterno
        selectedPacient.value.amaterno = newPacient.value.amaterno
        selectedPacient.value.fnacimiento = newPacient.value.fnacimiento
        selectedPacient.value.sexo = newPacient.value.sexo
        pacients.value.push(selectedPacient.value)
        hidePacientDialog()
    }
}
const pacientfullName = computed({
    get() {
        return selectedPacient.value.nombre + ' ' + selectedPacient.value.apaterno + ' ' + selectedPacient.value.amaterno
    },
})
const pacientAge = computed({
    get() {
        var ageDifMs = Date.now() - selectedPacient.value.fnacimiento.getTime();
        var ageDate = new Date(ageDifMs); // miliseconds from epoch
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }
})
const pacientFechaNacimiento = computed({
    get() {
        let d = new Date(selectedPacient.value.fnacimiento),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [day, month, year].join(' / ');
    }
})
//pacient end

const medicationCaptured = computed({
    get() {
        return medications.value.length > 0 && medications.value[0].nombre
    }
})

const hideDialog = () => {
    medicationDialog.value = false;
    submitted.value = false;
};
const saveMedication = () => {
    submitted.value = true;
    if (medication?.value.nombre?.trim()) {
        if (medication.value.id) {
            medications.value[findIndexById(medication.value.id)] = medication.value;
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Medication Updated', life: 3000 });
        }
        else {
            medication.value.id = createId();
            medication.value.code = createCode();
            medication.value.OneLine = `${medication.value.nombre}, TOMAR: ${medication.value.cantidad} CADA: ${medication.value.cada} HORAS DURANTE: ${medication.value.durante} DÍAS.VÍA DE ADMINISTRACIÓN: ${medication.value.viaAdmin}.`;
            medications.value.push(medication.value);
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Medication Created', life: 3000 });
        }

        medicationDialog.value = false;
        medication.value = {};
    }
};
const addMedication = (medication) => {
    console.log(medications.value)
    const index = findIndexById(medication.id)
    console.log(index);
    const newMedication = { id: createId(), nombre: '' }
    medications.value.splice(index + 1, 0, newMedication)
}
const editMedication = (medic) => {
    medication.value = { ...medic };
    medicationDialog.value = true;
};
const confirmDeleteMedication = (medic) => {
    medication.value = medic;
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
const createId = () => {
    return medications.value.length + 1;
}
const createCode = () => {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
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

const saveRecipeToDatabase = async (newRecipe) => {
    try {
        const docRef = await addDoc(collection(database, "recipes"), newRecipe);
        console.log("New recipe written with ID: ", docRef.id);
        return docRef.id
    } catch (e) {
        console.error("Error adding recipe: ", e);
    }
}

const saveRecipe = () => {
    if (!medicationCaptured.value) {
        console.log('error falta medicamento')
    }
    else {

        let newRecipe = {}
        newRecipe.fecha = new Date()
        newRecipe.pacient = selectedPacient.value
        newRecipe.medications = medications.value.map(medication => medication)
        RecipesService.addRecipe(newRecipe)
        saveRecipeToDatabase(newRecipe)
        exportToPDF()
    }
    console.log('saveRecipe', RecipesService.recipies)
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
        case 'quantity':
        case 'price':
            if (isPositiveInteger(newValue)) data[field] = newValue;
            else event.preventDefault();
            break;

        default:
            if (newValue.trim().length > 0) data[field] = newValue;
            else event.preventDefault();
            break;
    }
};

</script>
