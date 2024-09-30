import { reactive } from "vue";

export const RecipesService = reactive({
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
        this.recipies.push(item);
    },
    getRecipeData() {
        return this.recipies;
    },
    getRecipes() {
        return Promise.resolve(this.getRecipeData());
    },
});