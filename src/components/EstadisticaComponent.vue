<template>
    <DataTable :value="dias" tableStyle="min-width: 50rem" showGridlines>
        <template #header>
            <div class="flex flex-wrap items-center justify-between gap-2">
                <span class="text-xl font-bold">Estadisticas</span>
            </div>
        </template>
        <Column field="dia" header="DIA" style="width: 5%"></Column>
        <Column field="cext" style="width: 20%">
            <template #header>
                <div class="grid">
                    <div class="col-12">
                        <div class="text-center font-bold">CONSULTA EXTERNA</div>
                    </div>
                    <div class="col-6">
                        <div class="text-center">PSQ</div>
                    </div>
                    <div class="col-6">
                        <div class="text-center">PSC</div>
                    </div>
                    <div class="col-3">
                        <div class="text-center text-xs">1ra</div>
                    </div>
                    <div class="col-3">
                        <div class="text-center text-xs">Sub</div>
                    </div>
                    <div class="col-3">
                        <div class="text-center text-xs">1ra</div>
                    </div>
                    <div class="col-3">
                        <div class="text-center text-xs">Sub</div>
                    </div>
                </div>
            </template>
            <template #body="slotProps">
                <div class="grid">
                    <div class="col-3">
                        <div class="text-center"> {{ slotProps.data.cePsq1ra }}</div>
                    </div>
                    <div class="col-3">
                        <div class="text-center ">{{ slotProps.data.cePsq1ra }}</div>
                    </div>
                    <div class="col-3">
                        <div class="text-center ">{{ slotProps.data.cePsq1ra }}</div>
                    </div>
                    <div class="col-3">
                        <div class="text-center ">{{ slotProps.data.cePsq1ra }}</div>
                    </div>
                </div>
            </template>
        </Column>
        <Column field="inter" style="width: 20%">
            <template #header>
                <div class="grid">
                    <div class="col-12">
                        <div class="text-center font-bold">INTERNAMIENTOS</div>
                    </div>
                    <div class="col-4">
                        <div class="text-center">1a vez</div>
                    </div>
                    <div class="col-4">
                        <div class="text-right">Subsecuente</div>
                    </div>
                    <div class="col-4">
                        <div class="text-left"></div>
                    </div>

                    <div class="col-4">
                        <div class="text-center text-xs"></div>
                    </div>
                    <div class="col-4">
                        <div class="text-center text-xs">menos 30 </div>
                    </div>
                    <div class="col-4">
                        <div class="text-center text-xs">mas de 30</div>
                    </div>
                </div>
            </template>
            <template #body="slotProps">
                <div class="grid">
                    <div class="col-4">
                        <div class="text-center ">{{ slotProps.data.interna1ra }}</div>
                    </div>
                    <div class="col-4">
                        <div class="text-center ">{{ slotProps.data.internaSubMenor }}</div>
                    </div>
                    <div class="col-4">
                        <div class="text-center ">{{ slotProps.data.internaSubMayor }}</div>
                    </div>
                </div>
            </template>
        </Column>
        <Column field="altas" style="width: 10%">
            <template #header>
                <div class="grid">
                    <div class="col-12">
                        <div class="text-center font-bold">ALTAS</div>
                    </div>
                    <div class="col-6">
                        <div class="text-center text-xs ">Mejoría Clínica</div>
                    </div>
                    <div class="col-6">
                        <div class="text-center text-xs ">Alta Voluntaria</div>
                    </div>
                </div>
            </template>
            <template #body="slotProps">
                <div class="grid">
                    <div class="col-6">
                        <div class="text-center ">{{ slotProps.data.cePsq1ra }}</div>
                    </div>
                    <div class="col-6">
                        <div class="text-center ">{{ slotProps.data.cePsq1ra }}</div>
                    </div>
                </div>
            </template>
        </Column>
        <Column field="largaestancia" style="width: 15%">
            <template #header>
                <div class="grid">
                    <div class="col-12">
                        <div class="text-center font-bold">LARGA ESTANCIA</div>
                    </div>
                    <div class="col-6">
                        <div class="text-center text-xs ">Ingresan Directo</div>
                    </div>
                    <div class="col-6">
                        <div class="text-center text-xs ">Prev. Estab.</div>
                    </div>
                </div>
            </template>
            <template #body="slotProps">
                <div class="grid">
                    <div class="col-6">
                        <div class="text-center ">{{ slotProps.data.cePsq1ra }}</div>
                    </div>
                    <div class="col-6">
                        <div class="text-center ">{{ slotProps.data.cePsq1ra }}</div>
                    </div>
                </div>
            </template>
        </Column>
        <Column field="clinicaAdicciones" style="width: 10%">
            <template #header>
                <div class="grid">
                    <div class="col-12">
                        <div class="text-center font-bold">CLINICA ADICCIONES</div>
                    </div>
                    <div class="col-6">
                        <div class="text-center text-xs ">Ingresan Directo</div>
                    </div>
                    <div class="col-6">
                        <div class="text-center text-xs ">Prev. Estab.</div>
                    </div>
                </div>
            </template>
            <template #body="slotProps">
                <div class="grid">
                    <div class="col-6">
                        <div class="text-center ">{{ slotProps.data.cePsq1ra }}</div>
                    </div>
                    <div class="col-6">
                        <div class="text-center ">{{ slotProps.data.cePsq1ra }}</div>
                    </div>
                </div>
            </template>
        </Column>
        <Column field="traslados" style="width: 5%">
            <template #header>
                <div class="grid">
                    <div class="col-12">
                        <div class="text-center font-bold">TRASLADOS</div>
                    </div>
                    <div class="col-6">
                        <div class="text-center text-xs ">Local</div>
                    </div>
                    <div class="col-6">
                        <div class="text-center text-xs ">Foraneo</div>
                    </div>
                </div>
            </template>
            <template #body="slotProps">
                <div class="grid">
                    <div class="col-6">
                        <div class="text-center ">{{ slotProps.data.cePsq1ra }}</div>
                    </div>
                    <div class="col-6">
                        <div class="text-center ">{{ slotProps.data.cePsq1ra }}</div>
                    </div>
                </div>
            </template>
        </Column>
        <Column field="actipulse" style="width: 10%">
            <template #header>
                <div class="grid">
                    <div class="col-12">
                        <div class="text-center font-bold">ACTIPULSE</div>
                    </div>
                    <div class="col-4">
                        <div class="text-center ">7</div>
                    </div>
                    <div class="col-4">
                        <div class="text-center ">14</div>
                    </div>
                    <div class="col-4">
                        <div class="text-center ">21</div>
                    </div>
                </div>
            </template>
            <template #body="slotProps">
                <div class="grid">
                    <div class="col-4">
                        <div class="text-center ">{{ slotProps.data.cePsq1ra }}</div>
                    </div>
                    <div class="col-4">
                        <div class="text-center ">{{ slotProps.data.cePsq1ra }}</div>
                    </div>
                    <div class="col-4">
                        <div class="text-center ">{{ slotProps.data.cePsq1ra }}</div>
                    </div>
                </div>
            </template>
        </Column>

        <Column :exportable="false" style="width: 5%">
            <template #body="slotProps">
                <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="edit(slotProps.data)" />
            </template>
        </Column>
        <template #footer> Pacientes que concluyeron 12 sesiones C.A. ____ {{ pacientesConcluyeron }} # Pacientes
            que NO concluyeron 12 sesiones C.A. {{ pacientesNoConcluyeron }}____
        </template>
    </DataTable>

    <Dialog v-model:visible="diaDialog" :style="{ width: '750px' }" header="Estadisticas del día" :modal="true">
        <div class="card">
            <Tabs v-model:value="selectedTab" scrollable>
                <TabList>
                    <Tab value="0" class="text-base">Consulta Externa</Tab>
                    <Tab value="1" class="text-base">Internamientos</Tab>
                    <Tab value="2" class="text-base">Altas</Tab>
                    <Tab value="3" class="text-base">Larga Estancia</Tab>
                    <Tab value="4" class="text-base">Clínica Adicciones</Tab>
                    <Tab value="5" class="text-base">Traslados</Tab>
                    <Tab value="6" class="text-base">Actipulse</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel value="0"> <!-- Consulta Externa -->
                        <div class="formgrid grid">
                            <div class="field col-12 md:col-4 block">Psiquíatra</div>
                            <Divider layout="vertical" />
                            <div class="field col-12 md:col-6 block">Psicología</div>
                            <div class="field col-12 md:col-2">
                                <label for="csPsq1ra" class="block">1ra. vez</label>
                                <InputNumber id="csPsq1ra" v-model.trim="dia.csPsq1ra" required="true" autofocus
                                    :invalid="submitted && !dia.csPsq1ra" fluid />
                                <small v-if="submitted && !dia.csPsq1ra" class="text-red-500">Obligatorio.</small>
                            </div>
                            <div class="field col-12 md:col-2">
                                <label for="csPsqSub" class="block">Subsecuentes</label>
                                <InputNumber id="csPsqSub" v-model.trim="dia.csPsqSub" required="true" autofocus
                                    :invalid="submitted && !dia.csPsqSub" fluid />
                                <small v-if="submitted && !dia.csPsqSub" class="text-red-500">
                                    Obligatorio.
                                </small>
                            </div>
                            <Divider layout="vertical" />
                            <div class="field col-12 md:col-2">
                                <label for="csPsc1ra" class="block">1ra. vez</label>
                                <InputNumber id="csPsc1ra" v-model.trim="dia.csPsc1ra" required="true" autofocus
                                    :invalid="submitted && !dia.csPsc1ra" fluid />
                                <small v-if="submitted && !dia.csPsc1ra" class="text-red-500">
                                    Obligatorio.
                                </small>
                            </div>
                            <div class="field col-12 md:col-2">
                                <label for="csPscSub" class="block">Subsecuentes</label>
                                <InputNumber id="csPscSub" v-model.trim="dia.csPscSub" required="true" autofocus
                                    :invalid="submitted && !dia.csPscSub" fluid />
                                <small v-if="submitted && !dia.csPscSub" class="text-red-500">
                                    Obligatorio.
                                </small>
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel value="1"> <!-- Internamientos -->
                        <div class="formgrid grid">
                            <div class="field col-12 md:col-2 block"></div>
                            <Divider layout="vertical" />
                            <div class="field col-12 md:col-8 block">Subsecuentes</div>
                            <div class="field col-12 md:col-2">
                                <label for="interna1ra" class="block">1ra. vez</label>
                                <InputNumber id="interna1ra" v-model.trim="dia.interna1ra" required="true" autofocus
                                    :invalid="submitted && !dia.interna1ra" fluid />
                                <small v-if="submitted && !dia.interna1ra" class="text-red-500">Obligatorio.</small>
                            </div>
                            <Divider layout="vertical" />
                            <div class="field col-12 md:col-3">
                                <label for="internaSubMenor" class="block">menor a 30 Días</label>
                                <InputNumber id="internaSubMenor" v-model.trim="dia.internaSubMenor" required="true"
                                    autofocus :invalid="submitted && !dia.internaSubMenor" fluid />
                                <small v-if="submitted && !dia.internaSubMenor" class="text-red-500">
                                    Obligatorio.
                                </small>
                            </div>
                            <div class="field col-12 md:col-3">
                                <label for="internaSubMayor" class="block">mayor a 30 días</label>
                                <InputNumber id="internaSubMayor" v-model.trim="dia.internaSubMayor" required="true"
                                    autofocus :invalid="submitted && !dia.internaSubMayor" fluid />
                                <small v-if="submitted && !dia.internaSubMayor" class="text-red-500">
                                    Obligatorio.
                                </small>
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel value="2"> <!-- Altas -->
                        <div class="formgrid grid">
                            <div class="field col-12 md:col-3">
                                <label for="altaMejoria" class="block">Mejoría Clínica</label>
                                <InputNumber id="altaMejoria" v-model.trim="dia.altaMejoria" required="true" autofocus
                                    :invalid="submitted && !dia.altaMejoria" fluid />
                                <small v-if="submitted && !dia.altaMejoria" class="text-red-500">Obligatorio.</small>
                            </div>
                            <div class="field col-12 md:col-3">
                                <label for="altaVoluntaria" class="block">Alta Voluntaria</label>
                                <InputNumber id="altaVoluntaria" v-model.trim="dia.altaVoluntaria" required="true"
                                    autofocus :invalid="submitted && !dia.altaVoluntaria" fluid />
                                <small v-if="submitted && !dia.altaVoluntaria" class="text-red-500">
                                    Obligatorio.
                                </small>
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel value="3"> <!-- Larga Estancia -->
                        <div class="formgrid grid">
                            <div class="field col-12 md:col-3">
                                <label for="estanciaIngresoDirecto" class="block">Ingresan Directos</label>
                                <InputNumber id="estanciaIngresoDirecto" v-model.trim="dia.estanciaIngresoDirecto"
                                    required="true" autofocus :invalid="submitted && !dia.estanciaIngresoDirecto"
                                    fluid />
                                <small v-if="submitted && !dia.estanciaIngresoDirecto"
                                    class="text-red-500">Obligatorio.</small>
                            </div>
                            <div class="field col-12 md:col-4">
                                <label for="estanciaEstablizaPrev" class="block">Estabilizados Previamente</label>
                                <InputNumber id="estanciaEstablizaPrev" v-model.trim="dia.estanciaEstablizaPrev"
                                    required="true" autofocus :invalid="submitted && !dia.estanciaEstablizaPrev"
                                    fluid />
                                <small v-if="submitted && !dia.estanciaEstablizaPrev" class="text-red-500">
                                    Obligatorio.
                                </small>
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel value="4"> <!-- clinica adicciones -->
                        <div class="formgrid grid">
                            <div class="field col-12 md:col-3">
                                <label for="adiccionesIngresoDirecto" class="block">Ingresan Directos</label>
                                <InputNumber id="adiccionesIngresoDirecto" v-model.trim="dia.adiccionesIngresoDirecto"
                                    required="true" autofocus :invalid="submitted && !dia.adiccionesIngresoDirecto"
                                    fluid />
                                <small v-if="submitted && !dia.adiccionesIngresoDirecto"
                                    class="text-red-500">Obligatorio.</small>
                            </div>
                            <div class="field col-12 md:col-4">
                                <label for="adiccionesEstablizaPrev" class="block">Estabilizados Previamente</label>
                                <InputNumber id="adiccionesEstablizaPrev" v-model.trim="dia.adiccionesEstablizaPrev"
                                    required="true" autofocus :invalid="submitted && !dia.adiccionesEstablizaPrev"
                                    fluid />
                                <small v-if="submitted && !dia.adiccionesEstablizaPrev" class="text-red-500">
                                    Obligatorio.
                                </small>
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel value="5"> <!-- Traslados -->
                        <div class="formgrid grid">
                            <div class="field col-12 md:col-2">
                                <label for="trasladoLocal" class="block">Local</label>
                                <InputNumber id="csPsq1ra" v-model.trim="dia.csPsq1ra" required="true" autofocus
                                    :invalid="submitted && !dia.csPsq1ra" fluid />
                                <small v-if="submitted && !dia.csPsq1ra" class="text-red-500">Obligatorio.</small>
                            </div>
                            <div class="field col-12 md:col-3">
                                <label for="csPsqSub" class="block">Foraneo</label>
                                <InputNumber id="csPsqSub" v-model.trim="dia.csPsqSub" required="true" autofocus
                                    :invalid="submitted && !dia.csPsqSub" fluid />
                                <small v-if="submitted && !dia.csPsqSub" class="text-red-500">
                                    Obligatorio.
                                </small>
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel value="6"> <!-- Actipulse -->
                        <div class="formgrid grid">
                            <div class="field col-12 md:col-2">
                                <label for="csPsq1ra" class="block">Actipulse 7</label>
                                <InputNumber id="csPsq1ra" v-model.trim="dia.csPsq1ra" required="true" autofocus
                                    :invalid="submitted && !dia.csPsq1ra" fluid />
                                <small v-if="submitted && !dia.csPsq1ra" class="text-red-500">Obligatorio.</small>
                            </div>
                            <div class="field col-12 md:col-2">
                                <label for="csPsqSub" class="block">Actipulse 14</label>
                                <InputNumber id="csPsqSub" v-model.trim="dia.csPsqSub" required="true" autofocus
                                    :invalid="submitted && !dia.csPsqSub" fluid />
                                <small v-if="submitted && !dia.csPsqSub" class="text-red-500">
                                    Obligatorio.
                                </small>
                            </div>
                            <div class="field col-12 md:col-2">
                                <label for="csPsqSub" class="block">Actipulse 21</label>
                                <InputNumber id="csPsqSub" v-model.trim="dia.csPsqSub" required="true" autofocus
                                    :invalid="submitted && !dia.csPsqSub" fluid />
                                <small v-if="submitted && !dia.csPsqSub" class="text-red-500">
                                    Obligatorio.
                                </small>
                            </div>
                        </div>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </div>

        <template #footer>
            <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog" />
            <Button label="Guardar" icon="pi pi-check" @click="saveDia" />
        </template>
    </Dialog>

</template>

<script setup>

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import Tag from 'primevue/tag';
import Rating from 'primevue/rating';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';

import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import Divider from 'primevue/divider';

import { ref, onMounted } from 'vue';

const selectedTab = ref('0');

const dias = ref();
const diaDialog = ref(false);
const submitted = ref(false);
const dia = ref({});
const pacientesConcluyeron = ref(0);
const pacientesNoConcluyeron = ref(0);

onMounted(() => {
    dias.value = [{
        dia: '1',
        cePsq1ra: createCode(),
        cePsqSec: createCode(),
        cePsc1ra: createCode(),
        cePscSub: createCode(),
        interna1ra: createCode(),
        internaSubMenor: createCode(),
        internaSubMayor: createCode(),
    },
    {
        dia: '2',
        cePsq1ra: createCode(),
        cePsqSec: createCode(),
        cePsc1ra: createCode(),
        cePscSub: createCode(),
        interna1ra: createCode(),
        internaSubMenor: createCode(),
        internaSubMayor: createCode(),
    },
    {
        dia: '3',
        cePsq1ra: createCode(),
        cePsqSec: createCode(),
        cePsc1ra: createCode(),
        cePscSub: createCode(),
        interna1ra: createCode(),
        internaSubMenor: createCode(),
        internaSubMayor: createCode(),

    },
    {
        dia: '4',
        cePsq1ra: createCode(),
        cePsqSec: createCode(),
        cePsc1ra: createCode(),
        cePscSub: createCode(),
        interna1ra: createCode(),
        internaSubMenor: createCode(),
        internaSubMayor: createCode(),

    }]
});


const createCode = () => {
    let id = '';
    var chars = '0123456789';
    for (var i = 0; i < 3; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}

const edit = (data) => {
    dia.value = { ...data };
    diaDialog.value = true
}
const hideDialog = () => {
    diaDialog.value = false;
    submitted.value = false;
};

const saveDia = () => {
    submitted.value = true;
    diaDialog.value = false;
    dia.value = {};
};
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
const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

</script>
