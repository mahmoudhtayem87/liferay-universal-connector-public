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

import {postProxyObjectDefinition} from '../../services/ProxyObjectService';
import {
	cleanProxyObject,
	generateProxyObjectName,
	showError,
	showSuccess,
} from '../../utils/util';
import ConnectionConfiguration from './ConnectionConfiguration';
import FileUpload from './FileUpload';
import MethodPropertiesMapping from './MethodPropertiesMapping';
import ProxyObjectMainMethods from './ProxyObjectMainMethods';
import SchemaMapping from './SchemaMapping';

const STEPS = [
	{
		subTitle: 'Upload Swagger File',
		title: 'File',
	},
	{
		subTitle: 'Define Proxy Methods',
		title: 'Methods',
	},
	{
		subTitle: 'Define Proxy Fields',
		title: 'Fields',
	},
	{
		subTitle: 'Define Proxy Mapping',
		title: 'Map',
	},
	{
		subTitle: 'Configure Connection',
		title: 'Connection',
	},
];

const SwaggerDiscoverAPIWizard = forwardRef((props, ref) => {
	const [active, setActive] = useState(0);
	const [config, setConfig] = useState({
		connectionType:"swagger",
		deleteItemByIdAPI: null,
		getItemByIdAPI: null,
		getPageAPI: null,
		name: '',
		objectProperties: null,
		postItemAPI: null,
		swaggerSpecs: null,
		updateItemByIdAPI: null,
	});

	const {onActiveChange, onClose, onSuccess} = props;

	const connectionConfigurationComponentRef = useRef(null);
	const fileUploadComponentRef = useRef(null);
	const methodPropertiesMappingComponentRef = useRef(null);
	const proxyObjectConfigComponentRef = useRef(null);
	const schemaMappingComponentRef = useRef(null);

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
				if (fileUploadComponentRef.current) {
					fileUploadComponentRef.current.handleSubmit();
				}
				break;
			}

			case 1: {
				proxyObjectConfigComponentRef.current.handleSubmit();

				break;
			}

			case 2: {
				schemaMappingComponentRef.current.handleSubmit();

				break;
			}

			case 3: {
				methodPropertiesMappingComponentRef.current.handleSubmit();

				break;
			}

			case 4: {
				connectionConfigurationComponentRef.current.handleSubmit();

				break;
			}
			default:
				setActive(0);
				break;
		}
	}, [active]);

	const handlePropertiesMapping = (properties) => {
		setConfig((prevState) => ({...prevState, methodMapping: properties}));

		setActive(4);
	};

	const handleSaveAPIs = (APIs) => {
		setConfig((prevState) => ({...prevState, ...APIs}));

		setActive(2);
	};

	const handleSaveConnectionConfiguration = useCallback(
		(connectionConfiguration) => {
			const configuration = {...config, ...connectionConfiguration};

			const proxyObjectDefinition = {
				configuration: JSON.stringify(cleanProxyObject(configuration)),
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
		},
		[config, onClose, onSuccess]
	);

	const handleSaveObjectProperties = (objectProperties) => {
		setConfig((prevState) => ({...prevState, objectProperties}));

		setActive(3);
	};

	const handleSaveSpecs = (swaggerSpecs) => {
		setConfig((prev) => ({...prev, ...swaggerSpecs}));

		setActive(1);
	};

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
						<FileUpload
							handleSave={handleSaveSpecs}
							key={active}
							ref={fileUploadComponentRef}
						></FileUpload>
					</div>
				)}

				{active === 1 && (
					<div>
						{config.swaggerSpecs && (
							<ProxyObjectMainMethods
								config={config}
								handleSave={handleSaveAPIs}
								key={active}
								ref={proxyObjectConfigComponentRef}
							></ProxyObjectMainMethods>
						)}
					</div>
				)}

				{active === 2 && (
					<div>
						{config.getItemByIdAPI && (
							<SchemaMapping
								config={config}
								handleSave={handleSaveObjectProperties}
								key={active}
								ref={schemaMappingComponentRef}
							></SchemaMapping>
						)}
					</div>
				)}

				{active === 3 && (
					<div>
						{config.objectProperties && (
							<MethodPropertiesMapping
								config={config}
								handleSave={handlePropertiesMapping}
								key={active}
								ref={methodPropertiesMappingComponentRef}
							></MethodPropertiesMapping>
						)}
					</div>
				)}

				{active === 4 && (
					<div>
						{config.objectProperties && (
							<ConnectionConfiguration
								config={config}
								handleSave={handleSaveConnectionConfiguration}
								key={active}
								ref={connectionConfigurationComponentRef}
							></ConnectionConfiguration>
						)}
					</div>
				)}
			</div>
		</div>
	);
});

export default SwaggerDiscoverAPIWizard;
