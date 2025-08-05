package ai.docbrain.persistence.fileManagement;


import ai.docbrain.domain.fileManagement.Folder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FolderSpringRepository extends JpaRepository<Folder, Long> {

    List<Folder> findAllByCompanyId(long companyId);

    @Query("SELECT f FROM Folder f WHERE f.parentId = :parentId")
    List<Folder> findChildFoldersByParentId(@Param("parentId") Long parentId);

    /**
     * Count folders by company ID
     */
    int countByCompanyId(Long companyId);
}
