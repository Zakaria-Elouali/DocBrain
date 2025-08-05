package ai.docbrain.service.calendar;


import ai.docbrain.domain.calendar.Contact;
import ai.docbrain.service.calendar.DTO.ContactDTO;

import java.util.List;
import java.util.Optional;

public class ContactService    {

   IContactRepository contactRepository;


    public List<ContactDTO> findAllContacts() {
        return contactRepository.findAllContacts();
    }

    public Optional<Contact> findContactById(Long id) {
        return contactRepository.findContactById(id);
    }

    public Contact save(Contact contact) {
        return contactRepository.save(contact);
    }
}