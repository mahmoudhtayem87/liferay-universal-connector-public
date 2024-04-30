import {forwardRef, useImperativeHandle, useState} from "react";
import {useFormik} from "formik";
import ClayForm from "@clayui/form";
import {AUTH_TYPES} from "../../utils/constants";


const URLConnection = forwardRef((props, ref) => {

    const [authType, setAuthType] = useState(null);


    const {handleSave} = props;

    const {errors, handleChange, handleSubmit, touched} = useFormik({
        initialValues: {
            name: '',
            host: '',
            paging:false,
            authType:null,
            username:'',
            password:'',
            token:''
        },
        onSubmit: (values) => {
            handleSave(values);
        },
        validate: (values) => {

            setAuthType(values.authType);

            const errors = {};

            if (!values.name) {
                errors.name = 'Required';
            }

            if (!values.host) {
                errors.host = 'Required';
            }

            if (!values.authType) {
                errors.authType = 'Required';
            }

            if (values.authType) {
                if (values.authType === 'basic') {
                    if (!values.username) {
                        errors.username = 'Required';
                    }

                    if (!values.password) {
                        errors.password = 'Required';
                    }
                }

                if (values.authType === 'bearer_token') {
                    if (!values.token) {
                        errors.token = 'Required';
                    }
                }
            }

            return errors;

        },
    });

    useImperativeHandle(ref, () => ({
        handleSubmit,
    }));

    return (
        <>
            <form onSubmit={handleSubmit}>
                <ClayForm.Group className="form-group-sm">
                    <label htmlFor="name">Name</label>

                    <input
                        className="form-control"
                        id="name"
                        onChange={handleChange}
                    />

                    {errors.name && touched.name && (
                        <div className="form-feedback-item mt-2 text-2 text-danger">
                            {errors.name}
                        </div>
                    )}
                </ClayForm.Group>

                <ClayForm.Group className="form-group-sm">
                    <label htmlFor="host">Endpoint host</label>

                    <input
                        className="form-control"
                        id="host"
                        onChange={handleChange}
                    />

                    {errors.host && touched.host && (
                        <div className="form-feedback-item mt-2 text-2 text-danger">
                            {errors.host}
                        </div>
                    )}
                </ClayForm.Group>

                <ClayForm.Group className="form-group-sm">

                    <div class="autofit-row">
                        <div class="autofit-col d-flex">

                            <input
                                id="paging"
                                class="my-auto mr-3"
                                type="checkbox"
                                onChange={handleChange}
                            />

                        </div>

                        <div class="autofit-col autofit-col-expand d-flex">

                            <span class="my-auto" htmlFor="paging">Endpoint Support Paging <strong>By Page Id</strong> and <strong>Page Size</strong> Query Parameters</span>

                        </div>

                    </div>

                </ClayForm.Group>

                <ClayForm.Group className="form-group-sm">
                    <label htmlFor="authType">Authentication Type</label>

                    <select
                        className="form-control"
                        id="authType"
                        onChange={handleChange}
                    >
                        <option></option>

                        {AUTH_TYPES.map((type) => (
                            <option key={type.key} value={type.key}>
                                {type.label}
                            </option>
                        ))}
                    </select>

                    {errors.authType && touched.authType && (
                        <div className="form-feedback-item mt-2 text-2 text-danger">
                            {errors.authType}
                        </div>
                    )}
                </ClayForm.Group>

                {authType && authType === 'basic' && (
                    <>
                        <ClayForm.Group className="form-group-sm">
                            <label htmlFor="username">User Name</label>

                            <input
                                className="form-control"
                                id="username"
                                onChange={handleChange}
                            />

                            {errors.username && touched.username && (
                                <div className="form-feedback-item mt-2 text-2 text-danger">
                                    {errors.username}
                                </div>
                            )}
                        </ClayForm.Group>

                        <ClayForm.Group className="form-group-sm">
                            <label htmlFor="password">Password</label>

                            <input
                                className="form-control"
                                id="password"
                                onChange={handleChange}
                                type="password"
                            />

                            {errors.password && touched.password && (
                                <div className="form-feedback-item mt-2 text-2 text-danger">
                                    {errors.password}
                                </div>
                            )}
                        </ClayForm.Group>
                    </>
                )}

                {authType && authType === 'bearer_token' && (
                    <>
                        <ClayForm.Group className="form-group-sm">
                            <label htmlFor="token">Bearer Token</label>

                            <input
                                className="form-control"
                                id="token"
                                onChange={handleChange}
                            />

                            {errors.token && touched.token && (
                                <div className="form-feedback-item mt-2 text-2 text-danger">
                                    {errors.token}
                                </div>
                            )}
                        </ClayForm.Group>
                    </>
                )}

            </form>
        </>
    );

});

export default URLConnection;
