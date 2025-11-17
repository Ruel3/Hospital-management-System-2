package com.hms.app.controller;

import com.hms.app.model.Patient;
import com.hms.app.service.PatientService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/hms/patients")
@CrossOrigin(origins = "http://localhost:8080") // IMPORTANT: Allow requests from your front-end
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @GetMapping
    public ResponseEntity<List<Patient>> getAllPatients() {
        return new ResponseEntity<>(patientService.findAllPatients(), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Patient> createPatient(@RequestBody Patient patient) {
        Patient newPatient = patientService.registerPatient(patient);
        return new ResponseEntity<>(newPatient, HttpStatus.CREATED);
    }

    // You would add similar controllers for /staff, /admissions, etc.
}
