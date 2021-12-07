import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { useStore } from '../../stores/store';
import {
    handleFloatKeyPress,
    mapItemClassifierToSelectItem
} from '../../utils';

export default observer(function ItemFilter() {
    const {
        inventoryStore: {
            loadItems,
            itemLoading,
            itemLocations,
            itemLocationsLoaded,
            loadItemLocations,
            itemConditions,
            loadItemConditions,
            itemConditionsLoaded
        }
    } = useStore();

    function getBaseState() {
        return {
            name: '',
            serialNumber: '',
            description: '',
            itemLocationId: null,
            itemConditionId: null,
            weightHeavierThen: null,
            weightLighterThen: null
        };
    }

    const [filter, setFilter] = useState(getBaseState);
    const [itemLocationSelectItems, setItemLocationSelectItems] = useState([]);
    const [itemConditionSelectItems, setItemConditionSelectItems] = useState(
        []
    );

    useEffect(() => {
        loadItems(filter);
    }, [filter, loadItems]);

    useEffect(() => {
        function mapItemLocations() {
            setItemLocationSelectItems([
                { key: 0, value: undefined, text: '---vali---' },
                ...itemLocations.map(x =>
                    mapItemClassifierToSelectItem(x, 'name')
                )
            ]);
        }

        if (!itemLocationsLoaded) {
            loadItemLocations().then(mapItemLocations);
        } else {
            mapItemLocations();
        }
    }, [itemLocations, loadItemLocations, itemLocationsLoaded]);

    useEffect(() => {
        function mapItemConditions() {
            setItemConditionSelectItems([
                { key: 0, value: undefined, text: '---vali---' },
                ...itemConditions.map(x =>
                    mapItemClassifierToSelectItem(x, 'condition')
                )
            ]);
        }

        if (!itemConditionsLoaded) {
            loadItemConditions().then(mapItemConditions);
        } else {
            mapItemConditions();
        }
    }, [itemConditions, loadItemConditions, itemConditionsLoaded]);

    function handleChange(_, { name, value }) {
        setFilter({
            ...filter,
            [name]: value
        });
    }

    return (
        <Form>
            <Form.Group widths="equal">
                <Form.Input
                    name="name"
                    label="Nimi"
                    value={filter.name}
                    onChange={handleChange}
                />
                <Form.Input
                    name="serialNumber"
                    label="Seerianumber"
                    value={filter.serialNumber}
                    onChange={handleChange}
                />
                <Form.Input
                    name="description"
                    label="Kirjeldus"
                    value={filter.description}
                    onChange={handleChange}
                />
                <Form.Input
                    name="weightHeavierThen"
                    label="Kaal raskem, kui (kg)"
                    onKeyPress={handleFloatKeyPress}
                    onChange={handleChange}
                    value={filter.weightHeavierThen}
                />
                <Form.Input
                    name="weightLighterThen"
                    label="Kaal kergem, kui (kg)"
                    onKeyPress={handleFloatKeyPress}
                    onChange={handleChange}
                    value={filter.weightLighterThen}
                />
            </Form.Group>
            <Form.Group>
                <Form.Select
                    width="10"
                    name="itemLocationId"
                    label="Vali asukoht"
                    placeholder="Vali asukoht..."
                    options={itemLocationSelectItems}
                    value={filter.itemLocationId}
                    onChange={handleChange}
                />
                <Form.Select
                    width="6"
                    name="itemConditionId"
                    label="Vali seisukord"
                    placeholder="Vali seisukord..."
                    options={itemConditionSelectItems}
                    value={filter.itemConditionId}
                    onChange={handleChange}
                />
            </Form.Group>
            <Button
                type="button"
                onClick={() => setFilter(getBaseState())}
                content="Tühjenda"
                disabled={itemLoading}
            />
        </Form>
    );
});
