import { database } from "@/firebase"
import { collection, getDocs } from "firebase/firestore/lite"

export const SaleTicketService = {
    saleTickets: [],
    async getSaleTicketsData() {
        if (!this.saleTickets.length) {
            const saleTicketsCollection = collection(database, 'tickets')
            const saleTicketsSnapshot = await getDocs(saleTicketsCollection)
            this.saleTickets = saleTicketsSnapshot.docs.map(doc => doc.data())
            return this.saleTickets
        }
    },
    getSaleTickets() {
        return Promise.resolve(this.getSaleTicketsData())
    }
}