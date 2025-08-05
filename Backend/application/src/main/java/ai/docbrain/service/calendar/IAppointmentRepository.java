package ai.docbrain.service.calendar;

import ai.docbrain.domain.calendar.Appointment;
import ai.docbrain.service.calendar.DTO.AppointmentDTO;

import java.util.List;
import java.util.Optional;

public interface IAppointmentRepository {


    List<AppointmentDTO> findAllAppointmentsByCompanyId(Long companyId);

    Optional<AppointmentDTO> findAppointmentDtoByIdAndCompanyId(Long id, Long companyId);

    Optional<Appointment> findAppointmentByIdAndCompanyId(Long id, Long companyId);

    Appointment save(Appointment appointmentDTO);

    void deleteById(Long id);
}
