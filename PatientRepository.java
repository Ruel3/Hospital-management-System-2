package com.hms.app.repository;

import com.hms.app.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    // Spring automatically provides methods like save(), findAll(), findById()
}
