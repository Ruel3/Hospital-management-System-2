package com.hms.app.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.LocalDate;

@Entity
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Internal database ID
    
    private String patientID; // The P1001 ID
    private String name;
    private LocalDate dateOfBirth;
    private LocalDate admissionDate;

    // Getters and Setters (omitted for brevity)
    
    // Default constructor
    public Patient() {}

    // Constructor for new patient (internal ID set by DB)
    public Patient(String name, LocalDate dateOfBirth, LocalDate admissionDate) {
        this.name = name;
        this.dateOfBirth = dateOfBirth;
        this.admissionDate = admissionDate;
    }
    
    // Add logic to generate the P-ID (Patient ID) here or in the Service layer
    public void generatePatientID(long count) {
        this.patientID = "P" + (1000 + count);
    }
}
