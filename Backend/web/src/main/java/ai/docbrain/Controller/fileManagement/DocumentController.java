package ai.docbrain.Controller.fileManagement;

import ai.docbrain.domain.fileManagement.Folder;
import ai.docbrain.domain.users.User;
import ai.docbrain.service.fileManagement.DTO.CreateFileRequestDto;
import ai.docbrain.service.fileManagement.DTO.CreateFileResponseDto;
import ai.docbrain.service.fileManagement.DTO.DocumentListResponse;
import ai.docbrain.service.fileManagement.DTO.FileDataResponseDto;
import ai.docbrain.service.fileManagement.DTO.FileMetadataResponseDto;
import ai.docbrain.service.fileManagement.DTO.RenameFileRequestDto;
import ai.docbrain.service.fileManagement.DTO.RenameFileResponseDto;
import ai.docbrain.service.fileManagement.DTO.UpdateFileContentRequestDto;
import ai.docbrain.service.fileManagement.DTO.UpdateFileContentResponseDto;
import ai.docbrain.service.fileManagement.DTO.UploadResponse;
import ai.docbrain.service.fileManagement.DocumentService;
import ai.docbrain.service.fileManagement.FolderService;
import ai.docbrain.service.user.UserService;
import ai.docbrain.service.utils.ServerConstants;
import ai.docbrain.service.utils.ServerUtils;
import ai.docbrain.service.utils.exception.ResourceNotFoundException;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api")
@AllArgsConstructor
@Log4j2
public class DocumentController {

    private final DocumentService documentService;
    private final UserService userService;
    private final FolderService folderService;

    @PostMapping("/uploadfile")
    public ResponseEntity<?> uploadFile(
            @ModelAttribute("caller") User caller,
            @RequestParam("files") MultipartFile[] files,
            @RequestParam(required = false) Long folderId
    ) {
        if (files == null || files.length == 0) {
            return ServerUtils.getResponseEntity(ServerConstants.FILE_EMPTY, HttpStatus.BAD_REQUEST);
        }

        List<String> errorMessages = new ArrayList<>();
        List<String> successMessages = new ArrayList<>();

        // Validate folder ownership if folderId is provided
        Folder folder = null;
        if (folderId != null) {
            folder = folderService.findById(folderId)
                    .orElseThrow(() -> new ResourceNotFoundException("Folder not found with ID: " + folderId));
            if (!folder.getCompanyId().equals(caller.getCompanyId())) {
                return ServerUtils.getResponseEntity(ServerConstants.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED);
            }
        }

        for (MultipartFile file : files) {
            if (file.isEmpty()) {
                errorMessages.add("File " + file.getOriginalFilename() + " is empty.");
                continue;
            }

            try {
                // Call the uploadDocument method for each file
                ResponseEntity<?> response = documentService.uploadDocument(caller, file, folderId);

                if (response.getStatusCode() == HttpStatus.OK) {
                    successMessages.add("File " + file.getOriginalFilename() + " uploaded successfully.");
                } else {
                    errorMessages.add("Failed to upload file " + file.getOriginalFilename() + ": " + response.getBody());
                }
            } catch (Exception e) {
                log.error("An error occurred while uploading the document: " + file.getOriginalFilename(), e);
                errorMessages.add("An error occurred while uploading file " + file.getOriginalFilename() + ": " + e.getMessage());
            }
        }

        // Return appropriate response based on success and error messages
        if (!errorMessages.isEmpty()) {
            return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
                    .body(new UploadResponse(successMessages, errorMessages));
        }

        return ResponseEntity.ok(new UploadResponse(successMessages, Collections.emptyList()));
    }

//    @PostMapping("/uploadfiletouser")
//    public ResponseEntity<String> uploadFileToUser(
//            @ModelAttribute("caller") User caller,
//            @RequestParam("email") String email,
//            @RequestParam("file") MultipartFile file
//    ) {
//        try {
//            if (email == null || email.isEmpty() || file == null || file.isEmpty()) {
//                return ServerUtils.getResponseEntity(ServerConstants.INVALID_DATA, HttpStatus.BAD_REQUEST);
//            }
//
//            // Ensure the caller is an admin or super admin
//            if (!userService.isAdmin(caller) && !userService.isSuperAdmin(caller)) {
//                return ServerUtils.getResponseEntity(ServerConstants.UNAUTHORIZED_ACCESS, HttpStatus.FORBIDDEN);
//            }
//
//            return documentService.uploadFileToUser(caller, email, file);
//        } catch (Exception e) {
//            log.error("An error occurred while uploading the document: " + file.getOriginalFilename(), e);
//            return ServerUtils.getResponseEntity(ServerConstants.FILE_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }

    @GetMapping("/downloadfile")
    public ResponseEntity<?> downloadFile(
            @ModelAttribute("caller") User caller,
            @RequestParam(value = "fileid", required = false) Long fileId,
            @RequestParam(value = "fileName", required = false) String fileName
    ) {
        try {
            // Validate fileName
            if (fileName == null || fileName.isEmpty()) {
                return ServerUtils.getResponseEntity(ServerConstants.INVALID_DATA, HttpStatus.BAD_REQUEST);
            }

            // Fetch the document from the service
            ResponseEntity<byte[]> response = documentService.downloadDocument(caller, fileId, fileName);

            // Check if document is null
            if (response.getBody() == null) {
                log.warn("Document with ID: {} and fileName: {} is null", fileId, fileName);
                return ServerUtils.getResponseEntity(ServerConstants.FIL_DOWNLOAD_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
            }

            // Set headers for file download
            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"");
            headers.add(HttpHeaders.CONTENT_TYPE, ServerUtils.getMediaType(fileName).toString());

            // Return the file as response
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(response.getBody());
        } catch (Exception e) {
            log.error("An error occurred while downloading the document: {}", fileName, e);
            return ServerUtils.getResponseEntity(ServerConstants.FIL_DOWNLOAD_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/deletefile")
    public ResponseEntity<?> deleteFile(
            @ModelAttribute("caller") User caller,
            @RequestParam(value = "fileId", required = false) Long fileId
    ) {
        try {
            if (fileId == null) {
                return ServerUtils.getResponseEntity(ServerConstants.INVALID_DATA, HttpStatus.BAD_REQUEST);
            }
            return documentService.deleteDocument(caller, fileId);
        } catch (Exception e) {
            log.error("An error occurred while deleting the document: " + fileId, e);
            return ServerUtils.getResponseEntity(ServerConstants.FILE_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


//    @PostMapping(value = "/replaceDocument", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//    public ResponseEntity<String> replaceDocument(
//            @ModelAttribute("caller") User caller,
//            @RequestParam Long documentId,
//            @RequestParam MultipartFile newFile
//    ) {
//        try {
//            if (documentId == null || newFile == null || newFile.isEmpty()) {
//                return ServerUtils.getResponseEntity(ServerConstants.INVALID_DATA, HttpStatus.BAD_REQUEST);
//            }
//            return documentService.replaceDocument(caller, documentId, newFile);
//        } catch (Exception e) {
//            log.error("An error occurred while replacing the document: " + documentId, e);
//            return ServerUtils.getResponseEntity(ServerConstants.FILE_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }

//    @GetMapping("/getAllDocuments")
//    public ResponseEntity<byte[]> downloadAllDocuments(
//            @ModelAttribute("caller") User caller,
//            @RequestParam Long userId
//    ) {
//        try {
//            if (userId == null) {
//                return ResponseEntity.badRequest().build();
//            }
//            return documentService.downloadAllDocuments(caller, userId);
//        } catch (Exception e) {
//            log.error("An error occurred while downloading all documents", e);
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
//        }
//    }

    @GetMapping("/files/{folderId}/metadata")
    public ResponseEntity<List<FileMetadataResponseDto>> getDocumentMetadataByFolderId(
            @ModelAttribute("caller") User caller,
            @PathVariable Long folderId
    ) {
        List<FileMetadataResponseDto> metadataList = documentService.getDocumentMetadataByFolderId(caller, folderId);

        if (metadataList.isEmpty()) {
            throw new ResourceNotFoundException(ServerConstants.FILE_NOT_FOUND);
        }

        return ResponseEntity.ok(metadataList);
    }

    /**
     * Get all document metadata for the company
     *
     * @param caller The authenticated user
     * @return ResponseEntity with the list of file metadata
     */
    @GetMapping("/files/all/metadata")
    public ResponseEntity<List<FileMetadataResponseDto>> getAllDocumentMetadata(
            @ModelAttribute("caller") User caller
    ) {
        try {
            List<FileMetadataResponseDto> metadataList = documentService.getAllDocumentMetadataByCompany(caller);

            if (metadataList.isEmpty()) {
                return ResponseEntity.noContent().build();
            }

            return ResponseEntity.ok(metadataList);
        } catch (Exception e) {
            log.error("Error fetching all document metadata", e);
            throw new ResourceNotFoundException("Failed to fetch document metadata");
        }
    }

    @GetMapping("/files/{documentId}/file-data")
    public ResponseEntity<FileDataResponseDto> getDocumentFileData(
            @ModelAttribute("caller") User caller,
            @PathVariable Long documentId
    ) {
        FileDataResponseDto fileData = documentService.getDocumentFileData(caller, documentId);
        return ResponseEntity.ok(fileData);
    }

    /**
     * Creates a new markdown file in the specified folder
     *
     * @param caller The authenticated user
     * @param request The create file request containing folder ID and optional file name
     * @return ResponseEntity with the created file metadata
     */
    @PostMapping("/createfile")
    public ResponseEntity<CreateFileResponseDto> createFile(
            @ModelAttribute("caller") User caller,
            @RequestBody(required = false) CreateFileRequestDto request
    ) {
        try {
            // Extract parameters from request or use defaults
            Long folderId = (request != null) ? request.getFolderId() : null;
            String fileName = (request != null && request.getFileName() != null) ?
                    request.getFileName() : "New Markdown.md";

            // Call service to create the file
            CreateFileResponseDto response = documentService.createMarkdownFile(caller, folderId, fileName);

            // Return appropriate response based on success or failure
            if (response.getId() != null) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
        } catch (Exception e) {
            log.error("An error occurred while creating the markdown file", e);
            CreateFileResponseDto errorResponse = new CreateFileResponseDto();
            errorResponse.setMessage(ServerConstants.FILE_ERROR);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Updates the content of a file
     * Currently supports markdown files, but designed to be extensible for other formats
     *
     * @param caller The authenticated user
     * @param fileId The ID of the file to update
     * @param request The update request containing the new content and optional content type
     * @return ResponseEntity with the updated file metadata
     */
    @PutMapping("/files/{fileId}/content")
    public ResponseEntity<UpdateFileContentResponseDto> updateFileContent(
            @ModelAttribute("caller") User caller,
            @PathVariable Long fileId,
            @RequestBody UpdateFileContentRequestDto request
    ) {
        try {
            // Call service to update the file content
            UpdateFileContentResponseDto response = documentService.updateFileContent(caller, fileId, request);

            // Return appropriate response based on success or failure
            if (response.getId() != null) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
        } catch (Exception e) {
            log.error("An error occurred while updating the file content for file ID: " + fileId, e);
            UpdateFileContentResponseDto errorResponse = new UpdateFileContentResponseDto();
            errorResponse.setMessage(ServerConstants.FILE_ERROR);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Renames a file
     *
     * @param caller The authenticated user
     * @param fileId The ID of the file to rename (from path variable)
     * @param request The rename request containing the new file name
     * @return ResponseEntity with the updated file metadata
     */
    @PutMapping("/renamefile/{fileId}")
    public ResponseEntity<RenameFileResponseDto> renameFile(
            @ModelAttribute("caller") User caller,
            @PathVariable Long fileId,
            @RequestBody RenameFileRequestDto request
    ) {
        try {
            // Validate request
            if (request == null || request.getName() == null || request.getName().trim().isEmpty()) {
                RenameFileResponseDto errorResponse = new RenameFileResponseDto();
                errorResponse.setMessage(ServerConstants.INVALID_DATA);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
            }

            // Call service to rename the file
            RenameFileResponseDto response = documentService.renameFile(caller, fileId, request.getName());

            // Return appropriate response based on success or failure
            if (response.getId() != null) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
        } catch (Exception e) {
            log.error("An error occurred while renaming the file with ID: " + fileId, e);
            RenameFileResponseDto errorResponse = new RenameFileResponseDto();
            errorResponse.setMessage(ServerConstants.FILE_ERROR);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}