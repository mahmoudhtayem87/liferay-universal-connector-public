/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {ClayIconSpriteContext} from '@clayui/icon';
import {ClayModalProvider} from '@clayui/modal';

import ProxyObjectDefinitionList from './components/ProxyObjectDefinitionList';

const App = () => {
	return (
		<ClayIconSpriteContext.Provider value={Liferay.Icons.spritemap}>
			<ClayModalProvider>
				<ProxyObjectDefinitionList></ProxyObjectDefinitionList>
			</ClayModalProvider>
		</ClayIconSpriteContext.Provider>
	);
};

export default App;
