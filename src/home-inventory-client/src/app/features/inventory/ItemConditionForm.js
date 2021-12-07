import { useFormik } from 'formik';
import { observer } from 'mobx-react-lite';
import { Button, Form, Segment } from 'semantic-ui-react';
import { useStore } from '../../stores/store';
import * as yup from 'yup';
import getFormikErrors from '../../utils';

export default observer(function ItemConditionForm({ handleAfterSubmit }) {
    const {
        inventoryStore: { createItemCondition }
    } = useStore();

    const formik = useFormik({
        initialValues: {
            condition: ''
        },
        onSubmit: async values => {
            const addedCondition = await createItemCondition(values);

            handleAfterSubmit(addedCondition);
        },
        validationSchema: yup.object({
            condition: yup.string().required('Seiskord on kohustuslik')
        })
    });

    return (
        <Segment loading={formik.isSubmitting}>
            <Form.Input
                autoFocus
                name="condition"
                label="Seisukord"
                onChange={formik.handleChange}
                value={formik.values.name}
                error={getFormikErrors(formik, 'name')}
            />
            <Button
                type="button"
                onClick={formik.handleSubmit}
                positive
                content="Lisa seisukord"
            />
        </Segment>
    );
});
