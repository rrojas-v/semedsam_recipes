import { database } from "@/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore/lite";

const getPacientsData = async () => {
    const pacientsCollection = collection(database, 'pacients')
    const pacientsSnapshot = await getDocs(pacientsCollection)
    
    return pacientsSnapshot.docs.map(document => {
        const doc = document.data()
        doc.fnacimiento = new Date(doc.fnacimiento.seconds * 1000) 
        return doc
    })
}
export const PacientService = {
    async saveNewPacientToDatabase(newPacient) {
        newPacient.amaterno = ((newPacient.amaterno) ? newPacient.amaterno : '')
        const docRef = await addDoc(collection(database, 'pacients'), newPacient)
        console.log("New pacient written with ID: ", docRef.id);
        return docRef.id
    },
    async modifyPacientToDatabase() {
        
    },
    
    getPacients() {
        return Promise.resolve(getPacientsData());
    }
};
    