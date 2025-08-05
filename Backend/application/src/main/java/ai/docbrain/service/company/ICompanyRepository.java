package ai.docbrain.service.company;

import ai.docbrain.domain.company.Company;

import java.util.Optional;

public interface ICompanyRepository {
    Optional<Company> findByCompanyName(String companyName);

    Company save(Company company);

    Optional<Company> findById(Long id);
}
