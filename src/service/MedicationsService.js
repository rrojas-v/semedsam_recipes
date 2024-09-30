export const MedicationsService = {
    getMedicationsData() {
        return [{
            id: '1',
            nombre:'', 
            // cantidad: '',
            // cada: '',
            // durante: '',
            // viaadmin: ''
        }];
    },
    getMedications() {
        return Promise.resolve(this.getMedicationsData());
    },
};
