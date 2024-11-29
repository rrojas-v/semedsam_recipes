<template>
    <Card>
        <template #title>Agenda</template>
        <template #content>
            <div class="grid">
                <div class="col-3">
                    <div class="p-1 font-bold">
                        Día seleccionado: {{ hoy.toLocaleDateString() }}
                    </div>
                </div>
            </div>
            <div class="grid">
                <div class="col-6">
                    <DatePicker v-model="hoy" inline class="w-full sm:w-[40rem]" :disabledDays="[0]"
                        :disabled-dates="[new Date('November 12, 2024'), new Date('November 19, 2024')]">
                        <!-- <template #date="slotProps">
                            <template v-if="available(slotProps.date)">{{ slotProps.date.day }}</template>
<Badge v-else :value="slotProps.date.day" size="small"></Badge>

</template> -->
                    </DatePicker>
                </div>
                <div class="col-6">
                    <DataTable :value="schedules">
                        <Column field="hora" header="Hora" style="width: 5%;"></Column>
                        <Column field="pacient.nombre" header="Paciente"></Column>
                        <Column headerStyle="width: 1rem; text-align: center"
                            bodyStyle="text-align: center; overflow: visible">
                            <template #body="slotProps">
                                <Button icon="pi pi-pen-to-square" severity="contrast" text rounded aria-label=""
                                    size="small" @click="appointmentDetail(slotProps.data)" />
                            </template>
                        </Column>
                    </DataTable>

                </div>
            </div>
        </template>
    </Card>




    <Dialog v-model:visible="visibleDetailsDialog" modal header="Detalles de la Cita" :style="{ width: '50rem' }">
        <div class="grid">
            <div class="col-3">
                <div class="p-1 font-bold">
                    Fecha: {{ hoy.toLocaleDateString() }}
                </div>
            </div>
        </div>
        <div class="card pb-3">
            <PacientComponent />
        </div>
        <Card>
            <template #content>
                <div class="formgrid grid">
                    <div class="field col-12 md:col-6">
                        <Select id="product" v-model="schedule.service" :options="products"
                            placeholder="Seleccione un servicio" class="w-full md:w-56" filter optionLabel="name"
                            option-value="code" required="true" autofocus fluid>
                        </Select>
                    </div>
                    <div class="field col-12 md:col-6">
                        <Select id="teraphist" v-model="schedule.teraphist" :options="teraphists"
                            placeholder="Seleccione un terapeuta" class="w-full md:w-56" filter optionLabel="name"
                            option-value="code" required="true" fluid>
                        </Select>
                    </div>
                </div>
                <div class="formgrid grid">
                    <div class="field col-12">
                        <Textarea class="w-full" v-model="schedule.descripcion"
                            placeholder="Escriba sus observaciones"></Textarea>
                    </div>
                </div>
            </template>
        </Card>
        <div class="flex justify-content-end gap-3 p-3">
            <Button type="button" label="Cancelar" severity="secondary" @click="visibleDetailsDialog = false"></Button>
            <Button type="button" label="Guardar" @click="saveAppointment()"></Button>
        </div>
    </Dialog>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import Card from 'primevue/card';
import DatePicker from 'primevue/datepicker';
import Badge from 'primevue/badge';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import { SchedulesService } from '@/service/ScheduleService';
import Dialog from 'primevue/dialog';
import Select from 'primevue/select';
import { PacientService } from '@/service/PacientService';
import PacientComponent from '@/components/PacientComponent.vue';
import { ProductsService } from '@/service/ProductsService';
import { TeraphistsService } from '@/service/TeraphistsService';
import Textarea from 'primevue/textarea';

import { selectedPacient } from '@/store/store';


const hoy = ref(new Date())
const disabledDates = []
disabledDates.push(new Date(2024, 11, 23))
const dayBeg = 9
const dayEnd = 22

const schedules = ref([])
const schedule = ref({})

const visibleDetailsDialog = ref(false);

const pacients = ref([])
const products = ref([])
const teraphists = ref([])

onMounted(async () => {
    UpdateHoursView()
    PacientService.getPacients().then((data) => { pacients.value = data })
    products.value = ProductsService.getproducts()
    teraphists.value = TeraphistsService.getTeraphists()
})

watch(hoy, () => {
    UpdateHoursView()
})

const UpdateHoursView = async () => {
    schedules.value = []
    schedules.value = await SchedulesService.getSchedules(hoy.value);

    for (var i = dayBeg; i < dayEnd; i++) {
        const h = schedules.value.filter(h => h.hora == i + ':00')
        if (!h.length) {
            schedules.value.push({ hora: i + ':00', pacient: '' })
        }
    }
    schedules.value.sort((a, b) => a.id - b.id)
}

const appointmentDetail = (data) => {
    schedule.value = { ...data }
    console.log(schedule.value.pacient)
    selectedPacient.value = schedule.value.pacient
    visibleDetailsDialog.value = true

    console.log(schedule.value)

}
const saveAppointment = () => {

    console.log('save', schedule.value)

    const cleaned = {
        id: schedule.value.hora.substring(0, schedule.value.hora.indexOf(':')),
        fecha: hoy.value,
        hora: schedule.value.hora,
        pacientCode: selectedPacient.value.code,
        pacient: selectedPacient.value,
        service: schedule.value.service,
        descripcion: schedule.value.descripcion,
    }
    SchedulesService.saveNewScheduleToDatabase(cleaned)

    UpdateHoursView(); //move to compute or xyz

    visibleDetailsDialog.value = false
}

const blocked = (date) => {
    const availableDays = [1, 2, 3, 4, 5, 6, 7, 8]
    return availableDays.includes(date.day)
}
const availableColor = (date) => {
    return "warn"
}

const columnsAgenda = ref([
    { field: 'horaFormated', header: 'Horario' },
    { field: 'descripcion', header: 'Cita' }
]);

const onCellEditComplete = (event) => {
    let { data, newValue, field } = event;
    if (newValue.trim().length > 0)
        data[field] = newValue;
    else
        event.preventDefault();
};

</script>
