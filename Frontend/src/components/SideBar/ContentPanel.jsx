import React, {useEffect} from 'react';
import { FileTree } from './FileTree/FileTree';
import {RightClickProvider} from "./FileTree/ContextMenu/RightClickProvider";
import {FileOperationsProvider} from "./FileTree/FileService/FileOperationsProvider";
import {AppointmentsList} from "./calendar/AppointmentsList";
import {DeleteConfirmationProvider} from "../Common/DeleteConfirmationProvider";
import UserManagement from "@/pages/Users/UserManagement";
import Settings from "@/pages/Setting/Settings";
import Dashboard from "@/pages/Dashboard/dashboard";
import InvoiceSidebar from "./Invoice/InvoiceSidebar";
import { useAuth } from '@/helpers/auth_helper';

// Import new components
import ClientDocuments from './ClientView/ClientDocuments';
import SignatureRequests from './ClientView/SignatureRequests';
import CaseManagement from './FirmView/CaseManagement';

const getPanelWidth = (panel) => {
    switch (panel) {
        case 'dashboard':
            return '0px';
        case 'files':
            return '250px';
        case 'calendar':
            return '250px';
        case 'users':
            return '0px';
        case 'settings':
            return '250px';
        case 'invoice':
            return '250px';
        case 'cases':
            return '250px';
        case 'client-documents':
            return '250px';
        case 'signatures':
            return '250px';
        default:
            return '250px';
    }
};

export const ContentPanel = ({ activePanel }) => {
    const { isClient, isAdmin, isSuperAdmin, isViewer, userRoles } = useAuth();

    useEffect(() => {
        document.body.setAttribute('data-active-panel', activePanel || 'none');
    }, [activePanel]);

    if (!activePanel) return null;

    // Temporary placeholder for components that haven't been created yet
    const PlaceholderComponent = ({ title }) => (
        <div className="panel-content">
            <h2 className="panel-title">{title}</h2>
            <p>This feature is coming soon...</p>
        </div>
    );

    return (
        <div className={`content-panel ${!activePanel ? 'collapsed' : 'active'}`} data-active-panel={activePanel}
             style={{
                 width: getPanelWidth(activePanel),
                 display: activePanel ? 'block' : 'none', // Ensure it's visible when active
                 position: 'relative',
                 zIndex: 10
             }}>

            {/* Common panels for all users */}
            {!isClient && activePanel === 'files' &&
                <RightClickProvider>
                    <FileOperationsProvider>
                    <FileTree />
                    </FileOperationsProvider>
                </RightClickProvider>
            }
            {!isClient && activePanel === 'calendar' && (
                <DeleteConfirmationProvider>
                    <AppointmentsList />
                </DeleteConfirmationProvider>
            )}
            {activePanel === 'settings' && (
                <Settings />
            )}
            {activePanel === 'recent' && (
                <PlaceholderComponent title="Recent Files" />
            )}
            {activePanel === 'starred' && (
                <PlaceholderComponent title="Starred Files" />
            )}

            {/* Firm-specific panels for now  allowed client to */}
            {/*{!isClient && activePanel === 'dashboard' && (*/}
            {activePanel === 'dashboard' && (
                <Dashboard/>
            )}
            {!isClient && activePanel === 'invoice' && (
                <DeleteConfirmationProvider>
                    <InvoiceSidebar />
                </DeleteConfirmationProvider>
            )}
            {!isClient && activePanel === 'cases' && (
                <CaseManagement />
            )}
            {(isAdmin || isSuperAdmin) && activePanel === 'users' && (
                <DeleteConfirmationProvider>
                    <UserManagement />
                </DeleteConfirmationProvider>
            )}

            {/* Client-specific panels */}
            {isClient && activePanel === 'client-documents' && (
                <ClientDocuments />
            )}
            {isClient && activePanel === 'signatures' && (
                <SignatureRequests />
            )}
        </div>
    );
};
