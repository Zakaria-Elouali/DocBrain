package ai.docbrain.service.calendar;

import ai.docbrain.domain.calendar.Contact;
import ai.docbrain.service.calendar.DTO.AppointmentDTO;
import ai.docbrain.service.calendar.DTO.ContactDTO;

import java.util.List;
import java.util.Optional;

public interface IContactRepository {

    List<ContactDTO> findAllContacts();

    Optional<Contact> findContactById(Long id);

    Contact save(Contact contact);

}
