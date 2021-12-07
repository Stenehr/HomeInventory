import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { Button, Grid, Header, Segment } from 'semantic-ui-react';
import LoginForm from '../features/user/LoginForm';
import RegisterForm from '../features/user/RegisterForm';
import { useStore } from '../stores/store';
import { useHistory } from 'react-router';

const loginOpen = 'loginOpen';
const registerOpen = 'registerOpen';

export default observer(function HomePage() {
    const [formState, setFormState] = useState(null);

    const history = useHistory();
    const {
        userStore: { isAdmin, isRegularUser }
    } = useStore();

    function handleBackClick() {
        setFormState(null);
    }

    if (isRegularUser) {
        history.push('/items');
    }

    if (isAdmin) {
        history.push('/admin');
    }

    return (
        <Grid centered style={{ marginTop: '5em' }}>
            <Grid.Row centered>
                <Grid.Column textAlign="center">
                    <Header as="h1">Minu asjad</Header>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column computer="6" tablet="10" mobile="16">
                    <Segment padded>
                        {!formState && (
                            <Grid centered>
                                <Button
                                    content="Logi sisse"
                                    onClick={() => setFormState(loginOpen)}
                                />
                                <Button
                                    content="Registreeri"
                                    onClick={() => setFormState(registerOpen)}
                                />
                            </Grid>
                        )}
                        {formState === loginOpen && (
                            <LoginForm handleBackClick={handleBackClick} />
                        )}
                        {formState === registerOpen && (
                            <RegisterForm handleBackClick={handleBackClick} />
                        )}
                    </Segment>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
});
