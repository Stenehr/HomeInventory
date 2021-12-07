import { useFormik } from 'formik';
import { observer } from 'mobx-react-lite';
import { Button, Form, Header, Input, Segment } from 'semantic-ui-react';
import { useStore } from '../../stores/store';
import * as yup from 'yup';
import getFormikErrors from '../../utils';
import { useEffect, useState } from 'react';

export default observer(function ItemLocationForm({
    handleAfterSubmit,
    handleCloseForm,
    itemLocation,
    isLevelAdding
}) {
    const {
        inventoryStore: { createItemLocation }
    } = useStore();

    const [parentLocationId, setParentLocationId] = useState(null);
    const [locationNames, setLocationNames] = useState([]);

    useEffect(() => {
        if (itemLocation && isLevelAdding) {
            setLocationNames([itemLocation.name]);
            setParentLocationId(itemLocation.id);
        } else {
            setLocationNames([]);
            setParentLocationId(null);
        }
    }, [itemLocation, isLevelAdding]);

    const formik = useFormik({
        initialValues: {
            name: ''
        },
        onSubmit: async values => {
            const addedLocation = await createItemLocation({
                ...values,
                parentLocationId
            });
            setLocationNames([...locationNames, addedLocation.name]);
            setParentLocationId(addedLocation.id);
            formik.setFieldValue('name', '');
            formik.setTouched(false);

            if (locationNames.length > 0) {
                addedLocation.name = `${locationNames.join('/')}/${
                    addedLocation.name
                }`;
            }

            handleAfterSubmit(addedLocation);
        },
        validationSchema: yup.object({
            name: yup.string().required('Nimi on kohustuslik')
        })
    });

    return (
        <Segment loading={formik.isSubmitting}>
            <Header as="h4">
                {parentLocationId ? 'Täpsusta asukoht' : 'Lisa uus asukoht'}
            </Header>
            <Form.Field inline error={getFormikErrors(formik, 'name')}>
                <label>{locationNames.join('/')}/</label>
                <Input
                    autoFocus
                    name="name"
                    onChange={formik.handleChange}
                    value={formik.values.name}
                />
            </Form.Field>
            <Button
                type="button"
                onClick={formik.handleSubmit}
                positive
                content="Salvesta"
            />
            <Button type="button" onClick={handleCloseForm} content="Valmis" />
        </Segment>
    );
});
