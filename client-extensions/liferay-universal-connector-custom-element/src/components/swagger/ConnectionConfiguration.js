/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayForm from '@clayui/form';
import {useFormik} from 'formik';
import {forwardRef, useImperativeHandle, useState} from 'react';
import {AUTH_TYPES} from "../../utils/constants";



const ConnectionConfiguration = forwardRef((props, ref) => {
	const [authType, setAuthType] = useState(null);

	const {handleSave} = props;

	const {errors, handleChange, handleSubmit, touched} = useFormik({
		initialValues: {
			authType: null,
			host: null,
			password: null,
			token: null,
			username: null,
		},
		onSubmit: (values) => {
			let connectionConfiguration = {};

			if (values.authType === 'basic') {
				delete values.token;

				connectionConfiguration = {
					connectionConfig: {
						...values,
					},
				};
			}
			else if (values.authType === 'bearer_token') {
				delete values.username;

				delete values.password;

				connectionConfiguration = {
					connectionConfig: {
						...values,
					},
				};
			}
			else if (values.authType === 'none') {
				delete values.username;

				delete values.password;

				delete values.token;

				connectionConfiguration = {
					connectionConfig: {
						...values,
					},
				};
			}

			handleSave(connectionConfiguration);
		},
		validate: (values) => {
			const errors = {};

			setAuthType(values.authType);

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
					<label htmlFor="host">End Point Host</label>

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

export default ConnectionConfiguration;
