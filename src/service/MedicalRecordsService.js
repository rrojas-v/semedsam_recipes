import { database } from "@/firebase";
import { collection, getDocs, query, where } from "firebase/firestore/lite";

export const MedicalRecordsService = {
    async getMedicalRecordsData(pacientCode) {
        if (pacientCode) {
            const Ref = collection(database, "medicalRecords");            
            const q = query(Ref, where("pacient.code", "==", pacientCode));
            const querySnapshot = await getDocs(q);
            this.medicalRecords = querySnapshot.docs.map(document => {
                let doc = document.data()
                doc.fecha  = (new Date(doc.fecha.seconds * 1000)).toLocaleDateString()
                return doc
            });
            return this.medicalRecords
        }
        else return [];
    },
    getMedicalRecords(pacientCode) {
        return Promise.resolve(this.getMedicalRecordsData(pacientCode));
    }
}