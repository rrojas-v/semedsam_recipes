import { database } from "@/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore/lite";

export const PacientService = {
    async savePacientToDatabase(newPacient) {
        try {
            newPacient.amaterno = ((newPacient.amaterno) ? newPacient.amaterno : '')
            const docRef = await addDoc(collection(database, 'pacients'), newPacient)
            console.log("New pacient written with ID: ", docRef.id);
            return docRef.id
        } catch (e) {
            console.error("Error adding recipe: ", e);
        }
    },
    async getPacientsData() {
        const pacientsCollection = collection(database, 'pacients')
        const pacientsSnapshot = await getDocs(pacientsCollection)
        
        console.log('firebase pacients')
        return pacientsSnapshot.docs.map(doc => doc.data())
    },
    getPacients() {
        return Promise.resolve(this.getPacientsData());
    }
};
    