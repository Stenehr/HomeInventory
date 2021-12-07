import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Grid, Table } from 'semantic-ui-react';
import LoadingComponent from '../../components/LoadingComponent';
import { useStore } from '../../stores/store';

export default observer(function UserTotalLocations() {
    const {
        adminStore: { userTotalLocations, loading, loadUserTotalLocations }
    } = useStore();

    useEffect(() => {
        loadUserTotalLocations();
    }, [loadUserTotalLocations]);

    if (loading) {
        return <LoadingComponent />;
    }

    return (
        <Grid centered>
            <Grid.Column computer="8" tablet="16">
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Kasutaja</Table.HeaderCell>
                            <Table.HeaderCell>Asukohtade arv</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {userTotalLocations.map(userTotalLocation => (
                            <Table.Row key={userTotalLocation.userName}>
                                <Table.Cell>
                                    {userTotalLocation.userName}
                                </Table.Cell>
                                <Table.Cell>
                                    {userTotalLocation.locationCount}
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </Grid.Column>
        </Grid>
    );
});
