import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ItemsDashboard from '../features/inventory/ItemsDashboard';
import { Route, Switch } from 'react-router';
import HomePage from './HomePage';
import { useStore } from '../stores/store';
import NotFound from './NotFound';
import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import LoadingComponent from '../components/LoadingComponent';
import ItemForm from '../features/inventory/ItemForm';
import ItemDetails from '../features/inventory/ItemDetails';
import UserRoute from './UserRoute';
import AdminRoute from './AdminRoute';
import AdminDashboard from '../features/admin/AdminDashboard';
import ServerError from './ServerError';

export default observer(function App() {
    const {
        appStore,
        userStore: { token, getUser, isLoggedIn }
    } = useStore();

    useEffect(() => {
        if (token) {
            getUser().finally(() => appStore.setAppLoaded());
        } else {
            appStore.setAppLoaded();
        }
    }, [token, getUser, appStore]);

    if (!appStore.appLoaded) {
        return <LoadingComponent />;
    }

    return (
        <>
            <Route exact path="/" component={HomePage} />
            <Route
                path={'/(.+)'}
                render={() => (
                    <>
                        {isLoggedIn && <NavBar />}
                        <Container style={{ marginTop: '7em' }}>
                            <Switch>
                                <UserRoute
                                    path="/items"
                                    component={ItemsDashboard}
                                />
                                <UserRoute
                                    path="/details/:id"
                                    component={ItemDetails}
                                />
                                <UserRoute
                                    path={['/add-item', '/edit-item/:id']}
                                    component={ItemForm}
                                />
                                <AdminRoute
                                    path="/admin"
                                    component={AdminDashboard}
                                />
                                <Route
                                    path="/server-error"
                                    component={ServerError}
                                />
                                <Route component={NotFound} />
                            </Switch>
                        </Container>
                    </>
                )}
            />
        </>
    );
});
