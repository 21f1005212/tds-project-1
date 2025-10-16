const express = require('express');
const app = express();
const PORT = 3300;

// In-memory array to act as a mock database
let students = [
    { id: 1, name: 'Alice Smith', major: 'Computer Science' },
    { id: 2, name: 'Bob Johnson', major: 'Physics' }
];
let nextStudentId = 3;

// Middleware to parse JSON request bodies
// This is crucial for POST requests to read the data sent by the client.
app.use(express.json());

// -----------------------------------------------------------------
// STUDENT API POST Endpoint: Create New Student
// Endpoint: POST /api/students
// -----------------------------------------------------------------
app.post('/api/students', (req, res) => {
    // 1. Extract data from the request body (req.body)
    const { name, major } = req.body;

    // 2. Simple validation (check if required fields exist)
    if (!name || !major) {
        // Send a 400 Bad Request status and an error message
        return res.status(400).json({ error: 'Name and major are required fields.' });
    }

    // 3. Create a new student object
    const newStudent = {
        id: nextStudentId++, // Assign a unique ID and increment the counter
        name: name,
        major: major
    };

    // 4. Save the new student (add to the mock database)
    students.push(newStudent);

    // 5. Send a response back to the client
    // 201 Created is the standard response for a successful POST operation.
    res.status(201).json({
        message: 'Student record created successfully',
        student: newStudent
    });
});

// A simple GET route to check if the server is running and see the list
app.get('/api/students', (req, res) => {
    res.status(200).json(students);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
