<template>
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <Button label="Nuevo" icon="pi pi-plus" class="mr-2" @click="openNew" />
                    <!-- <Button label="Desactivar" icon="pi pi-trash" severity="danger" outlined
                        @click="confirmDeleteSelected"
                        :disabled="!selectedMemberships || !selectedMemberships.length" /> -->
                </template>
            </Toolbar>


            <DataTable ref="dt" v-model:selection="selectedMemberships" :value="memberships" dataKey="id"
                :paginator="true" :rows="10" :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]" currentPageReportTemplate="{first} - {last} de {totalRecords}">
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-2">Administrar Membresías</h4>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Buscar..." />
                        </IconField>
                    </div>
                </template>

                <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
                <Column field="vigenciaIniFormated" header="Inicio" sortable style="min-width: 2rem"></Column>
                <!-- <Column field="vigenciaFinFormated" header="Final" sortable style="min-width: 2rem"></Column> -->
                <Column field="duracion" header="Duración" sortable style="min-width: 2rem"></Column>
                <Column field="selectedPacient.nombre" header="Paciente" sortable style="min-width: 16rem">
                </Column>
                <Column field="price" header="Monto" sortable style="min-width: 4rem">
                    <template #body="slotProps">
                        {{ formatCurrency(slotProps.data.price) }}
                    </template>
                </Column>
                <Column field="servicio" header="Servicio" sortable style="min-width: 10rem"></Column>

                <Column field="status.label" header="Estatus" sortable style="min-width: 4rem">
                    <template #body="slotProps">
                        <Tag :value="slotProps.data.status.label" :severity="getStatusLabel(slotProps.data.status)" />
                    </template>
                </Column>
                <!-- <Column :exportable="false" style="min-width: 12rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2"
                            @click="editMembership(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger"
                            @click="confirmDeleteMembership(slotProps.data)" />
                    </template>
                </Column> -->
            </DataTable>
        </div>

        <Dialog v-model:visible="membershipDialog" style="width: 600px;" header="Detalles de membresía" :modal="true">
            <div class="formgrid grid">
                <div class="field col-12 md:col-12">
                    <label for="name" class="block font-bold mb-3">Paciente</label>
                    <Select v-model="membership.pacient" :options="pacients" placeholder="Seleccione un paciente"
                        class="w-full md:w-56" filter optionLabel="nombre" option-value="code" required="true" autofocus
                        :invalid="submitted && !membership.pacient" fluid>
                    </Select>
                    <small v-if="submitted && !membership.pacient" class="text-red-500">
                        Paciente es requerido.
                    </small>
                </div>
                <div class="field col-12 md:col-4">
                    <label for="price" class="block font-bold mb-3">Monto Cobrado</label>
                    <InputNumber id="price" v-model="membership.price" mode="currency" currency="USD" locale="en-US"
                        fluid />
                </div>
                <div class="field col-12 md:col-1">
                </div>
                <div class="field col-12 md:col-7">
                    <span class="block font-bold mb-4">Servicio Contratado</span>
                    <div class="grid grid-cols-12 gap-3">
                        <div class="flex items-center gap-2 pl-4">
                            <RadioButton id="servicio1" v-model="membership.servicio" name="servicio"
                                value="Hospital de Día" />
                            <label for="servicio1">Hospital de Día</label>
                        </div>
                        <div class="flex items-center gap-2 pl-4">
                            <RadioButton id="servicio2" v-model="membership.servicio" name="servicio"
                                value="Seguros SEMEDSAM" />
                            <label for="servicio2">Seguros SEMEDSAM</label>
                        </div>
                        <div class="flex items-center gap-2 pl-4">
                            <RadioButton id="servicio3" v-model="membership.servicio" name="servicio"
                                value="Membresía Anual" />
                            <label for="servicio3">Membresía Anual</label>
                        </div>
                    </div>
                </div>
                <div class="field col-12 md:col-4">
                    <label for="vigenciaInicio" class="font-bold block mb-2"> Vigencia Inicio </label>
                    <DatePicker v-model="membership.vigenciaIni" showIcon fluid :showOnFocus="false"
                        inputId="vigenciaInicio" />
                </div>
                <div class="field col-12 md:col-3">
                    <label for="duracion" class="font-bold block mb-2">Duración (años)</label>
                    <InputNumber v-model="membership.duracion" inputId="minmax-buttons" showButtons :min="1" :max="5"
                        fluid />
                </div>
                <div class="field col-12 md:col-3">
                    <label for="vigenciaFinal" class="font-bold block mb-2"> Vigencia Final </label>
                    <DatePicker fluid inputId="vigenciaFinal" disabled />
                </div>
                <!-- <div class="field col-12 md:col-6">
                    <label for="status" class="block font-bold mb-3">Estatus</label>
                    <Select id="status" v-model="membership.status" :options="statuses" optionLabel="label"
                        defaultValue="activo" placeholder="Seleccione un estatus" fluid disabled></Select>
                </div> -->
            </div>

            <template #footer>
                <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Guardar" icon="pi pi-check" @click="saveMembership" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteMembershipDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="membership">Are you sure you want to delete <b>{{ membership.name }}</b>?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteMembershipDialog = false" />
                <Button label="Yes" icon="pi pi-check" @click="deleteMembership" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteMembershipsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="membership">¿Está seguro de CANCELAR las membresías seleccionadas?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteMembershipsDialog = false" />
                <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedMemberships" />
            </template>
        </Dialog>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Toolbar from 'primevue/toolbar';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import IconField from 'primevue/iconfield';
import Tag from 'primevue/tag';
import InputNumber from 'primevue/inputnumber';
import Dialog from 'primevue/dialog';
import Select from 'primevue/select';
import RadioButton from 'primevue/radiobutton';
import DatePicker from 'primevue/datepicker';

import { MembershipService } from '@/service/MembershipService';
import { PacientService } from '@/service/PacientService';


const pacients = ref([]);

const toast = useToast();
const dt = ref();
const memberships = ref([]);
const membershipDialog = ref(false);
const deleteMembershipDialog = ref(false);
const deleteMembershipsDialog = ref(false);
const membership = ref({});

const selectedMemberships = ref();
const filters = ref({
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const submitted = ref(false);
const statuses = ref([
    { label: 'ACTIVO', value: 'activo' },
    { label: 'CANCELADA', value: 'cancelada' }
]);


onMounted(() => {
    MembershipService.getMemberships().then((data) => (memberships.value = data));

});
// const vigenciaFin = computed(() => {
//     if (membership.value.vigenciaIni || membership.value.duracion > 0) {
//         return (new Date).setFullYear(membership.value.vigenciaIni.getFullYear() + membership.value.duracion);
//     }
//     else {
//         return new Date();
//     }
// });
const formatCurrency = (value) => {
    if (value)
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    return;
};
const openNew = () => {
    PacientService.getPacients().then((data) => { pacients.value = data });


    console.log(pacients.value)

    membership.value = {}
    membership.value.status = 'activo'
    //membership.value.vigenciaIni = new Date()
    //membership.value.duracion = 1
    submitted.value = false
    membershipDialog.value = true
};
const hideDialog = () => {
    membershipDialog.value = false;
    submitted.value = false;
};
const saveMembership = () => {
    submitted.value = true;

    PacientService.getPacients().then((data) => { pacients.value = data });

    membership.value.vigenciaIniFormated = membership.value.vigenciaIni.toLocaleDateString();
    if (membership?.value.pacient?.trim()) {
        if (membership.value.id) {
            membership.value.status = membership.value.status.value ? membership.value.status.value : membership.value.status;
            memberships.value[findIndexById(membership.value.id)] = membership.value;
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Actualizacion de Membresia', life: 3000 });
        }
        else {
            membership.value.id = createId()
            membership.value.code = createId()
            membership.value.selectedPacient = pacients.value.find(item => item.code === membership.value.pacient)

            memberships.value.push(membership.value)
            MembershipService.saveNewMembershipToDatabase(membership.value)
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Membresia Creada', life: 3000 })
        }

        membershipDialog.value = false;
        membership.value = {};
    }
};
const editMembership = (prod) => {
    membership.value = { ...prod };
    membershipDialog.value = true;
};
const confirmDeleteMembership = (prod) => {
    membership.value = prod;
    deleteMembershipDialog.value = true;
};
const deleteMembership = () => {
    memberships.value = memberships.value.filter(val => val.id !== membership.value.id);
    deleteMembershipDialog.value = false;
    membership.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Detalles de membresia', life: 3000 });
};
const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < memberships.value.length; i++) {
        if (memberships.value[i].id === id) {
            index = i;
            break;
        }
    }

    return index;
};
const createId = () => {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}
const confirmDeleteSelected = () => {
    deleteMembershipsDialog.value = true;
};
const deleteSelectedMemberships = () => {
    memberships.value = memberships.value.filter(val => !selectedMemberships.value.includes(val));
    deleteMembershipsDialog.value = false;
    selectedMemberships.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Membresía borrada', life: 3000 });
};

const getStatusLabel = (status) => {
    console.log('status', status)
    switch (status) {
        case 'activo':
            return 'success';

        case 'cancelada':
            return 'danger';

        default:
            return null;
    }
};

</script>
