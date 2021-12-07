import { makeAutoObservable, runInAction } from 'mobx';
import api from '../api';

export default class InventoryStore {
    items = [];
    selectedItem = null;
    itemLocations = [];
    itemConditions = [];
    itemLoading = false;
    itemLocationsLoaded = false;
    itemConditionsLoaded = false;

    constructor() {
        makeAutoObservable(this);
    }

    loadItems = async filter => {
        this.itemLoading = true;
        try {
            const result = await api.inventory.getAll(
                this.createUrlParams(filter)
            );

            runInAction(() => {
                this.items = result;
            });
        } catch (ex) {
            console.log(ex);
        } finally {
            runInAction(() => (this.itemLoading = false));
        }
    };

    createUrlParams = filter => {
        const searchParams = new URLSearchParams();
        Object.keys(filter ?? {}).forEach(key => {
            const filterValue = filter[key];
            if (filterValue) {
                searchParams.append(key, filterValue);
            }
        });

        return searchParams;
    };

    loadItemLocations = async () => {
        try {
            const itemLocations = await api.itemLocation.getAll();
            runInAction(() => {
                this.itemLocations = itemLocations;
                this.itemLocationsLoaded = true;
            });
        } catch (ex) {
            console.log(ex);
        }
    };

    getItemLocation = id => {
        return this.itemLocations.find(x => x.id === id);
    };

    createItemLocation = async itemLocationDto => {
        try {
            const itemLocation = await api.itemLocation.create(itemLocationDto);
            runInAction(() => {
                this.itemLocationsLoaded = false;
            });

            return itemLocation;
        } catch (ex) {
            console.log(ex);
        }
    };

    loadItemConditions = async () => {
        try {
            const itemConditions = await api.itemCondition.getAll();
            runInAction(() => {
                this.itemConditions = itemConditions;
                this.itemConditionsLoaded = true;
            });
        } catch (ex) {
            console.log(ex);
        }
    };

    createItemCondition = async itemConditionDto => {
        try {
            const itemCondition = await api.itemCondition.create(
                itemConditionDto
            );
            runInAction(() => {
                this.itemConditionsLoaded = false;
            });

            return itemCondition;
        } catch (ex) {
            console.log(ex);
        }
    };

    createItem = async itemDto => {
        try {
            const formData = this.createFormData(itemDto);
            const result = await api.inventory.create(formData);
            runInAction(() => {
                this.items.push(result);
                this.selectedItem = result;
            });
            return result;
        } catch (ex) {
            console.log(ex);
        }
    };

    updateItem = async (id, itemDto) => {
        try {
            const formData = this.createFormData(itemDto);
            const result = await api.inventory.edit(id, formData);
            runInAction(() => {
                const index = this.items.map(i => i.id).indexOf(id);
                this.items.splice(index, 1, result);
                this.selectedItem = result;
            });
        } catch (ex) {
            console.log(ex);
        }
    };

    createFormData = itemDto => {
        const formData = new FormData();
        Object.keys(itemDto).forEach(key => {
            let value = itemDto[key];
            if (value === undefined || value === null) {
                formData.append(key, '');
            } else {
                formData.append(key, value);
            }
        });

        return formData;
    };

    loadSelectedItem = async id => {
        this.itemLoading = true;
        try {
            const item =
                this.items.find(i => i.id === Number(id)) ??
                (await api.inventory.get(id));
            runInAction(() => (this.selectedItem = item));
        } catch (ex) {
            console.log(ex);
        } finally {
            runInAction(() => (this.itemLoading = false));
        }
    };
}
