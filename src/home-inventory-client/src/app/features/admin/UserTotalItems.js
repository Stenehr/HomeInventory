import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Grid, Table } from 'semantic-ui-react';
import LoadingComponent from '../../components/LoadingComponent';
import { useStore } from '../../stores/store';

export default observer(function UserTotalItems() {
    const {
        adminStore: { userTotalItems, loading, loadUserTotalItems }
    } = useStore();

    useEffect(() => {
        loadUserTotalItems();
    }, [loadUserTotalItems]);

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
                            <Table.HeaderCell>Esemete kogus</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {userTotalItems.map(userTotalItem => (
                            <Table.Row key={userTotalItem.userName}>
                                <Table.Cell>
                                    {userTotalItem.userName}
                                </Table.Cell>
                                <Table.Cell>
                                    {userTotalItem.itemCount}
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </Grid.Column>
        </Grid>
    );
});
