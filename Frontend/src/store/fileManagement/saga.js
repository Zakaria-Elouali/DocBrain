import { call, put, takeLatest, select, take } from 'redux-saga/effects';
import {
  ADD_FILE_REQUEST,
  CREATE_FILE_REQUEST,
  ADD_FOLDER_REQUEST,
  FETCH_FOLDERS_REQUEST,
  FETCH_FOLDERS_SUCCESS,
  REPLACE_TEMP_FOLDER_WITH_REEL_ONE_SUCCESS,
  REMOVE_TEMP_FOLDER_AFTER_BACKEND_CREATION_FAILURE,
  UPDATE_FOLDER_REQUEST,
  DELETE_FOLDER_REQUEST,
  FETCH_FILE_DATA_REQUEST,
  FETCH_FILES_METADATA_REQUEST,
  FETCH_ALL_FILES_METADATA_REQUEST,
  DELETE_FILE_REQUEST,
  UPDATE_FILE_REQUEST,
  UPDATE_FILE_CONTENT_REQUEST,
} from './actionType';

import {
  addFileSuccess,
  addFileFailure,
  createFileSuccess,
  createFileFailure,
  fetchFoldersSuccess,
  fetchFoldersFailure,
  updateFolderFailure,
  updateFolderSuccess,
  deleteFolderFailure,
  deleteFolderSuccess,
  fetchFileDataSuccess,
  fetchFileDataFailure,
  fetchFilesMetadataSuccess,
  fetchFilesMetadataFailure,
  fetchAllFilesMetadataSuccess,
  fetchAllFilesMetadataFailure,
  deleteFileFailure,
  deleteFileSuccess,
  updateFileSuccess,
  updateFileFailure,
  updateFileContentSuccess,
  updateFileContentFailure, fetchFileDataRequest,
} from './action';
import {APIClient} from "@/helpers/api_helper";
import {
  CREATE_FOLDER, CREATE_FILE, DELETE_FILE,
  DELETE_FOLDER, GET_FILE_DATA_BY_FILE_ID,
  GET_FILES_METADATA_BY_FOLDER_ID, GET_ALL_FILES_METADATA,
  GET_FOLDERS, UPDATE_FILE, UPDATE_FILE_CONTENT,
  UPDATE_FOLDER,
  UPLOAD_FILES, RENAME_FILE
} from "@/helpers/url_helper";
import {toast} from "react-toastify";

const api = new APIClient();

// Add File (for file uploads)
function* handleAddFile(action) {
  try {
    // Validate files array
    if (!action.payload.files || action.payload.files.length === 0) {
      throw new Error("No files provided for upload.");
    }

    // Create FormData to handle file uploads
    const formData = new FormData();
    for (let i = 0; i < action.payload.files.length; i++) {
      formData.append('files', action.payload.files[i]);
    }

    // Append folderId if provided
    if (action.payload.folderId) {
      formData.append('folderId', action.payload.folderId);
    }

    // Make the POST request with FormData
    const response = yield call(api.post, UPLOAD_FILES, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    yield put(addFileSuccess(response));
  } catch (error) {
    console.error("File upload failed:", error);
    yield put(addFileFailure(error.message));
  }
}

// Create File (for creating empty markdown files)
function* handleCreateFile(action) {
  try {
    const { tempId, name, parentId, contentType } = action.payload;

    // Create request payload
    const requestData = {
      fileName: name,
      folderId: parentId,
      contentType: contentType || "text/markdown"
    };

    // Make the POST request to create the file
    const response = yield call(api.post, CREATE_FILE, requestData);

    // If successful, dispatch success action
    yield put(createFileSuccess({
      tempId,
      file: response
    }));

    // Fetch the file data immediately so it's available for viewing
    if (response && response.id) {
      yield put(fetchFileDataRequest(response.id));
    }

    toast.success('Markdown file created successfully');
  } catch (error) {
    console.error("File creation failed:", error);
    // Include the tempId in the failure action so we can remove it from the tree
    yield put(createFileFailure({
      error: error.message,
      tempId: action.payload.tempId
    }));
    toast.error('Failed to create markdown file');
  }
}

// Fetch Files for a specific folder
// function* handleFetchFilesMetadata(action) {
//   try {
//     let apiUrl;
//     if (action.payload.folderId === null) {
//       // For root level files (no parent folder)
//       apiUrl = GET_FILES_METADATA_BY_FOLDER_ID.replace('{folderId}', 'root');
//     } else {
//       // For files in a specific folder
//       apiUrl = GET_FILES_METADATA_BY_FOLDER_ID.replace('{folderId}', action.payload.folderId);
//     }
//
//     const response = yield call(api.get, apiUrl);
//     yield put(fetchFilesMetadataSuccess(response));
//   } catch (error) {
//     console.error("Failed to fetch files metadata:", error);
//     yield put(fetchFilesMetadataFailure(error.message));
//   }
// }

// Fetch ALL Files metadata across all folders
function* handleFetchAllFilesMetadata() {
  try {
    const response = yield call(api.get, GET_ALL_FILES_METADATA);

    // Check if we have a valid response
    if (!response || !Array.isArray(response)) {
      throw new Error("Invalid response format for files metadata");
    }

    // // Get the current tree state to check if we need to refresh folders
    // const currentTree = yield select(state => state.fileFolderReducer.tree);
    //
    // // If the tree is empty or has no folders, we need to fetch folders first
    // const hasFolders = currentTree.some(item => item.type === 'folder');
    // if (!currentTree.length || !hasFolders) {
    //   yield put(fetchFoldersRequest());
    //
    //   // Wait for folders to be fetched before proceeding with files
    //   yield take(FETCH_FOLDERS_SUCCESS);
    // }

    yield put(fetchAllFilesMetadataSuccess(response));
  } catch (error) {
    console.error("Failed to fetch all files metadata:", error);
    yield put(fetchAllFilesMetadataFailure(error.message));
    toast.error('Failed to fetch files');
  }
}
// Fetch File Data
function* handleFetchFileData(action) {
  try {
    const { documentId, forceRefresh } = action.payload;

    // Get file metadata to determine file type
    const filesMetadata = yield select((state) => state.fileFolderReducer.filesMetadata);
    const fileMetadata = filesMetadata.find(file => file.id === documentId);

    // Determine if this is an editable file type (markdown, text)
    const isEditableFile = fileMetadata &&
      (fileMetadata.type === 'text/markdown' ||
       fileMetadata.contentType === 'text/markdown' ||
       fileMetadata.type === 'text/plain' ||
       fileMetadata.name.endsWith('.md') ||
       fileMetadata.name.endsWith('.txt'));

    // Check if file data is already cached
    const cachedFileData = yield select((state) => state.fileFolderReducer.fileData[documentId]);

    // Always dispatch cached data if available to ensure component gets data immediately
    if (cachedFileData) {
      yield put(fetchFileDataSuccess({id: documentId, fileData: cachedFileData}));

      // For non-editable files (PDFs, images), we can stop here unless forced refresh
      // For editable files (markdown, text), we should check for updates
      if (!forceRefresh && !isEditableFile) {
        return;
      }

      // If not forcing refresh but it's an editable file, fetch in background
      if (!forceRefresh) {
        try {
          const apiUrl = GET_FILE_DATA_BY_FILE_ID.replace('{documentId}', documentId);
          const response = yield call(api.get, apiUrl);

          // Handle the new response format where content is used instead of fileData
          const fileContent = response.fileData || response.content;

          // Only update if the data has changed
          if (fileContent && fileContent !== cachedFileData) {
            yield put(fetchFileDataSuccess({id: response.id, fileData: fileContent}));
          }
        } catch (backgroundError) {
          console.error("Background refresh failed:", backgroundError);
          // Don't show error for background refresh
        }
        return;
      }
    }

    // If no cached data or force refresh, fetch from server
    const apiUrl = GET_FILE_DATA_BY_FILE_ID.replace('{documentId}', documentId);
    const response = yield call(api.get, apiUrl);

    // Handle the new response format where content is used instead of fileData
    // For markdown/text files, content field is used
    // For PDFs and other binary files, fileData field is used
    const fileContent = isEditableFile ? (response.content || response.fileData) : (response.fileData || response.content);

    if (fileContent) {
      yield put(fetchFileDataSuccess({id: response.id, fileData: fileContent}));
    } else {
      console.error('No file content found in response');
      yield put(fetchFileDataFailure('No file content found in response'));
    }
  } catch (error) {
    console.error("Failed to fetch file data:", error);
    yield put(fetchFileDataFailure(error.message)); // Dispatch failure action with the error
    toast.error('Failed to fetch file data'); // Show a toast notification for the error
  }
}
// UPDATE File
function* handleUpdateFile(action) {
  const { fileId, newName } = action.payload;
  try {
    const apiUrl = RENAME_FILE.replace('{fileId}', fileId);
    const response = yield call(api.put, apiUrl, { name: newName });
    console.log("File renamed successfully:", response);
    yield put(updateFileSuccess(response));
    toast.success('File renamed successfully');
  } catch (error) {
    yield put(updateFileFailure(error.message));
    toast.error('Failed to rename file');
  }
}

// Handle updating file content (for markdown files)
function* handleUpdateFileContent(action) {
  const { fileId, content } = action.payload;
  try {
    const apiUrl = UPDATE_FILE_CONTENT.replace('{fileId}', fileId);

    // Send the content in the format expected by the server
    const response = yield call(api.put, apiUrl, { content });

    // Store the content in the Redux store
    yield put(updateFileContentSuccess({ fileId, content }));
    toast.success('File content saved successfully');

    // Force refresh the file data to ensure we have the latest version
    yield put(fetchFileDataRequest(fileId, true));
  } catch (error) {
    console.error("Failed to update file content:", error);
    yield put(updateFileContentFailure(error.message));
    toast.error('Failed to save file content');
  }
}
function* handleDeleteFile(action) {
  try {
    const apiUrl = `${DELETE_FILE}?fileId=${action.payload}`;
    const response = yield call(api.delete, apiUrl);
    yield put(deleteFileSuccess(action.payload));
    toast.success('File deleted successfully');
  } catch (error) {
    yield put(deleteFileFailure(error.message));
    toast.error('Failed to delete file');
  }
}

// -----------------------------//                  FOLDERS  SECTION               //------------------------------------------
// Add Folder
function* handleAddFolder(action) {
  const { tempId, companyId, name, parentId } = action.payload;
  try {
    const response = yield call(api.post,CREATE_FOLDER, {  name:name, parentId:parentId, companyId: companyId });
    const responseData = response.data ? response.data : response;
    yield put({
      type: REPLACE_TEMP_FOLDER_WITH_REEL_ONE_SUCCESS,
      payload: {
        tempId,
        id: responseData.id,
        responseName: responseData.name,
        parentId: responseData.parentId},
    });
    // yield put(fetchFoldersRequest({ userId }));
  } catch (error) {
    console.error("Error creating folder:", error);
    yield put({
      type: REMOVE_TEMP_FOLDER_AFTER_BACKEND_CREATION_FAILURE,
      payload: { tempId },
    });
  }
}

// Fetch Folders
function* handleFetchFolders(action) {
  try {
    const response = yield call(api.get, GET_FOLDERS);
    yield put(fetchFoldersSuccess(response));
  } catch (error) {
    yield put(fetchFoldersFailure(error.message));
  }
}

// UPDATE Folder
function* handleUpdateFolder(action) {
  const { newName } = action.payload;
  try {
    const apiUrl = UPDATE_FOLDER.replace('{folderId}', action.payload.folderId);
    const response = yield call(api.put, apiUrl, { name: newName });
    yield put(updateFolderSuccess(response));
  } catch (error) {
    yield put(updateFolderFailure(error.message));
  }
}

function* handleDeleteFolder(action) {
  try {
    const apiUrl = DELETE_FOLDER.replace('{folderId}', action.payload);
    const response = yield call(api.delete, apiUrl);
    yield put(deleteFolderSuccess(action.payload));
  } catch (error) {
    yield put(deleteFolderFailure(error.message));
  }
}

// Root Saga
export default function* fileFolderSaga() {
  yield takeLatest(ADD_FILE_REQUEST, handleAddFile);
  yield takeLatest(CREATE_FILE_REQUEST, handleCreateFile);
  // yield takeLatest(FETCH_FILES_METADATA_REQUEST, handleFetchFilesMetadata);
  yield takeLatest(FETCH_ALL_FILES_METADATA_REQUEST, handleFetchAllFilesMetadata);
  yield takeLatest(FETCH_FILE_DATA_REQUEST, handleFetchFileData);
  yield takeLatest(UPDATE_FILE_REQUEST, handleUpdateFile);
  yield takeLatest(UPDATE_FILE_CONTENT_REQUEST, handleUpdateFileContent);
  yield takeLatest(DELETE_FILE_REQUEST, handleDeleteFile);

  // FOLDERS
  yield takeLatest(ADD_FOLDER_REQUEST, handleAddFolder);
  yield takeLatest(FETCH_FOLDERS_REQUEST, handleFetchFolders);
  yield takeLatest(UPDATE_FOLDER_REQUEST, handleUpdateFolder);
  yield takeLatest(DELETE_FOLDER_REQUEST, handleDeleteFolder);
}
