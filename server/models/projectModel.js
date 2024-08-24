const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    projectName: {
        type: String,
        required: true,
    },
    projectDesc: {
        type: String,
    },
    projectUrl: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },
    submissionDate: {
        type: Date,
        required: true,
    },
    selectedDevelopers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    requirements: [{
        type: String,
    }],
    developerShares: {
        type: Map,
        of: String,
    },
    endPoints: [{
        key: String,
        value: String,
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true,
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
