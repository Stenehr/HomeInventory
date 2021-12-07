import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Grid, Segment } from 'semantic-ui-react';
import LoadingComponent from '../../components/LoadingComponent';
import { useStore } from '../../stores/store';
import ItemFilter from './ItemFilter';
import ListItem from './ListItem';

export default observer(function ItemList() {
    const {
        inventoryStore: { items, loadItems, itemLoading }
    } = useStore();

    useEffect(() => {
        loadItems();
    }, [loadItems]);

    return (
        <>
            <Segment>
                <ItemFilter />
            </Segment>
            <Grid>
                {itemLoading ? (
                    <LoadingComponent />
                ) : (
                    items?.map(item => (
                        <Grid.Column key={item?.id} computer="4" mobile="16">
                            <ListItem item={item} />
                        </Grid.Column>
                    ))
                )}
            </Grid>
        </>
    );
});
