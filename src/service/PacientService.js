import { database } from "@/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore/lite";

export const PacientService = {
    async saveNewPacientToDatabase(newPacient) {
        // try {
            newPacient.amaterno = ((newPacient.amaterno) ? newPacient.amaterno : '')
            const docRef = await addDoc(collection(database, 'pacients'), newPacient)
            console.log("New pacient written with ID: ", docRef.id);
            return docRef.id
        // } catch (e) {
        //     console.error("Error adding recipe: ", e);
        // }
    },
    async modifyPacientToDatabase() {
        
    },
    async getPacientsData() {
        const pacientsCollection = collection(database, 'pacients')
        const pacientsSnapshot = await getDocs(pacientsCollection)
        
        console.log('firebase pacients')
        return pacientsSnapshot.docs.map(document => {
            const doc = document.data()
            doc.fnacimiento = new Date(doc.fnacimiento.seconds * 1000) 
            return doc
        })
    },
    getPacients() {
        return Promise.resolve(this.getPacientsData());
    }
};
    