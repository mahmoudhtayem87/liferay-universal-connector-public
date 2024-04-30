import {forwardRef, useImperativeHandle, useState} from "react";
import {useFormik} from "formik";
import ClayForm from "@clayui/form";
import {AUTH_TYPES} from "../../utils/constants";
import {discoverTable} from "../../services/MySqlConnection";
import {showError, showSuccess} from "../../utils/util";


const ReviewSalesforceConnection = forwardRef((props, ref) => {

    const {handleSave, config} = props;

    const handleSubmit = () => {

        handleSave(config);

    }

    useImperativeHandle(ref, () => ({
        handleSubmit
    }));

    return (
        <div>
            <div className="autofit-row mt-2">

                <div className="autofit-col autofit-col-expand w-50 label text-3 bg-light">
                    Connection Information
                </div>

            </div>

            <div className="autofit-row">

                <div className="autofit-col autofit-col-expand w-50 label text-3">
                    Connection Name
                </div>

                <div className="autofit-col autofit-col-expand w-50 label text-3">
                    {config.name}
                </div>

            </div>

            <div className="autofit-row">

                <div className="autofit-col autofit-col-expand w-50 label text-3">
                    Login Url
                </div>

                <div className="autofit-col autofit-col-expand w-50 label text-3">
                    {config.connectionConfig.loginUrl}
                </div>

            </div>

            <div className="autofit-row">

                <div className="autofit-col autofit-col-expand w-50 label text-3">
                    Entity
                </div>

                <div className="autofit-col autofit-col-expand w-50 label text-3">
                    {config.connectionConfig.entity}
                </div>

            </div>

            <div className="autofit-row">

                <div className="autofit-col autofit-col-expand w-50 label text-3">
                    Primary Key
                </div>

                <div className="autofit-col autofit-col-expand w-50 label text-3">
                    {config.primaryKey}
                </div>

            </div>

            <div className="autofit-row mt-2">

                <div className="autofit-col autofit-col-expand w-50 label text-3 bg-light">
                    Entity Fields
                </div>

            </div>

            {config.objectProperties && config.objectProperties.map(column =>
                <div className="autofit-row">

                    <div className="autofit-col autofit-col-expand w-50 label text-3">
                        {column.label}
                    </div>

                    <div className="autofit-col autofit-col-expand w-50 label text-3">
                        {column.type}
                    </div>

                </div>
            )}


        </div>

    );

});

export default ReviewSalesforceConnection;
