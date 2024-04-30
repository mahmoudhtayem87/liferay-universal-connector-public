import {forwardRef, useCallback, useEffect, useImperativeHandle, useState} from "react";
import {useFormik} from "formik";
import ClayForm from "@clayui/form";
import ClayButton from "@clayui/button";
import {capitalizeFirstLetter} from "../../utils/util";

export const SUPPORTED_PROPERTIES_TYPES = [
    'string',
    'integer',
    'long',
    'number',
    'boolean',
    'date',
    'dateTime'
];

const QueryParameters = ({onSave}) => {


    const {errors, handleChange, handleSubmit, touched} = useFormik({
        initialValues: {
            name: '',
            value: ''
        },
        onSubmit: (values) => {

            onSave(values);

        },
        validate: (values) => {

            const errors = {};

            if (values.name.length <= 0) {
                errors.name = 'Required';
            }

            if (values.value.length <= 0) {
                errors.value = 'Required';
            }

            return errors;

        },
    });

    return (
        <>
            <form onSubmit={handleSubmit}>

                <div className="autofit-row autofit-row-expand">

                    <div className="autofit-col autofit-col-expand mr-2">
                        <ClayForm.Group className="form-group-sm">
                            <input
                                className="form-control"
                                placeholder="Parameter Name"
                                id="name"
                                onChange={handleChange}
                            />

                            {errors.name && touched.name && (
                                <div className="form-feedback-item mt-2 text-2 text-danger">
                                    {errors.name}
                                </div>
                            )}
                        </ClayForm.Group>
                    </div>

                    <div className="autofit-col autofit-col-expand mr-2">
                        <ClayForm.Group className="form-group-sm">

                            <input
                                className="form-control"
                                id="value"
                                placeholder="Parameter Value"
                                onChange={handleChange}
                            />

                            {errors.value && touched.value && (
                                <div className="form-feedback-item mt-2 text-2 text-danger">
                                    {errors.value}
                                </div>
                            )}
                        </ClayForm.Group>
                    </div>

                    <div className="autofit-col">
                        <ClayForm.Group>
                            <ClayButton onClick={handleSubmit} size='sm'>Save</ClayButton>
                        </ClayForm.Group>
                    </div>

                </div>
            </form>
        </>
    );

};

export default QueryParameters;
