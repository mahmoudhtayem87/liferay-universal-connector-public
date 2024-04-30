/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton, {ClayButtonWithIcon} from '@clayui/button';
import ClayForm, {ClayInput} from '@clayui/form';
import ClayIcon from '@clayui/icon';
import {useFormik} from 'formik';
import {forwardRef, useImperativeHandle, useRef, useState} from 'react';

import {loadSwaggerSpec} from '../../utils/Swagger';
import {isEmpty, showError} from '../../utils/util';

const FileUpload = forwardRef((props, ref) => {
	const {handleSave} = props;

	const [file, setFile] = useState(null);

	const fileInputRef = useRef(null);

	const {errors, handleChange, handleSubmit, touched} = useFormik({
		initialValues: {
			file: '',
			name: '',
		},
		onSubmit: (values) => {
			loadSwaggerSpec(file)
				.then(
					(swaggerObject) => {
						if (
							!swaggerObject ||
							isEmpty(swaggerObject.spec) ||
							isEmpty(swaggerObject.apis)
						) {
							showError(
								'Error',
								'The uploaded file is either an invalid Swagger file or does not contain the required API documentation.'
							);
						}
						else {
							handleSave({
								name: values.name,
								swaggerSpecs: swaggerObject,
							});
						}
					},
					() => {
						showError(
							'Error',
							'The uploaded file is either an invalid Swagger file or does not contain the required API documentation.'
						);
					}
				)
				.catch(() =>
					showError(
						'Error',
						'The uploaded file is either an invalid Swagger file or does not contain the required API documentation.'
					)
				);
		},
		validate: (values) => {
			const errors = {};

			if (!values.name) {
				errors.name = 'Required';
			}

			if (values.name && !/^[A-Za-z]/.test(values.name)) {
				errors.name =
					'Please provide a valid name for the proxy object.';
			}

			if (!file) {
				errors.file = 'Please upload a Swagger file.';
			}

			return errors;
		},
	});

	const handleFileChange = (event) => {
		const selectedFile = event.target.files[0];

		setFile(selectedFile);
	};

	const handleFileDelete = () => {
		setFile(null);

		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	const handleUploadClick = () => {
		fileInputRef.current.click();
	};

	useImperativeHandle(ref, () => ({
		handleSubmit,
	}));

	return (
		<form onSubmit={handleSubmit}>
			<ClayForm.Group className="form-group-sm">
				<label htmlFor="basicInput">Name</label>

				<ClayInput
					id="name"
					name="name"
					onChange={handleChange}
					placeholder="Name"
					type="text"
				></ClayInput>

				{errors.name && touched.name && (
					<div className="form-feedback-item mt-2 text-2 text-danger">
						{errors.name}
					</div>
				)}
			</ClayForm.Group>
			<ClayForm.Group className="form-group-sm">
				<label htmlFor="basicInput">Swagger File</label>

				<div className="form-group lfr-tooltip-scope">
					<div className="form-group">
						<ClayButton
							displayType="secondary"
							onClick={handleUploadClick}
							title="Upload"
						>
							<span className="inline-item inline-item-before">
								<ClayIcon symbol="upload" />
							</span>
							Upload File
						</ClayButton>
						{file && (
							<>
								<small className="inline-item inline-item-after mx-3">
									<strong>{file.name}</strong>
								</small>

								<ClayButtonWithIcon
									aria-label="Close"
									displayType="secondary"
									onClick={handleFileDelete}
									size="sm"
									symbol="times"
									title="Delete File"
								/>
							</>
						)}
					</div>
				</div>

				<input
					accept=".json"
					className="d-none form-control"
					id="file"
					onChange={handleFileChange}
					ref={fileInputRef}
					type="file"
				/>

				{errors.file && touched.file && (
					<div className="form-feedback-item mt-2 text-2 text-danger">
						{errors.file}
					</div>
				)}
			</ClayForm.Group>
		</form>
	);
});

export default FileUpload;
