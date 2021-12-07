import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { Menu } from 'semantic-ui-react';
import UserTotalItems from './UserTotalItems';
import UserTotalLocations from './UserTotalLocations';
import UserItemsTotalWeight from './UserItemsTotalWeight';
import UserTotalItemsWithImages from './UserTotalItemsWithImagesCount';

const userTotalItemsMenu = 'userTotalItems';
const userTotalLocationsMenu = 'userTotalLocations';
const userItemsTotalWeight = 'userItemsTotalWeight';
const userTotalItemsWithImagesCount = 'userTotalItemsWithImagesCount';

export default observer(function AdminDashboard() {
    const [activeMenu, setActiveMenu] = useState(userTotalItemsMenu);

    return (
        <>
            <Menu pointing secondary>
                <Menu.Item
                    name="Kasutaja esemete kogus"
                    active={activeMenu === userTotalItemsMenu}
                    onClick={() => setActiveMenu(userTotalItemsMenu)}
                />
                <Menu.Item
                    name="Kasutaja lisatud asukohtade arv"
                    active={activeMenu === userTotalLocationsMenu}
                    onClick={() => setActiveMenu(userTotalLocationsMenu)}
                />
                <Menu.Item
                    name="Kasutaja esemete kogu kaal"
                    active={activeMenu === userItemsTotalWeight}
                    onClick={() => setActiveMenu(userItemsTotalWeight)}
                />
                <Menu.Item
                    name="Kasutaja Esemete arv millel on pilt"
                    active={activeMenu === userTotalItemsWithImagesCount}
                    onClick={() => setActiveMenu(userTotalItemsWithImagesCount)}
                />
            </Menu>
            {activeMenu === userTotalItemsMenu && <UserTotalItems />}
            {activeMenu === userTotalLocationsMenu && <UserTotalLocations />}
            {activeMenu === userItemsTotalWeight && <UserItemsTotalWeight />}
            {activeMenu === userTotalItemsWithImagesCount && (
                <UserTotalItemsWithImages />
            )}
        </>
    );
});
