import {forwardRef, useImperativeHandle, useState} from "react";
import {useFormik} from "formik";
import ClayForm from "@clayui/form";
import {showError, showSuccess} from "../../utils/util";
import {discoverEntity} from "../../services/SalesforceConnectionUtil";


const SalesforceConnection = forwardRef((props, ref) => {

    const {handleSave} = props;

    const {errors, handleChange, handleSubmit, touched,values} = useFormik({
        initialValues: {
            clientSecret: '',
            entity:'',
            loginUrl:'',
            name: '',
            password:'',
            username:''
        },
        onSubmit: (values) => {

            discoverEntity(values).then(result => {
                handleSave({
                    ...result,
                    name:values.name,
                    primaryKey:result.primaryKey
                });
            },error=>{
                showError('Error',error.error);
            })

        },
        validate: (values) => {

            const errors = {};

            if (!values.clientSecret) {
                errors.clientSecret = 'Required';
            }

            if (!values.loginUrl) {
                errors.loginUrl = 'Required';
            }

            if (!values.name) {
                errors.name = 'Required';
            }

            if (!values.password) {
                errors.password = 'Required';
            }

            if (!values.entity) {
                errors.entity = 'Required';
            }

            if (!values.username) {
                errors.username = 'Required';
            }

            return errors;

        },
    });

    useImperativeHandle(ref, () => ({
        handleSubmit
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
                    <label htmlFor="loginUrl">Login Url</label>

                    <input
                        className="form-control"
                        id="loginUrl"
                        onChange={handleChange}
                    />

                    {errors.loginUrl && touched.loginUrl && (
                        <div className="form-feedback-item mt-2 text-2 text-danger">
                            {errors.loginUrl}
                        </div>
                    )}
                </ClayForm.Group>

                <ClayForm.Group className="form-group-sm">
                    <label htmlFor="clientSecret">Client Secret</label>

                    <input
                        className="form-control"
                        id="clientSecret"
                        onChange={handleChange}
                    />

                    {errors.clientSecret && touched.clientSecret && (
                        <div className="form-feedback-item mt-2 text-2 text-danger">
                            {errors.clientSecret}
                        </div>
                    )}
                </ClayForm.Group>

                <ClayForm.Group className="form-group-sm">
                    <label htmlFor="entity">Entity Name</label>

                    <input
                        className="form-control"
                        id="entity"
                        onChange={handleChange}
                    />

                    {errors.entity && touched.entity && (
                        <div className="form-feedback-item mt-2 text-2 text-danger">
                            {errors.entity}
                        </div>
                    )}
                </ClayForm.Group>

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

            </form>
        </>
    );

});

export default SalesforceConnection;
