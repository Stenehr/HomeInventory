import { useFormik } from 'formik';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { Button, Form, Grid, Icon, Image, Segment } from 'semantic-ui-react';
import * as yup from 'yup';
import { useStore } from '../../stores/store';
import getFormikErrors, {
    base64ImageStringToImageSrc,
    handleFloatKeyPress,
    mapItemClassifierToSelectItem
} from '../../utils';
import ItemConditionForm from './ItemConditionForm';
import ItemLocationForm from './ItemLocationForm';

export default observer(function ItemForm() {
    const {
        inventoryStore: {
            selectedItem,
            loadSelectedItem,
            itemLocations,
            loadItemLocations,
            itemLocationsLoaded,
            createItem,
            updateItem,
            getItemLocation,
            itemConditions,
            loadItemConditions,
            itemConditionsLoaded
        }
    } = useStore();

    const { id } = useParams();
    const history = useHistory();

    const [item, setItem] = useState({
        name: '',
        serialNumber: '',
        image: null,
        removeImage: false,
        description: '',
        itemLocationId: null,
        itemConditionId: null,
        weight: ''
    });

    const [addNewItemLocation, setAddNewItemLocation] = useState(false);
    const [addNewLocationLevel, setAddNewLocationLevel] = useState(false);
    const [itemLocationSelectItems, setItemLocationSelectItems] = useState([]);

    const [addNewItemCondition, setAddNewItemCondition] = useState(false);
    const [itemConditionSelectItems, setItemConditionSelectItems] = useState(
        []
    );

    const [previewImageSrc, setPreviewImageSrc] = useState(null);
    const [fileName, setFileName] = useState('');

    const fileRef = useRef();

    useEffect(() => {
        function mapItemLocations() {
            setItemLocationSelectItems(
                itemLocations.map(x => mapItemClassifierToSelectItem(x, 'name'))
            );
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
                { key: 0, value: null, text: '---vali---' },
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

    useEffect(() => {
        if (id) {
            if (!selectedItem || selectedItem.id !== Number(id)) {
                loadSelectedItem(id);
            } else {
                setItem({
                    name: selectedItem.name,
                    serialNumber: selectedItem.serialNumber,
                    image: null,
                    removeImage: false,
                    description: selectedItem.description,
                    itemLocationId: selectedItem.itemLocation?.id,
                    itemConditionId: selectedItem.itemCondition?.id,
                    weight: selectedItem.weight
                });
                const { imageDto } = selectedItem;
                if (!!imageDto) {
                    setPreviewImageSrc(
                        base64ImageStringToImageSrc(
                            imageDto.base64Image,
                            imageDto.mimeType
                        )
                    );
                    setFileName(imageDto.fileName);
                }
            }
        } else {
            setItem({
                name: '',
                serialNumber: '',
                image: null,
                removeImage: false,
                description: '',
                itemLocationId: null,
                itemConditionId: null,
                weight: ''
            });
            setPreviewImageSrc(null);
            setFileName(null);
        }
    }, [id, selectedItem, loadSelectedItem]);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: item,
        onSubmit: async values => {
            const weight = values.weight;
            const dto = {
                ...values,
                weight: weight?.toString()?.replace('.', ',')
            };

            if (id) {
                await updateItem(id, dto);
                history.push(`/details/${id}`);
            } else {
                const itemDto = await createItem(dto);
                history.push(`/details/${itemDto.id}`);
            }
        },
        validationSchema: yup.object({
            name: yup.string().required('Nimi on kohustuslik'),
            itemLocationId: yup.number().typeError('Asukoht on kohustuslik')
        })
    });

    function handleNewLocationAdded(addedItemLocation) {
        formik.setFieldValue('itemLocationId', addedItemLocation.id);
        setAddNewItemLocation(false);
        setAddNewLocationLevel(true);
    }

    function handleNewLocationFormClosed() {
        setAddNewItemLocation(false);
        setAddNewLocationLevel(false);
    }

    function handleNewConditionAdded(addedCondition) {
        setItemConditionSelectItems([
            ...itemConditionSelectItems,
            mapItemClassifierToSelectItem(addedCondition, 'condition')
        ]);

        formik.setFieldValue('itemConditionId', addedCondition.id);
        setAddNewItemCondition(false);
    }

    function handleFile(event) {
        const file = !!event.target.files && event.target.files[0];
        if (!file) {
            return;
        }
        setPreviewImageSrc(URL.createObjectURL(file));
        setFileName(file.name);
        formik.setFieldValue('image', file);
        formik.setFieldValue('removeImage', false);
    }

    function removeImage() {
        setPreviewImageSrc(null);
        setFileName(null);
        formik.setFieldValue('image', null);
        formik.setFieldValue('removeImage', true);
        fileRef.current.value = null;
    }

    return (
        <Grid centered>
            <Grid.Column tablet="16" computer="8">
                <Segment>
                    <Form
                        onSubmit={formik.handleSubmit}
                        loading={formik.isSubmitting}
                    >
                        <Form.Input
                            name="name"
                            label="Nimetus"
                            onChange={formik.handleChange}
                            value={formik.values.name}
                            error={getFormikErrors(formik, 'name')}
                        />
                        <Form.Input
                            name="serialNumber"
                            label="Seerianumber"
                            onChange={formik.handleChange}
                            value={formik.values.serialNumber}
                            error={getFormikErrors(formik, 'serialNumber')}
                        />
                        <Form.TextArea
                            name="description"
                            label="Kirjeldus"
                            onChange={formik.handleChange}
                            value={formik.values.description}
                            error={getFormikErrors(formik, 'description')}
                        />
                        <Form.Input
                            name="weight"
                            label="Kaal (kg)"
                            onKeyPress={handleFloatKeyPress}
                            onChange={formik.handleChange}
                            value={formik.values.weight}
                            error={getFormikErrors(formik, 'weight')}
                        />

                        <Grid style={{ marginBottom: '.5em' }}>
                            <Grid.Row>
                                <Grid.Column width="10">
                                    <Form.Select
                                        name="itemConditionId"
                                        label="Vali seisukord"
                                        placeholder="Vali seisukord..."
                                        options={itemConditionSelectItems}
                                        value={formik.values.itemConditionId}
                                        onChange={(_, { value }) => {
                                            formik.setFieldValue(
                                                'itemConditionId',
                                                value
                                            );
                                        }}
                                    />
                                </Grid.Column>
                                <Grid.Column width="6">
                                    <Button
                                        style={{ marginTop: '23px' }}
                                        color={
                                            addNewItemCondition ? 'red' : 'teal'
                                        }
                                        type="button"
                                        content={
                                            addNewItemCondition
                                                ? 'Tühista'
                                                : 'Lisa uus seisukord'
                                        }
                                        onClick={() =>
                                            setAddNewItemCondition(
                                                !addNewItemCondition
                                            )
                                        }
                                    />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                        {addNewItemCondition && (
                            <ItemConditionForm
                                handleAfterSubmit={handleNewConditionAdded}
                            />
                        )}

                        <Form.Select
                            name="itemLocationId"
                            label="Vali asukoht"
                            placeholder="Vali asukoht..."
                            options={itemLocationSelectItems}
                            value={formik.values.itemLocationId}
                            onChange={(_, { value }) => {
                                formik.setFieldValue('itemLocationId', value);
                            }}
                            error={getFormikErrors(formik, 'itemLocationId')}
                        />
                        {!addNewLocationLevel && formik.values.itemLocationId && (
                            <Button
                                color="teal"
                                type="button"
                                content="Lisa uus tase"
                                onClick={() => {
                                    setAddNewLocationLevel(true);
                                    setAddNewItemLocation(false);
                                }}
                            />
                        )}
                        {!addNewItemLocation && (
                            <Button
                                color="teal"
                                type="button"
                                content="Lisa uus asukoht"
                                onClick={() => {
                                    setAddNewItemLocation(true);
                                    setAddNewLocationLevel(false);
                                }}
                            />
                        )}
                        {(addNewItemLocation || addNewLocationLevel) && (
                            <ItemLocationForm
                                handleAfterSubmit={handleNewLocationAdded}
                                handleCloseForm={handleNewLocationFormClosed}
                                itemLocation={getItemLocation(
                                    formik.values.itemLocationId
                                )}
                                isLevelAdding={addNewLocationLevel}
                            />
                        )}

                        <div style={{ marginTop: '3em' }}>
                            {fileName && (
                                <Grid>
                                    <Grid.Row>
                                        <Grid.Column width="10">
                                            <Image
                                                centered
                                                src={previewImageSrc}
                                                size="small"
                                            />
                                        </Grid.Column>
                                        <Grid.Column width="6">
                                            {fileName && (
                                                <Button
                                                    icon
                                                    type="button"
                                                    onClick={removeImage}
                                                    color="red"
                                                    size="tiny"
                                                >
                                                    <Icon name="trash" />
                                                </Button>
                                            )}
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            )}
                            <Grid>
                                <Grid.Row>
                                    <Grid.Column width="8">
                                        <Button
                                            floated="left"
                                            type="button"
                                            content="Lisa pilt"
                                            icon="file"
                                            onClick={() =>
                                                fileRef.current.click()
                                            }
                                        />
                                        <Grid.Column />
                                        <Grid.Column width="8">
                                            {fileName && (
                                                <span>{fileName}</span>
                                            )}
                                        </Grid.Column>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            <input
                                hidden
                                ref={fileRef}
                                type="file"
                                onChange={handleFile}
                            />
                        </div>

                        <div style={{ marginTop: '2em' }}>
                            <Button type="submit" positive content="Salvesta" />
                            <Button
                                content="Tagasi"
                                type="button"
                                as={Link}
                                to={id ? `/details/${id}` : '/items'}
                            />
                        </div>
                    </Form>
                </Segment>
            </Grid.Column>
        </Grid>
    );
});
