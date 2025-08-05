package ai.docbrain.service.fileManagement;
import ai.docbrain.domain.fileManagement.Folder;
import ai.docbrain.domain.users.User;
import ai.docbrain.service.role.RoleService;
import ai.docbrain.service.user.IUserRepository;
import ai.docbrain.service.user.UserService;
import ai.docbrain.service.utils.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FolderService {

    private final IFolderRepository folderRepository;
    private final IUserRepository userRepository;
    private final RoleService roleService;

    public Folder createFolder(User caller, Folder folder) {
        // Debug logging
        System.out.println("Caller details: " + caller);
        System.out.println("Caller companyId: " + caller.getCompanyId());
        System.out.println("Folder before setting companyId: " + folder);

        // Ensure the folder is associated with the caller's company
        folder.setCompanyId(caller.getCompanyId());

        System.out.println("Folder after setting companyId: " + folder);
        System.out.println("Folder companyId: " + folder.getCompanyId());
        // Handle root folder (parentId must be null)
        if (folder.getParentId() == null) {
            // Ensure the folder is intended to be a root folder
            System.out.println("Creating root folder: " + folder.getName());
        } else {
            // Handle subfolder (parentId must be valid and belong to the same company)
            Folder parentFolder = folderRepository.findById(folder.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent folder not found"));
            if (!parentFolder.getCompanyId().equals(caller.getCompanyId())) {
                throw new IllegalArgumentException("Parent folder does not belong to the same company");
            }
            System.out.println("Creating subfolder: " + folder.getName() + " under parent: " + parentFolder.getName());
        }

        return folderRepository.save(folder);
    }

    public Folder updateFolder(User caller, Long folderId, Folder updatedFolder) {
        Folder existingFolder = folderRepository.findById(folderId)
                .orElseThrow(() -> new ResourceNotFoundException("Folder not found with id: " + folderId));

        // Ensure the folder belongs to the caller's company
        if (!existingFolder.getCompanyId().equals(caller.getCompanyId())) {
            throw new IllegalArgumentException("Folder does not belong to the same company");
        }

        existingFolder.setName(updatedFolder.getName());
        existingFolder.setTags(updatedFolder.getTags());
        return folderRepository.save(existingFolder);
    }

    public void deleteFolder(User caller, Long folderId) {
        Folder folder = folderRepository.findById(folderId)
                .orElseThrow(() -> new ResourceNotFoundException("Folder not found with id: " + folderId));

        // Ensure the folder belongs to the caller's company
        if (!folder.getCompanyId().equals(caller.getCompanyId())) {
            throw new IllegalArgumentException("Folder does not belong to the same company");
        }

        // Check if there are any child folders
        List<Folder> childFolders = getChildFolders(folderId);
        if (!childFolders.isEmpty()) {
            throw new IllegalStateException("Folder contains subfolders, delete them first");
        }

        folderRepository.delete(folder);
    }

    public Optional<Folder> getFolderById(User caller, Long folderId) {
        Optional<Folder> folder = folderRepository.findById(folderId);
        if (folder.isPresent() && !folder.get().getCompanyId().equals(caller.getCompanyId())) {
            throw new IllegalArgumentException("Folder does not belong to the same company");
        }
        return folder;
    }

    public List<Folder> getAllFoldersForCompany(User caller) {
        // Fetch all folders for the caller's company
        List<Folder> allFolders = folderRepository.findAllByCompanyId(caller.getCompanyId());

        // If the caller is a client, return only folders linked to them
        if (roleService.isClient(caller)) {
            return allFolders.stream()
                    .filter(folder -> folder.getClients() != null && folder.getClients().contains(caller))
                    .collect(Collectors.toList());
        }

        // If the caller is an employee (SUPER_ADMIN, ADMIN, VIEWER), exclude blocked folders
        if (caller.getBlockedFolderIds() != null && !caller.getBlockedFolderIds().isEmpty()) {
            return allFolders.stream()
                    .filter(folder -> !caller.getBlockedFolderIds().contains(folder.getId()))
                    .collect(Collectors.toList());
        }

        // If no blocked folders, return all folders
        return allFolders;
    }

//    public List<Folder> getFolderHierarchy(User caller, Long folderId) {
//        Folder rootFolder = folderRepository.findById(folderId)
//                .orElseThrow(() -> new ResourceNotFoundException("Folder not found with id: " + folderId));
//
//        // Ensure the folder belongs to the caller's company
//        if (!rootFolder.getCompanyId().equals(caller.getCompanyId())) {
//            throw new IllegalArgumentException("Folder does not belong to the same company");
//        }
//
//        List<Folder> hierarchy = new ArrayList<>();
//        buildFolderHierarchy(rootFolder, hierarchy);
//        return hierarchy;
//    }

//    private void buildFolderHierarchy(Folder folder, List<Folder> hierarchy) {
//        hierarchy.add(folder);
//        for (Folder childFolder : getChildFolders(folder.getId())) {
//            buildFolderHierarchy(childFolder, hierarchy);
//        }
//    }

    public List<Folder> getChildFolders(Long parentFolderId) {
        return folderRepository.findChildFoldersByParentId(parentFolderId);
    }

    public Folder linkFolderToClients(User caller, Long folderId, Set<Long> clientIds) {
        Folder folder = folderRepository.findById(folderId)
                .orElseThrow(() -> new ResourceNotFoundException("Folder not found with id: " + folderId));

        // Ensure the folder belongs to the caller's company
        if (!folder.getCompanyId().equals(caller.getCompanyId())) {
            throw new IllegalArgumentException("Folder does not belong to the same company");
        }

        // Fetch the clients from the database
        Set<User> clients = clientIds.stream()
                .map(clientId -> userRepository.findById(clientId)
                        .orElseThrow(() -> new ResourceNotFoundException("Client not found with id: " + clientId)))
                .collect(Collectors.toSet());

        folder.setClients(clients);
        return folderRepository.save(folder);
    }

    public Optional<Folder> findById(Long folderId) {
        return folderRepository.findById(folderId);
    }
}