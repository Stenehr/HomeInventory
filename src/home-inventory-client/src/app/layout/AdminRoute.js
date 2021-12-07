import { observer } from 'mobx-react-lite';
import { Redirect, Route } from 'react-router';
import { useStore } from '../stores/store';

export default observer(function AdminRoute({ component: Component, ...rest }) {
    const {
        userStore: { isAdmin }
    } = useStore();

    return (
        <Route
            {...rest}
            render={props =>
                isAdmin ? <Component {...props} /> : <Redirect to="/" />
            }
        />
    );
});
