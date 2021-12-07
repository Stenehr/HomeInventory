import { makeAutoObservable } from 'mobx';

export default class AppStore {
    appLoaded = false;

    constructor() {
        makeAutoObservable(this);
    }

    setAppLoaded = () => {
        this.appLoaded = true;
    };
}
