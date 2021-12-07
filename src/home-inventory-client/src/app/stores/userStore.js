import { makeAutoObservable, reaction, runInAction } from 'mobx';
import api from '../api';
import { history } from '../..';

const jwtKey = 'jwt';

export default class UserStore {
    user = null;
    token = window.localStorage.getItem(jwtKey);
    userLoading = false;

    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.token,
            token => {
                if (token) {
                    window.localStorage.setItem(jwtKey, token);
                } else {
                    window.localStorage.removeItem(jwtKey);
                    window.location.reload();
                }
            }
        );
    }

    get isLoggedIn() {
        return !!this.user;
    }

    get isAdmin() {
        return this.isLoggedIn && this.user.isAdmin;
    }

    get isRegularUser() {
        return this.isLoggedIn && !this.user.isAdmin;
    }

    login = async loginDto => {
        try {
            const user = await api.account.login(loginDto);
            this.setUser(user);
            if (user.isAdmin) {
                history.push('/admin');
            } else {
                history.push('/items');
            }
        } catch (error) {
            throw error;
        }
    };

    logout = () => {
        this.user = null;
        this.token = null;
    };

    register = async registerDto => {
        try {
            const user = await api.account.register(registerDto);
            this.setUser(user);
            history.push('/items');
        } catch (error) {
            throw error;
        }
    };

    getUser = async () => {
        this.userLoading = true;
        try {
            const user = await api.account.getUser();
            runInAction(() => {
                this.user = { ...user, token: this.token };
            });
        } finally {
            this.userLoading = false;
        }
    };

    setUser = user => {
        this.user = user;
        this.token = user.token;
    };
}
