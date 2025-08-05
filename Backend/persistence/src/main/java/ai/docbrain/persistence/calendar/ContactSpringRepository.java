package ai.docbrain.persistence.calendar;

import ai.docbrain.domain.calendar.Contact;
import ai.docbrain.service.calendar.DTO.ContactDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ContactSpringRepository extends JpaRepository<Contact, Long> {

    @Query("SELECT new ai.docbrain.service.calendar.DTO.ContactDTO( " +
            "c.id, c.clientName, c.phone, c.email) " +
            "FROM Contact c")
    List<ContactDTO> findAllContacts();

}
