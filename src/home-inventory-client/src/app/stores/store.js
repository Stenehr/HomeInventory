import { createContext, useContext } from 'react';
import AdminStore from './adminStore';
import AppStore from './appStore';
import InventoryStore from './inventoryStore';
import UserStore from './userStore';

export const store = {
    adminStore: new AdminStore(),
    appStore: new AppStore(),
    userStore: new UserStore(),
    inventoryStore: new InventoryStore()
};

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}
