// Custom hook to use the delete confirmation
import {DeleteConfirmationContext} from "../Common/DeleteConfirmationProvider";
import {useContext} from "react";

export const useDeleteConfirmation = () => {
    const context = useContext(DeleteConfirmationContext);
    if (!context) {
        throw new Error('useDeleteConfirmation must be used within a DeleteConfirmationProvider');
    }
    return context;
};

