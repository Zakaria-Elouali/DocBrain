package ai.docbrain.persistence.company;

import ai.docbrain.domain.company.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CompanySpringRepository extends JpaRepository<Company, Long> {
    Optional<Company> findByCompanyName(String companyName);
}
