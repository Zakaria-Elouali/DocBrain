package ai.docbrain.service.fileManagement;

import ai.docbrain.domain.fileManagement.Folder;

import java.util.List;
import java.util.Optional;

public interface IFolderRepository {
    List<Folder> findAllByCompanyId(long companyId);

    List<Folder> findChildFoldersByParentId(Long parentId);

    Folder save(Folder folder);

    Optional<Folder> findById(Long folderId);

    void delete(Folder folder);

    int countByCompanyId(Long companyId);
}
