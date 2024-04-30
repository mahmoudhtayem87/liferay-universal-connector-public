import {forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState} from "react";
import {useFormik} from "formik";
import ClayForm from "@clayui/form";
import QueryParameterForm from "./QueryParameterForm";
import ClayList from '@clayui/list';
import {showError} from "../../utils/util";
import ClayIcon from "@clayui/icon";


const QueryParameters = forwardRef((props, ref) => {

    const [queryParameters, setQueryParameters] = useState([]);

    const {handleSave,config} = props;

    const queryParameterFormComponentRef = useRef(null);

    const {errors, handleChange, handleSubmit, touched} = useFormik({
        initialValues: {
            pageIndex:'',
            pageSize:'',
            queryParameters:[]
        },
        onSubmit: (values) => {
            handleSave(values);
        },
        validate: useCallback((values) => {

            const errors = {};

            values.queryParameters = queryParameters;

            if (config.connectionConfig.paging)
            {
                if (values.pageIndex.length <= 0) {
                    errors.pageIndex = 'Required';
                }

                if (values.pageSize.length <= 0 ) {
                    errors.pageSize = 'Required';
                }

            }

            return errors;

        },[config,queryParameters]),
    });

    const handleSaveParameter = useCallback((parameter) => {

        if (!queryParameters.find(param => param.name === parameter.name)){

            setQueryParameters(prevState => [...prevState,parameter]);

        }else{

            showError('Error','The given parameter has already been provided.');

        }

    },[queryParameters])

    const handleDeleteParameter = useCallback((parameterName) => {

        setQueryParameters(queryParameters.filter(parameter => parameter.name !== parameterName));

    },[queryParameters])

    useImperativeHandle(ref, () => ({
        handleSubmit,
    }));


    return (
        <>
            <form onSubmit={handleSubmit}>
                {config.connectionConfig.paging && (
                    <div>
                        <ClayForm.Group className="form-group-sm">
                            <label htmlFor="pageIndex">Page Index Parameter Name</label>

                            <input
                                className="form-control"
                                id="pageIndex"
                                onChange={handleChange}
                            />

                            {errors.pageIndex && touched.pageIndex && (
                                <div className="form-feedback-item mt-2 text-2 text-danger">
                                    {errors.pageIndex}
                                </div>
                            )}
                        </ClayForm.Group>

                        <ClayForm.Group className="form-group-sm">
                            <label htmlFor="pageSize">Page Size Parameter Name</label>

                            <input
                                className="form-control"
                                id="pageSize"
                                onChange={handleChange}
                            />

                            {errors.pageSize && touched.pageSize && (
                                <div className="form-feedback-item mt-2 text-2 text-danger">
                                    {errors.pageSize}
                                </div>
                            )}
                        </ClayForm.Group>

                    </div>
                )}
            </form>

            <QueryParameterForm onSave={handleSaveParameter} ref={queryParameterFormComponentRef}></QueryParameterForm>

            {queryParameters.length > 0 && (
                <ClayList>

                    <ClayList.Header>Query Parameters</ClayList.Header>

                    {queryParameters.map(parameter=>(
                        <ClayList.Item flex>
                            <ClayList.ItemField>{parameter.name}</ClayList.ItemField>

                            <ClayList.ItemField>{parameter.type}</ClayList.ItemField>

                            <ClayList.ItemField expand>{parameter.value}</ClayList.ItemField>

                            <ClayList.ItemField>
                                <ClayList.QuickActionMenu>
                                    <ClayList.QuickActionMenu.Item
                                        aria-label="Delete"
                                        title="Delete"
                                        onClick={() => handleDeleteParameter(parameter.name)}
                                        symbol="trash"
                                    />
                                </ClayList.QuickActionMenu>
                            </ClayList.ItemField>
                        </ClayList.Item>
                    ))}


                </ClayList>
            )}

            {queryParameters.length <=0 && (
                <div className="alert alert-warning" role="alert">
                    <span className="alert-indicator">
                        <ClayIcon symbol="warning"></ClayIcon>
                    </span>
                    <strong className="lead">Warning:</strong>No <strong>Query Parameter(s)</strong> has been added yet.
                </div>
            )}

        </>
    );

});

export default QueryParameters;
