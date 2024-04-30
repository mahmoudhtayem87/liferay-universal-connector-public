import {forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState} from "react";
import {useFormik} from "formik";
import {capitalizeFirstLetter, showError} from "../../utils/util";
import ClayForm from "@clayui/form";
import QueryParameterForm, {SUPPORTED_PROPERTIES_TYPES} from "./QueryParameterForm";
import ClayList from "@clayui/list";
import ClayIcon from "@clayui/icon";
import SchemaPropertyForm from "./SchemaPropertyForm";


const Schema = forwardRef((props, ref) => {

    const [schemaProperties, setSchemaProperties] = useState([]);

    const {handleSave,config} = props;

    const schemaPropertyFormComponentRef = useRef(null);

    const {errors, handleChange, handleSubmit, touched} = useFormik({
        initialValues: {
            jsonPath:'',
            primaryKey:'',
            objectProperties:[]
        },
        onSubmit: (values) => {
            handleSave(values);
        },
        validate: useCallback((values) => {

            const errors = {};

            values.objectProperties = schemaProperties;

            if (values.jsonPath.length <= 0) {
                errors.jsonPath = 'Required';
            }

            if (values.primaryKey.length <= 0) {
                errors.primaryKey = 'Required';
            }

            return errors;

        },[config,schemaProperties]),
    });

    const handleSaveProperty = useCallback((property) => {

        if (!schemaProperties.find(prop => prop.value === property.value)){

            setSchemaProperties(prevState => [...prevState,property]);

        }else{

            showError('Error','The given property has already been provided.');

        }

    },[schemaProperties])

    const handleDeleteProperty = useCallback((propertyName) => {

        setSchemaProperties(schemaProperties.filter(property => property.value !== propertyName));

    },[schemaProperties])

    useImperativeHandle(ref, () => ({
        handleSubmit,
    }));


    return (
        <>
            <>
                <form onSubmit={handleSubmit}>

                    <div className="border-bottom mb-3">

                        <div className="autofit-row">

                            <div className="autofit-col autofit-col-expand mr-2">

                                <ClayForm.Group className="form-group-sm">
                                    <label htmlFor="jsonPath">Results JSON Path</label>

                                    <input
                                        className="form-control"
                                        id="jsonPath"
                                        onChange={handleChange}
                                    />

                                    {errors.jsonPath && touched.jsonPath && (
                                        <div className="form-feedback-item mt-2 text-2 text-danger">
                                            {errors.jsonPath}
                                        </div>
                                    )}
                                </ClayForm.Group>

                            </div>

                            <div className="autofit-col autofit-col-expand">

                                <ClayForm.Group className="form-group-sm">

                                    <label htmlFor="primaryKey">Select primary key</label>

                                    <select
                                        className="form-control"
                                        id="primaryKey"
                                        onChange={handleChange}
                                    >
                                        <option></option>
                                        {schemaProperties.map((property=>(
                                            <option value={property.value}>{capitalizeFirstLetter(property.label)}</option>
                                        )))}

                                    </select>

                                    {errors.primaryKey && touched.primaryKey && (
                                        <div className="form-feedback-item mt-2 text-2 text-danger">
                                            {errors.primaryKey}
                                        </div>
                                    )}
                                </ClayForm.Group>

                            </div>

                        </div>

                    </div>

                </form>

                <SchemaPropertyForm onSave={handleSaveProperty} ref={schemaPropertyFormComponentRef}></SchemaPropertyForm>

                {schemaProperties.length > 0 && (
                    <ClayList>

                        <ClayList.Header>Schema Properties</ClayList.Header>

                        {schemaProperties.map(property=>(
                            <ClayList.Item flex>
                                <ClayList.ItemField className="w-50" expand>{property.label}</ClayList.ItemField>

                                <ClayList.ItemField className="w-50" expand>{property.type}</ClayList.ItemField>

                                <ClayList.ItemField>

                                    <ClayList.QuickActionMenu>

                                        <ClayList.QuickActionMenu.Item
                                            aria-label="Delete"
                                            title="Delete"
                                            onClick={() => handleDeleteProperty(property.value)}
                                            symbol="trash"
                                        />

                                    </ClayList.QuickActionMenu>

                                </ClayList.ItemField>

                            </ClayList.Item>
                        ))}


                    </ClayList>
                )}

                {schemaProperties.length <=0 && (
                    <div className="alert alert-warning" role="alert">
                    <span className="alert-indicator">

                        <ClayIcon symbol="danger"></ClayIcon>

                    </span>

                        <strong className="lead">Warning:</strong>No <strong>Schema Property</strong> has been added yet.

                    </div>
                )}

            </>

        </>
    );

});

export default Schema;
