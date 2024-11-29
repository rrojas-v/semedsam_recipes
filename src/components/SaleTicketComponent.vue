<template>
    <div class="card">
        <Toolbar class="mb-2">
            <template #start>
                <Button label="Nuevo Ticket" icon="pi pi-plus" class="mr-2" @click="openNewSaleTicket" />
                <Button label="Cancelar Ticket" icon="pi pi-trash" severity="danger" outlined
                    @click="confirmDeleteSelected" :disabled="!selectedSales || !selectedSales.length" />
            </template>
            <template #end>
                <Button label="Export" icon="pi pi-download" severity="secondary" @click="exportCSV($event)" />
            </template>
        </Toolbar>

        <DataTable ref="dt" v-model:selection="selectedSales" :value="saleTickets" dataKey="id" :paginator="true"
            :rows="10" :filters="filters"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[5, 10, 25]"
            currentPageReportTemplate="{first} a {last} de {totalRecords} tickets de venta">
            <template #header>
                <div class="flex flex-wrap gap-2 items-center justify-between">
                    <h4 class="m-2">Tickets de Venta</h4>
                    <IconField>
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText v-model="filters['global'].value" placeholder="Buscar..." />
                    </IconField>
                </div>
            </template>

            <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
            <Column field="code" header="Folio" sortable style="min-width: 12rem"></Column>
            <Column field="amount" header="Monto" sortable style="min-width: 8rem">
                <template #body="slotProps">
                    {{ formatCurrency(slotProps.data.amount) }}
                </template>
            </Column>
            <Column field="service.name" header="Servicio" sortable style="min-width: 10rem"></Column>
            <Column field="description" header="Comentarios" sortable style="min-width: 16rem"></Column>
            <Column field="status" header="Estado" sortable style="min-width: 12rem">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.status" :severity="getStatusLabel(slotProps.data.status)" />
                </template>
            </Column>
            <Column :exportable="false" style="min-width: 12rem">
                <template #body="slotProps">
                    <Button icon="pi pi-trash" outlined rounded severity="danger"
                        @click="confirmDeleteSaleTicket(slotProps.data)" />
                </template>
            </Column>
        </DataTable>
    </div>

    <Dialog v-model:visible="saleTicketDialog" header="Ticket de venta" :modal="true" style="width: max-content;">
        <div class="grid">
            <div class="col">
                <label for="service" class="block font-bold mb-3">Servicio</label>
                <Select v-model="saleTicket.service" :options="services" optionLabel="name"
                    placeholder="Selecione un servicio" :invalid="!saleTicket.service" class="w-full md:w-56" />
            </div>
            <div class="col">
                <label for="amount" class="block font-bold mb-3">Monto</label>
                <InputNumber id="amount" v-model="saleTicket.amount" mode="currency" currency="MXN" locale="es-MX"
                    fluid />
            </div>
        </div>
        <div class="grid">
            <div class="col">
                <label for="description" class="block font-bold mb-3">Descripción adicional</label>
                <Textarea id="description" v-model="saleTicket.description" required="true" rows="3" cols="20"
                    :invalid="submitted && !saleTicket.description" fluid />
                <small v-if="submitted && !saleTicket.description" class="text-red-500">Concepto es
                    requerido.</small>
            </div>
        </div>

        <template #footer>
            <Button label="Salir sin guardar" icon="pi pi-times" text @click="hideSaleTicketDialog" />
            <Button label="Guardar" icon="pi pi-check" @click="saveSaleTicket" />
        </template>
    </Dialog>

    <Dialog v-model:visible="deleteSaleTicketDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
        <div class="flex items-center gap-4">
            <i class="pi pi-exclamation-triangle !text-3xl" />
            <span v-if="saleTicket">¿Está seguro de cambiar el estado a cancelado <b>{{ saleTicket.service
                    }}</b>?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" text @click="deleteSaleTicketDialog = false" />
            <Button label="Si" icon="pi pi-check" @click="deleteSaleTicket" />
        </template>
    </Dialog>

    <Dialog v-model:visible="deleteSaleTicketsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
        <div class="flex items-center gap-4">
            <i class="pi pi-exclamation-triangle !text-3xl" />
            <span v-if="saleTicket">¿Está seguro que quiere cancelar los tickets seleccionados?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" text @click="deleteSaleTicketsDialog = false" />
            <Button label="Si" icon="pi pi-check" text @click="deleteSelectedSaleTickets" />
        </template>
    </Dialog>

    <Dialog v-model:visible="printDialog" modal header="Vista previa"
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <template #header>
            <Button @click="downloadTicket">Descargar ticket</Button>
        </template>
        <SaleTicketPrintComponent :ticket="saleTicket" />
    </Dialog>

</template>

<script setup>
import { onMounted, ref } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import Button from 'primevue/button';
import Toolbar from 'primevue/toolbar';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import IconField from 'primevue/iconfield';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import DataTable from 'primevue/datatable';
import Textarea from 'primevue/textarea';
import Select from 'primevue/select';
import InputNumber from 'primevue/inputnumber';
import Dialog from 'primevue/dialog';
import { SaleTicketService } from '@/service/SaleTicketsService';
import { addDoc, collection } from 'firebase/firestore/lite';
import { database } from '@/firebase';
import html2pdf from 'html2pdf.js';
import SaleTicketPrintComponent from './SaleTicketPrintComponent.vue';

onMounted(() => {
    SaleTicketService.getSaleTicketsData().then((data) => saleTickets.value = data)
    console.log(saleTickets)
});

const toast = useToast();
const dt = ref();
const saleTicket = ref({});
const saleTickets = ref([]);

const saleTicketDialog = ref(false);
const deleteSaleTicketDialog = ref(false);
const deleteSaleTicketsDialog = ref(false);
const printDialog = ref(false);

const selectedSales = ref();
const filters = ref({
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const submitted = ref(false);
const statuses = ref([
    { label: 'ACTIVO', value: 'activo' },
    { label: 'CANCELADO', value: 'cancelado' }
]);
const services = ref([
    { name: 'Consulta Externa', id: '1' },
    { name: 'Grupos Terapéuticos', id: '2' },
    { name: 'Traslado Hospitalario', id: '3' },
    { name: 'Internado Psiquiatrico', id: '4' },
    { name: 'Estancias Prolongadas', id: '5' },
    { name: 'Servicios Especiales: Hospital de Día', id: '6' },
    { name: 'Servicios Especiales: Membresía Anual', id: '7' },
    { name: 'Servicios Especiales: SEMEDSAM Seguros', id: '8' },
]);
const exportCSV = () => {
    dt.value.exportCSV();
};
const formatCurrency = (value) => {
    if (value)
        return value.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
    return;
};
const openNewSaleTicket = () => {
    //    saleTicket.value = {};
    submitted.value = false;
    saleTicketDialog.value = true;
};
const hideSaleTicketDialog = () => {
    saleTicketDialog.value = false;
    submitted.value = false;
};
const saveSaleTicket = async () => {
    submitted.value = true;

    saleTicket.value.invoice = ''
    saleTicket.value.status = 'ACTIVO'
    saleTicket.value.date = new Date()

    if (!saleTickets.value)
        saleTickets.value = []
    if (saleTicket?.value.description?.trim()) {
        saleTicket.value.code = createCode();
        saleTickets.value.push(saleTicket.value);
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Ticket de venta creado', life: 3000 });

        const docRef = await addDoc(collection(database, "tickets"), saleTicket.value);
        console.log("New sale ticket written with ID: ", docRef.id);

        printDialog.value = true
        saleTicketDialog.value = false;

    }
};
const downloadTicket = () => {
    const fileName = "ticket-" + saleTicket.value.code
    html2pdf(document.querySelector('#printable'), {
        margin: 20,
        filename: fileName + ".pdf",
    });
}
const confirmDeleteSelected = () => {
    deleteSaleTicketsDialog.value = true;
};
const confirmDeleteSaleTicket = (prod) => {
    saleTicket.value = prod;
    deleteSaleTicketDialog.value = true;
};
const deleteSaleTicket = () => {
    saleTickets.value = saleTickets.value.filter(val => val.id !== saleTicket.value.id);
    deleteSaleTicketDialog.value = false;
    saleTicket.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Ticket Borrado', life: 3000 });
};
const deleteSelectedSaleTickets = () => {
    saleTickets.value = saleTickets.value.filter(val => !selectedSales.value.includes(val));
    deleteSaleTicketsDialog.value = false;
    selectedSales.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Tickets Borrado', life: 3000 });
};
const createCode = () => {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}
const getStatusLabel = (status) => {
    switch (status) {
        case 'ACTIVO':
            return 'Activo';

        case 'CANCELADO':
            return 'Cancelado';

        default:
            return null;
    }
};
const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < saleTickets.value.length; i++) {
        if (saleTickets.value[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
};
</script>