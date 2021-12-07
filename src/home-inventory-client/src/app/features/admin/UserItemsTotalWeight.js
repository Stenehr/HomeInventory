import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Grid, Table } from 'semantic-ui-react';
import LoadingComponent from '../../components/LoadingComponent';
import { useStore } from '../../stores/store';

export default observer(function UserItemsTotalWeight() {
    const {
        adminStore: { userItemsTotalWeight, loading, loadUserItemsTotalWeight }
    } = useStore();

    useEffect(() => {
        loadUserItemsTotalWeight();
    }, [loadUserItemsTotalWeight]);

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
                            <Table.HeaderCell>Asjade kogukaal</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {userItemsTotalWeight.map(userItemTotalWeight => (
                            <Table.Row key={userItemTotalWeight.userName}>
                                <Table.Cell>
                                    {userItemTotalWeight.userName}
                                </Table.Cell>
                                <Table.Cell>
                                    {userItemTotalWeight.weight} kg
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </Grid.Column>
        </Grid>
    );
});
