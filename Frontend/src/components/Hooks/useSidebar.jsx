// hooks/useSidebar
import { useState } from 'react';

export const useSidebar = () => {
    const [activePanel, setActivePanel] = useState(null);

    const togglePanel = (panelId) => {
        setActivePanel(activePanel === panelId ? null : panelId);
    };

    return { activePanel, togglePanel };
};
