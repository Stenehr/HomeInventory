import { useFormik } from 'formik';
import { observer } from 'mobx-react-lite';
import { Button, Form, Message } from 'semantic-ui-react';
import { useStore } from '../../stores/store';
import * as yup from 'yup';
import { useState } from 'react';
import getFormikErrors from '../../utils';

export default observer(function RegisterForm({ handleBackClick }) {
    const { userStore } = useStore();

    const [errorMessage, setErrorMessage] = useState(null);

    const formik = useFormik({
        initialValues: {
            userName: '',
            password: '',
            passwordConfirm: ''
        },
        onSubmit: values =>
            userStore.register(values).catch(error => {
                const { data } = error.response;
                setErrorMessage(data);
            }),
        validationSchema: yup.object({
            userName: yup
                .string()
                .min(4, 'Kasutajanimi peab olema vähemalt 4 tähemärki')
                .required('Kasutajanimi on kohustuslik'),
            password: yup
                .string()
                .min(4, 'Parool peab olema vähemalt 4 tähemärki')
                .required('Parool on kohustuslik'),
            passwordConfirm: yup
                .string()
                .oneOf([yup.ref('password')], 'Paroolid ei ühti')
        })
    });

    return (
        <Form
            error={!!errorMessage}
            onSubmit={formik.handleSubmit}
            loading={formik.isSubmitting}
            autoComplete="off"
        >
            <Form.Input
                name="userName"
                label="Kasutajanimi"
                autoFocus
                onChange={formik.handleChange}
                value={formik.values.userName}
                error={getFormikErrors(formik, 'userName')}
            />
            <Form.Input
                type="password"
                name="password"
                label="Parool"
                onChange={formik.handleChange}
                value={formik.values.password}
                error={getFormikErrors(formik, 'password')}
            />
            <Form.Input
                type="password"
                name="passwordConfirm"
                label="Korda parooli"
                onChange={formik.handleChange}
                value={formik.values.passwordConfirm}
                error={getFormikErrors(formik, 'passwordConfirm')}
            />
            <Message error content={errorMessage} />
            <Button type="submit" positive content="Registreeri" />
            <Button content="Tagasi" onClick={handleBackClick} />
        </Form>
    );
});
