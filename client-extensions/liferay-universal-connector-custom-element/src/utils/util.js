/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {v4 as uuidv4} from 'uuid';

export function capitalizeFirstLetter(text) {
	return text.charAt(0).toUpperCase() + text.slice(1);
}

export function cleanProxyObject(proxyObject) {

	if ('swaggerSpecs' in proxyObject) {
		delete proxyObject.swaggerSpecs;
	}

	if ('responses' in proxyObject.deleteItemByIdAPI.schema) {
		delete proxyObject.deleteItemByIdAPI.schema.responses;
	}

	if ('tags' in proxyObject.deleteItemByIdAPI.schema) {
		delete proxyObject.deleteItemByIdAPI.schema.tags;
	}

	if ('responses' in proxyObject.getItemByIdAPI.schema) {
		delete proxyObject.getItemByIdAPI.schema.responses;
	}

	if ('tags' in proxyObject.getItemByIdAPI.schema) {
		delete proxyObject.getItemByIdAPI.schema.tags;
	}

	if ('responses' in proxyObject.getPageAPI.schema) {
		delete proxyObject.getPageAPI.schema.responses;
	}

	if ('tags' in proxyObject.getPageAPI.schema) {
		delete proxyObject.getPageAPI.schema.tags;
	}

	if ('responses' in proxyObject.postItemAPI.schema) {
		delete proxyObject.postItemAPI.schema.responses;
	}

	if ('requestBody' in proxyObject.postItemAPI.schema) {
		delete proxyObject.postItemAPI.schema.requestBody;
	}

	if ('responses' in proxyObject.updateItemByIdAPI.schema) {
		delete proxyObject.updateItemByIdAPI.schema.responses;
	}

	if ('requestBody' in proxyObject.updateItemByIdAPI.schema) {
		delete proxyObject.updateItemByIdAPI.schema.requestBody;
	}

	if ('tags' in proxyObject.postItemAPI.schema) {
		delete proxyObject.postItemAPI.schema.tags;
	}

	return proxyObject;
}

export function findProperties(dataElement, propName) {
	for (const key in dataElement) {
		if (dataElement[key]) {
			if (key === propName) {
				return dataElement[key];
			}
			else if (typeof dataElement[key] === 'object') {
				const result = findProperties(dataElement[key], propName);
				if (result !== undefined) {
					return result;
				}
			}
		}
	}

	return null;
}

export function generateProxyObjectName() {
	const uniqueId = uuidv4();

	return `P${uniqueId.replaceAll('-', '')}`;
}

export function isEmpty(dataElement) {
	return !Object.keys(dataElement).length;
}

export function showError(title, message) {
	Liferay.Util.openToast({message, title, type: 'danger'});
}

export function showSuccess(
	title,
	message = 'The request has been successfully completed.'
) {
	Liferay.Util.openToast({message, title, type: 'success'});
}

export function validateSchemaAvailable(config) {
	return findProperties(
		config.getItemByIdAPI.schema.responses.default ||
			config.getItemByIdAPI.schema.responses['200'],
		'properties'
	)
		? true
		: false;
}
