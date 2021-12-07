export default function getFormikErrors(formik, fieldName) {
    const fieldMeta = formik.getFieldMeta(fieldName);
    return fieldMeta.touched && fieldMeta.error;
}

export function base64ImageStringToImageSrc(base64image, mimeType) {
    return `data:${mimeType};base64,${base64image}`;
}

export function mapItemClassifierToSelectItem(classifier, textKey) {
    return {
        key: classifier.id,
        value: classifier.id,
        text: classifier[textKey]
    };
}

export function handleFloatKeyPress(event) {
    if (!/^\d*\.?\d?$/g.test(event.key)) {
        event.preventDefault();
    }
    if (event.key === '.' && event.target.value.includes('.')) {
        event.preventDefault();
    }
}
