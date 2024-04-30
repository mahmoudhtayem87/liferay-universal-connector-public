/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

export const AUTH_TYPES = [
	{key: 'none', label: 'None'},
	{key: 'basic', label: 'Basic'},
	{key: 'bearer_token', label: 'Bearer Token'},
];

export const config = {
	agentOauthAppId: 'liferay-universal-connector-etc-node-oauth-application-user-agent',
	mySqlDiscover:'dynamic/mysql/util/discover',
	facebookCheck:'dynamic/facebook/util/connectivity-check',
	proxyObjectDefinitionsApi: '/o/c/t4t14proxyobjectdefinitions/',
	salesforceDiscover:'dynamic/salesforce/util/discover',
};
