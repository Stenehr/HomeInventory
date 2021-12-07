import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Grid, Table } from 'semantic-ui-react';
import LoadingComponent from '../../components/LoadingComponent';
import { useStore } from '../../stores/store';

export default observer(function UserTotalItemsWithImagesCount() {
    const {
        adminStore: {
            userTotalItemsWithImagesCount,
            loading,
            loadUserTotalItemsWithImagesCount
        }
    } = useStore();

    useEffect(() => {
        loadUserTotalItemsWithImagesCount();
    }, [loadUserTotalItemsWithImagesCount]);

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
                            <Table.HeaderCell>
                                Esemete arv millel on pilt
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {userTotalItemsWithImagesCount.map(
                            userItemImagesCount => (
                                <Table.Row key={userItemImagesCount.userName}>
                                    <Table.Cell>
                                        {userItemImagesCount.userName}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {userItemImagesCount.imageCount}
                                    </Table.Cell>
                                </Table.Row>
                            )
                        )}
                    </Table.Body>
                </Table>
            </Grid.Column>
        </Grid>
    );
});
