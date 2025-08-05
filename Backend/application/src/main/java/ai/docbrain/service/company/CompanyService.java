package ai.docbrain.service.company;

import ai.docbrain.domain.BaseEntity;
import ai.docbrain.domain.company.Company;
import ai.docbrain.service.authentication.exceptions.CompanyExistsException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;

@Service
@RequiredArgsConstructor
public class CompanyService {
    private final ICompanyRepository companyRepository;

    @Transactional
    public Company createCompany(String companyName, String createdBy) {
        validateCompanyName(companyName);

        Company company = Company.builder()
                .companyName(companyName)
                .build();

        company.setCreatedBy(createdBy);
//        company.setCreatedAt(ZonedDateTime.now());
        company.setStatusCode(BaseEntity.StatusCodes.ACTIVE);

        return companyRepository.save(company);
    }

    private void validateCompanyName(String companyName) {
        if (companyRepository.findByCompanyName(companyName).isPresent()) {
            throw new CompanyExistsException("Company with this name already exists");
        }
    }
}