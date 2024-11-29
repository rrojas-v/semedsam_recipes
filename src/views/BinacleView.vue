<template>
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <Button label="New" icon="pi pi-plus" class="mr-2" @click="openNew" />
                    <!-- <Button label="Delete" icon="pi pi-trash" severity="danger" outlined @click="confirmDeleteSelected"
                        :disabled="!selectedBinacles || !selectedBinacles.length" /> -->
                </template>

                <template #end>
                    <Button label="Descargar" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
                </template>
            </Toolbar>

            <DataTable ref="dt" v-model:selection="selectedBinacles" :value="binacles" dataKey="id" :paginator="true"
                :rows="10" :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} registros">
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <DatePicker v-model="selectedDate" showIcon fluid showButtonBar />
                        <Button type="button" label="Filtrar" icon="pi pi-filter" :loading="loading"
                            @click="loadBinacles" />
                        <!-- <IconField>
                            <InputText v-model="filters['global'].value" placeholder="Buscar..." />
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                        </IconField> -->
                    </div>
                </template>
                <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
                <Column field="fecha" header="Fecha" sortable style="min-width: 2rem"></Column>
                <Column field="pacientFullName" header="Paciente" sortable style="min-width: 22rem"></Column>
                <Column field="service.name" header="Servicio" sortable style="min-width: 10rem"></Column>
                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2"
                            @click="editBinacle(slotProps.data)" />
                        <!-- <Button icon="pi pi-trash" outlined rounded severity="danger"
                            @click="confirmDeleteBinacle(slotProps.data)" /> -->
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="binacleDialog" :style="{ width: '850px' }" header="Registro de bitacora" :modal="true">
            <div class="formgrid grid">
                <div class="field col-12 md:col-12">
                    <PacientComponent :pacient="binacle.pacient" />
                </div>
            </div>
            <Card>
                <template #content>
                    <div class="formgrid grid">
                        <div class="field col-12 md:col-6">
                            <label for="service" class="block font-bold mb-3">Servicio</label>
                            <Select id="service" v-model="binacle.service" :options="products" optionLabel="name"
                                placeholder="Seleccione un Servicio" fluid
                                @SelectChangeEvent="onchangeService"></Select>
                        </div>
                        <div class="field col-12 md:col-6">
                            <label for="fecha" class="block font-bold mb-3">Fecha</label>
                            <DatePicker v-model="selectedDate" showIcon fluid showButtonBar disabled />
                        </div>
                        <!-- <div class="field col-12 md:col-12">
                            <label for="description" class="block font-bold mb-3">Description</label>
                            <Textarea id="description" v-model="binacle.description" required="true" rows="3" cols="20"
                                fluid />
                        </div> -->

                        <!-- <div class="field col-12 md:col-6 flex items-center gap-2">
                            <Checkbox v-model="binacle.generaVenta" inputId="generaVenta" value="true"
                                defaultValue="true" />
                            <label for="generaVenta"> Tiene costo </label>
                        </div> -->
                    </div>
                    {{ temporal }}
                    <div v-if="binacle.service" class="formgrid grid">
                        <div v-if="binacle.service.code == '1'" class="field col-12">
                            <div class="formgroup-inline">
                                <div class="field-radiobutton">
                                    <RadioButton v-model="temporal.consulta" inputId="psq" name="detalles"
                                        value="PSQ" />
                                    <label for="psq">Psiquíatrica</label>
                                </div>
                                <div class="field-radiobutton">
                                    <RadioButton v-model="temporal.consulta" inputId="psc" name="detalles"
                                        value="PSC" />
                                    <label for="psc">Psicológica</label>
                                </div>
                            </div>
                            <div class="formgroup-inline">
                                <div class="field-radiobutton">
                                    <RadioButton v-model="temporal.visita" inputId="pvisita" name="detalles"
                                        value="Primera" />
                                    <label for="pvisita">Primera Visita</label>
                                </div>
                                <div class="field-radiobutton">
                                    <RadioButton v-model="temporal.visita" inputId="visitas" name="detalles"
                                        value="Subsecuente" />
                                    <label for="visitas">Visita Subsecuente</label>
                                </div>
                            </div>
                        </div>
                        <!-- Internado Psiquiatrico -->
                        <div v-if="binacle.service.code == '4'" class="field col-12">
                            <div class="field-radiobutton">
                                <RadioButton v-model="temporal.visita" inputId="pvisita" name="detalles"
                                    value="Primera" />
                                <label for="pvisita">Primera Visita</label>
                            </div>
                            <div class="field-radiobutton">
                                <RadioButton v-model="temporal.visita" inputId="visitas" name="detalles"
                                    value="Subsecuente" />
                                <label for="visitas">Visita Subsecuente</label>
                            </div>
                        </div>
                        <!-- Altas -->
                        <div v-if="binacle.service.code == '7'" class="field col-12">
                            <div class="field-radiobutton">
                                <RadioButton v-model="temporal.tipoAlta" inputId="mclinica" name="detalles"
                                    value="Mejoria Clinica" />
                                <label for="pvisita">Mejoría Clínica</label>
                            </div>
                            <div class="field-radiobutton">
                                <RadioButton v-model="temporal.tipoAlta" inputId="avoluntaria" name="detalles"
                                    value="Alta Voluntaria" />
                                <label for="visitas">Alta Voluntaria</label>
                            </div>
                        </div>
                        <!-- Estancias Prolongadas -->
                        <div v-if="binacle.service.code == '5'" class="field col-12">
                            <div class="field-radiobutton">
                                <RadioButton v-model="temporal.largaEstancia" inputId="idirecto" name="detalles"
                                    value="Ingresa Directo" />
                                <label for="idirecto">Ingresa Directo</label>
                            </div>
                            <div class="field-radiobutton">
                                <RadioButton v-model="temporal.largaEstancia" inputId="pestab" name="detalles"
                                    value="Prev. Estab." />
                                <label for="pestab">Prev. Estab.</label>
                            </div>
                        </div>
                        <!-- Clínica Adicciones -->
                        <div v-if="binacle.service.code == '8'" class="field col-12">
                            <div class="field-radiobutton">
                                <RadioButton v-model="temporal.clinicaAdicciones" inputId="caidirecto" name="detalles"
                                    value="Ingresa Directo" />
                                <label for="idirecto">Ingresa Directo</label>
                            </div>
                            <div class="field-radiobutton">
                                <RadioButton v-model="temporal.clinicaAdicciones" inputId="capestab" name="detalles"
                                    value="Prev. Estab." />
                                <label for="pestab">Prev. Estab.</label>
                            </div>
                        </div>
                        <!-- Traslados -->
                        <div v-if="binacle.service.code == '3'" class="field col-12">
                            <div class="field-radiobutton">
                                <RadioButton v-model="temporal.tipoTraslado" inputId="tlocal" name="detalles"
                                    value="Local" />
                                <label for="tlocal">Local</label>
                            </div>
                            <div class="field-radiobutton">
                                <RadioButton v-model="temporal.tipoTraslado" inputId="tforaneo" name="detalles"
                                    value="Foraneo" />
                                <label for="tforaneo">Foraneo</label>
                            </div>
                        </div>
                        <!-- Actipulse -->
                        <div v-if="binacle.service.code == '9'" class="field col-12">
                            <div class="field-radiobutton">
                                <RadioButton v-model="temporal.actipulse" inputId="siete" name="detalles" value="7" />
                                <label for="siete">7</label>
                            </div>
                            <div class="field-radiobutton">
                                <RadioButton v-model="temporal.actipulse" inputId="catorce" name="detalles"
                                    value="14" />
                                <label for="catorce">14</label>
                            </div>
                            <div class="field-radiobutton">
                                <RadioButton v-model="temporal.actipulse" inputId="veintiuno" name="detalles"
                                    value="21" />
                                <label for="veintiuno">21</label>
                            </div>
                        </div>
                    </div>
                </template>
            </Card>

            <template #footer>
                <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Guardar" icon="pi pi-check" @click="saveBinacle" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteBinacleDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="binacle">Are you sure you want to delete <b>{{ binacle.name }}</b>?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteBinacleDialog = false" />
                <Button label="Yes" icon="pi pi-check" @click="deleteBinacle" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteBinaclesDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="binacle">Are you sure you want to delete the selected binacles?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteBinaclesDialog = false" />
                <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedBinacles" />
            </template>
        </Dialog>
    </div>
</template>

<script setup>

import { ref, onMounted, watch } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';

import Button from 'primevue/button';
import Toolbar from 'primevue/toolbar';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import IconField from 'primevue/iconfield';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Select from 'primevue/select';
import Dialog from 'primevue/dialog';
import PacientComponent from '@/components/PacientComponent.vue';
import Card from 'primevue/card';
import { ProductsService } from '@/service/ProductsService';
import { selectedPacient } from '@/store/store';
import { BinaclesService } from '@/service/BinacleServices';
import DatePicker from 'primevue/datepicker';
import Checkbox from 'primevue/checkbox';
import RadioButton from 'primevue/radiobutton';

const toast = useToast();
const dt = ref();
const binacleDialog = ref(false);
const deleteBinacleDialog = ref(false);
const deleteBinaclesDialog = ref(false);
const selectedBinacles = ref();

const loading = ref(false);

const filters = ref({
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const submitted = ref(false);
const products = ref([]);

const selectedDate = ref(new Date());
const binacle = ref({});
const binacles = ref([]);
selectedPacient.value = {}

const temporal = ref({});

onMounted(() => {
    products.value = ProductsService.getProducts()
    loadBinacles()
});
watch(selectedPacient, (newPacient) => {
    if (newPacient.value) {
        binacle.value.pacient = newPacient.value
    }
});
const onchangeService = () => {
    console.log('onChangeService')
    temporal.value = {}
}
const loadBinacles = () => {
    loading.value = true
    BinaclesService.getBinacles(selectedDate.value.toLocaleDateString()).then((data) => binacles.value = data)
    loading.value = false
};
const openNew = () => {
    binacle.value = {};
    binacle.value.generaVenta = true;
    submitted.value = false;
    binacleDialog.value = true;
};
const hideDialog = () => {
    binacleDialog.value = false;
    submitted.value = false;
};
const saveBinacle = () => {
    submitted.value = true;
    console.log(temporal.value)
    console.log(Object.keys(temporal.value).length)
    if (binacle?.value.pacient && binacle?.value.service && Object.keys(temporal.value).length > 0) {

        if (binacle.value.service.name === "Consulta Externa") {
            binacle.value.detalles = {}
            binacle.value.detalles.consulta = temporal.value.consulta;
            binacle.value.detalles.visita = temporal.value.visita;
        }
        else if (binacle.value.service.name === "Internado Psiquiatrico") {
            binacle.value.detalles = {}
            binacle.value.detalles.visita = temporal.value.visita;
        }
        else if (binacle.value.service.name === "Altas") {
            binacle.value.detalles = {}
            binacle.value.detalles.tipoAlta = temporal.value.tipoAlta;
        }
        else if (binacle.value.service.name === "Estancias Prolongadas") {
            binacle.value.detalles = {}
            binacle.value.detalles.largaEstancia = temporal.value.largaEstancia;
        }
        else if (binacle.value.service.name === "Clínica Adicciones") {
            binacle.value.detalles = {}
            binacle.value.detalles.clinicaAdicciones = temporal.value.clinicaAdicciones;
        }
        else if (binacle.value.service.name === "Traslados") {
            binacle.value.detalles = {}
            binacle.value.detalles.clinicaAdicciones = temporal.value.clinicaAdicciones;
        }
        else if (binacle.value.service.name === "Actipulse") {
            binacle.value.detalles = {}
            binacle.value.detalles.actipulse = temporal.value.actipulse;
        }

        console.log(binacle.value)

        if (binacle.value.id) {
            binacles.value[findIndexById(binacle.value.id)] = binacle.value;
            BinaclesService.saveToDatabase(binacle.value)
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Registro Actualizado', life: 3000 });
        }
        else {
            binacle.value.id = createCode()
            binacle.value.code = createCode()
            binacle.value.fecha = selectedDate.value.toLocaleDateString()
            BinaclesService.saveToDatabase(binacle.value)

            binacle.value.pacientFullName = binacle.value.pacient.nombre + ' ' + binacle.value.pacient.apaterno + ' ' + binacle.value.pacient.amaterno
            binacles.value.push(binacle.value);

            toast.add({ severity: 'success', summary: 'Successful', detail: 'Registro Creado', life: 3000 });
        }
        binacleDialog.value = false;
        binacle.value = {};
    }
};
const editBinacle = (data) => {
    console.log('edit', data)
    binacle.value = { ...data };
    binacleDialog.value = true;
};
const confirmDeleteBinacle = (prod) => {
    binacle.value = prod;
    deleteBinacleDialog.value = true;
};
const deleteBinacle = () => {
    binacles.value = binacles.value.filter(val => val.id !== binacle.value.id);
    deleteBinacleDialog.value = false;
    binacle.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Registro Borrado', life: 3000 });
};
const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < binacles.value.length; i++) {
        if (binacles.value[i].id === id) {
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
const exportCSV = () => {
    dt.value.exportCSV();
};
const confirmDeleteSelected = () => {
    deleteBinaclesDialog.value = true;
};
const deleteSelectedBinacles = () => {
    binacles.value = binacles.value.filter(val => !selectedBinacles.value.includes(val));
    deleteBinaclesDialog.value = false;
    selectedBinacles.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Registros Borrados', life: 3000 });
};

</script>
