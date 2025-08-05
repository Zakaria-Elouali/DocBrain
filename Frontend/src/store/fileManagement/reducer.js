import {
    ADD_FILE_REQUEST,
    ADD_FILE_SUCCESS,
    ADD_FILE_FAILURE,
    CREATE_FILE_REQUEST,
    CREATE_FILE_SUCCESS,
    CREATE_FILE_FAILURE,
    UPDATE_FILE_REQUEST,
    UPDATE_FILE_SUCCESS,
    UPDATE_FILE_FAILURE,
    DELETE_FILE_REQUEST,
    DELETE_FILE_SUCCESS,
    DELETE_FILE_FAILURE,
    FETCH_ALL_FILES_METADATA_REQUEST,
    FETCH_ALL_FILES_METADATA_SUCCESS,
    FETCH_ALL_FILES_METADATA_FAILURE,
    ADD_FOLDER_REQUEST,
    ADD_FOLDER_SUCCESS,
    ADD_FOLDER_FAILURE,
    UPDATE_FOLDER_REQUEST,
    UPDATE_FOLDER_SUCCESS,
    UPDATE_FOLDER_FAILURE,
    DELETE_FOLDER_REQUEST,
    DELETE_FOLDER_SUCCESS,
    DELETE_FOLDER_FAILURE,
    FETCH_FOLDERS_REQUEST,
    FETCH_FOLDERS_SUCCESS,
    FETCH_FOLDERS_FAILURE,
    REPLACE_TEMP_FOLDER_WITH_REEL_ONE_SUCCESS,
    REMOVE_TEMP_FOLDER_AFTER_BACKEND_CREATION_FAILURE,
    UPDATE_FOLDER_NAME_OPTIMISTIC,
    SET_PROGRESS,
    SET_ERROR,
    ADD_OPERATION,
    REMOVE_OPERATION,
    OPERATION_COMPLETE,
    FETCH_FILES_METADATA_FAILURE,
    FETCH_FILES_METADATA_REQUEST,
    FETCH_FILES_METADATA_SUCCESS,
    FETCH_FILE_DATA_FAILURE,
    FETCH_FILE_DATA_SUCCESS,
    FETCH_FILE_DATA_REQUEST,
    UPDATE_FILE_CONTENT_REQUEST,
    UPDATE_FILE_CONTENT_SUCCESS,
    UPDATE_FILE_CONTENT_FAILURE,
} from './actionType';

const initialState = {
  tree: [],
  loadingFiles: false,
  loadingFolders: false,
  error: null,
  operations: {},            // For progress and error tracking
  activeOperations: [],
  filesMetadata: [],
  fileData: {},
};

const fileFolderReducer = (state = initialState, action) => {
  switch (action.type) {

  // Progress and Error Management
    case ADD_OPERATION:
      return {
          ...state,
          activeOperations: [...state.activeOperations, action.payload.operationId]
      };

    case SET_PROGRESS:
      return {
          ...state,
          operations: {
              ...state.operations,
              [action.payload.operationId]: {
                  progress: action.payload.progress,
                  status: 'pending'
              }
          }
      };

    case OPERATION_COMPLETE: {
      const { operationId } = action.payload;
      const { [operationId]: removed, ...remainingOperations } = state.operations;
      return {
          ...state,
          operations: remainingOperations
      };
    }

    case SET_ERROR:
      return {
          ...state,
          operations: {
              ...state.operations,
              [action.payload.operationId]: {
                  progress: 0,
                  status: 'error',
                  error: action.payload.error
              }
          }
      };

    case REMOVE_OPERATION:
      const { [action.payload.operationId]: _, ...updatedOperations } = state.operations;
      return {
          ...state,
          operations: updatedOperations,
          activeOperations: state.activeOperations.filter(id => id !== action.payload.operationId)
      };



      // File Actions
    case ADD_FILE_REQUEST:
    case CREATE_FILE_REQUEST:
    case UPDATE_FILE_REQUEST:
    case DELETE_FILE_REQUEST:
    case FETCH_FILES_METADATA_REQUEST:
    case FETCH_ALL_FILES_METADATA_REQUEST:
    case FETCH_FILE_DATA_REQUEST:
    case UPDATE_FILE_CONTENT_REQUEST:
      return { ...state, loadingFiles: true, error: null };

    case ADD_FILE_SUCCESS:
      return {
        ...state,
        loadingFiles: false,
        tree: addFileToTree(state.tree, action.payload),
      };

    case CREATE_FILE_SUCCESS:
      const { filetempId, file } = action.payload;
      // Replace the temporary file with the real one
      return {
        ...state,
        loadingFiles: false,
        tree: replaceTemporaryFile(state.tree, filetempId, file),
      };

    case UPDATE_FILE_SUCCESS:
      return {
        ...state,
        loadingFiles: false,
        tree: updateNodeInTree(state.tree, action.payload),
      };

    case DELETE_FILE_SUCCESS:
      return {
        ...state,
        loadingFiles: false,
        tree: deleteNodeFromTree(state.tree, action.payload),
        // Also update filesMetadata to remove the deleted file
        filesMetadata: state.filesMetadata.filter(file => file.id !== action.payload),
        // Clear file data from cache if it exists
        fileData: {
          ...state.fileData,
          [action.payload]: undefined
        }
      };

    case FETCH_FILES_METADATA_SUCCESS: {
      const files = action.payload; // Payload is an array of file objects

      if (files.length === 0) {
          console.log("No files to add.");
          return state;
      }
      // Extract folderId from the first file (assuming all files belong to the same folder)
      const folderId = files[0].folderId;

      // Find the folder in the tree and add the files to its children
      const updatedTree = state.tree.map((folder) => {
          if (folder.id === folderId) {
              // Filter out files that are already in the folder
              const existingFileIds = new Set(folder.children?.map((child) => child.id) || []);
              const newFiles = files.filter((file) => !existingFileIds.has(file.id));
              return {
                  ...folder,
                  children: [
                      ...(folder.children || []), // Preserve existing children
                      ...newFiles.map((file) => ({
                          ...file,
                          // type: 'file', // Ensure files have a type
                      })),
                  ],
              };
          }
          return folder;
      });

      // Add files to filesMetadata (avoid duplicates)
      const existingFileIds = new Set(state.filesMetadata.map((file) => file.id));
      const newFilesMetadata = files.filter((file) => !existingFileIds.has(file.id));

      const updatedFilesMetadata = [...state.filesMetadata, ...newFilesMetadata];

      return {
          ...state,
          loadingFiles: false,
          tree: updatedTree,
          filesMetadata: updatedFilesMetadata,
      };
    }

    case FETCH_ALL_FILES_METADATA_SUCCESS: {
      const allFiles = action.payload; // Payload is an array of all file objects with their folder info

      if (!allFiles || allFiles.length === 0) {
          return {
              ...state,
              loadingFiles: false,
              // Clear filesMetadata if no files exist in the backend
              filesMetadata: []
          };
      }

      // Separate files (anything that's not a folder)
      const files = allFiles.filter(item => item.type !== "folder");

      // Extract all folders from the current tree (we want to keep the folder Mainarea)
      const extractFoldersFromTree = (nodes) => {
          let folders = [];
          nodes.forEach(node => {
              if (node.type === 'folder') {
                  // Create a copy of the folder without its children
                  const folderCopy = { ...node, children: [] };
                  folders.push(folderCopy);

                  // If this folder has children, extract subfolders from them too
                  if (node.children && node.children.length > 0) {
                      folders = [...folders, ...extractFoldersFromTree(node.children)];
                  }
              }
          });
          return folders;
      };

      // Get all folders from the current tree
      const allFolders = extractFoldersFromTree(state.tree);

      // Create a map of folders by ID for quick lookup
      const folderMap = new Map();
      allFolders.forEach(folder => {
          folderMap.set(folder.id.toString(), folder);
      });

      // Group files by folderId
      const filesByFolder = {};
      files.forEach(file => {
          // Use folderId as the key for grouping (null or undefined means root)
          const folderId = file.folderId || 'root';
          if (!filesByFolder[folderId]) {
              filesByFolder[folderId] = [];
          }
          filesByFolder[folderId].push(file);
      });

      // Start with a fresh tree containing only folders
      let updatedTree = state.tree
          .filter(item => item.type === 'folder')
          .map(folder => ({ ...folder, children: folder.children ? folder.children.filter(child => child.type === 'folder') : [] }));

      // Recursively remove all files from folder children
      const removeFilesFromFolders = (nodes) => {
          return nodes.map(node => {
              if (node.type === 'folder') {
                  return {
                      ...node,
                      children: node.children ? removeFilesFromFolders(node.children.filter(child => child.type === 'folder')) : []
                  };
              }
              return node;
          });
      };

      updatedTree = removeFilesFromFolders(updatedTree);

      // Add root-level files to the tree
      if (filesByFolder['root'] && filesByFolder['root'].length > 0) {
          updatedTree = [...updatedTree, ...filesByFolder['root']];
      }

      // Add files to their respective folders
      const addFilesToFolders = (nodes, filesByFolder) => {
          return nodes.map(node => {
              if (node.type === 'folder') {
                  const folderId = node.id.toString();
                  const folderFiles = filesByFolder[folderId] || [];

                  return {
                      ...node,
                      children: [
                          ...addFilesToFolders(node.children || [], filesByFolder),
                          ...folderFiles
                      ]
                  };
              }
              return node;
          });
      };

      updatedTree = addFilesToFolders(updatedTree, filesByFolder);

      return {
          ...state,
          loadingFiles: false,
          tree: updatedTree,
          // Replace filesMetadata with the fresh data from the backend
          filesMetadata: files
      };
    }

    case FETCH_FILE_DATA_SUCCESS:
      const { id, fileData } = action.payload;
      return {
        ...state,
        loadingFiles: false,
        fileData: {
            ...state.fileData,
            [id]: fileData, // Cache file data by documentId
        },
      };

    case UPDATE_FILE_CONTENT_SUCCESS:
      const { fileId, content } = action.payload;
      return {
        ...state,
        loadingFiles: false,
        fileData: {
            ...state.fileData,
            [fileId]: content, // Update file content in cache
        },
      };

    // Failure Actions
    case ADD_FILE_FAILURE:
      return { ...state, loadingFiles: false, error: action.payload };

    case CREATE_FILE_FAILURE:
      // For CREATE_FILE_FAILURE, we need to remove the temporary file from the tree
      return {
        ...state,
        loadingFiles: false,
        error: action.payload.error,
        // Remove the temporary file from the tree
        tree: action.payload.tempId ? removeTemporaryFile(state.tree, action.payload.tempId) : state.tree
      };

    case UPDATE_FILE_FAILURE:
    case DELETE_FILE_FAILURE:
    case FETCH_FILES_METADATA_FAILURE:
    case FETCH_ALL_FILES_METADATA_FAILURE:
    case FETCH_FILE_DATA_FAILURE:
    case UPDATE_FILE_CONTENT_FAILURE:
      return { ...state, loadingFiles: false, error: action.payload };

      // Folder Actions

    case ADD_FOLDER_REQUEST:
        const { tempId, name } = action.payload;
        const updateNameInTree = (nodes) =>
            nodes.map((node) =>
                node.id === tempId ? { ...node, name } : { ...node, children: updateNameInTree(node.children || []) }
            );
        return {
            ...state,
            tree: updateNameInTree(state.tree),
            // loadingFolders: true,
            error: null
        };
    case UPDATE_FOLDER_REQUEST:
    case DELETE_FOLDER_REQUEST:
    case FETCH_FOLDERS_REQUEST:
      return { ...state, loadingFolders: true, error: null };

    // case ADD_FOLDER_SUCCESS: for now disable because i call the replace temp folder if success to create in backend
    //   return {
    //     ...state,
    //     loadingFolders: false,
    //     tree: addFolderToTree(state.tree, action.payload),
    //   };

    case UPDATE_FOLDER_SUCCESS:
      return {
        ...state,
        loadingFolders: false,
        tree: updateNodeInTree(state.tree, action.payload),
      };

    case DELETE_FOLDER_SUCCESS:
      return {
        ...state,
        loadingFolders: false,
        tree: deleteNodeFromTree(state.tree, action.payload),
      };

    case FETCH_FOLDERS_SUCCESS: {
      // Extract existing files from the current tree
      const extractFilesFromTree = (nodes) => {
          let files = [];
          nodes.forEach(node => {
              // If this is a file (not a folder), add it to the files array
              if (node.type !== 'folder') {
                  files.push(node);
              }
              // If this node has children, extract files from them too
              if (node.children && node.children.length > 0) {
                  files = [...files, ...extractFilesFromTree(node.children)];
              }
          });
          return files;
      };

      // Get all files from the current tree
      const existingFiles = extractFilesFromTree(state.tree);

      // Build the new folder Mainarea
      const buildTreeStructure = (flatArray) => {
          const nodeMap = new Map();
          const rootNodes = [];

          // First pass: Create all nodes with empty children arrays
          flatArray.forEach(node => {
              nodeMap.set(node.id, { ...node, children: [] });
          });

          // Second pass: Build the tree Mainarea
          flatArray.forEach(node => {
              if (node.parentId === null) {
                  // This is a root node
                  rootNodes.push(nodeMap.get(node.id));
              } else {
                  // This is a child node, add it to its parent's children array
                  const parent = nodeMap.get(node.parentId);
                  if (parent) {
                      parent.children.push(nodeMap.get(node.id));
                  }
              }
          });

          return rootNodes;
      };

      // Build the new folder Mainarea
      const newFolderTree = buildTreeStructure(action.payload);

      // Group files by folderId
      const filesByFolder = {};
      existingFiles.forEach(file => {
          const folderId = file.folderId || 'root';
          if (!filesByFolder[folderId]) {
              filesByFolder[folderId] = [];
          }
          filesByFolder[folderId].push(file);
      });

      // Add root-level files to the tree
      let updatedTree = [...newFolderTree];
      if (filesByFolder['root'] && filesByFolder['root'].length > 0) {
          updatedTree = [...updatedTree, ...filesByFolder['root']];
      }

      // Add files to their respective folders
      Object.keys(filesByFolder).forEach(folderId => {
          if (folderId === 'root') return; // Skip root files, already handled

          const folderFiles = filesByFolder[folderId];

          // Update the tree to add files to their respective folders
          updatedTree = updatedTree.map(item => {
              if (item.id.toString() === folderId.toString()) {
                  return {
                      ...item,
                      children: [
                          ...(item.children || []),
                          ...folderFiles
                      ]
                  };
              }

              // Recursively check for nested folders
              if (item.children && item.children.length > 0) {
                  return {
                      ...item,
                      children: updateChildrenWithFiles(item.children, folderId, folderFiles)
                  };
              }

              return item;
          });
      });

      return {
          ...state,
          loadingFolders: false,
          tree: updatedTree
      };
    }
    // Failure Actions
    // case ADD_FOLDER_FAILURE: for now disable because i call the remove temp folder if failed to create in backend
    case UPDATE_FOLDER_FAILURE:
    case DELETE_FOLDER_FAILURE:
    case FETCH_FOLDERS_FAILURE:
      return { ...state, loadingFolders: false, error: action.payload };

    case 'ADD_TEMP_FILE':
    case 'ADD_TEMP_FOLDER': {
      const { payload } = action;
      const updatedTree = [...state.tree];
      // If parentId is specified, add the folder as a child of the parent
      if (payload.parentId) {
          const addChildToParent = (nodes) => {
              return nodes.map((node) => {
                  if (node.id === payload.parentId) {
                      return {
                          ...node,
                          children: [...(node.children || []), payload],
                      };
                  }
                  return {
                      ...node,
                      children: addChildToParent(node.children || []),
                  };
              });
          };
          return { ...state, tree: addChildToParent(updatedTree) };
      }

      // If no parentId, add the folder to the root level
      updatedTree.push(payload);
      return { ...state, tree: updatedTree };
    }

    case 'REMOVE_TEMP_FILE': {
      const { tempId } = action.payload;
      // Remove the temporary file from the tree
      return {
        ...state,
        tree: removeTemporaryFile(state.tree, tempId)
      };
    }

    // replacing the temp folder with reel one after backend prove the creation
    case REPLACE_TEMP_FOLDER_WITH_REEL_ONE_SUCCESS: {
      const {tempId, id, responseName} = action.payload;
      const replaceTemporaryFolder = (nodes) => {
          return nodes.map((node) => {
              if (node.id === tempId) {
                  return { ...node, id, responseName, isTemporary: false };
              }
              return {
                  ...node,
                  children: replaceTemporaryFolder(node.children || []),
              };
          });
      };

      return { ...state,
          loadingFolders: false,
          tree: replaceTemporaryFolder(state.tree)
      };
    }

    // removing the temp folder after the backend doesn't prove the creation
    case REMOVE_TEMP_FOLDER_AFTER_BACKEND_CREATION_FAILURE: {
      const { tempId } = action.payload;
      const removeTemporaryFolder = (nodes) => {
          return nodes
              .map((node) => ({
                  ...node,
                  children: removeTemporaryFolder(node.children || []),
              }))
              .filter((node) => node.id !== tempId);
      };

      return { ...state,
          loadingFolders: false,
          tree: removeTemporaryFolder(state.tree)
      };
    }

    default:
      return state;
    }
};

// Helper to add a folder
// const addFolderToTree = (tree, payload) => {
//   const { parentId, folder } = payload;
//
//   const traverseAndAdd = (nodes) =>
//       nodes.map((node) => {
//         if (node.id === parentId && node.type === 'folder') {
//           return { ...node, children: [...(node.children || []), folder] };
//         }
//         if (node.children) {
//           return { ...node, children: traverseAndAdd(node.children) };
//         }
//         return node;
//       });
//
//   return traverseAndAdd(tree);
// };

// Helper to add a file
const addFileToTree = (tree, payload) => {
  const { parentId, file } = payload;

  const traverseAndAdd = (nodes) =>
      nodes.map((node) => {
        if (node.id === parentId && node.type === 'folder') {
          return { ...node, children: [...(node.children || []), file] };
        }
        if (node.children) {
          return { ...node, children: traverseAndAdd(node.children) };
        }
        return node;
      });

  return traverseAndAdd(tree);
};

// Helper to replace a temporary file with the real one
const replaceTemporaryFile = (tree, tempId, file) => {
  const traverseAndReplace = (nodes) => {
    return nodes.map((node) => {
      if (node.id === tempId) {
        // Replace the temporary file with the real one
        return {
          ...file,
          isTemporary: false
        };
      }
      if (node.children) {
        return {
          ...node,
          children: traverseAndReplace(node.children)
        };
      }
      return node;
    });
  };

  return traverseAndReplace(tree);
};

// Helper to remove a temporary file from the tree
const removeTemporaryFile = (tree, tempId) => {
  const traverseAndRemove = (nodes) => {
    // Filter out the node with the matching tempId
    return nodes
      .filter(node => node.id !== tempId)
      .map(node => {
        if (node.children && node.children.length > 0) {
          return {
            ...node,
            children: traverseAndRemove(node.children)
          };
        }
        return node;
      });
  };

  return traverseAndRemove(tree);
};

// Helper function to recursively update children with files
const updateChildrenWithFiles = (children, folderId, files) => {
  return children.map(child => {
    // Only process folder items
    if (child.type === 'folder' && child.id.toString() === folderId.toString()) {
      // Filter out files that are already in the folder
      const existingChildIds = new Set(
        (child.children || [])
          .filter(c => c.type !== 'folder')
          .map(c => c.id)
      );
      const newFiles = files.filter(file => !existingChildIds.has(file.id));

      // Keep existing folder children (subfolders)
      const existingFolderChildren = (child.children || []).filter(c => c.type === 'folder');
      // Keep existing file children
      const existingFileChildren = (child.children || []).filter(c => c.type !== 'folder');

      return {
        ...child,
        children: [
          ...existingFolderChildren,
          ...existingFileChildren,
          ...newFiles
        ]
      };
    }

    // Recursively check for nested folders
    if (child.type === 'folder' && child.children && child.children.length > 0) {
      return {
        ...child,
        children: updateChildrenWithFiles(child.children, folderId, files)
      };
    }

    return child;
  });
};

// Helper to update a node
const updateNodeInTree = (tree, payload) => {
  const traverseAndUpdate = (nodes) =>
      nodes.map((node) => {
        if (node.id === payload.id) {
          return { ...node, ...payload };
        }
        if (node.children) {
          return { ...node, children: traverseAndUpdate(node.children) };
        }
        return node;
      });

  return traverseAndUpdate(tree);
};

// Helper to delete a node
const deleteNodeFromTree = (tree, nodeId) => {
  const traverseAndDelete = (nodes) =>
      nodes
          .filter((node) => node.id !== nodeId)
          .map((node) =>
              node.children
                  ? { ...node, children: traverseAndDelete(node.children) }
                  : node
          );

  return traverseAndDelete(tree);
};

// Helper functions for tree manipulation are defined above

export default fileFolderReducer;
