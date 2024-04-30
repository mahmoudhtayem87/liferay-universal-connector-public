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

const SchemaPropertyForm = ({onSave}) => {


    const {errors, handleChange, handleSubmit, touched} = useFormik({
        initialValues: {
            name: '',
            type: ''
        },
        onSubmit: (values) => {
            try {

                const {name,type} = values;

                let objectProperty = {
                    "label": `${name[0].toUpperCase()}${name.slice(1)}`,
                    "objectDefinitionKey": `proxy${name.replaceAll('_','').replaceAll('-','')}`,
                    "type": type,
                    "value": name,
                }

                onSave(objectProperty);

            }catch (error){
                console.log(error);
            }


        },
        validate: (values) => {

            const errors = {};

            if (values.name.length <= 0) {
                errors.name = 'Required';
            }

            if (values.type.length <= 0) {
                errors.type = 'Required';
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

                            <select
                                className="form-control"
                                id="type"
                                onChange={handleChange}
                            >
                                <option></option>
                                {SUPPORTED_PROPERTIES_TYPES.map((type=>(
                                    <option value={type}>{capitalizeFirstLetter(type)}</option>
                                )))}

                            </select>

                            {errors.type && touched.type && (
                                <div className="form-feedback-item mt-2 text-2 text-danger">
                                    {errors.type}
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

export default SchemaPropertyForm;
