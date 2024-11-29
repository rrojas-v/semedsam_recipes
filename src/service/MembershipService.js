import { database } from "@/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore/lite";

export const MembershipService = {
    async saveNewMembershipToDatabase(newMembership) {
        const docRef = await addDoc(collection(database, 'memberships'), newMembership)
        return docRef.id
    },
    async getMembershipsData() {
        const membershipsCollection = collection(database, 'memberships')
        const membershipsSnapshot = await getDocs(membershipsCollection)
        
        return membershipsSnapshot.docs.map(document => {
            const doc = document.data()
            doc.vigenciaFin = new Date(doc.vigenciaIni.seconds * 1000) 
            return doc
        })
    },
    getMemberships() {
        return Promise.resolve(this.getMembershipsData());
    }
}