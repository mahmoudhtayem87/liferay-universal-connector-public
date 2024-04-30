/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayAlert from '@clayui/alert';
import {ClayDualListBox} from '@clayui/form';
import {
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useState,
} from 'react';

import {
	capitalizeFirstLetter,
	findProperties,
	showError,
	validateSchemaAvailable,
} from '../../utils/util';

export const SUPPORTED_PROPERTIES_TYPES = [
	'string',
	'integer',
	'long',
	'number',
	'boolean',
	'bool',
	'date',
	'dateTime'
];

const SchemaMapping = forwardRef((props, ref) => {
	const [isSchemaAvailable, setIsSchemaAvailable] = useState(false);
	const [items, setItems] = useState();
	const [leftSelected, setLeftSelected] = useState([]);
	const [rightSelected, setRightSelected] = useState([]);

	const {config, handleSave} = props;

	const handleSubmit = useCallback(() => {
		const [selectedProperties] = items;

		if (
			selectedProperties.length <= 0 ||
			!validateSchemaAvailable(config)
		) {
			showError(
				'Error',
				'Please ensure that you choose at least one property; it is a required selection.'
			);

			return;
		}

		handleSave(selectedProperties);
	}, [config, items, handleSave]);

	useEffect(() => {
		if (validateSchemaAvailable(config)) {
			setIsSchemaAvailable(true);

			const properties = findProperties(
				config.getItemByIdAPI.schema.responses.default ||
					config.getItemByIdAPI.schema.responses['200'],
				'properties'
			);

			let allProperties = Object.keys(properties).map((key) => ({
				label: capitalizeFirstLetter(key),
				objectDefinitionKey: `proxy${key}`,
				property: properties[key],
				type: properties[key].type,
				value: key,
			}));

			allProperties = allProperties.filter((property) =>
				SUPPORTED_PROPERTIES_TYPES.includes(property.type)
			);

			const selectedProperties = config.objectProperties || [];

			const availableProperties = allProperties.filter(
				(property) =>
					!selectedProperties.some(
						(excludeProperty) =>
							excludeProperty.objectDefinitionKey ===
							property.objectDefinitionKey
					)
			);

			setItems([selectedProperties, availableProperties]);
		}
	}, [config]);

	useImperativeHandle(ref, () => ({
		handleSubmit,
	}));

	return (
		<>
			{isSchemaAvailable && items && (
				<ClayDualListBox
					items={items}
					left={{
						label: 'Selected Properties',
						onSelectChange: setLeftSelected,
						selected: leftSelected,
					}}
					onItemsChange={setItems}
					right={{
						label: 'Available Properties',
						onSelectChange: setRightSelected,
						selected: rightSelected,
					}}
					size={8}
				/>
			)}

			{!isSchemaAvailable && (
				<ClayAlert displayType="danger" title="Error">
					The chosen endpoints lack a valid JSON schema.
				</ClayAlert>
			)}
		</>
	);
});

export default SchemaMapping;
