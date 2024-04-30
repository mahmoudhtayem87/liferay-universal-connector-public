/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayForm from '@clayui/form';
import {useFormik} from 'formik';
import {forwardRef, useEffect, useImperativeHandle, useState} from 'react';

const ProxyObjectMainMethods = forwardRef((props, ref) => {
	const [deleteMethods, setDeleteMethods] = useState([]);
	const [getMethods, setGetMethods] = useState([]);
	const [postMethods, setPostMethods] = useState([]);
	const [putMethods, setPutMethods] = useState([]);

	const {config, handleSave} = props;

	const {errors, handleChange, handleSubmit, touched} = useFormik({
		initialValues: {
			deleteItemById: '',
			getItemById: '',
			getPagedItems: '',
			postItem: '',
			updateItemById: '',
		},
		onSubmit: (values) => {
			const operations = {
				deleteItemByIdAPI: {
					path: values.deleteItemById,
					schema: getSchemaByPath(values.deleteItemById, 'delete'),
				},
				getItemByIdAPI: {
					path: values.getItemById,
					schema: getSchemaByPath(values.getItemById, 'get'),
				},
				getPageAPI: {
					path: values.getPagedItems,
					schema: getSchemaByPath(values.getPagedItems, 'get'),
				},
				postItemAPI: {
					path: values.postItem,
					schema: getSchemaByPath(values.postItem, 'post'),
				},
				updateItemByIdAPI: {
					path: values.updateItemById,
					schema: getSchemaByPath(values.updateItemById, 'put'),
				},
			};

			handleSave(operations);
		},
		validate: (values) => {
			const errors = {};

			if (!values.getPagedItems) {
				errors.getPagedItems = 'Required';
			}

			if (!values.getItemById) {
				errors.getItemById = 'Required';
			}
			else if (
				getSchemaPropertiesCount(values.getItemById, 'get') < 1
			) {
				errors.getItemById =
					'The GetItemByIdAPI endpoint must have, at a minimum, the parameters for item Id.';
			}

			if (!values.deleteItemById) {
				errors.deleteItemById = 'Required';
			}
			else if (
				getSchemaPropertiesCount(values.deleteItemById, 'delete') < 1
			) {
				errors.deleteItemById =
					'The DeleteItemById endpoint must have, at a minimum, the parameters for item Id.';
			}

			if (!values.updateItemById) {
				errors.updateItemById = 'Required';
			}
			else if (
				getSchemaPropertiesCount(values.updateItemById, 'put') < 1
			) {
				errors.updateItemById =
					'The UpdateItemById endpoint must have, at a minimum, the parameters for item Id.';
			}

			if (!values.postItem) {
				errors.postItem = 'Required';
			}

			return errors;
		},
	});

	const getSchemaByPath = (path, method) => {
		const schema = config.swaggerSpecs.spec.paths[path][method];

		return schema;
	};

	const getSchemaPropertiesCount = (path, method) => {
		const schema = getSchemaByPath(path, method);

		return schema && schema.parameters ? schema.parameters.length : 0;
	};

	useEffect(() => {
		const paths = Object.keys(config.swaggerSpecs.spec.paths);

		const apisSpecs = paths.map((path) => ({
			...config.swaggerSpecs.spec.paths[path],
			path,
		}));

		const deletes = apisSpecs.filter((path) => 'delete' in path);

		const gets = apisSpecs.filter((path) => 'get' in path);

		const posts = apisSpecs.filter((path) => 'post' in path);

		const puts = apisSpecs.filter((path) => 'put' in path);

		setDeleteMethods(deletes);

		setGetMethods(gets);

		setPostMethods(posts);

		setPutMethods(puts);
	}, [config]);

	useImperativeHandle(ref, () => ({
		handleSubmit,
	}));

	return (
		<form onSubmit={handleSubmit}>
			<ClayForm.Group className="form-group-sm">
				<label htmlFor="getPagedItems">Get Paged Items Endpoint</label>

				<select
					className="form-control"
					id="getPagedItems"
					onChange={handleChange}
				>
					<option></option>
					{!!getMethods.length &&
						getMethods.map((item) => (
							<option
								key={item.get.operationId}
								value={item.path}
							>
								{item.path}
							</option>
						))}
				</select>

				{errors.getPagedItems && touched.getPagedItems && (
					<div className="form-feedback-item mt-2 text-2 text-danger">
						{errors.getPagedItems}
					</div>
				)}
			</ClayForm.Group>

			<ClayForm.Group className="form-group-sm">
				<label htmlFor="getItemById">Get Single Item Endpoint</label>

				<select
					className="form-control"
					id="getItemById"
					onChange={handleChange}
				>
					<option></option>
					{!!getMethods.length &&
						!!getMethods.length &&
						getMethods.map((item) => (
							<option
								key={item.get.operationId}
								value={item.path}
							>
								{item.path}
							</option>
						))}
				</select>

				{errors.getItemById && touched.getItemById && (
					<div className="form-feedback-item mt-2 text-2 text-danger">
						{errors.getItemById}
					</div>
				)}
			</ClayForm.Group>

			<ClayForm.Group className="form-group-sm">
				<label htmlFor="postItem">Create Single Item Endpoint</label>

				<select
					className="form-control"
					id="postItem"
					onChange={handleChange}
				>
					<option></option>
					{!!postMethods.length &&
						!!postMethods.length &&
						postMethods.map((item) => (
							<option
								key={item.post.operationId}
								value={item.path}
							>
								{item.path}
							</option>
						))}
				</select>

				{errors.postItem && touched.postItem && (
					<div className="form-feedback-item mt-2 text-2 text-danger">
						{errors.postItem}
					</div>
				)}
			</ClayForm.Group>

			<ClayForm.Group className="form-group-sm">
				<label htmlFor="deleteItemById">
					Delete Single Item By Id Endpoint
				</label>

				<select
					className="form-control"
					id="deleteItemById"
					onChange={handleChange}
				>
					<option></option>
					{!!deleteMethods.length &&
						deleteMethods.map((item) => (
							<option
								key={item.delete.operationId}
								value={item.path}
							>
								{item.path}
							</option>
						))}
				</select>

				{errors.deleteItemById && touched.deleteItemById && (
					<div className="form-feedback-item mt-2 text-2 text-danger">
						{errors.deleteItemById}
					</div>
				)}
			</ClayForm.Group>

			<ClayForm.Group className="form-group-sm">
				<label htmlFor="updateItemById">
					Update Single Item Endpoint
				</label>

				<select
					className="form-control"
					id="updateItemById"
					onChange={handleChange}
				>
					<option></option>
					{!!putMethods.length &&
						putMethods.map((item) => (
							<option
								key={item.put.operationId}
								value={item.path}
							>
								{item.path}
							</option>
						))}
				</select>

				{errors.updateItemById && touched.updateItemById && (
					<div className="form-feedback-item mt-2 text-2 text-danger">
						{errors.updateItemById}
					</div>
				)}
			</ClayForm.Group>
		</form>
	);
});

export default ProxyObjectMainMethods;
