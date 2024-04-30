/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

const concat = require('concat');
const fs = require('fs-extra');
const path = require('path');
const buildFolder = `./build/static/`;
const componentBuildFolder = 'componentLibrary';
const componentBuiltFile = 'components';
function fromDir(startPath, filter) {
    const _files = [];
    console.log(startPath);
    if (!fs.existsSync(startPath)) {
        console.log("Wrong Folder Path!", startPath);

        return;
    }
    const files = fs.readdirSync(startPath);
    for (let i = 0; i < files.length; i++) {
        const filename = path.join(startPath,files[i]);
        if (filename.endsWith(filter)) {
            _files.push(filename);
            console.log('-- found: ', filename);
        };
    }

    return _files;
};

(async function build() {

    const js_files = fromDir(`${buildFolder}/js`,'.js');

    const css_files = fromDir(`${buildFolder}/css`,'.css');

    await fs.ensureDir(componentBuildFolder);

    await fs.removeSync(`${componentBuildFolder}/${componentBuiltFile}.js`);

    if (css_files &&  !!css_files.length )
    {await fs.removeSync(`${componentBuildFolder}/${componentBuiltFile}.css`);}

    await concat(js_files, `${componentBuildFolder}/${componentBuiltFile}.js`);

    if (css_files &&  !!css_files.length )
    {await concat(css_files, `${componentBuildFolder}/${componentBuiltFile}.css`);}
})();
