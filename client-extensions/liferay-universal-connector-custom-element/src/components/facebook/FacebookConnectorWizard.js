/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayMultiStepNav from '@clayui/multi-step-nav';
import {
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from 'react';


import {generateProxyObjectName, showError, showSuccess} from "../../utils/util";
import {postProxyObjectDefinition} from "../../services/ProxyObjectService";

import FacebookConnection from "./FacebookConnection";


const STEPS = [
	{
		subTitle: 'Configure Facebook Connection',
		title: 'Connection',
	}
];

const FacebookConnectorWizard = forwardRef((props, ref) => {
	const [active, setActive] = useState(0);
	const [config, setConfig] = useState({
		connection:{
		},
		connectionType:"url",
		objectProperties:[],
		primaryKey:'',
	});

	const {onActiveChange, onClose, onSuccess} = props;

	const facebookConnectionComponentRef = useRef(null);

	const handleSave = (config) => {

		const proxyObjectDefinition = {
			configuration: JSON.stringify(config),
			name: config.connectionConfig.name,
			proxyObjectName: generateProxyObjectName(),
		};

		postProxyObjectDefinition(proxyObjectDefinition)
			.then(
				() => {

					showSuccess('Success');

					onSuccess();
				},

				(error) => showError('Error', error.message)

			)

			.catch((error) => showError('Error', error.message))

			.finally(() => onClose(false));
	}

	useImperativeHandle(ref, () => ({
		handleBackPage,
		handleNextPage,
	}));

	const handleBackPage = useCallback(() => {
		setActive(active === 0 ? 0 : active - 1);
	}, [active]);

	const handleNextPage = useCallback(() => {

		switch (Number(active)) {
			case 0: {
				if (facebookConnectionComponentRef.current) {
					facebookConnectionComponentRef.current.handleSubmit();
				}
				break;
			}
			default:
				setActive(0);
				break;
		}
	}, [active]);

	useEffect(() => {
		onActiveChange(active);
	}, [active, onActiveChange]);


	return (
		<div>
			<div
				className="p-3"
				style={{maxHeight: '40vh', overflow: 'scroll'}}
			>
				{active === 0 && (
					<div>
						<FacebookConnection handleSave={handleSave} ref={facebookConnectionComponentRef}></FacebookConnection>
					</div>
				)}

			</div>
		</div>
	);
});

export default FacebookConnectorWizard;
