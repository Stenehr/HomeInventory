import { observer } from 'mobx-react-lite';
import { Redirect, Route } from 'react-router';
import { useStore } from '../stores/store';

export default observer(function UserRote({ component: Component, ...rest }) {
    const {
        userStore: { isRegularUser }
    } = useStore();

    return (
        <Route
            {...rest}
            render={props =>
                isRegularUser ? <Component {...props} /> : <Redirect to="/" />
            }
        />
    );
});
