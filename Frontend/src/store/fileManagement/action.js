import {
  ADD_FILE_REQUEST,
  ADD_FILE_SUCCESS,
  ADD_FILE_FAILURE,

  CREATE_FILE_REQUEST,
  CREATE_FILE_SUCCESS,
  CREATE_FILE_FAILURE,

  FETCH_FILES_METADATA_REQUEST,
  FETCH_FILES_METADATA_FAILURE,
  FETCH_FILES_METADATA_SUCCESS,

  FETCH_FILE_DATA_REQUEST,
  FETCH_FILE_DATA_SUCCESS,
  FETCH_FILE_DATA_FAILURE,

  UPDATE_FILE_CONTENT_REQUEST,
  UPDATE_FILE_CONTENT_SUCCESS,
  UPDATE_FILE_CONTENT_FAILURE,

  UPDATE_FILE_FAILURE,
  UPDATE_FILE_SUCCESS,
  UPDATE_FILE_REQUEST,

  DELETE_FILE_FAILURE,
  DELETE_FILE_REQUEST,
  DELETE_FILE_SUCCESS,

  ADD_FOLDER_REQUEST,
  ADD_FOLDER_SUCCESS,
  ADD_FOLDER_FAILURE,

  FETCH_FOLDERS_REQUEST,
  FETCH_FOLDERS_SUCCESS,
  FETCH_FOLDERS_FAILURE,

  UPDATE_FOLDER_REQUEST,
  UPDATE_FOLDER_SUCCESS,
  UPDATE_FOLDER_FAILURE,

  DELETE_FOLDER_SUCCESS,
  DELETE_FOLDER_FAILURE,
  DELETE_FOLDER_REQUEST,

  ADD_OPERATION,
  SET_PROGRESS,
  SET_ERROR,
  REMOVE_OPERATION,
  FETCH_ALL_FILES_METADATA_REQUEST,
  FETCH_ALL_FILES_METADATA_SUCCESS,
  FETCH_ALL_FILES_METADATA_FAILURE,


} from './actionType';
/**
 * Add a new file operation (Upload/Download)
 * @param {string} operationId - Unique ID for the operation
 * @param {string} fileName - Name of the file being processed
 * @param {string} type - Operation type: 'upload' or 'download'
 */
export const addOperation = (operationId, fileName, type) => ({
  type: ADD_OPERATION,
  payload: { operationId, fileName, type }
});

/**
 * Update progress for a file operation
 * @param {string} operationId - Unique ID for the operation
 * @param {number} progress - Progress percentage (0 to 100)
 */
export const setProgress = (operationId, progress) => ({
  type: SET_PROGRESS,
  payload: { operationId, progress }
});

/**
 * Set an error for a file operation
 * @param {string} operationId - Unique ID for the operation
 * @param {string} error - Error message
 */
export const setError = (operationId, error) => ({
  type: SET_ERROR,
  payload: { operationId, error }
});

/**
 * Remove a completed or failed file operation
 * @param {string} operationId - Unique ID for the operation
 */
export const removeOperation = (operationId) => ({
  type: REMOVE_OPERATION,
  payload: { operationId }
});

// File Actions
// ADD FILES (for file uploads)
export const addFileRequest = (file) => ({
  type: ADD_FILE_REQUEST,
  payload: file,
});

export const addFileSuccess = (file) => ({
  type: ADD_FILE_SUCCESS,
  payload: file,
});

export const addFileFailure = (error) => ({
  type: ADD_FILE_FAILURE,
  payload: error,
});

// CREATE FILES (for creating empty markdown files)
export const createFileRequest = (fileData) => ({
  type: CREATE_FILE_REQUEST,
  payload: fileData,
});

export const createFileSuccess = (file) => ({
  type: CREATE_FILE_SUCCESS,
  payload: file,
});

export const createFileFailure = (error) => ({
  type: CREATE_FILE_FAILURE,
  payload: error,
});
// FETCH FILES METADATA (for a specific folder)
export const fetchFilesMetadataRequest = (payload) => ({
  type: FETCH_FILES_METADATA_REQUEST,
  payload, // payload can include folderId, userId, or other necessary data
});

export const fetchFilesMetadataSuccess = (filesMetadata) => ({
  type: FETCH_FILES_METADATA_SUCCESS,
  payload: filesMetadata, // payload is the fetched files metadata
});

export const fetchFilesMetadataFailure = (error) => ({
  type: FETCH_FILES_METADATA_FAILURE,
  payload: error, // payload is the error message or object
});

// FETCH ALL FILES METADATA (across all folders)
export const fetchAllFilesMetadataRequest = () => ({
  type: FETCH_ALL_FILES_METADATA_REQUEST
});

export const fetchAllFilesMetadataSuccess = (filesMetadata) => ({
  type: FETCH_ALL_FILES_METADATA_SUCCESS,
  payload: filesMetadata, // payload is all files metadata
});

export const fetchAllFilesMetadataFailure = (error) => ({
  type: FETCH_ALL_FILES_METADATA_FAILURE,
  payload: error, // payload is the error message or object
});
// FETCH FILE DATA
export const fetchFileDataRequest = (documentId, forceRefresh = false) => ({
  type: FETCH_FILE_DATA_REQUEST,
  payload: { documentId, forceRefresh },
});

export const fetchFileDataSuccess = ({ id, fileData }) => ({
  type: FETCH_FILE_DATA_SUCCESS,
  payload: { id, fileData },
});

export const fetchFileDataFailure = (error) => ({
  type: FETCH_FILE_DATA_FAILURE,
  payload: error,
});

// UPDATE FILE CONTENT
export const updateFileContentRequest = (fileData) => ({
  type: UPDATE_FILE_CONTENT_REQUEST,
  payload: fileData,
});

export const updateFileContentSuccess = (updatedFile) => ({
  type: UPDATE_FILE_CONTENT_SUCCESS,
  payload: updatedFile,
});

export const updateFileContentFailure = (error) => ({
  type: UPDATE_FILE_CONTENT_FAILURE,
  payload: error,
});

      // UPDATE FILES
export const updateFileRequest = (fileData) => ({
  type: UPDATE_FILE_REQUEST,
  payload: fileData,
});

export const updateFileSuccess = (updatedFile) => ({
  type: UPDATE_FILE_SUCCESS,
  payload: updatedFile,
});

export const updateFileFailure = (error) => ({
  type: UPDATE_FILE_FAILURE,
  payload: error,
});


// DELETE FILES
// Action Creators for deleting a file
export const deleteFileRequest = (fileId) => ({
  type: DELETE_FILE_REQUEST,
  payload: fileId,
});

export const deleteFileSuccess = (fileId) => ({
  type: DELETE_FILE_SUCCESS,
  payload: fileId,
});

export const deleteFileFailure = (error) => ({
  type: DELETE_FILE_FAILURE,
  payload: error,
});
                // Folder Actions     \\
// ADD FOLDER
export const addFolderRequest = (folder) => ({
  type: ADD_FOLDER_REQUEST,
  payload: folder,
});

export const addFolderSuccess = (folder) => ({
  type: ADD_FOLDER_SUCCESS,
  payload: folder,
});

export const addFolderFailure = (error) => ({
  type: ADD_FOLDER_FAILURE,
  payload: error,
});
// FETCH FOLDER
export const fetchFoldersRequest = (action) => ({
  type: FETCH_FOLDERS_REQUEST,
  payload: action
});

export const fetchFoldersSuccess = (folders) => ({
  type: FETCH_FOLDERS_SUCCESS,
  payload: folders,
});

export const fetchFoldersFailure = (error) => ({
  type: FETCH_FOLDERS_FAILURE,
  payload: error,
});
// UPDATE FOLDER
export const updateFolderRequest = (folder) => ({
  type: UPDATE_FOLDER_REQUEST,
  payload: folder,
});

export const updateFolderSuccess = (folder) => ({
  type: UPDATE_FOLDER_SUCCESS,
  payload: folder,
});

export const updateFolderFailure = (error) => ({
  type: UPDATE_FOLDER_FAILURE,
  payload: error,
});

// DELETE FOLDER
export const deleteFolderRequest = (folderId) => ({
  type: DELETE_FOLDER_REQUEST,
  payload: folderId,
});

export const deleteFolderSuccess = (folderId) => ({
  type: DELETE_FOLDER_SUCCESS,
  payload: folderId,
});

export const deleteFolderFailure = (error) => ({
  type: DELETE_FOLDER_FAILURE,
  payload: error,
});