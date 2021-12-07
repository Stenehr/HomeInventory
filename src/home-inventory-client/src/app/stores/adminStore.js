import { makeAutoObservable, runInAction } from 'mobx';
import api from '../api';

export default class AdminStore {
    userTotalItems = [];
    userTotalLocations = [];
    userItemsTotalWeight = [];
    userTotalItemsWithImagesCount = [];
    loading = false;

    constructor() {
        makeAutoObservable(this);
    }

    loadUserTotalItems = async () => {
        this.loading = true;
        try {
            const result = await api.admin.getUserTotalItem();
            runInAction(() => (this.userTotalItems = result));
        } catch (ex) {
            console.log(ex);
        } finally {
            runInAction(() => (this.loading = false));
        }
    };

    loadUserTotalLocations = async () => {
        this.loading = true;
        try {
            const result = await api.admin.getUserTotalLocations();
            runInAction(() => (this.userTotalLocations = result));
        } catch (ex) {
            console.log(ex);
        } finally {
            runInAction(() => (this.loading = false));
        }
    };

    loadUserItemsTotalWeight = async () => {
        this.loading = true;
        try {
            const result = await api.admin.getUserItemsTotalWeight();
            runInAction(() => (this.userItemsTotalWeight = result));
        } catch (ex) {
            console.log(ex);
        } finally {
            runInAction(() => (this.loading = false));
        }
    };

    loadUserTotalItemsWithImagesCount = async () => {
        this.loading = true;
        try {
            const result = await api.admin.getUserTotalItemsWithImagesCount();
            runInAction(() => (this.userTotalItemsWithImagesCount = result));
        } catch (ex) {
            console.log(ex);
        } finally {
            runInAction(() => (this.loading = false));
        }
    };
}
