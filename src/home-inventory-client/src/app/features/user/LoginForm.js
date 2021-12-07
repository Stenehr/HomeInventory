import { useFormik } from 'formik';
import { observer } from 'mobx-react-lite';
import { Button, Form, Message } from 'semantic-ui-react';
import { useStore } from '../../stores/store';
import * as yup from 'yup';
import { useState } from 'react';
import getFormikErrors from '../../utils';

export default observer(function LoginForm({ handleBackClick }) {
    const { userStore } = useStore();

    const [errorMessage, setErrorMessage] = useState(null);

    const formik = useFormik({
        initialValues: {
            userName: '',
            password: ''
        },
        onSubmit: values =>
            userStore.login(values).catch(() => {
                setErrorMessage('Vale kasutajanimi või parool');
            }),
        validationSchema: yup.object({
            userName: yup
                .string()
                .min(4, 'Kasutajanimi peab olema vähemalt 4 tähemärki')
                .required('Kasutajanimi on kohustuslik'),
            password: yup
                .string()
                .min(4, 'Parool peab olema vähemalt 4 tähemärki')
                .required('Parool on kohustuslik')
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
            <Message error content={errorMessage} />
            <Button type="submit" positive content="Logi sisse" />
            <Button content="Tagasi" onClick={handleBackClick} />
        </Form>
    );
});
