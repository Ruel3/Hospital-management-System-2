
package com.hms.controller;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/patients")
public class PatientController {
    @GetMapping public String all(){ return "patients"; }
}
