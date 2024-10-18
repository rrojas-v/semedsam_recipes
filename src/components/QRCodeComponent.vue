<template>
    <qrcode-vue :value="url" :size="size" />
    <!-- <qrcode-canvas :value="props.value" :size="size" level="H" />
    <qrcode-svg value="QRCODE.VUE :)" level="H" /> -->
</template>
<script>
import QrcodeVue
    //, { QrcodeCanvas, QrcodeSvg } 
    from 'qrcode.vue'

export default {
    // data() {
    //     return {
    //         size: 600,
    //     }
    // },
    props: ['value'],
    setup(props) {
        const url = 'https://semedsam-recipes.vercel.app/recipe?' + props.value
        console.log('url', url)
        return url
    },
    components: {
        QrcodeVue,
        // QrcodeCanvas,
        // QrcodeSvg,
    },
}
</script>