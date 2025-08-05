import React, { useMemo } from 'react';
import { SideBarData } from "./NavDataCategories";
import { IconButton } from 'components/SideBar/IconButton';
import { ContentPanel } from 'components/SideBar/ContentPanel';
import { useSidebar } from 'hooks/useSidebar';
import { useAuth } from '@/helpers/auth_helper';

const Sidebar = ({layoutType, isArabicLanguage = false }) => {
    const { activePanel, togglePanel } = useSidebar();
    const { userRoles } = useAuth();

    // Filter sidebar items based on user roles
    const filteredSidebarData = useMemo(() => {
        const filtered = SideBarData.filter(item => {
            // If no roles specified, show to everyone
            if (!item.roles || item.roles.length === 0) {
                return true;
            }
            // Check if user has any of the required roles
            const hasRequiredRole = item.roles.some(role => userRoles.includes(role));
            return hasRequiredRole;
        });
        return filtered;
    }, [userRoles]);

    return (
        <React.Fragment>
            <div className="sidebar-container">
                <div className="icon-sidebar">
                    <div className="nav-buttons">
                        <React.Fragment>
                            {filteredSidebarData.map((item) => (
                                <IconButton
                                    key={item.id}
                                    icon={item.icon}
                                    title={isArabicLanguage ? item.arabicTitle : item.englishTitle}
                                    isActive={activePanel === item.id}
                                    onClick={() => togglePanel(item.id)}
                                />
                            ))}
                        </React.Fragment>
                    </div>
                </div>
                <ContentPanel activePanel={activePanel} />
            </div>
        </React.Fragment>
    );
};
export {Sidebar};