export const MedicationsService = {
    getMedicationsData() {
        return [{
            id: '1',
            nombre:''
        }];
    },
    getMedications() {
        return Promise.resolve(this.getMedicationsData());
    },
};
