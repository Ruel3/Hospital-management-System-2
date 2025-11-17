// --- Back-End API Base URL ---
const API_BASE_URL = 'http://localhost:8080/api/hms'; // Assumes Java Spring Boot is running on 8080

// --- Authentication Token (Simulated) ---
let authToken = localStorage.getItem('hmsAuthToken'); 

// --- Utility: Handle API Fetch Requests ---
async function apiFetch(endpoint, method = 'GET', data = null) {
    const headers = {
        'Content-Type': 'application/json',
    };
    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`; // Send token for protected routes
    }

    const config = {
        method: method,
        headers: headers,
        body: data ? JSON.stringify(data) : null,
    };

    try {
        const response = await fetch(API_BASE_URL + endpoint, config);
        
        if (response.status === 401) {
            alert('Session expired or unauthorized. Please log in again.');
            window.location.href = 'index.html';
            return null;
        }
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }
        
        // Handle no-content responses (204)
        if (response.status === 204) return {};
        
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        alert('An error occurred: ' + error.message);
        return null;
    }
}

// --- LOGIN LOGIC (for index.html) ---

function handleLoginSubmit() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const messageEl = document.getElementById('login-message');
            messageEl.textContent = '';

            try {
                // This call should hit your Java /auth/login endpoint
                const authData = await apiFetch('/auth/login', 'POST', { username, password });
                
                if (authData && authData.token) {
                    authToken = authData.token;
                    localStorage.setItem('hmsAuthToken', authToken);
                    window.location.href = 'dashboard.html'; // Redirect to dashboard
                } else {
                    messageEl.textContent = 'Invalid credentials or API error.';
                }
            } catch (error) {
                 messageEl.textContent = 'Login failed. Check server status.';
            }
        });
    }
}

// --- DASHBOARD LOGIC (for dashboard.html - needs all previous functions to be updated to use apiFetch) ---

// Example: Patient Form Submission updated to use the API
async function handlePatientSubmit(event) {
    event.preventDefault();
    const patientData = {
        name: document.getElementById('p_name').value,
        dateOfBirth: document.getElementById('p_dob').value,
        admissionDate: document.getElementById('p_admDate').value
    };

    const newPatient = await apiFetch('/patients', 'POST', patientData);
    
    if (newPatient) {
        alert(`Patient ${newPatient.name} registered with ID: ${newPatient.patientID}`);
        event.target.reset();
        loadAllData(); // Re-render lists
    }
}

// Example: Function to load all patients from the API
async function loadPatients() {
    const patients = await apiFetch('/patients');
    if (patients) {
        // Assume renderList is adapted to handle the structure returned by the API
        renderList(patients, 'patient-list'); 
    }
}

// Global list of rendering functions
const renderFunctions = {
    'patient-list': loadPatients,
    // ... add similar functions for staff, admissions, etc.
};

function loadAllData() {
    Object.values(renderFunctions).forEach(func => func());
    populateDropdowns();
    renderList(pharmacies, 'pharmacy-list');
}

// --- Initialization ---

document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on the login page
    if (document.getElementById('login-form')) {
        handleLoginSubmit();
    } 
    // Check if we are on the dashboard page
    else if (document.getElementById('patient-form')) {
        // Check authentication before loading dashboard
        if (!authToken) {
            window.location.href = 'index.html'; // Redirect if no token
            return;
        }

        // Initialize dashboard logic
        window.showSection = showSection;
        loadAllData();
        
        // Attach API handlers to forms
        document.getElementById('patient-form').addEventListener('submit', handlePatientSubmit);
        // ... attach other form handlers (staff, admission, etc.)
        
        showSection('patient-section');
    }
});
