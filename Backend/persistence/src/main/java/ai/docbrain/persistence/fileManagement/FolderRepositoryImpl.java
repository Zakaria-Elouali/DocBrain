package ai.docbrain.persistence.fileManagement;

import ai.docbrain.domain.fileManagement.Folder;
import ai.docbrain.service.fileManagement.IFolderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class FolderRepositoryImpl implements IFolderRepository {

    private final FolderSpringRepository folderSpringRepository;

    @Override
    public List<Folder> findAllByCompanyId(long companyId) {
        return folderSpringRepository.findAllByCompanyId(companyId);
    }

    @Override
    public List<Folder> findChildFoldersByParentId(Long parentId) {
        return folderSpringRepository.findChildFoldersByParentId(parentId);
    }

    @Override
    public Folder save(Folder folder) {
        return folderSpringRepository.save(folder);
    }

    @Override
    public Optional<Folder> findById(Long folderId) {
        return folderSpringRepository.findById(folderId);
    }

    @Override
    public void delete(Folder folder) {
        folderSpringRepository.delete(folder);
    }

    //---------------------------FOR DASHBOARD---------------------------//

    /**
     * Count folders by company ID
     */
    @Override
    public int countByCompanyId(Long companyId) {
        return folderSpringRepository.countByCompanyId(companyId);
    }
}
