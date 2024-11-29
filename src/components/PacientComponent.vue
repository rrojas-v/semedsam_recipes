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
            <div class="grid p-2">
                <div class="col">
                    Nombre:<span v-if="selectedPacient" class="text-left p-3 border-round-sm bg-primary font-bold">{{
                        pacientFullName }}</span>
                </div>
            </div>
            <div class="grid p-2">
                <div class="col">
                    Sexo:
                    <span v-if="selectedPacient.value" class="text-left p-3 border-round-sm bg-primary font-bold">{{
                        selectedPacient.value.sexo?.name }}
                    </span>
                </div>
                <div class="col">
                    Edad:<span v-if="selectedPacient" class="text-left p-3 border-round-sm bg-primary font-bold">
                        {{ pacientAge }} años</span>
                </div>
                <div class="col">
                    Nacimiento:<span v-if="selectedPacient" class="text-left p-3 border-round-sm bg-primary font-bold">
                        {{ pacientFnacimientoDate }}</span>
                </div>
            </div>
        </div>
    </Panel>

    <Dialog v-model:visible="pacientDialog" header="Información del Paciente" :modal="true">
        <div class="formgrid grid">
            <div class="field col">
                <label for="nombre" class="block font-bold mb-2">Nombre</label>
                <InputText id="nombre" v-model.trim="selectedPacient.value.nombre" required="true" autofocus
                    :invalid="!selectedPacient.value.nombre" fluid />
                <small v-if="submittedPacient && !selectedPacient.value.nombre" class="text-red-500">Capture para
                    continuar.</small>
            </div>
            <div class="field col">
                <label for="apaterno" class="block font-bold mb-2">Apellido paterno</label>
                <InputText id="apaterno" v-model.trim="selectedPacient.value.apaterno" required="true"
                    :invalid="!selectedPacient.value.apaterno" fluid />
                <small v-if="submittedPacient && !selectedPacient.value.apaterno" class="text-red-500">Capture para
                    continuar.</small>
            </div>
            <div class="field col">
                <label for="amaterno" class="block font-bold mb-2">Apellido materno</label>
                <InputText id="amaterno" v-model.trim="selectedPacient.value.amaterno" fluid />
            </div>
        </div>

        <div class="formgrid grid">
            <div class="field col">
                <div class="field col">
                    <label for="FNacimiento" class="font-bold block mb-2"> F. Nacimiento </label>
                    <DatePicker id="fnacimiento" v-model="selectedPacient.value.fnacimiento" showIcon
                        :invalid="!selectedPacient.value.fnacimiento" fluid iconDisplay="input" :maxDate="new Date()" />
                    <small v-if="submittedPacient && !selectedPacient.value.fnacimiento" class="text-red-500">Seleccione
                        una
                        fecha para continuar.</small>
                </div>
            </div>
            <div class="field col">
                <label for="sexo" class="font-bold block mb-2"> Sexo </label>
                <Select id="sexo" v-model="selectedPacient.value.sexo" :options="sexoSelectOps" optionLabel="name"
                    placeholder="Seleccione uno" class="w-full md:w-56" :invalid="!selectedPacient.value.sexo" />
                <small v-if="submittedPacient && !selectedPacient.value.sexo" class="text-red-500">Seleccione uno para
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
</template>
<script setup>
import DatePicker from 'primevue/datepicker'
import Select from 'primevue/select'
import Panel from 'primevue/panel'
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Dialog from 'primevue/dialog';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import { selectedPacient } from '@/store/store';

import { computed, onMounted, ref, watch } from 'vue';

import { PacientService } from "@/service/PacientService"

const props = defineProps(['pacient'])
console.log('pacient props', props)
selectedPacient.value = props.pacient

const pacients = ref([]);

const pacientDialog = ref(false);
const submittedPacient = ref(false);

const showSearchPacientDialogVisible = ref(false)
const selectSearchPacient = ref()

const sexoSelectOps = ref([
    { name: 'Masculino' },
    { name: 'Femenino' }
])

const createCode = () => {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}
const findPacientIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < pacients.value.length; i++) {
        if (pacients.value[i].id === id) {
            index = i;
            break;
        }
    }

    return index;
};
//ToDo: Add lazy loading
const showPacientSearchDialog = () => {
    showSearchPacientDialogVisible.value = true
    PacientService.getPacients().then((data) => pacients.value = data)
}
const clicSearchPacient = () => {
    showSearchPacientDialogVisible.value = false
    selectedPacient.value = selectSearchPacient.value
    console.log('selectedPacient', selectedPacient.value)
}

function getAge(d1) {
    let diff = (new Date()).getTime() - d1.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}
const pacientAge = computed(() => {
    if (selectedPacient.value?.fnacimiento) {
        return getAge(selectedPacient.value.fnacimiento);
    }
    else {
        return null
    }
})
// watch(selectedPacient.value.nombre, () => {
//     if (selectedPacient.value) {
//         selectedPacient.value.nombreCompleto = selectedPacient.value.nombre + " " + selectedPacient.value.apaterno + " " + selectedPacient.value.amaterno
//     }
// })
onMounted(() => {
    // selectedPacient.value = props.pacient
    console.log('pacient onmount', selectedPacient.value)
})
const pacientFnacimientoDate = computed(() => {
    if (selectedPacient?.value?.fnacimiento) {
        return selectedPacient.value.fnacimiento.toLocaleDateString()
    }
    else {
        return null
    }
})
//pacient begin
const showPacientDialog = () => {
    selectedPacient.value = {}
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

const savePacient = () => {
    submittedPacient.value = true
    console.log("savePacient", selectedPacient)
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
            pacients.value[findPacientIndexById(pacients.value.code)] = pacients.value;
        }
        hidePacientDialog()
    }
}
</script>