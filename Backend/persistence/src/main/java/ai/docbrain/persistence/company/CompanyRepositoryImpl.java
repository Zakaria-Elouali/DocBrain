package ai.docbrain.persistence.company;

import ai.docbrain.domain.company.Company;
import ai.docbrain.service.company.ICompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class CompanyRepositoryImpl implements ICompanyRepository {
    private final CompanySpringRepository companySpringRepository;

    @Override
    public Optional<Company> findByCompanyName(String companyName) {
        return companySpringRepository.findByCompanyName(companyName);
    }

    @Override
    public Company save(Company company) {
        return companySpringRepository.save(company);
    }

    @Override
    public Optional<Company> findById(Long id) {
        return companySpringRepository.findById(id);
    }
}
