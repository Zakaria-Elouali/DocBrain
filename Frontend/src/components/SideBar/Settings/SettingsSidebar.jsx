import React, { useState } from 'react';
import {UserCircle, Shield, Bell, Settings as SettingsIcon
} from 'lucide-react';
import {useTranslation} from "react-i18next";

// Sidebar Navigation Component
export const SettingsSidebar = ({ activeSection, onSectionChange }) => {
    const menuItems = [
        { id: 'profile', icon: UserCircle, label: 'Personal Info' },
        { id: 'security', icon: Shield, label: 'Security' },
        { id: 'notifications', icon: Bell, label: 'Notifications' },
        { id: 'preferences', icon: SettingsIcon, label: 'Preferences' }
    ];
    const { t } = useTranslation();

    return (
        <div className="settings-sidebar">
            <div className="settings-nav">
                {menuItems.map(({ id, icon: Icon, label }) => (
                    <button
                        key={id}
                        onClick={() => onSectionChange(id)}
                        className={`settings-nav-item ${activeSection === id ? 'active' : ''}`}
                    >
                        <Icon className="w-5 h-5 mr-2" />
                        <span>{t(label)}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};