<template>
    <div id="printable" :style="{ height: '928px', width: '700px' }">
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
                        Dr. Jes&uacute;s &Aacute;ngel De La Luz Ram&iacute;rez
                    </div>
                </div>
                <div class="grid">
                    <div class="col text-center text-sm w-10">
                        M&eacute;dico Psiquiatra
                    </div>
                </div>
                <div class="grid">
                    <div class="col text-center text-sm w-10">
                        Universidad Nacional Aut&oacute;noma de M&eacute;xico
                    </div>
                </div>
                <div class="grid">
                    <div class="col text-center text-sm w-10">
                        C&eacute;dula Profesional 5492965
                    </div>
                </div>
                <div class="grid">
                    <div class="col text-center text-sm w-10 pb-4">
                        C&eacute;dula de Especialista 9990455
                    </div>
                </div>
            </template>
            <template #content>
                <div class="grid">
                    <div class="col-fixed min-w-min">
                        <div class="bg-primary">Nombre del paciente: </div>
                    </div>
                    <div class="col">
                        <div v-if="recipe.pacient"
                            class="border-bottom-1 border-primary-500 bg-primary font-bold uppercase">
                            {{ recipe.pacient.nombre
                                + ' ' + recipe.pacient.apaterno
                                + ' ' + recipe.pacient.amaterno }}.
                        </div>
                    </div>
                </div>
                <div v-if="recipe.pacient" class="grid py-2">
                    <div class="col-fixed min-w-min">
                        <div class="bg-primary">Edad: </div>
                    </div>
                    <div class="col">
                        <div class="border-bottom-1 border-primary-500 bg-primary">
                            {{ recipe.pacient.age }} a&ntilde;os
                        </div>
                    </div>
                    <div class="col-fixed min-w-min">
                        <div class="bg-primary">Fecha Nac.: </div>
                    </div>
                    <div class="col">
                        <div class="border-bottom-1 border-primary-500 bg-primary">
                            {{ recipeFechaNacimiento }}.
                        </div>
                    </div>
                    <div class="col-fixed min-w-min">
                        <div class="bg-primary">Fecha: </div>
                    </div>
                    <div class="col">
                        <div class="border-bottom-1 border-primary-500 bg-primary">
                            {{ recipeFecha }}.
                        </div>
                    </div>
                </div>
                <div class="grid py-2">
                    <div class="col">
                        Medicamentos:
                    </div>
                </div>
                <div style="height: 300px;">
                    <div v-for="item in recipe.medications" :key="item.id" class="grid pb-4">
                        <!-- <div class="col-fixed min-w-min"> {{ item.id }}. </div> -->
                        <div class="col uppercase"> {{ item.medication }} {{ item.dosis }}</div>
                    </div>
                </div>
            </template>
            <template #footer>
                <div class="grid" v-if="recipe.uid">
                    <div class="col text-xs flex align-items-end flex-wrap">
                        Esta receta ha sido firmada correctamente: {{ recipe.uid }}
                    </div>
                    <div class="col flex justify-content-end flex-wrap">
                        <QRCodeComponent :value="recipe.uid" />
                    </div>
                </div>
                <div class="grid" v-else>
                    <div class="text-xs col">
                        IMPORTANTE: Esta es una vista previa y no es v&aacute;lida como receta m&eacute;dica
                    </div>
                </div>
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
import { computed } from 'vue';
import Card from 'primevue/card';
import QRCodeComponent from './QRCodeComponent.vue';

const { recipe } = defineProps(['recipe'])

const recipeFechaNacimiento = computed(() => {
    if (recipe.pacient.fnacimiento) {
        return recipe.pacient.fnacimiento.toLocaleDateString()
    }
    else {
        return null
    }
})
const recipeFecha = computed(() => {
    if (recipe.fecha) {
        return recipe.fecha.toLocaleDateString()
    }
    else {
        return null
    }
})

</script>