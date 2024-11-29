<template>
    <Card>
        <template #title>Notas Médicas</template>
        <template #content>
            <div class="mb-5">
                <PacientComponent />
            </div>

            <div class="grid">
                <div class="col-2">
                    <DataTable v-model:selection="selectedMedicalRecords" :value="medicalRecords" selectionMode="single"
                        dataKey="fecha" @rowSelect="onRowSelect" @rowUnselect="onRowUnselect">
                        <Column field="fecha" header="Notas Médicas" sortable style="max-width: 3rem"></Column>
                    </DataTable>
                </div>
                <div class="col">

                    <Card>
                        <template #title>
                            <div class="flex justify-content-between flex-wrap">
                                <Button label="Nuevo" icon="pi pi-plus" @click="createNewMedicalRecord" />
                                <Button label="Guardar" icon="pi pi-check" @click="save" :disabled="!dataValid" />
                            </div>
                            <Divider />
                        </template>
                        <template #content>
                            <Card v-if="!medicalRecord.pacient">
                                <template #title>Seleccione una nota médica</template>
                            </Card>
                            <div v-if="medicalRecord.pacient">
                                <div class="formgrid grid">
                                    <div class="field col-3">
                                        <div class="field-checkbox">
                                            <Checkbox v-model="medicalRecord.membresia" inputId="membresia"
                                                value="Si" />
                                            <label for="membresia" class="ml-2">Con Membresía</label>
                                        </div>
                                        <div class="field-checkbox">
                                            <Checkbox v-model="medicalRecord.consultaMedica" inputId="consultaMedica"
                                                value="consultaMedica" />
                                            <label for="consultaMedica" class="ml-2">Consulta Médica</label>
                                        </div>
                                    </div>

                                    <div class="field col-3">
                                        <div class="formgroup-inline">
                                            <div class="field-checkbox">
                                                <RadioButton v-model="medicalRecord.formatoCita" inputId="formatoCita1"
                                                    value="Presencial" />
                                                <label for="formatoCita1" class="ml-2">Presencial</label>
                                            </div>
                                            <div class="field-checkbox">
                                                <RadioButton v-model="medicalRecord.formatoCita" inputId="formatoCita2"
                                                    value="Remoto" />
                                                <label for="formatoCita2" class="ml-2">Remota (Zoom)</label>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="field col-3">
                                        <div class="formgroup-inline">
                                            <div class="field-checkbox">
                                                <Checkbox v-model="medicalRecord.generaCosto" inputId="generaCosto"
                                                    value="generaCosto" />
                                                <label for="generaCosto" class="ml-2">Genera Costo</label>
                                            </div>
                                            <div class="field-checkbox">
                                                <Checkbox v-model="medicalRecord.generaReceta" inputId="generaReceta"
                                                    value="generaReceta" />
                                                <label for="generaReceta" class="ml-2">Genera Receta</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="field col-3 ">
                                        <label for="comoSupo" class="ml-2">Como se enteró de nosotros</label>
                                        <Select id="comoSupo" class="w-full" v-model="medicalRecord.comoSupo"
                                            :options="comoSupoOptions" option-label="name" />
                                    </div>
                                </div>
                                <div class="formgrid grid">
                                    <div class="field col-3">
                                    </div>
                                    <div class="field col-3">
                                    </div>
                                    <div class="field col-3">
                                    </div>
                                    <div class="field col-3" v-if="medicalRecord.comoSupo?.code >= 3">
                                        <label for="comoSupo">{{ medicalRecord.comoSupo?.especificar }}</label>
                                        <InputText v-model="medicalRecord.comoSupoOtro"
                                            :disabled="!medicalRecord.comoSupo?.especificar" />
                                    </div>
                                </div>

                                <div class="formgrid grid">
                                    <div class="field col-12">
                                        <label for="seguimiento">Seguimiento / Evolución</label>
                                        <Textarea id="seguimiento" type="text" rows="4"
                                            v-model="medicalRecord.seguimiento"
                                            class="text-base text-color surface-overlay p-2 outline-none focus:border-primary w-full"></Textarea>
                                    </div>
                                    <div class="field col-12">
                                        <label for="plan">Plan</label>
                                        <Textarea id="plan" type="text" rows="4" v-model="medicalRecord.plan"
                                            class="text-base text-color surface-overlay p-2 outline-none focus:border-primary w-full"></Textarea>
                                    </div>
                                    <div class="field col-12">
                                        <label for="proximaCita">Próxima Cita</label>
                                        <Textarea id="proximaCita" type="text" rows="4"
                                            v-model="medicalRecord.proximaCita"
                                            class="text-base text-color surface-overlay p-2 outline-none focus:border-primary w-full"></Textarea>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </Card>

                </div>
            </div>

        </template>
        <template #footer>
            <!-- <div class="flex justify-content-end flex-wrap">
                <Button label="Guardar" icon="pi pi-check" @click="save" :disabled="!medicalRecord" />
            </div> -->
        </template>
    </Card>

</template>

<script setup>
import InputText from 'primevue/inputtext';
import Card from 'primevue/card';
import Textarea from 'primevue/textarea';
import Checkbox from 'primevue/checkbox';
import RadioButton from 'primevue/radiobutton';
import Select from 'primevue/select';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Divider from 'primevue/divider';


import PacientComponent from './PacientComponent.vue';
import { computed, ref, watch } from 'vue';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore/lite';
import { database } from '@/firebase';
import { selectedPacient } from '@/store/store';
import { MedicalRecordsService } from '@/service/MedicalRecordsService';

const medicalRecords = ref([])
const selectedMedicalRecords = ref([])
const medicalRecord = ref({})

const comoSupoOptions = ref([
    { name: 'Recomendación de amigos o familiares', especificar: 'Otro', code: 1 },
    { name: 'Correo electrónico', especificar: 'Especificar', code: 2 },
    { name: 'Búsqueda en Google u otros buscadores', especificar: 'Especificar', code: 3 },
    { name: 'Redes sociales ', especificar: 'Facebook, Instagram, Twitter, etc.', code: 4 },
    { name: 'Publicidad en internet', especificar: 'Banners, Google Ads, etc.', code: 5 },
    { name: 'Eventos o ferias', especificar: 'Nombre del evento si aplica', code: 6 },
    { name: 'Periódico o revista (especificar cuál si aplica)', especificar: 'Especificar', code: 7 },
    { name: 'Radio o televisión (especificar canal o estación)', especificar: 'Especificar', code: 8 },
    { name: 'Directorio online', especificar: 'Yelp, Directorio Empresarial Merida, etc.', code: 9 },
    { name: 'Otro', especificar: 'Especificar', code: 10 }
])
watch(selectedPacient, () => {
    console.log('watch')
    medicalRecord.value = {}
    if (selectedPacient.value) {
        MedicalRecordsService
            .getMedicalRecords(selectedPacient.value.code)
            .then((data) => medicalRecords.value = data)
    }
})
const createCode = () => {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}
const createNewMedicalRecord = () => {
    medicalRecord.value = {}
    medicalRecord.value.pacient = selectedPacient.value
}
const dataValid = computed(() => {
    const valid1 = medicalRecord.value.membresia?.length || medicalRecord.value.consultaMedica?.length
    const valid3 = (medicalRecord.value.generaCosto || medicalRecord.value.generaReceta)
    return selectedPacient && valid1 && medicalRecord.value.formatoCita && valid3 && medicalRecord.value.comoSupo
})
const save = async () => {
    console.log(medicalRecord.value)

    delete medicalRecord.value.comoSupo.especificar
    medicalRecord.value.fecha = new Date()
    medicalRecord.value.pacient = selectedPacient.value
    await setDoc(doc(database, "medicalRecords", createCode()), medicalRecord.value)
    medicalRecord.value = {}

    MedicalRecordsService
        .getMedicalRecords(selectedPacient.value.code)
        .then((data) => medicalRecords.value = data)
}

// search medrec by code pacient
// const Ref = collection(database, "medicalRecords");
//     const q = query(Ref, where("pacient.code", "==", "Yg8bW"));

//     const querySnapshot = await getDocs(q);
//     querySnapshot.forEach((doc) => {
//         console.log(doc.id, " => ", doc.data());
//     });

const onRowSelect = (event) => {
    console.log(event.data);
    medicalRecord.value = event.data
};
const onRowUnselect = (event) => {
    console.log(event.data);
    medicalRecord.value = {}
}
</script>