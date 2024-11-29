// import { database } from "@/firebase";
// import { collection, getDocs, setDoc, doc, getDoc } from "firebase/firestore/lite";


// export const AppointmentService = {
//     async saveNewAppointmentToDatabase(newAppointment) {
//         await setDoc(doc(database, 'appointments', newSchedule.fecha.getFullYear()+'-'+newSchedule.fecha.getMonth()+'-'+newAppointment.fecha.getDate()), newAppointment)
//     },
//     getSchedules() {
//         return Promise.resolve(getSchedulesData());
//     },
//     getSchedule(fecha) {
//         return Promise.resolve(getScheduleData(fecha));
//     }
// }