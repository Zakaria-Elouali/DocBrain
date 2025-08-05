package ai.docbrain.service.fileManagement;



import ai.docbrain.domain.fileManagement.Folder;
import ai.docbrain.service.utils.exception.ResourceNotFoundException;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class FolderUtils {

    public static String buildFolderPath(Long folderId, IFolderRepository folderRepository) {
        List<String> pathComponents = new ArrayList<>();

        Long currentFolderId = folderId; // Create a new variable for the loop
        while (currentFolderId != null) {
            // Fetch the folder using its ID
            Folder folder = folderRepository.findById(currentFolderId)
                    .orElseThrow(() -> new ResourceNotFoundException("Folder not found with ID: " ));

            pathComponents.add(folder.getName());

            // Get the parent folder ID
            currentFolderId = folder.getParentId(); // Move up the hierarchy using parentId
        }

        // Reverse to build path from root to current folder
        Collections.reverse(pathComponents);
        return String.join("/", pathComponents);
    }
}
