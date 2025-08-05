import {createContext, useContext} from "react";
import {useSelector} from "react-redux";

// Context creation
export const FileOperationsContext = createContext(null);

export const useFileDownloadUpload = () => {
    const context = useContext(FileOperationsContext);
    if (!context) {
        throw new Error('useFileDownloadUpload must be used within FileOperationsProvider');
    }
    return context;
};


export const useActiveOperations = () => {
    const activeOperationsArray = useSelector(state => state.fileFolderReducer.activeOperations);
    // Convert to Set only when needed in components
    return new Set(activeOperationsArray);
};