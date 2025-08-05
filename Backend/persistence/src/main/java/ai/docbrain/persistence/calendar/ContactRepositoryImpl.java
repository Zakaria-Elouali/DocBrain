package ai.docbrain.persistence.calendar;

import ai.docbrain.domain.calendar.Contact;
import ai.docbrain.service.calendar.DTO.ContactDTO;
import ai.docbrain.service.calendar.IContactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class ContactRepositoryImpl implements IContactRepository {

    private final ContactSpringRepository contactSpringRepository;

    @Override
    public List<ContactDTO> findAllContacts() {
        return contactSpringRepository.findAllContacts();
    }

    @Override
    public Optional<Contact> findContactById(Long id) {
        return contactSpringRepository.findById(id);
    }

    @Override
    public Contact save(Contact contact) {
        return contactSpringRepository.save(contact);
    }


}
