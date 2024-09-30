<template>
    <Card>
        <template #title>
            <div>Paciente</div>
        </template>
        <template #content>
            <div class="card flex justify-center">
                <div class="card flex justify-center">
                    <AutoComplete v-model="selectedPacient" optionLabel="nombre" :suggestions="filteredPacients"
                        @complete="search" class="pr-2" />
                    <Button icon="pi pi-search" aria-label="Filter" @click="searchPacient" class="mr-2" />
                    <Button icon="pi pi-user-plus" aria-label="Filter" @click="newPacient" />
                </div>
            </div>
        </template>
    </Card>

    <Dialog v-model:visible="pacientDialog" header="Información del Paciente" :modal="true">
        <div class="formgrid grid">
            <div class="field col">
                <label for="nombre" class="block font-bold mb-2">Nombre</label>
                <InputText id="nombre" v-model.trim="selectedPacient.nombre" required="true" autofocus
                    :invalid="submittedPacient && !selectedPacient.nombre" fluid />
                <small v-if="submittedPacient && !selectedPacient.nombre" class="text-red-500">Nombre es
                    requerido.</small>
            </div>
            <div class="field col">
                <label for="apaterno" class="block font-bold mb-2">Apellido paterno</label>
                <InputText id="apaterno" v-model.trim="selectedPacient.apaterno" required="true" autofocus
                    :invalid="submittedPacient && !selectedPacient.apaterno" fluid />
                <small v-if="submittedPacient && !selectedPacient.apaterno" class="text-red-500">Apellido paterno es
                    requerido.</small>
            </div>
            <div class="field col">
                <label for="amaterno" class="block font-bold mb-2">Apellido materno</label>
                <InputText id="amaterno" v-model.trim="selectedPacient.amaterno" required="true" autofocus fluid />
            </div>
        </div>

        <div class="formgrid grid">
            <div class="field col">
                <div class="field col">
                    <label for="edad" class="font-bold block mb-2"> Edad </label>
                    <InputNumber v-model="selectedPacient.edad" inputId="edad" fluid />
                </div>
            </div>
            <div class="field col"></div>
            <div class="field col"></div>
        </div>

        <template #footer>
            <Button label="Cancelar" icon="pi pi-times" text @click="hidePacientDialog" />
            <Button label="Guardar" icon="pi pi-check" @click="savePacient" />
        </template>
    </Dialog>



</template>

<script setup>
import AutoComplete from 'primevue/autocomplete';
import Card from 'primevue/card';
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import Dialog from 'primevue/dialog';

import { ref, onMounted } from 'vue'
import { PacientService } from "@/service/PacientService"

onMounted(() => {
    PacientService.getPacients().then((data) => (pacients.value = data));
});

const pacients = ref([]);
const selectedPacient = ref();
const filteredPacients = ref();

const pacientDialog = ref(false);
const submittedPacient = ref(false);

const search = (event) => {
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
const searchPacient = () => {
    if (selectedPacient.value.trim().length) {
        filteredPacients.value = [...pacients.value];
    } else {
        filteredPacients.value = pacients.value.filter((pacient) => {
            return pacient.nombre.toLowerCase().startsWith(selectedPacient.value.toLowerCase());
        });
    }
}
const newPacient = () => {
    selectedPacient.value = {}
    submittedPacient.value = false
    pacientDialog.value = true
};
const hidePacientDialog = () => {
    submittedPacient.value = false;
    pacientDialog.value = false;
};
const savePacient = () => {
    submittedPacient.value = true;
    pacients.value.push(selectedPacient.value)
    hidePacientDialog()

}
</script>