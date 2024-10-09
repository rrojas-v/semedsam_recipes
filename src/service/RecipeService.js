import { database } from "@/firebase";
import { collection, getDocs } from "firebase/firestore/lite";

function timestampToDate(seconds, nanoseconds = 0) {
    // Convertimos los segundos a milisegundos y sumamos los nanosegundos en microsegundos
    const milliseconds = (seconds * 1000) + (nanoseconds / 1000000);
    
    // Creamos el objeto Date
    const date = new Date(milliseconds);

    return date;
}
//ToDo: add caching support
export const RecipesService = 
{
    recipes: [],
    addRecipe(item) {
        this.recipes.push(item);
    },
    async getRecipesData() {
        const recipesCollection = collection(database, 'recipes');
        const recipesSnapshot = await getDocs(recipesCollection);
        
        console.log('firebase recipes')
        return recipesSnapshot.docs.map(doc => {
            const row = doc.data()
            row.fecha = (timestampToDate(row.fecha.seconds,row.fecha.nanoseconds)).toLocaleDateString();
            row.pacientFullName = row.pacient.nombre+' '+row.pacient.apaterno+' '+row.pacient.amaterno
            console.log('recipes', row)
            return row
        })
    },
    getRecipes() {
        return Promise.resolve(this.getRecipesData())
    },

}