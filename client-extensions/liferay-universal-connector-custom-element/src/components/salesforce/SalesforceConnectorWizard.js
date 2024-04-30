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

import SalesforceConnection from "./SalesforceConnection";
import ReviewSalesforceConnection from "./ReviewSalesforceConnection";
import {generateProxyObjectName, showError, showSuccess} from "../../utils/util";
import {postProxyObjectDefinition} from "../../services/ProxyObjectService";


const STEPS = [
	{
		subTitle: 'Configure Salesforce Connection',
		title: 'Connection',
	}, {
		subTitle: 'Review Configuration',
		title: 'Review',
	}
];

const SalesforceConnectorWizard = forwardRef((props, ref) => {
	const [active, setActive] = useState(0);
	const [config, setConfig] = useState({
		connection:{
		},
		connectionType:"url",
		objectProperties:[],
		primaryKey:'',
	});

	const {onActiveChange, onClose, onSuccess} = props;

	const mySqlConnectionComponentRef = useRef(null);
	const reviewMySqlConnectionComponentRef = useRef(null);

	const handleSaveConnection = (connection) => {

		setConfig((prevState) => (
			{...prevState,
				...connection
			}
		));

		setActive(1);
	}

	useImperativeHandle(ref, () => ({
		handleBackPage,
		handleNextPage,
	}));

	const handleSaveSchema = useCallback( (schema) => {

		const proxyObjectDefinition = {
			configuration: JSON.stringify(schema),
			name: schema.name,
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

	const handleBackPage = useCallback(() => {
		setActive(active === 0 ? 0 : active - 1);
	}, [active]);

	const handleNextPage = useCallback(() => {

		switch (Number(active)) {
			case 0: {
				if (mySqlConnectionComponentRef.current) {
					mySqlConnectionComponentRef.current.handleSubmit();
				}
				break;
			}
			case 1: {
				if (reviewMySqlConnectionComponentRef.current) {
					reviewMySqlConnectionComponentRef.current.handleSubmit();
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
						<SalesforceConnection handleSave={handleSaveConnection} ref={mySqlConnectionComponentRef}></SalesforceConnection>
					</div>
				)}

				{active === 1 && (
					<div>
						<ReviewSalesforceConnection config={config} handleSave={handleSaveSchema} ref={reviewMySqlConnectionComponentRef}></ReviewSalesforceConnection>
					</div>
				)}

			</div>
		</div>
	);
});

export default SalesforceConnectorWizard;
