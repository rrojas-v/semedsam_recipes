import { database } from "@/firebase";
import { collection, doc, getDocs, query, serverTimestamp, setDoc, where } from "firebase/firestore/lite";
import { ref } from "vue";

function timestampToDate(seconds, nanoseconds = 0) {
    // Convertimos los segundos a milisegundos y sumamos los nanosegundos en microsegundos
    const milliseconds = (seconds * 1000) + (nanoseconds / 1000000);
    
    // Creamos el objeto Date
    const date = new Date(milliseconds);

    return date;
}
const getBinaclesDataByFecha = async (fecha) => {
    console.log('getBinaclesDataByFecha',fecha)
    // if (!this.recipes.length) {
        const binaclesCollection = collection(database, 'binacles');
  //    const binaclesSnapshot = await getDocs(binaclesCollection);
        const q = query(binaclesCollection, where("fecha", "==", fecha));        
        const binaclesSnapshot = await getDocs(q);
        
        console.log('firebase getBinaclesData')
        return binaclesSnapshot.docs.map(doc => {
            const row = doc.data()
            console.log('row',row)
            //row.fecha = (timestampToDate(row.fecha.seconds,row.fecha.nanoseconds)).toLocaleDateString();
            row.pacientFullName = row.pacient.nombre+' '+row.pacient.apaterno+' '+row.pacient.amaterno
            row.pacient.fnacimiento = new Date(row.pacient.fnacimiento.seconds * 1000) 
            return row
        })
    // }
}

export const BinaclesService = {
    async saveToDatabase(binacle) {
        console.log('save to database', binacle)
        binacle.timestamp = serverTimestamp()
        //binacle.fecha = (timestampToDate(binacle.fecha.seconds,binacle.fecha.nanoseconds)).toLocaleDateString();
        if (binacle.fecha.seconds && binacle.fecha.nanoseconds) {
            binacle.fecha = (timestampToDate(binacle.fecha.seconds,binacle.fecha.nanoseconds)).toLocaleDateString();
        }

        console.log('save to database',binacle)

        const docRef = doc(database, "binacles", binacle.id)
        await setDoc(docRef, binacle, { merge: true } )
    },
    getBinacles(fecha) {
        return Promise.resolve(getBinaclesDataByFecha(fecha))
    }
}