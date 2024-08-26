const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
        unique: [true, 'UserName already taken.'],
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'developer'],
        default: 'developer',
    },
    projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
    }],
}, {
    timestamps: true,
});


userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
