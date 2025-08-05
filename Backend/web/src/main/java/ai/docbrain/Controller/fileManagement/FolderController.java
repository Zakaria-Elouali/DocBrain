package ai.docbrain.Controller.fileManagement;

import ai.docbrain.domain.fileManagement.Folder;
import ai.docbrain.domain.users.User;
import ai.docbrain.service.fileManagement.FolderService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/folders")
public class FolderController {

    private final FolderService folderService;

    @GetMapping
    public ResponseEntity<List<Folder>> getAllFoldersForCompany(@ModelAttribute("caller") User caller) {
        return ResponseEntity.ok(folderService.getAllFoldersForCompany(caller));
    }

    @PostMapping
    public ResponseEntity<Folder> createFolder(@ModelAttribute("caller") User caller, @RequestBody Folder folder) {
        return ResponseEntity.ok(folderService.createFolder(caller, folder));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Folder> updateFolder(@ModelAttribute("caller") User caller, @PathVariable Long id, @RequestBody Folder updatedFolder) {
        return ResponseEntity.ok(folderService.updateFolder(caller, id, updatedFolder));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFolder(@ModelAttribute("caller") User caller, @PathVariable Long id) {
        folderService.deleteFolder(caller, id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Folder> getFolderById(@ModelAttribute("caller") User caller, @PathVariable Long id) {
        return folderService.getFolderById(caller, id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }



//    @GetMapping("/{id}/hierarchy")
//    public ResponseEntity<List<Folder>> getFolderHierarchy(@ModelAttribute("caller") User caller, @PathVariable Long id) {
//        return ResponseEntity.ok(folderService.getFolderHierarchy(caller, id));
//    }

//    @GetMapping("/{id}/children")
//    public ResponseEntity<List<Folder>> getChildFolders(@ModelAttribute("caller") User caller, @PathVariable Long id) {
//        return ResponseEntity.ok(folderService.getChildFolders(id));
//    }

    @PostMapping("/{id}/link-clients")
    public ResponseEntity<Folder> linkFolderToClients(@ModelAttribute("caller") User caller, @PathVariable Long id, @RequestBody Set<Long> clientIds) {
        return ResponseEntity.ok(folderService.linkFolderToClients(caller, id, clientIds));
    }
}