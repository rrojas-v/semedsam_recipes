// {
//     id: '0',
//     description: '',
// }
export const MedicationsService = {
    getMedicationsData() {
        return [{
            id: '1',
            name:'', 
            cantidad: '',
            cada: '',
            durante: '',
            viaadmin: ''
        }];
    },
    getMedications() {
        return Promise.resolve(this.getMedicationsData());
    },
};
