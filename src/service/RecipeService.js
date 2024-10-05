import { database } from "@/firebase";
import { collection, getDocs } from "firebase/firestore/lite";

export const RecipesService = 
{
    recipies: [],
    addRecipe(item) {
        let d = new Date(item.fecha),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        item.fechaFormated = [day, month, year].join('/');

        item.clinica = 'Mérida'
        item.employeeId = 1; // {1, Dr. Angel de la Luz Ramirez}
        this.recipies.push(item);
    },
    async getRecipeData() {
        const recipesCol = collection(database, 'recipes');
        const recipesSnapshot = await getDocs(recipesCol);
        this.recipes = recipesSnapshot.docs.map(doc => doc.data());
        
        console.log('recipesList',this.recipes.length)
        return this.recipes;
    },
    getRecipes() {
        return Promise.resolve(this.getRecipeData())
    },

}