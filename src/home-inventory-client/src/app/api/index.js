import axios from 'axios';
import { store } from '../stores/store';
import { history } from '../../index';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.request.use(config => {
    const token = store.userStore.token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axios.interceptors.response.use(
    response => response,
    error => {
        const data = error.data;
        const status = error.status;
        switch (status) {
            case 400:
                const { errors } = data;
                if (errors) {
                    const errorMessage = Object.keys(errors).map(key => {
                        return errors[key][0];
                    });
                    alert(errorMessage.join(','));
                } else {
                    alert(data);
                }
                break;
            case 404:
                history.push('/not-found');
                break;
            case 500:
                history.push('/server-error', data);
                break;
            default:
                return;
        }
    }
);

const getData = response => response?.data;

const requests = {
    get: url => axios.get(url).then(getData),
    post: (url, body) => axios.post(url, body).then(getData),
    put: (url, body) => axios.put(url, body).then(getData),
    delete: url => axios.delete(url).then(getData)
};

const accountEndpoint = '/account';
const account = {
    login: loginDto => requests.post(`${accountEndpoint}/login`, loginDto),
    register: registerDto =>
        requests.post(`${accountEndpoint}/register`, registerDto),
    getUser: () => requests.get(accountEndpoint)
};

const inventoryEndpoint = '/inventory';
const inventory = {
    getAll: searchParams =>
        axios.get(inventoryEndpoint, { params: searchParams }).then(getData),
    get: id => requests.get(`${inventoryEndpoint}/${id}`),
    create: itemFormData => requests.post(inventoryEndpoint, itemFormData),
    edit: (id, itemFormData) =>
        requests.put(`${inventoryEndpoint}/${id}`, itemFormData)
};

const itemLocationEndpoint = `${inventoryEndpoint}/item-location`;
const itemLocation = {
    getAll: () => requests.get(itemLocationEndpoint),
    create: itemLocationDto =>
        requests.post(itemLocationEndpoint, itemLocationDto)
};

const itemConditionEndpoit = `${inventoryEndpoint}/item-condition`;
const itemCondition = {
    getAll: () => requests.get(itemConditionEndpoit),
    create: itemLocationDto =>
        requests.post(itemConditionEndpoit, itemLocationDto)
};

const adminStatisticsEndpoint = '/admin/statistics';
const admin = {
    getUserTotalItem: () =>
        requests.get(`${adminStatisticsEndpoint}/user-total-items`),
    getUserTotalLocations: () =>
        requests.get(`${adminStatisticsEndpoint}/user-total-added-locations`),
    getUserItemsTotalWeight: () =>
        requests.get(`${adminStatisticsEndpoint}/user-total-items-weight`),
    getUserTotalItemsWithImagesCount: () =>
        requests.get(
            `${adminStatisticsEndpoint}/user-total-items-with-images-count`
        )
};

const api = {
    admin,
    account,
    inventory,
    itemLocation,
    itemCondition
};

export default api;
