import React, { useState, useEffect } from "react";
import { RightClickContext } from "./useRightClick"; // Ensure the correct path to your `useRightClick`

export const RightClickProvider = ({ children }) => {
    const [menuState, setMenuState] = useState({ position: null, target: null });

    const handleContextMenu = (event, target) => {
        event.preventDefault();
        event.stopPropagation();

        // Calculate menu position with viewport boundaries
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const menuWidth = 200; // Adjust as per your menu dimensions
        const menuHeight = 150; // Adjust as per your menu dimensions

        const x = Math.min(event.clientX, viewportWidth - menuWidth);
        const y = Math.min(event.clientY, viewportHeight - menuHeight);

        setMenuState({ position: { x, y }, target });
    };

    const closeMenu = () => setMenuState({ position: null, target: null });

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuState.position && !event.target.closest(".right-click-menu")) {
                closeMenu();
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [menuState.position]);

    return (
        <RightClickContext.Provider value={{ menuState, handleContextMenu, closeMenu }}>
            {children}
        </RightClickContext.Provider>
    );
};
