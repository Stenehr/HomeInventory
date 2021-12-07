import { useHistory } from 'react-router';
import { Button, Container, Menu } from 'semantic-ui-react';
import { useStore } from '../stores/store';
import { Link } from 'react-router-dom';

export default function NavBar() {
    const {
        userStore: { logout, isAdmin, isRegularUser }
    } = useStore();
    const history = useHistory();

    function handleLogout() {
        logout();
        history.push('/');
    }

    return (
        <Menu fixed="top">
            <Container>
                {isAdmin && (
                    <Menu.Item as={Link} to="/admin" header>
                        Admin
                    </Menu.Item>
                )}
                {isRegularUser && (
                    <Menu.Item as={Link} to="/items" header>
                        Minu asjad
                    </Menu.Item>
                )}
                {isRegularUser && (
                    <Menu.Item>
                        <Button
                            positive
                            content="Lisa ese"
                            as={Link}
                            to="/add-item"
                        />
                    </Menu.Item>
                )}
                <Menu.Item position="right">
                    <Button
                        onClick={handleLogout}
                        content="Logi välja"
                        icon="power"
                    />
                </Menu.Item>
            </Container>
        </Menu>
    );
}
