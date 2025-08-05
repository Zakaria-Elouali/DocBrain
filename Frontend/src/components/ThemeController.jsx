import { useState, useEffect } from 'react';
import {MoonIcon, SunIcon} from "lucide-react";
import {useDispatch, useSelector} from "react-redux";
import {CHANGE_LAYOUT_MODE, CHANGE_TOPBAR_THEME} from "@/store/layouts/actionType";

const ThemeController = () => {

    const dispatch = useDispatch();
    const currentTheme = useSelector((state) =>
        document.documentElement.getAttribute("data-bs-theme")
    );

    const isDarkMode = currentTheme === "dark";

    const toggleTheme = () => {
        const newTheme = isDarkMode ? "light" : "dark";
        dispatch({ type: CHANGE_LAYOUT_MODE, payload: newTheme });
        // dispatch({ type: CHANGE_TOPBAR_THEME, payload: newTheme });
        localStorage.setItem("theme", newTheme); // Optional if you want persistence
    };

    // const [isDarkMode, setIsDarkMode] = useState(() => {
    //     const savedTheme = localStorage.getItem('theme');
    //     return savedTheme === 'dark';
    // });

// useEffect(() => {
//     if (isDarkMode) {
//         document.documentElement.setAttribute('data-bs-theme', 'dark');
//         localStorage.setItem('theme', 'dark');
//     } else {
//         document.documentElement.setAttribute('data-bs-theme', 'light');
//         localStorage.setItem('theme', 'light');
//     }
// }, [isDarkMode]);

    // const toggleTheme = () => {
    //     setIsDarkMode((prevState) => !prevState);
    // };

    return (
        <label className="toggle-wrapper" htmlFor="toggle">
            <div className={`toggle ${isDarkMode ? "enabled" : "disabled"}`}
                 onClick={toggleTheme}
                >
                <span className="hidden">
                    {isDarkMode ? "Dark Mode Enabled" : "Light Mode Enabled"}
                </span>
                <div className="icons">
                    <SunIcon/>
                    <MoonIcon/>
                </div>
            </div>
        </label>
    );
};

export default ThemeController;
