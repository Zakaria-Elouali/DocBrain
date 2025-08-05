import { useCallback, useMemo } from "react";
import { FileOperationsService } from "./FileOperationsService";
import {
    ADD_OPERATION,
    OPERATION_COMPLETE,
    REMOVE_OPERATION,
    SET_ERROR,
    SET_PROGRESS
} from "../../../../store/fileManagement/actionType";
import { useDispatch } from "react-redux";
import { FileOperationsContext } from "./useFileDownloadUpload"; // Ensure this is imported correctly

function useFileOperationsProvider() {

    const dispatch = useDispatch();
    const fileService = useMemo(() => new FileOperationsService(), []);

    const handleUpload = useCallback(async (file, parentId) => {
        const operationId = `upload-${Date.now()}-${file.name}`;
        dispatch({ type: ADD_OPERATION, payload: { operationId, fileName: file.name } });

        try {
            await fileService.uploadFile(
                file,
                parentId,
                (progress) => {
                    dispatch({
                        type: SET_PROGRESS,
                        payload: { operationId, progress }
                    });
                }
            );

            dispatch({ type: OPERATION_COMPLETE, payload: { operationId } });
            return operationId;
        } catch (error) {
            dispatch({
                type: SET_ERROR,
                payload: { operationId, error: error.message }
            });
            throw error;
        } finally {
            dispatch({ type: REMOVE_OPERATION, payload: { operationId } });
        }
    }, [fileService, dispatch]);

    const handleDownload = useCallback(async (fileId, fileName) => {
        const operationId = `download-${Date.now()}-${fileName}`;
        dispatch({ type: ADD_OPERATION, payload: { operationId, fileName } });

        try {
            await fileService.downloadFile(
                fileId,
                fileName,
                (progress) => {
                    dispatch({
                        type: SET_PROGRESS,
                        payload: { operationId, progress }
                    });
                }
            );

            dispatch({ type: OPERATION_COMPLETE, payload: { operationId } });
            return operationId;
        } catch (error) {
            dispatch({
                type: SET_ERROR,
                payload: { operationId, error: error.message }
            });
            throw error;
        } finally {
            dispatch({ type: REMOVE_OPERATION, payload: { operationId } });
        }
    }, [fileService, dispatch]);

    const cancelOperation = useCallback((operationId) => {
        fileService.cancelOperation(operationId);
        dispatch({ type: REMOVE_OPERATION, payload: { operationId } });
    }, [fileService, dispatch]);

    return {
        handleUpload,
        handleDownload,
        cancelOperation
    };
}

export const FileOperationsProvider = ({ children }) => {
    const value = useFileOperationsProvider();
    return (
        <FileOperationsContext.Provider value={value}>
            {children}
        </FileOperationsContext.Provider>
    );
};
