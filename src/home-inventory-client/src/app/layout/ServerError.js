import { useLocation } from 'react-router';
import { Header, Segment } from 'semantic-ui-react';

export default function ServerError() {
    const location = useLocation();
    const appException = location.state;

    return (
        <Segment>
            <Header as="h3">
                {appException.statusCode} - {appException.message}
            </Header>
            <code>{appException.details}</code>
        </Segment>
    );
}
