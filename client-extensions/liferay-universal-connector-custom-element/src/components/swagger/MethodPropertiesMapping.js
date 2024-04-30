/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayAlert from '@clayui/alert';
import {Text} from '@clayui/core';
import Form from '@clayui/form';
import {
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useState,
} from 'react';

import {capitalizeFirstLetter} from '../../utils/util';

const GET_PAGE_API_PICK_LISTS_INPUTS = ['pageIndex', 'pageSize'];

const GET_PAGE_API_RESPONSE_PICK_LISTS_INPUTS = ['itemId'];

const GET_PAGE_API_TEXT_INPUTS = ['items'];

const MethodPropertiesMapping = forwardRef((props, ref) => {
	const [errors, setErrors] = useState([]);
	const [methodsConfig, setMethodsConfig] = useState({
		deleteItemByIdAPI: {parameters: {}},
		getItemById: {parameters: {}},
		getPageAPI: {
			parameters: {},
			response: {itemId: null, items: null, pageIndex: null},
		},
		updateItemByIdAPI: {parameters: {}},
	});

	const {config, handleSave} = props;

	const handleInputTextChange = useCallback((event) => {
		if (GET_PAGE_API_TEXT_INPUTS.includes(event.target.id)) {
			setMethodsConfig((prevState) => ({
				...prevState,
				getPageAPI: {
					...prevState.getPageAPI,
					response: {
						...prevState.getPageAPI.response,
						[event.target.id]: event.target.value,
					},
				},
			}));
		}
	}, []);

	const handlePickListSelectionChange = useCallback(
		(event) => {
			if (
				GET_PAGE_API_PICK_LISTS_INPUTS.filter(
					(parameter) => parameter === event.target.id
				).length
			) {
				setMethodsConfig((prevState) => ({
					...prevState,
					getPageAPI: {
						...prevState.getPageAPI,
						parameters: {
							...prevState.getPageAPI.parameters,
							[event.target.id]: event.target.value,
						},
					},
				}));
			}

			if (
				GET_PAGE_API_RESPONSE_PICK_LISTS_INPUTS.filter(
					(parameter) => parameter === event.target.id
				).length
			) {
				setMethodsConfig((prevState) => ({
					...prevState,
					getPageAPI: {
						...prevState.getPageAPI,
						response: {
							...prevState.getPageAPI.parameters,
							[event.target.id]: event.target.value,
						},
					},
				}));
			}

			if (
				config.getItemByIdAPI.schema.parameters.filter(
					(property) => property.name === event.target.id
				).length
			) {
				setMethodsConfig((prevState) => ({
					...prevState,
					getItemById: {
						...prevState.getItemById,
						parameters: {
							...prevState.getItemById.parameters,
							[event.target.id]: event.target.value,
						},
					},
				}));
			}

			if (
				config.updateItemByIdAPI.schema.parameters.filter(
					(property) => property.name === event.target.id
				).length
			) {
				setMethodsConfig((prevState) => ({
					...prevState,
					updateItemByIdAPI: {
						...prevState.updateItemByIdAPI,
						parameters: {
							...prevState.updateItemByIdAPI.parameters,
							[event.target.id]: event.target.value,
						},
					},
				}));
			}

			if (
				config.deleteItemByIdAPI.schema.parameters.filter(
					(property) => property.name === event.target.id
				).length
			) {
				setMethodsConfig((prevState) => ({
					...prevState,
					deleteItemByIdAPI: {
						...prevState.deleteItemByIdAPI,
						parameters: {
							...prevState.deleteItemByIdAPI.parameters,
							[event.target.id]: event.target.value,
						},
					},
				}));
			}
		},
		[config]
	);

	const handleSubmit = useCallback(() => {
		handleSave(methodsConfig);
	}, [methodsConfig, handleSave]);

	useEffect(() => {
		setErrors([]);
	}, [config]);

	useImperativeHandle(ref, () => ({
		handleSubmit,
	}));

	return (
		<>
			{errors &&
				!!errors.length &&
				errors.map((error, index) => (
					<ClayAlert
						displayType="warning"
						key={index}
						title={error.title}
					>
						{error.message}
					</ClayAlert>
				))}
			{config && (
				<div className="container-fluid">
					<div className="autofit-padded autofit-row flex-wrap">
						<div className="autofit-col autofit-col-expand w-100">
							<Text weight="bold">Get Items Page Endpoint</Text>

							<div className="pt-3">
								<Form.Group>
									<label htmlFor="pageIndex">
										Choose Page Index Parameter
									</label>

									<select
										className="form-control"
										id="pageIndex"
										onChange={handlePickListSelectionChange}
									>
										<option value="none">
											Not Supported
										</option>

										{config.getPageAPI &&
											config.getPageAPI.schema &&
											config.getPageAPI.schema
												.parameters &&
											config.getPageAPI.schema.parameters.map(
												(item) => (
													<option
														key={item.name}
														value={item.name}
													>
														{capitalizeFirstLetter(
															item.name
														)}
													</option>
												)
											)}
									</select>
								</Form.Group>

								<Form.Group>
									<label htmlFor="pageSize">
										Choose Page Size Parameter
									</label>

									<select
										className="form-control"
										id="pageSize"
										onChange={handlePickListSelectionChange}
									>
										<option value="none">
											Not Supported
										</option>

										{config.getPageAPI &&
											config.getPageAPI.schema &&
											config.getPageAPI.schema
												.parameters &&
											config.getPageAPI.schema.parameters.map(
												(item) => (
													<option
														key={item.name}
														value={item.name}
													>
														{capitalizeFirstLetter(
															item.name
														)}
													</option>
												)
											)}
									</select>
								</Form.Group>

								<Form.Group>
									<label htmlFor="pageSize">
										Choose Item Id
									</label>

									<select
										className="form-control"
										id="itemId"
										onChange={handlePickListSelectionChange}
									>
										<option></option>

										{config.objectProperties.map((item) => (
											<option
												key={item.value}
												value={item.value}
											>
												{capitalizeFirstLetter(
													item.label
												)}
											</option>
										))}
									</select>
								</Form.Group>

								<Form.Group>
									<label htmlFor="picker">
										Response page items JSON path
									</label>

									<input
										aria-label="Response page items JSON path"
										className="form-control"
										id="items"
										onChange={handleInputTextChange}
										type="text"
										value={
											methodsConfig.getPageAPI.response
												.items
										}
									/>
								</Form.Group>
							</div>
						</div>

						<div className="autofit-col autofit-col-expand w-100">
							<div>
								<Text weight="bold">
									Get Single Item By Id Endpoint
								</Text>

								<div className="pt-3">
									{config &&
										config.getItemByIdAPI.schema
											.parameters &&
										config.getItemByIdAPI.schema.parameters
											.filter(
												(parameter) =>
													parameter.required
											)
											.map((parameter) => (
												<Form.Group
													key={parameter.name}
												>
													<label htmlFor="pageIndex">
														Choose value for{' '}
														{parameter.name}{' '}
														parameter
													</label>

													<select
														className="form-control"
														id={parameter.name}
														onChange={
															handlePickListSelectionChange
														}
													>
														<option></option>

														<option value="externalReferenceCode">
															Item Id
														</option>

														<option value="objectDefinitionExternalReferenceCode">
															Proxy Definition Id
														</option>
													</select>
												</Form.Group>
											))}
								</div>
							</div>

							<div>
								<Text weight="bold">
									Update Single Item By Id Endpoint
								</Text>

								<div className="pt-3">
									{config &&
										config.updateItemByIdAPI.schema
											.parameters &&
										config.updateItemByIdAPI.schema.parameters
											.filter(
												(parameter) =>
													parameter.required
											)
											.map((parameter) => (
												<Form.Group
													key={parameter.name}
												>
													<label htmlFor="pageIndex">
														Choose value for{' '}
														{parameter.name}{' '}
														parameter
													</label>

													<select
														className="form-control"
														id={parameter.name}
														onChange={
															handlePickListSelectionChange
														}
													>
														<option></option>

														<option value="externalReferenceCode">
															Item Id
														</option>

														<option value="objectDefinitionExternalReferenceCode">
															Proxy Definition Id
														</option>
													</select>
												</Form.Group>
											))}
								</div>
							</div>

							<div>
								<Text weight="bold">
									Delete Single Item By Id Endpoint
								</Text>

								<div className="pt-3">
									{config &&
										config.deleteItemByIdAPI.schema
											.parameters &&
										config.deleteItemByIdAPI.schema.parameters
											.filter(
												(parameter) =>
													parameter.required
											)
											.map((parameter) => (
												<Form.Group
													key={parameter.name}
												>
													<label htmlFor="pageIndex">
														Choose value for{' '}
														{parameter.name}{' '}
														parameter
													</label>

													<select
														className="form-control"
														id={parameter.name}
														onChange={
															handlePickListSelectionChange
														}
													>
														<option></option>

														<option value="externalReferenceCode">
															Item Id
														</option>

														<option value="objectDefinitionExternalReferenceCode">
															Proxy Definition Id
														</option>
													</select>
												</Form.Group>
											))}
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
});

export default MethodPropertiesMapping;
