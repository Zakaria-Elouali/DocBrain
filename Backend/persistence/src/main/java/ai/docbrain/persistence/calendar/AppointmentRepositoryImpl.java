package ai.docbrain.persistence.calendar;

import ai.docbrain.domain.calendar.Appointment;
import ai.docbrain.service.calendar.DTO.AppointmentDTO;
import ai.docbrain.service.calendar.IAppointmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class AppointmentRepositoryImpl implements IAppointmentRepository {

    private final AppointmentSpringRepository appointmentSpringRepository;

    @Override
    public List<AppointmentDTO> findAllAppointmentsByCompanyId(Long companyId) {
        return appointmentSpringRepository.findAllAppointmentsByCompanyId(companyId);
    }

    @Override
    public Optional<AppointmentDTO> findAppointmentDtoByIdAndCompanyId(Long id, Long companyId) {
        return appointmentSpringRepository.findAppointmentDtoByIdAndCompanyId(id, companyId);
    }

    @Override
    public Optional<Appointment> findAppointmentByIdAndCompanyId(Long id, Long companyId) {
        return appointmentSpringRepository.findAppointmentByIdAndCompanyId(id, companyId);
    }

    @Override
    public Appointment save(Appointment appointment) {
        return appointmentSpringRepository.save(appointment);
    }

    @Override
    public void deleteById(Long id) {
        appointmentSpringRepository.deleteById(id);
    }
}
