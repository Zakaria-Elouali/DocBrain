package ai.docbrain.service.fileManagement;

import ai.docbrain.domain.fileManagement.Document;
import ai.docbrain.domain.fileManagement.DocumentActivityLog;
import ai.docbrain.domain.fileManagement.Folder;
import ai.docbrain.domain.users.User;
import ai.docbrain.service.fileManagement.DTO.CreateFileResponseDto;
import ai.docbrain.service.fileManagement.DTO.DocumentListResponse;
import ai.docbrain.service.fileManagement.DTO.FileDataResponseDto;
import ai.docbrain.service.fileManagement.DTO.FileMetadataResponseDto;
import ai.docbrain.service.fileManagement.DTO.RenameFileRequestDto;
import ai.docbrain.service.fileManagement.DTO.RenameFileResponseDto;
import ai.docbrain.service.fileManagement.DTO.UpdateFileContentRequestDto;
import ai.docbrain.service.fileManagement.DTO.UpdateFileContentResponseDto;
import ai.docbrain.service.role.RoleService;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfReader;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.utils.PdfMerger;
import ai.docbrain.service.user.IUserRepository;
import ai.docbrain.service.user.UserService;
import ai.docbrain.service.utils.EncryptionUtil;
import ai.docbrain.service.utils.ServerConstants;
import ai.docbrain.service.utils.ServerUtils;
import ai.docbrain.service.utils.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Log4j2
@Service
public class DocumentService {

    private final IDocumentRepository documentRepository;
    private final IFolderRepository folderRepository;
    private final RoleService roleService;
    private final EncryptionUtil encryptionUtil;
    private final IDocumentActivityLogRepository logRepository;

    @Transactional
    public ResponseEntity<String> uploadDocument(User caller, MultipartFile file, Long folderId) {
        try {
            // Validate caller
            if (caller == null) {
                return ServerUtils.getResponseEntity(ServerConstants.USER_NOT_FOUND, HttpStatus.UNAUTHORIZED);
            }

            // Validate file input
            if (file == null || file.isEmpty()) {
                return ServerUtils.getResponseEntity(ServerConstants.INVALID_DATA, HttpStatus.BAD_REQUEST);
            }
            if (file.getSize() > 10 * 1024 * 1024) { // 10 MB limit
                return ServerUtils.getResponseEntity(ServerConstants.FILE_LIMIT_EXCEEDED, HttpStatus.BAD_REQUEST);
            }

            String contentType = file.getContentType();
            if (contentType == null || !(contentType.equals("application/pdf") || contentType.startsWith("image/"))) {
                return ServerUtils.getResponseEntity(ServerConstants.INVALID_DATA, HttpStatus.BAD_REQUEST);
            }

            // Sanitize and validate file name
            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null || originalFilename.contains(",")) {
                return ServerUtils.getResponseEntity(ServerConstants.INVALID_DATA, HttpStatus.BAD_REQUEST);
            }

            String sanitizedFilename = ServerUtils.sanitizeFileName(originalFilename);

            // Encrypt file data and file name
            byte[] encryptedFileData = encryptionUtil.encrypt(file.getBytes());
            String encryptedFilename = Base64.getEncoder().encodeToString(encryptionUtil.encrypt(sanitizedFilename.getBytes()));
            System.out.println("Encrypted file data length: "+ encryptedFileData.length); // Debugging
            System.out.println("Encrypted file data type: "+ encryptedFileData.getClass().getName());
            // Save the document
            Document document = Document.builder()
                    .name(encryptedFilename)
                    .type(contentType)
                    .path(folderId == null ? "/" : FolderUtils.buildFolderPath(folderId, folderRepository))
                    .size(file.getSize())
                    .folderId(folderId)
                    .companyId(caller.getCompanyId())
                    .fileData(encryptedFileData)
                    .tags("uploaded")
                    .summary(null) // Explicitly set to null
                    .keywords(null)
                    .vectorRepresentation(null)
                    .accessedAt(null)
                    .aiProcessed(false)
                    .build();

            documentRepository.save(document);
            System.out.println("uploaded document Name : "+ originalFilename); // Debugging
            System.out.println("uploaded document Name : "+ document.getName()); // Debugging
            logDocumentAction(document, caller, "UPLOADED", originalFilename);

            return ServerUtils.getResponseEntity(ServerConstants.FILE_UPLOADED, HttpStatus.OK);

        } catch (IOException e) {
            log.error("File processing error: " + (file != null ? file.getOriginalFilename() : "Unknown file"), e);
            return ServerUtils.getResponseEntity(ServerConstants.FILE_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);

        } catch (Exception e) {
            log.error("Unexpected error during file upload", e);
            return ServerUtils.getResponseEntity(ServerConstants.FILE_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional(readOnly = true)
    public ResponseEntity<byte[]> downloadDocument(User caller, Long fileId, String fileName) {
        try {
            if (caller == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
            }

            String encryptedFilename = Base64.getEncoder().encodeToString(encryptionUtil.encrypt(fileName.getBytes()));

            List<Document> dbDocuments;
            if (roleService.isClient(caller)) {
                // Clients can only access their own documents
                dbDocuments = documentRepository.getByCompanyIdAndFileId(fileId, caller.getCompanyId());
                if (dbDocuments == null || dbDocuments.isEmpty()) {
                    log.error("Client {} tried to access a document they don't own: {}", caller.getEmail(), fileName);
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
                }
            } else {
                // Admins and other roles can access any document within their company
                dbDocuments = documentRepository.getByCompanyIdAndFileId(fileId, caller.getCompanyId());
                if (dbDocuments == null || dbDocuments.isEmpty()) {
                    log.error("User {} attempted to access non-existent document: {}", caller.getEmail(), fileName);
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
                }
            }

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            PdfMerger pdfMerger = new PdfMerger(new PdfDocument(new PdfWriter(outputStream)));

            for (Document document : dbDocuments) {
                byte[] decryptedData = encryptionUtil.decrypt(document.getFileData());

                if (decryptedData == null || decryptedData.length == 0) {
                    log.error("Decryption failed or resulted in empty data for file: {}", document.getName());
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
                }

                PdfDocument pdfDoc = new PdfDocument(new PdfReader(new ByteArrayInputStream(decryptedData)));
                pdfMerger.merge(pdfDoc, 1, pdfDoc.getNumberOfPages());
                pdfDoc.close();
            }

            pdfMerger.close();
            return ResponseEntity.ok(outputStream.toByteArray());

        } catch (Exception e) {
            log.error("An unexpected error occurred while downloading the document: {}", fileName, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @Transactional
    public ResponseEntity<String> deleteDocument(User caller, Long fileId) {
        try {
            if (caller == null) {
                return ServerUtils.getResponseEntity(ServerConstants.USER_NOT_FOUND, HttpStatus.UNAUTHORIZED);
            }

            Optional<Document> documentOptional = documentRepository.findById(fileId);
            if (documentOptional.isEmpty()) {
                log.error("Document not found with ID: {}", fileId);
                return ServerUtils.getResponseEntity(ServerConstants.FILE_NOT_FOUND, HttpStatus.BAD_REQUEST);
            }

            Document document = documentOptional.get();
            if (!document.getCompanyId().equals(caller.getCompanyId())) {
                log.error("Access denied for user with ID: {} to delete document with ID: {}", caller.getId(), fileId);
                return ServerUtils.getResponseEntity(ServerConstants.UNAUTHORIZED_ACCESS, HttpStatus.FORBIDDEN);
            }

            documentRepository.delete(document);
            // LogDocumentAction the deletion action
            byte[] decryptedFilenameBytes = encryptionUtil.decrypt(Base64.getDecoder().decode(document.getName()));
            String decryptedFilename = new String(decryptedFilenameBytes);
            logDocumentAction(document, caller, "DELETED", decryptedFilename);
            return ServerUtils.getResponseEntity(ServerConstants.FILE_DELETED, HttpStatus.OK);
        } catch (Exception e) {
            log.error("An error occurred while deleting the document: {}", fileId, e);
            return ServerUtils.getResponseEntity(ServerConstants.FILE_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional(readOnly = true)
    public List<FileMetadataResponseDto> getDocumentMetadataByFolderId(User caller, Long folderId) {
        try {
            if (caller == null) {
                throw new ResourceNotFoundException("User not found");
            }
            System.out.println("Folder ID: "+ folderId+"companyId: "+ caller.getCompanyId()); // Debugging
            // Fetch metadata for documents in the folder
            List<FileMetadataResponseDto> metadataList = documentRepository.findMetadataByFolderIdAndCompanyId(folderId, caller.getCompanyId());
            System.out.println("Metadata list size: "+ metadataList.size()); // Debugging
            // Decrypt the file names in the metadata
            return decryptFileMetadata(metadataList);

        } catch (Exception e) {
            log.error("Error fetching document metadata for folder ID: " + folderId, e);
            throw new ResourceNotFoundException("Failed to fetch document metadata");
        }
    }

    /**
     * Get all document metadata for a company
     *
     * @param caller The user requesting the metadata
     * @return List of FileMetadataResponseDto objects with decrypted file names
     */
    @Transactional(readOnly = true)
    public List<FileMetadataResponseDto> getAllDocumentMetadataByCompany(User caller) {
        try {
            if (caller == null) {
                throw new ResourceNotFoundException("User not found");
            }

            // Fetch metadata for all documents in the company
            List<FileMetadataResponseDto> metadataList = documentRepository.findAllMetadataByCompanyId(caller.getCompanyId());
            log.info("Found {} documents for company ID: {}", metadataList.size(), caller.getCompanyId());

            // Decrypt the file names in the metadata
            return decryptFileMetadata(metadataList);

        } catch (Exception e) {
            log.error("Error fetching all document metadata for company ID: " + caller.getCompanyId(), e);
            throw new ResourceNotFoundException("Failed to fetch document metadata");
        }
    }

    /**
     * Helper method to decrypt file metadata
     *
     * @param metadataList List of FileMetadataResponseDto objects with encrypted file names
     * @return List of FileMetadataResponseDto objects with decrypted file names
     */
    private List<FileMetadataResponseDto> decryptFileMetadata(List<FileMetadataResponseDto> metadataList) {
        return metadataList.stream()
                .map(metadata -> {
                    try {
                        // Decrypt the file name
                        byte[] decryptedFilenameBytes = encryptionUtil.decrypt(Base64.getDecoder().decode(metadata.getName()));
                        String decryptedFilename = new String(decryptedFilenameBytes);

                        // Return a new DTO with the decrypted file name
                        return new FileMetadataResponseDto(
                                metadata.getId(),
                                decryptedFilename, // Decrypted file name
                                metadata.getType(),
                                metadata.getPath(),
                                metadata.getSize(),
                                metadata.getFolderId(),
                                metadata.getCompanyId(), // Updated to use companyId instead of userId
                                metadata.getTags(),
                                metadata.getSummary(),
                                metadata.getKeywords(),
                                metadata.getAccessedAt(),
                                metadata.getLastModifiedAt(),
                                metadata.isAiProcessed()
                        );
                    } catch (Exception e) {
                        log.error("Error decrypting file name for document ID: " + metadata.getId(), e);
                        throw new RuntimeException("Failed to decrypt file name", e);
                    }
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public FileDataResponseDto getDocumentFileData(User caller, Long documentId) {
        try {
            if (caller == null) {
                throw new ResourceNotFoundException("User not found");
            }

            // Fetch the document
            Optional<Document> documentOptional = documentRepository.findById(documentId);
            if (documentOptional.isEmpty()) {
                throw new ResourceNotFoundException("Document not found with ID: " + documentId);
            }

            Document document = documentOptional.get();

            // Ensure the document belongs to the caller's company
            if (!document.getCompanyId().equals(caller.getCompanyId())) {
                throw new ResourceNotFoundException("Access denied to document with ID: " + documentId);
            }

            // Decrypt the file data
            byte[] decryptedFileData = encryptionUtil.decrypt(document.getFileData());

            // Get the document type
            String contentType = document.getType();

            // Handle different content types
            if (contentType != null && (contentType.equals("text/markdown") || contentType.equals("text/plain"))) {
                // For text-based formats, convert bytes to string
                String textContent = new String(decryptedFileData, StandardCharsets.UTF_8);
                return new FileDataResponseDto(documentId, textContent, contentType);
            } else {
                // For binary formats, return the raw bytes
                return new FileDataResponseDto(documentId, decryptedFileData, contentType);
            }

        } catch (Exception e) {
            log.error("Error decrypting file data for document ID: " + documentId, e);
            throw new RuntimeException("Failed to decrypt file data", e);
        }
    }




    public void logDocumentAction(Document document, User user, String action, String originalFilename) {
        DocumentActivityLog log = DocumentActivityLog.builder()
                .documentId(document.getId())
                .documentName(originalFilename)
                .companyId(document.getCompanyId())
                .userId(user.getId())
                .userName(user.getFullName())
                .action(action)
                .timestamp(ZonedDateTime.now())
                .build();

        logRepository.save(log);
    }

    /**
     * Updates the content of a file
     * Currently supports markdown files, but designed to be extensible for other formats
     *
     * @param caller The user updating the file
     * @param fileId The ID of the file to update
     * @param updateRequest The request containing the new content and content type
     * @return UpdateFileContentResponseDto with the updated file metadata
     */
    @Transactional
    public UpdateFileContentResponseDto updateFileContent(User caller, Long fileId, UpdateFileContentRequestDto updateRequest) {
        try {
            // Validate caller
            if (caller == null) {
                return new UpdateFileContentResponseDto(null, null, null, null, null,
                        ServerConstants.USER_NOT_FOUND);
            }

            // Validate request
            if (updateRequest == null || updateRequest.getContent() == null) {
                return new UpdateFileContentResponseDto(null, null, null, null, null,
                        ServerConstants.INVALID_DATA);
            }

            // Fetch the document
            Optional<Document> documentOptional = documentRepository.findById(fileId);
            if (documentOptional.isEmpty()) {
                return new UpdateFileContentResponseDto(null, null, null, null, null,
                        ServerConstants.FILE_NOT_FOUND);
            }

            Document document = documentOptional.get();

            // Ensure the document belongs to the caller's company
            if (!document.getCompanyId().equals(caller.getCompanyId())) {
                return new UpdateFileContentResponseDto(null, null, null, null, null,
                        ServerConstants.UNAUTHORIZED_ACCESS);
            }

            // Get the original file name (for logging)
            byte[] decryptedFilenameBytes = encryptionUtil.decrypt(Base64.getDecoder().decode(document.getName()));
            String decryptedFilename = new String(decryptedFilenameBytes);

            // Handle different content types
            String contentType = updateRequest.getContentType();
            if (contentType == null) {
                // Default to the document's existing type
                contentType = document.getType();
            }

            byte[] newContent;

            // Process content based on content type
            switch (contentType) {
                case "text/markdown":
                case "text/plain":
                    // For text-based formats, use UTF-8 encoding
                    newContent = updateRequest.getContent().getBytes(StandardCharsets.UTF_8);
                    break;

                // Add cases for other formats as needed
                // case "application/pdf":
                //    // Handle PDF content
                //    break;

                default:
                    // For unsupported types, return an error
                    return new UpdateFileContentResponseDto(null, null, null, null, null,
                            "Unsupported content type: " + contentType);
            }

            // Encrypt the new content
            byte[] encryptedContent = encryptionUtil.encrypt(newContent);

            // Update the document
            document.setFileData(encryptedContent);
            document.setSize((long) newContent.length);
            document.setLastModifiedAt(ZonedDateTime.now());

            // Save the updated document
            documentRepository.save(document);

            // Log the action
            logDocumentAction(document, caller, "UPDATED", decryptedFilename);

            // Return success response
            return new UpdateFileContentResponseDto(
                    document.getId(),
                    decryptedFilename,
                    document.getType(),
                    document.getSize(),
                    document.getLastModifiedAt(),
                    ServerConstants.FILE_UPDATED
            );

        } catch (Exception e) {
            log.error("Error updating file content for file ID: " + fileId, e);
            return new UpdateFileContentResponseDto(null, null, null, null, null,
                    ServerConstants.FILE_ERROR);
        }
    }

    /**
     * Renames a file
     *
     * @param caller The user renaming the file
     * @param fileId The ID of the file to rename
     * @param newFileName The new name for the file
     * @return RenameFileResponseDto with the updated file metadata
     */
    @Transactional
    public RenameFileResponseDto renameFile(User caller, Long fileId, String newFileName) {
        try {
            // Validate caller
            if (caller == null) {
                return new RenameFileResponseDto(null, null, null, null, null, null, null, null,
                        ServerConstants.USER_NOT_FOUND);
            }

            // Validate new file name
            if (newFileName == null || newFileName.trim().isEmpty()) {
                return new RenameFileResponseDto(null, null, null, null, null, null, null, null,
                        ServerConstants.INVALID_DATA);
            }

            // Sanitize the new file name
            String sanitizedNewFileName = ServerUtils.sanitizeFileName(newFileName);

            // Fetch the document
            Optional<Document> documentOptional = documentRepository.findById(fileId);
            if (documentOptional.isEmpty()) {
                return new RenameFileResponseDto(null, null, null, null, null, null, null, null,
                        ServerConstants.FILE_NOT_FOUND);
            }

            Document document = documentOptional.get();

            // Ensure the document belongs to the caller's company
            if (!document.getCompanyId().equals(caller.getCompanyId())) {
                return new RenameFileResponseDto(null, null, null, null, null, null, null, null,
                        ServerConstants.UNAUTHORIZED_ACCESS);
            }

            // Get the original file name (for logging)
            byte[] decryptedFilenameBytes = encryptionUtil.decrypt(Base64.getDecoder().decode(document.getName()));
            String decryptedFilename = new String(decryptedFilenameBytes);

            // Encrypt the new file name
            byte[] encryptedNewFileNameBytes = encryptionUtil.encrypt(sanitizedNewFileName.getBytes());
            String encryptedNewFileName = Base64.getEncoder().encodeToString(encryptedNewFileNameBytes);

            // Update the document
            document.setName(encryptedNewFileName);
            document.setLastModifiedAt(ZonedDateTime.now());

            // Save the updated document
            documentRepository.save(document);

            // Log the action
            logDocumentAction(document, caller, "RENAMED", sanitizedNewFileName + " (from " + decryptedFilename + ")");

            // Return success response
            return new RenameFileResponseDto(
                    document.getId(),
                    sanitizedNewFileName,
                    document.getType(),
                    document.getPath(),
                    document.getSize(),
                    document.getFolderId(),
                    document.getCompanyId(),
                    document.getLastModifiedAt(),
                    ServerConstants.FILE_RENAMED
            );

        } catch (Exception e) {
            log.error("Error renaming file with ID: " + fileId, e);
            return new RenameFileResponseDto(null, null, null, null, null, null, null, null,
                    ServerConstants.FILE_ERROR);
        }
    }

    /**
     * Creates a new empty markdown file in the specified folder
     *
     * @param caller The user creating the file
     * @param folderId The folder ID where the file should be created
     * @param fileName The name of the file (optional, defaults to "New Markdown.md")
     * @return CreateFileResponseDto containing the file metadata
     */
    @Transactional
    public CreateFileResponseDto createMarkdownFile(User caller, Long folderId, String fileName) {
        try {
            // Validate caller
            if (caller == null) {
                return new CreateFileResponseDto(null, null, null, null, null, null, null,
                        ServerConstants.USER_NOT_FOUND);
            }

            // Set default file name if not provided
            String actualFileName = (fileName == null || fileName.isEmpty()) ? "New Markdown.md" : fileName;

            // Ensure the file has .md extension
            if (!actualFileName.toLowerCase().endsWith(".md")) {
                actualFileName = actualFileName + ".md";
            }

            // Sanitize file name
            String sanitizedFilename = ServerUtils.sanitizeFileName(actualFileName);

            // Default empty markdown content
            String defaultContent = "# " + sanitizedFilename.replace(".md", "") + "\n\nEnter your markdown content here...";

            // Encrypt file data and file name using UTF-8 encoding
            byte[] encryptedFileData = encryptionUtil.encrypt(defaultContent.getBytes(StandardCharsets.UTF_8));
            String encryptedFilename = Base64.getEncoder().encodeToString(encryptionUtil.encrypt(sanitizedFilename.getBytes(StandardCharsets.UTF_8)));

            // Validate folder ownership if folderId is provided
            String path = "/";
            if (folderId != null) {
                Folder folder = folderRepository.findById(folderId)
                        .orElseThrow(() -> new ResourceNotFoundException("Folder not found with ID: " + folderId));

                if (!folder.getCompanyId().equals(caller.getCompanyId())) {
                    return new CreateFileResponseDto(null, null, null, null, null, null, null,
                            ServerConstants.UNAUTHORIZED_ACCESS);
                }

                path = FolderUtils.buildFolderPath(folderId, folderRepository);
            }

            // Create and save the document
            Document document = Document.builder()
                    .name(encryptedFilename)
                    .type("text/markdown")
                    .path(path)
                    .size((long) defaultContent.getBytes().length)
                    .folderId(folderId)
                    .companyId(caller.getCompanyId())
                    .fileData(encryptedFileData)
                    .tags("created")
                    .summary(null)
                    .keywords(null)
                    .vectorRepresentation(null)
                    .accessedAt(null)
                    .aiProcessed(false)
                    .build();

            documentRepository.save(document);

            // Log the action
            logDocumentAction(document, caller, "CREATED", sanitizedFilename);

            // Return success response with file metadata
            return new CreateFileResponseDto(
                    document.getId(),
                    sanitizedFilename,
                    document.getType(),
                    document.getPath(),
                    document.getSize(),
                    document.getFolderId(),
                    document.getCompanyId(),
                    ServerConstants.FILE_CREATED
            );

        } catch (Exception e) {
            log.error("Error creating markdown file", e);
            return new CreateFileResponseDto(null, null, null, null, null, null, null,
                    ServerConstants.FILE_ERROR);
        }
    }
}