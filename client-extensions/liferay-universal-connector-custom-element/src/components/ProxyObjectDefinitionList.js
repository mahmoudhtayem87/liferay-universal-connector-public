/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton, {ClayButtonWithIcon} from '@clayui/button';
import DropDown from '@clayui/drop-down';
import {Body, Cell, Head, Row, Table} from '@clayui/core';
import ClayEmptyState from '@clayui/empty-state';
import ClayIcon from '@clayui/icon';
import ClayModal, {useModal} from '@clayui/modal';
import {ClayPaginationBarWithBasicItems} from '@clayui/pagination-bar';
import ClayToolbar from '@clayui/toolbar';
import moment from 'moment';
import {useEffect, useRef, useState} from 'react';

import {
    connectProxyObjectDefinition,
    deleteProxyObjectDefinition, disconnectProxyObjectDefinition,
    getProxyObjectDefinitionsPage,
} from '../services/ProxyObjectService';
import SwaggerDiscoverAPIWizard from "./swagger/SwaggerDiscoverAPIWizard";
import URLConnection from "./url/URLConnection";
import URLAPIConnectorWizard from "./url/URLAPIConnectorWizard";
import MySqlConnectorWizard from "./mysql/MySqlConnectorWizard";
import SalesforceConnectorWizard from "./salesforce/SalesforceConnectorWizard";
import ClayLoadingIndicator from "@clayui/loading-indicator";
import FacebookConnectorWizard from "./facebook/FacebookConnectorWizard";

const connectByModelTitle = (connectBy) =>{
    switch (connectBy){
        case 1:
            return 'Swagger Connect Wizard';
        case 2:
            return 'API URL Connect Wizard';
        case 3:
            return 'MySQL Connect Wizard';
        case 4:
            return 'Salesforce Connect Wizard';
        case 5:
            return 'Facebook Connect Wizard';
    }
}

const DELTAS = [{label: 5}, {label: 10}, {label: 20}, {label: 40}];

const HEADERS = [
    {
        expanded: false,
        key: 'id',
        label: 'ID',
    },
    {
        expanded: true,
        key: 'name',
        label: 'Name',
    },
    {
        expanded: true,
        key: 'proxyObjectName',
        label: 'Proxy Object ERC',
    },
    {
        expanded: false,
        key: 'connected',
        label: 'Connected',
    },
    {
        expanded: false,
        key: 'dateCreated',
        label: 'Created Date',
    },
    {
        expanded: false,
        key: 'actions',
        label: 'Actions',
    },
];

const ProxyObjectDefinitionList = () => {

    const [active, setActive] = useState(0);
    const [connectBy,setConnectBy] = useState(0);
    const [data, setData] = useState(null);
    const [delta, setDelta] = useState(5);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [pageIndex, setPageIndex] = useState(1);
    const [selectedId,setSelectedId] = useState(-1);
    const [totalItems, setTotalItems] = useState(0);

    const {observer, onOpenChange, open} = useModal();

    const facebookConnectorWizardComponentRef = useRef(null);
    const mySqlConnectorWizardComponentRef = useRef(null);
    const salesforceConnectorWizardComponentRef = useRef(null);
    const swaggerDiscoverAPIWizardComponentRef = useRef(null);
    const urlAPIConnectorWizardComponentRef = useRef(null);

    const confirmDeleteItemModal = (proxyObjectDefinitionId) => {
        const deleteProxyObject = async () => {
            setIsDeleting(true);

            await deleteProxyObjectDefinition(proxyObjectDefinitionId);

            setIsDeleting(false);

            reload();
        };

        Liferay.Util.openConfirmModal({
            message:
                'Deleting a proxy object definition. This action is permanent and cannot be undone.',
            onConfirm: (isConfirmed) => {
                if (isConfirmed) {
                    deleteProxyObject();
                }
            },
        });
    };

    const handleBackPage = () => {

        if (connectBy === 1){

            swaggerDiscoverAPIWizardComponentRef.current.handleBackPage();
        }

        if (connectBy === 2){

            urlAPIConnectorWizardComponentRef.current.handleBackPage();
        }

        if (connectBy === 3){

            mySqlConnectorWizardComponentRef.current.handleBackPage();
        }

        if (connectBy === 4){

            salesforceConnectorWizardComponentRef.current.handleBackPage();
        }

        if (connectBy === 5){

            facebookConnectorWizardComponentRef.current.handleBackPage();
        }

    };

    const handleNextPage = () => {

        if (connectBy === 1){

            swaggerDiscoverAPIWizardComponentRef.current.handleNextPage();
        }

        if (connectBy === 2){

            urlAPIConnectorWizardComponentRef.current.handleNextPage();
        }

        if (connectBy === 3){

            mySqlConnectorWizardComponentRef.current.handleNextPage();
        }

        if (connectBy === 4){

            salesforceConnectorWizardComponentRef.current.handleNextPage();
        }

        if (connectBy === 5){

            facebookConnectorWizardComponentRef.current.handleNextPage();
        }


    };

    const loadPage = async () => {
        setIsLoading(true);

        const results = await getProxyObjectDefinitionsPage(pageIndex, delta);

        setData(results.items);

        setTotalItems(results.totalCount);

        setIsLoading(false);
    };

    const openSwaggerConnectorWizardModal = () => {
        setConnectBy(1);
        onOpenChange(true);
    };

    const openAPIURLWizardModal = () => {
        setConnectBy(2);
        onOpenChange(true);
    };

    const openMySqlWizardModal = () => {
        setConnectBy(3);
        onOpenChange(true);
    };

    const openSalesforceWizardModal = () => {
        setConnectBy(4);
        onOpenChange(true);
    };

    const openFacebookWizardModal = () => {
        setConnectBy(5);
        onOpenChange(true);
    };

    const reload = () => {
        setTotalItems(0);

        if (pageIndex === 1) {
            loadPage();
        }
        else {
            setPageIndex(1);
        }
    };

    const handleConnect = async (proxyObjectDefinitionId) =>{
        setIsLoading(true);
        setSelectedId(proxyObjectDefinitionId);

        await connectProxyObjectDefinition(proxyObjectDefinitionId);

        setTimeout(reload,500);

        setIsLoading(false);
        setSelectedId(-1);

        return true;
    }

    const handleDisconnect = async (proxyObjectDefinitionId) =>{
        setIsLoading(true);

        await disconnectProxyObjectDefinition(proxyObjectDefinitionId);

        setTimeout(reload,250);

        setIsLoading(false);

        return true;
    }

    useEffect(() => {
        const fetchData = async () => {
            const results = await getProxyObjectDefinitionsPage(
                pageIndex,
                delta
            );

            setData(results.items);

            setTotalItems(results.totalCount);
        };

        fetchData();
    }, [delta, pageIndex]);


    return (
        <>
            <ClayToolbar className="mb-3 bg-white">

                <ClayToolbar.Nav className="container">

                    <ClayToolbar.Item className="text-left" expand>

                    </ClayToolbar.Item>

                    <ClayToolbar.Item></ClayToolbar.Item>

                    <ClayToolbar.Item>

                        <ClayToolbar.Section>
                            {Liferay.ThemeDisplay.isSignedIn() && (

                                <DropDown trigger={
                                    <ClayButton
                                        aria-label="Create New Connection"
                                        className="lfr-portal-tooltip"
                                        displayType="primary"
                                        size="sm"
                                        title="Create New Connection"
                                    >

									<span className="inline-item inline-item-before my-auto">

										<ClayIcon symbol="plus" />

									</span>

                                        <span>New</span>

                                    </ClayButton>
                                }>
                                    <DropDown.ItemList>

                                        <DropDown.Group header="Connect By">
                                            <DropDown.Item onClick={openSwaggerConnectorWizardModal}>Swagger File</DropDown.Item>

                                            <DropDown.Item onClick={openAPIURLWizardModal}>API URL</DropDown.Item>

                                            <DropDown.Item onClick={openMySqlWizardModal}>MySql Connection String</DropDown.Item>

                                            <DropDown.Item onClick={openSalesforceWizardModal}>Salesforce Connection String</DropDown.Item>

                                            <DropDown.Item onClick={openFacebookWizardModal}>Facebook Page Connection</DropDown.Item>


                                        </DropDown.Group>

                                    </DropDown.ItemList>

                                </DropDown>
                            )}
                        </ClayToolbar.Section>

                    </ClayToolbar.Item>

                </ClayToolbar.Nav>

            </ClayToolbar>

            {totalItems > 0 && (
                <div className="container">
                    <Table columnsVisibility={false} >
                        <Head items={HEADERS}>
                            {(column) => (
                                <Cell
                                    expanded={column.expanded}
                                    key={column.key}
                                    wrap={false}
                                >
                                    {column.label}
                                </Cell>
                            )}
                        </Head>

                        <Body>
                            {data &&
                                data.map((row) => (
                                    <Row key={row['id']}>
                                        <Cell wrap={false}>{row['id']}</Cell>

                                        <Cell expanded={true} wrap={false}>
                                            {row['name']}
                                        </Cell>

                                        <Cell expanded={true} wrap={true}>
                                            {row['proxyObjectName']}
                                        </Cell>

                                        <Cell expanded={false}>
                                            {isLoading && selectedId === row["id"]
                                                ? (<ClayLoadingIndicator displayType="secondary" size="sm" />)
                                                : row['connected']?"Yes" : "No" }
                                        </Cell>

                                        <Cell wrap={false}>
                                            {moment(row['dateCreated']).format(
                                                'MMMM D, YYYY'
                                            )}
                                        </Cell>

                                        <Cell textAlign="end" expanded={false} wrap={false}>

                                            <DropDown
                                                closeOnClick={true}
                                                trigger={
                                                <ClayButtonWithIcon
                                                    aria-label="Actions"
                                                    className="lfr-portal-tooltip"
                                                    displayType="primary"
                                                    size="sm"
                                                    title="Actions"
                                                    symbol="ellipsis-v">

                                                </ClayButtonWithIcon>

                                            }>
                                                <DropDown.ItemList>

                                                    <DropDown.Group header="Actions">

                                                        <DropDown.Item onClick={()=> handleConnect(row["id"])}>Connect</DropDown.Item>

                                                        <DropDown.Item onClick={()=> handleDisconnect(row["id"])}>Disconnect</DropDown.Item>

                                                        <DropDown.Item  onClick={() =>
                                                            confirmDeleteItemModal(
                                                                row['id']
                                                            )
                                                        }>Delete</DropDown.Item>

                                                    </DropDown.Group>

                                                </DropDown.ItemList>

                                            </DropDown>

                                        </Cell>
                                    </Row>
                                ))}
                        </Body>
                    </Table>

                    <ClayPaginationBarWithBasicItems
                        activeDelta={delta}
                        defaultActive={1}
                        deltas={DELTAS}
                        ellipsisBuffer={3}
                        onActiveChange={(page) => {
                            setPageIndex(page);
                        }}
                        onDeltaChange={(delta) => {
                            setDelta(delta);
                        }}
                        totalItems={totalItems}
                    />
                </div>
            )}

            {totalItems <= 0 && !isLoading && (
                <div className="container">
                    <ClayEmptyState
                        description={null}
                        imgProps={{alt: 'Alternative Text', title: 'Hello World!'}}
                        imgSrc={`${Liferay.ThemeDisplay.getPathThemeImages()}/states/search_state.gif`}
                        imgSrcReducedMotion={`${Liferay.ThemeDisplay.getPathThemeImages()}/states/search_state_reduced_motion.gif`}
                        title="No Object Definition Found"
                    >
                        {Liferay.ThemeDisplay.isSignedIn() && (
                            <ClayButton
                                aria-label="Create New Connection"
                                className="lfr-portal-tooltip"
                                disabled={isDeleting || isLoading}
                                displayType="primary"
                                onClick={openSwaggerConnectorWizardModal}
                                size="sm"
                                title="Create New Connection"
                            >
							<span className="inline-item inline-item-before my-auto">
								<ClayIcon symbol="plus" />
							</span>

                                <span>Create New Connection</span>

                            </ClayButton>
                        )}
                    </ClayEmptyState>
                </div>
            )}

            {open && (
                <ClayModal observer={observer} size="lg">

                    <ClayModal.Header>{connectByModelTitle(connectBy)}</ClayModal.Header>

                    <ClayModal.Body>
                        {connectBy === 1 && (
                            <SwaggerDiscoverAPIWizard
                                onActiveChange={setActive}
                                onClose={onOpenChange}
                                onSuccess={reload}
                                ref={swaggerDiscoverAPIWizardComponentRef}
                            />
                        )}

                        {connectBy === 2 && (
                            <URLAPIConnectorWizard
                                onActiveChange={setActive}
                                onClose={onOpenChange}
                                onSuccess={reload}
                                ref={urlAPIConnectorWizardComponentRef}
                            />
                        )}

                        {connectBy === 3 && (
                            <MySqlConnectorWizard
                                onActiveChange={setActive}
                                onClose={onOpenChange}
                                onSuccess={reload}
                                ref={mySqlConnectorWizardComponentRef}
                            />
                        )}

                        {connectBy === 4 && (
                            <SalesforceConnectorWizard
                                onActiveChange={setActive}
                                onClose={onOpenChange}
                                onSuccess={reload}
                                ref={salesforceConnectorWizardComponentRef}
                            />
                        )}

                        {connectBy === 5 && (
                            <FacebookConnectorWizard
                                onActiveChange={setActive}
                                onClose={onOpenChange}
                                onSuccess={reload}
                                ref={facebookConnectorWizardComponentRef}
                            />
                        )}

                    </ClayModal.Body>

                    <ClayModal.Footer
                        last={
                            <ClayButton.Group spaced>
                                <ClayButton
                                    disabled={active === 0}
                                    displayType="secondary"
                                    onClick={handleBackPage}
                                >
                                    Back
                                </ClayButton>
                                <ClayButton onClick={handleNextPage}>

                                    {(connectBy === 1 && active === 4) ? 'Submit' : (connectBy === 2 && active === 2) ? 'Submit' : (connectBy === 3 && active === 1) ? 'Submit' : (connectBy === 4 && active === 1) ? 'Submit' : (connectBy === 5 && active === 0) ? 'Submit' : 'Next'}

                                </ClayButton>
                            </ClayButton.Group>
                        }
                    />
                </ClayModal>
            )}
        </>
    );
};

export default ProxyObjectDefinitionList;
