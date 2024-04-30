import {forwardRef, useImperativeHandle, useState} from "react";
import {useFormik} from "formik";
import ClayForm from "@clayui/form";
import {AUTH_TYPES} from "../../utils/constants";
import {discoverTable} from "../../services/MySqlConnection";
import {showError, showSuccess} from "../../utils/util";
import {checkConnection} from "../../services/FacebookConnection";


const FacebookConnection = forwardRef((props, ref) => {

    const {handleSave} = props;

    const {errors, handleChange, handleSubmit, touched,values} = useFormik({
        initialValues: {
            name: '',
            pageId:'',
            pageToken: '',
        },
        onSubmit: (values) => {

            checkConnection(values).then(result => {
                console.log(result);
                if (result){
                    handleSave({
                        connectionConfig:{
                            ...values
                        },
                        name: values.name,
                        connectionType: "facebook",
                        primaryKey: "id",
                    });
                }else{
                    showError('Error',"Invalid Page ID or Page Access Token.");
                }
            },error=>{
                showError('Error',error.error);
            })

        },
        validate: (values) => {

            const errors = {};

            if (!values.name) {
                errors.name = 'Required';
            }

            if (!values.pageId) {
                errors.pageId = 'Required';
            }

            if (!values.pageToken) {
                errors.pageToken = 'Required';
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
                    <label htmlFor="pageId">Page ID</label>

                    <input
                        className="form-control"
                        id="pageId"
                        onChange={handleChange}
                    />

                    {errors.pageId && touched.pageId && (
                        <div className="form-feedback-item mt-2 text-2 text-danger">
                            {errors.pageId}
                        </div>
                    )}
                </ClayForm.Group>

                <ClayForm.Group className="form-group-sm">
                    <label htmlFor="pageToken">Facebook Page Access Token</label>

                    <input
                        className="form-control"
                        id="pageToken"
                        onChange={handleChange}
                    />

                    {errors.pageToken && touched.pageToken && (
                        <div className="form-feedback-item mt-2 text-2 text-danger">
                            {errors.pageToken}
                        </div>
                    )}
                </ClayForm.Group>

            </form>
        </>
    );

});

export default FacebookConnection;
