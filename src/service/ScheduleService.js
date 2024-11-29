import { database } from "@/firebase";
import { collection, getDocs, setDoc, doc, getDoc, query, where, serverTimestamp, orderBy } from "firebase/firestore/lite";

const getSchedulesData = async (fecha) => {
    const id = fecha.getFullYear()+'-'+fecha.getMonth()+'-'+fecha.getDate()
    const q = query(collection(database, 'schedules'), where("fecha", "==", id))
    const querySnapshot = await getDocs(q)

    let result = []
    querySnapshot.forEach((doc) => {
        //console.log(doc.data())
        result.push(doc.data())
    });
    return result
}
const getScheduleData = async (fecha) => {
    const hoy = fecha.getFullYear()+'-'+fecha.getMonth()+'-'+fecha.getDate()
    const docRef = doc(database, "schedules", hoy)
    const docSnap = await getDoc(docRef);
    const result = docSnap.data();
    console.log('getScheduleData',result)
    return result
}

export const SchedulesService = {
    async saveNewScheduleToDatabase(newSchedule) {
        if (!newSchedule.descripcion) 
            newSchedule.descripcion = ''

        const id = newSchedule.fecha.getFullYear().toString()
                    .concat('-',(newSchedule.fecha.getMonth()+1).toString())
                    .concat('-',newSchedule.fecha.getDate().toString())
                    .concat('-',newSchedule.hora)
        
        newSchedule.fecha = newSchedule.fecha.getFullYear()+'-'+newSchedule.fecha.getMonth()+'-'+newSchedule.fecha.getDate()
        newSchedule.timestamp = serverTimestamp()
        const docRef = doc(database, "schedules", id)   
        await setDoc(docRef, newSchedule, { merge: true } )
    },
    getSchedules(fecha) {
        return Promise.resolve(getSchedulesData(fecha));
    },
    getSchedule(fecha) {
        return Promise.resolve(getScheduleData(fecha));
    }
}