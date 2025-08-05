package ai.docbrain.persistence.calendar;

import ai.docbrain.domain.calendar.Appointment;
import ai.docbrain.service.calendar.DTO.AppointmentDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentSpringRepository extends JpaRepository<Appointment, Long> {

    @Query("SELECT new ai.docbrain.service.calendar.DTO.AppointmentDTO(" +
            "a.id, a.caseNumber, a.type, a.date, a.time, a.duration, a.description, " +
            "a.contact.id, a.contact.clientName, a.contact.phone, a.contact.email, a.status, a.companyId) " +
            "FROM Appointment a WHERE a.companyId = :companyId")
    List<AppointmentDTO> findAllAppointmentsByCompanyId(@Param("companyId") Long companyId);

    @Query("SELECT new ai.docbrain.service.calendar.DTO.AppointmentDTO(" +
            "a.id, a.caseNumber, a.type, a.date, a.time, a.duration, a.description, " +
            "a.contact.id, a.contact.clientName, a.contact.phone, a.contact.email, a.status, a.companyId) " +
            "FROM Appointment a WHERE a.id = :id AND a.companyId = :companyId")
    Optional<AppointmentDTO> findAppointmentDtoByIdAndCompanyId(@Param("id") Long id, @Param("companyId") Long companyId);

    @Query("SELECT a FROM Appointment a WHERE a.id = :id AND a.companyId = :companyId")
    Optional<Appointment> findAppointmentByIdAndCompanyId(@Param("id") Long id, @Param("companyId") Long companyId);


}
