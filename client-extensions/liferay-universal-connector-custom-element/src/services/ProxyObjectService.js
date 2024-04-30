/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {config} from '../utils/constants';
import {request} from '../utils/request';

export async function deleteProxyObjectDefinition(proxyObjectDefinitionId) {
	return request({
		method: 'delete',
		url: `${config.proxyObjectDefinitionsApi}/${proxyObjectDefinitionId}`,
	});
}

export async function postProxyObjectDefinition(proxyObjectDefinition) {
	return request({
		data: proxyObjectDefinition,
		method: 'post',
		url: `${config.proxyObjectDefinitionsApi}`,
	});
}

export async function connectProxyObjectDefinition(proxyObjectDefinitionId) {
	return request({
		method: 'put',
		url: `${config.proxyObjectDefinitionsApi}/${proxyObjectDefinitionId}/object-actions/connect`,
	});
}

export async function disconnectProxyObjectDefinition(proxyObjectDefinitionId) {
	return request({
		method: 'put',
		url: `${config.proxyObjectDefinitionsApi}/${proxyObjectDefinitionId}/object-actions/disconnect`,
	});
}

export async function getProxyObjectDefinitionsPage(page, pageSize) {
	return request({
		method: 'get',
		url: `${config.proxyObjectDefinitionsApi}?page=${page}&pageSize=${pageSize}`,
	});
}
