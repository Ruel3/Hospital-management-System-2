// --- Data Models ---
// Initialize unique IDs for each entity
let patientCounter = 1000;
let staffCounter = 2000;
let admissionCounter = 3000;
let prescriptionCounter = 4000;
let billingCounter = 5000;
let pharmacyCounter = 6000;

// Central data storage
const data = {
    patients: [],
    staff: [],
    admissions: [],
    prescriptions: [],
    bills: [],
    pharmacies: [
        { id: 'PH' + (++pharmacyCounter), name: 'Central Pharmacy', location: 'Hospital Main' },
        { id: 'PH' + (++pharmacyCounter), name: 'Outpatient Dispensary', location: 'Clinic Block' }
    ]
};

// --- Utility Functions ---

/**
 * Hides all content sections and shows the specified one.
 * @param {string} sectionId The ID of the section to show.
 */
function showSection(sectionId) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
    // Re-render relevant lists when switching sections (optional, but good for data refresh)
    renderAllLists();
}

/**
 * Formats a list of objects into an HTML unordered list.
 * @param {Array<Object>} list - The array of data objects.
 * @param {string[]} displayKeys - The keys from the objects to display in the list item.
 * @param {string} entityName - The name of the entity for logging.
 * @returns {string} The HTML string for the list.
 */
function renderList(list, displayKeys, entityName) {
    if (list.length === 0) {
        return `<li>No ${entityName} records found.</li>`;
    }
    return list.map(item => {
        const displayItems = displayKeys.map(key => {
            let value = item[key];
            if (key.includes('Date') && value) {
                // Format Date objects for display
                value = new Date(value).toLocaleDateString();
            }
            return `<strong>${key.replace(/([A-Z])/g, ' $1').trim()}:</strong> ${value}`;
        }).join(' | ');
        return `<li>${displayItems}</li>`;
    }).join('');
}

// --- Rendering Functions ---

function renderPatientList() {
    const patientList = document.getElementById('patient-list');
    patientList.innerHTML = renderList(data.patients, ['id', 'name', 'dob', 'admissionDate'], 'Patient');
}

function renderStaffList() {
    const staffList = document.getElementById('staff-list');
    staffList.innerHTML = renderList(data.staff, ['id', 'name', 'role', 'specialization'], 'Staff');
}

function renderAdmissionList() {
    const admissionList = document.getElementById('admission-list');
    admissionList.innerHTML = renderList(data.admissions, ['id', 'patientID', 'staffID', 'roomNum', 'dischargeDate'], 'Admission');
}

function renderPrescriptionList() {
    const prescriptionList = document.getElementById('prescription-list');
    prescriptionList.innerHTML = renderList(data.prescriptions, ['id', 'patientID', 'staffID', 'medication', 'dosage', 'pharmacyID'], 'Prescription');
}

function renderBillingList() {
    const billingList = document.getElementById('billing-list');
    billingList.innerHTML = renderList(data.bills, ['id', 'patientID', 'totalAmount', 'paymentStatus'], 'Bill');
}

function renderPharmacyInfo() {
    const pharmacyList = document.getElementById('pharmacy-list');
    const pharmacySelect = document.getElementById('r_pharmacyID');
    
    // Update Pharmacy List
    pharmacyList.innerHTML = renderList(data.pharmacies, ['id', 'name', 'location'], 'Pharmacy');

    // Update Prescription Select Dropdown
    pharmacySelect.innerHTML = '<option value="">Select Pharmacy</option>';
    data.pharmacies.forEach(pharmacy => {
        const option = document.createElement('option');
        option.value = pharmacy.id;
        option.textContent = `${pharmacy.name} (${pharmacy.id})`;
        pharmacySelect.appendChild(option);
    });
}

function renderAllLists() {
    renderPatientList();
    renderStaffList();
    renderAdmissionList();
    renderPrescriptionList();
    renderBillingList();
    renderPharmacyInfo(); // Also updates the select dropdown
}

// --- Form Handlers ---

document.getElementById('patient-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('p_name').value;
    const dob = document.getElementById('p_dob').value;
    const admissionDate = document.getElementById('p_admDate').value;
    
    const newPatient = {
        id: 'P' + (++patientCounter),
        name,
        dob,
        admissionDate
    };

    data.patients.push(newPatient);
    alert(`Patient ${name} registered successfully with ID: ${newPatient.id}`);
    this.reset();
    renderPatientList();
});

document.getElementById('staff-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('s_name').value;
    const role = document.getElementById('s_role').value;
    const specialization = document.getElementById('s_spec').value;
    
    const newStaff = {
        id: 'S' + (++staffCounter),
        name,
        role,
        specialization
    };

    data.staff.push(newStaff);
    alert(`${role} ${name} added successfully with ID: ${newStaff.id}`);
    this.reset();
    renderStaffList();
});

document.getElementById('admission-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const patientID = document.getElementById('a_patientID').value.toUpperCase();
    const staffID = document.getElementById('a_staffID').value.toUpperCase();
    const roomNum = document.getElementById('a_roomNum').value;
    const dischargeDate = document.getElementById('a_discDate').value || 'N/A'; // Optional

    const patientExists = data.patients.some(p => p.id === patientID);
    const staffExists = data.staff.some(s => s.id === staffID);

    if (!patientExists) {
        alert(`Error: Patient ID ${patientID} not found.`);
        return;
    }
    if (!staffExists) {
        alert(`Error: Staff ID ${staffID} not found.`);
        return;
    }
    
    const newAdmission = {
        id: 'A' + (++admissionCounter),
        patientID,
        staffID,
        roomNum,
        dischargeDate 
    };

    data.admissions.push(newAdmission);
    alert(`Admission recorded for Patient ${patientID} to Room ${roomNum}.`);
    this.reset();
    renderAdmissionList();
});

document.getElementById('prescription-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const patientID = document.getElementById('r_patientID').value.toUpperCase();
    const staffID = document.getElementById('r_staffID').value.toUpperCase();
    const medication = document.getElementById('r_medication').value;
    const dosage = document.getElementById('r_dosage').value;
    const pharmacyID = document.getElementById('r_pharmacyID').value;

    const newPrescription = {
        id: 'R' + (++prescriptionCounter),
        patientID,
        staffID,
        medication,
        dosage,
        pharmacyID,
        dateWritten: new Date().toISOString().split('T')[0] // Record date
    };

    data.prescriptions.push(newPrescription);
    alert(`Prescription for ${medication} written for Patient ${patientID}.`);
    this.reset();
    renderPrescriptionList();
});

document.getElementById('billing-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const patientID = document.getElementById('b_patientID').value.toUpperCase();
    const totalAmount = parseFloat(document.getElementById('b_totalAmount').value).toFixed(2);
    const paymentStatus = document.getElementById('b_paymentStatus').value;

    const patientExists = data.patients.some(p => p.id === patientID);
    if (!patientExists) {
        alert(`Error: Patient ID ${patientID} not found. Cannot create bill.`);
        return;
    }
    
    const newBill = {
        id: 'B' + (++billingCounter),
        patientID,
        totalAmount: `$${totalAmount}`,
        paymentStatus,
        dateCreated: new Date().toISOString().split('T')[0] // Record date
    };

    data.bills.push(newBill);
    alert(`Bill ${newBill.id} created for Patient ${patientID}. Status: ${paymentStatus}.`);
    this.reset();
    renderBillingList();
});


// --- Initial Setup ---

document.addEventListener('DOMContentLoaded', () => {
    // Expose showSection globally so the HTML buttons can call it
    window.showSection = showSection; 

    // Initial render of all lists and pharmacy dropdown
    renderAllLists();
    
    // Ensure the initial patient section is visible
    showSection('patient-section'); 
});
