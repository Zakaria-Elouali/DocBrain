import { createContext, useContext } from "react";

// Create the context
export const RightClickContext = createContext(null);

// Custom hook to use the context
export const useRightClick = () => {
    const context = useContext(RightClickContext);
    if (!context) {
        throw new Error("useRightClick must be used within a RightClickProvider");
    }
    return context;
};
