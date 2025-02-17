const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    eid: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    designation: { type: String, required: true },
    department: { type: String, required: true },
    salary: { type: Number, required: true }
});

module.exports = mongoose.model('Employee', EmployeeSchema);
