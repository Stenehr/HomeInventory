import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import { Button, Header, Item, List, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { useStore } from '../../stores/store';
import { base64ImageStringToImageSrc } from '../../utils';
import LoadingComponent from '../../components/LoadingComponent';

export default observer(function ItemFilter() {
    const { id } = useParams();
    const {
        inventoryStore: { selectedItem, loadSelectedItem, itemLoading }
    } = useStore();

    useEffect(() => {
        if (!selectedItem || selectedItem.id !== Number(id))
            loadSelectedItem(id);
    }, [id, loadSelectedItem, selectedItem]);

    if (itemLoading || !selectedItem) {
        return <LoadingComponent />;
    }
    return (
        <Segment>
            <Item.Group>
                <Item>
                    {selectedItem.imageDto && (
                        <Item.Image
                            size="medium"
                            src={base64ImageStringToImageSrc(
                                selectedItem.imageDto.base64Image,
                                selectedItem.imageDto.mimeType
                            )}
                        />
                    )}
                    <Item.Content>
                        <Item.Header>{selectedItem.name}</Item.Header>
                        <List>
                            <List.Item>
                                <List.Content>
                                    Asukoht: {selectedItem.itemLocation.name}
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Content>
                                    Seerianumber: {selectedItem.serialNumber}
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Content>
                                    Kaal:{' '}
                                    {selectedItem.weight
                                        ? `${selectedItem.weight} kg`
                                        : ''}
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Content>
                                    Seisukord:{' '}
                                    {selectedItem.itemCondition?.condition}
                                </List.Content>
                            </List.Item>
                        </List>
                        <Item.Description>
                            <Header as="h4">Kirjeldus: </Header>
                            {selectedItem.description}
                        </Item.Description>
                        <div style={{ marginTop: '1em' }}>
                            <Button
                                content="Muuda"
                                as={Link}
                                to={`/edit-item/${selectedItem.id}`}
                            />
                            <Button content="Tagasi" as={Link} to="/items" />
                        </div>
                    </Item.Content>
                </Item>
            </Item.Group>
        </Segment>
    );
});
