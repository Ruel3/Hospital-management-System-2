package com.hms.app.service;

import com.hms.app.model.Patient;
import com.hms.app.repository.PatientRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PatientService {

    private final PatientRepository patientRepository;

    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    public Patient registerPatient(Patient patient) {
        // Get the current count + 1 to simulate nextPatientID (P1001, P1002, etc.)
        long count = patientRepository.count() + 1; 
        patient.generatePatientID(count);
        return patientRepository.save(patient);
    }

    public List<Patient> findAllPatients() {
        return patientRepository.findAll();
    }
    
    // ... add methods for Staff, Admission, etc.
}
