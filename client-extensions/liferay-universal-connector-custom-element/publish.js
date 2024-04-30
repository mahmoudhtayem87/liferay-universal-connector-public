/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 * npm i concat fs-extra path express serve-static
 */

const express = require('express')

const path = require('path')

const serveStatic = require('serve-static')
const app = express()
const portNumber = 3300;
app.use(serveStatic(path.join(`${__dirname}/componentLibrary`)))
app.listen(portNumber)
console.clear();
console.log('Component Library has been published to the below urls');
console.log('JavaScript URLConnection');
console.log(`http://localhost:${portNumber}/components.js`);
console.log('CSS URLConnection');
console.log(`http://localhost:${portNumber}/components.css`);
