/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import SwaggerClient from 'swagger-client';

import {showError} from './util';

export function loadSwaggerSpec(swaggerFile) {
	const promise = new Promise((resolve, reject) => {
		try {
			const reader = new FileReader();

			reader.onload = async (event) => {
				const fileContent = event.target.result;

				resolve(await SwaggerClient({spec: JSON.parse(fileContent)}));
			};

			reader.readAsText(swaggerFile);
		}
		catch (error) {
			showError('Error', error.message);

			reject(error.message);
		}
	});

	return promise;
}
