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

import URLConnection from "./URLConnection";
import QueryParameters from "./QueryParameters";
import Schema from "./Schema";
import {cleanProxyObject, generateProxyObjectName, showError, showSuccess} from "../../utils/util";
import {postProxyObjectDefinition} from "../../services/ProxyObjectService";


const STEPS = [
	{
		subTitle: 'Configure Endpoint URL Connection',
		title: 'Connection',
	}, {
		subTitle: 'Define Query Parameters',
		title: 'Parameters',
	}, {
		subTitle: 'Define Results Fields',
		title: 'Fields',
	}
];

const URLAPIConnectorWizard = forwardRef((props, ref) => {
	const [active, setActive] = useState(0);
	const [config, setConfig] = useState({
		connection:{
		},
		connectionType:"url",
		queryParameters:[],
		objectProperties:[],
		jsonPath:'',
		primaryKey:'',
	});

	const {onActiveChange, onClose, onSuccess} = props;

	const urlConnectionComponentRef = useRef(null);
	const queryParametersComponentRef = useRef(null);
	const schemaComponentRef = useRef(null);

	const handleSaveConnection = (connection) => {

		setConfig((prevState) => (
			{...prevState,
				name:connection.name,
				connectionConfig: {
				...connection
			}
		}
		));

		setActive(1);
	}

	const handleSaveParameters = (parameters) => {

		setConfig((prevState) => ({...prevState, ...parameters}));

		setActive(2);

	}

	const handleSaveSchema = useCallback( (schema) => {

		const configuration = {...config, ...schema};

		const proxyObjectDefinition = {
			configuration: JSON.stringify(configuration),
			name: config.name,
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

	},[config])


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
				if (urlConnectionComponentRef.current) {
					urlConnectionComponentRef.current.handleSubmit();
				}
				break;
			}
			case 1: {
				if (queryParametersComponentRef.current) {
					queryParametersComponentRef.current.handleSubmit();
				}
				break;
			}

			case 2: {
				if (schemaComponentRef.current) {
					schemaComponentRef.current.handleSubmit();
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
			<label className="mb-3 text-6">{STEPS[active].subTitle}</label>

			<ClayMultiStepNav>
				{STEPS.map(({title}, i) => {
					const complete = active > i;

					return (
						<ClayMultiStepNav.Item
							active={active === i}
							expand={i + 1 !== STEPS.length}
							key={i}
							state={complete ? 'complete' : undefined}
						>
							<ClayMultiStepNav.Divider />
							<ClayMultiStepNav.Indicator
								complete={complete}
								label={1 + i}
								subTitle={title}
							/>
						</ClayMultiStepNav.Item>
					);
				})}
			</ClayMultiStepNav>

			<div
				className="p-3"
				style={{maxHeight: '40vh', overflow: 'scroll'}}
			>
				{active === 0 && (
					<div>
						<URLConnection handleSave={handleSaveConnection} ref={urlConnectionComponentRef}></URLConnection>
					</div>
				)}

				{active === 1 && (
					<div>
						<QueryParameters handleSave={handleSaveParameters} config={config} ref={queryParametersComponentRef}></QueryParameters>
					</div>
				)}

				{active === 2 && (
					<div>
						<Schema handleSave={handleSaveSchema} config={config} ref={schemaComponentRef}></Schema>
					</div>
				)}



			</div>
		</div>
	);
});

export default URLAPIConnectorWizard;
