<template>
    <div id="printable" :style="{ height: '528px', width: '700px' }">
        <Card class="shadow-none">
            <template #header>
                <div class="grid">
                    <div class="col text-center text-7xl">SEMEDSAM </div>
                </div>
                <div class="grid">
                    <div class="col text-center text-xl">SERVICIOS MEDICOS EN SALUD MENTAL</div>
                </div>
                <div class="grid">
                    <div class="col text-center text-xl w-10">
                        Folio ticket {{ ticket.code }}
                    </div>
                </div>
                <div class="grid">
                    <div class="col text-center text-sm w-10">
                        Comprobante de Venta
                    </div>
                </div>
                <div class="grid">
                    <div class="col text-center text-sm w-10">
                        {{ ticket.date }}
                    </div>
                </div>
            </template>
            <template #content>
                <!-- <div class="grid">
                    <div class="col-fixed min-w-min">
                        <div class="bg-primary">Nombre del paciente: </div>
                    </div>
                    <div class="col">
                        <div v-if="ticket.pacient"
                            class="border-bottom-1 border-primary-500 bg-primary font-bold uppercase">{{
                                ticket.pacient.nombre
                                + ' ' + ticket.pacient.apaterno
                                + ' ' + ticket.pacient.amaterno }}.
                        </div>
                    </div>
                </div>
                <div v-if="ticket.pacient" class="grid py-2">
                    <div class="col-fixed min-w-min">
                        <div class="bg-primary">Edad: </div>
                    </div>
                    <div class="col">
                        <div class="border-bottom-1 border-primary-500 bg-primary">
                            {{ ticket.pacient.age }} a&ntilde;os
                        </div>
                    </div>
                    <div class="col-fixed min-w-min">
                        <div class="bg-primary">Fecha Nac.: </div>
                    </div>
                    <div class="col">
                        <div class="border-bottom-1 border-primary-500 bg-primary">
                            {{ ticketFechaNacimiento }}.
                        </div>
                    </div>
                    <div class="col-fixed min-w-min">
                        <div class="bg-primary">Fecha: </div>
                    </div>
                    <div class="col">
                        <div class="border-bottom-1 border-primary-500 bg-primary">
                            {{ ticketFecha }}.
                        </div>
                    </div>
                </div> -->
                <div class="grid py-2">
                    <div class="col">
                        {{ ticket.service.name }}
                    </div>
                </div>
                <div class="grid py-2">
                    <div class="col">
                        {{ ticket.description }}
                    </div>
                </div>

            </template>
            <template #footer>
                <div class="pb-4"></div>
                <div class="grid">
                    <div class="col font-bold text-xs">SEMEDSAM M&Eacute;RIDA, YUC</div>
                    <div class="col font-bold text-xs">SEMEDSAM CANC&Uacute;N YUC</div>
                </div>
                <div class="grid">
                    <div class="col text-xs">Calle 43 #694&Ntilde;; x 88 y 90 Fracc. Arboledas Cd. Caucel Tel. 999 469
                        6490
                    </div>
                    <div class="col text-xs">SM-201 Mz-37 L-03 Av. Hda. de Chabl&eacute; esq. Av. Ni&ntilde;os
                        H&eacute;roes
                        Tel. 999
                        425 0887 / 998 520 0367</div>
                </div>
                <div class="grid">
                    <div class="col font-bold text-xs">SEMEDSAM CDMX</div>
                    <div class="col font-bold text-xs">SEMEDSAM IGUALA GUERRERO</div>
                </div>
                <div class="grid">
                    <div class="col text-xs">Calle Topacio #8-D Conjunto La Paz, Los Reyes La Paz Tel. 552 162 6438 /
                        553
                        127
                        0217</div>
                    <div class="col text-xs">Av. Sur M2. 10 Lt. 1 Col. Ejiditarios Fracc. Nuevo Horizonte Tel. 552 162
                        6438
                        /
                        553 127
                        0217</div>
                </div>
            </template>

        </Card>
    </div>
</template>

<script setup>
import Card from 'primevue/card';
import { onMounted } from 'vue';

const { ticket } = defineProps(['ticket'])

onMounted(() => {
    console.log('mounted print component', ticket)
})

</script>