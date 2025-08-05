package ai.docbrain.persistence.role;


import ai.docbrain.domain.role.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

public interface PermissionSpringRepository extends JpaRepository<Permission, Long> {
    Optional<Permission> findByName(String name);

    @Query("SELECT p FROM Permission p WHERE p.id = :id")
    Optional<Permission> findById(Long id);

    @Query("SELECT p FROM Permission p")
    List<Permission> findAllPermissions();
}
