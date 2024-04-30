import {forwardRef, useImperativeHandle, useState} from "react";
import {useFormik} from "formik";
import ClayForm from "@clayui/form";
import {AUTH_TYPES} from "../../utils/constants";
import {discoverTable} from "../../services/MySqlConnection";
import {showError, showSuccess} from "../../utils/util";


const MySqlConnection = forwardRef((props, ref) => {

    const {handleSave} = props;

    const {errors, handleChange, handleSubmit, touched,values} = useFormik({
        initialValues: {
            database:'',
            host: '',
            name: '',
            password:'',
            table:'',
            username:''
        },
        onSubmit: (values) => {

            discoverTable(values).then(result => {
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

            if (!values.database) {
                errors.database = 'Required';
            }

            if (!values.host) {
                errors.host = 'Required';
            }

            if (!values.name) {
                errors.name = 'Required';
            }

            if (!values.password) {
                errors.password = 'Required';
            }

            if (!values.table) {
                errors.table = 'Required';
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
                    <label htmlFor="host">Host</label>

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
                    <label htmlFor="database">Database Name</label>

                    <input
                        className="form-control"
                        id="database"
                        onChange={handleChange}
                    />

                    {errors.database && touched.database && (
                        <div className="form-feedback-item mt-2 text-2 text-danger">
                            {errors.database}
                        </div>
                    )}
                </ClayForm.Group>

                <ClayForm.Group className="form-group-sm">
                    <label htmlFor="database">Table Name</label>

                    <input
                        className="form-control"
                        id="table"
                        onChange={handleChange}
                    />

                    {errors.table && touched.table && (
                        <div className="form-feedback-item mt-2 text-2 text-danger">
                            {errors.table}
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

export default MySqlConnection;
