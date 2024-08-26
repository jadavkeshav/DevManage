const crypto = require('crypto');
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const cors = require("cors");
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');


const app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


dotenv.config();
app.use(express.json());
app.use(cors());

connectDB();



app.use('/api/users', require('./routes/userRoutes.js'));
app.use('/api/projects', require('./routes/projectRoutes.js'));

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

const sendOtpEmail = async (email, otp) => {
    const templatePath = path.join(__dirname, 'views', 'otp_email.ejs');
    const html = await ejs.renderFile(templatePath, { otp });

    const mailOptions = {
        from: 'DevManage999@gmail.com',
        to: email,
        subject: 'Your OTP Code',
        html,
    };

    return transporter.sendMail(mailOptions);
};



const otpStore = {};

const generateOtp = () => {
    return crypto.randomInt(100000, 999999).toString();
};

const saveOtp = (email, otp) => {
    otpStore[email] = {
        otp,
        expiresAt: Date.now() + 10 * 60 * 1000,
    };
};

const verifyOtp = (email, otp) => {
    const otpData = otpStore[email];
    if (!otpData) return false;
    if (Date.now() > otpData.expiresAt) {
        delete otpStore[email];
        return false;
    }
    if (otpData.otp === otp) {
        delete otpStore[email];
        return true;
    }
    return false;
};

app.post('/api/auth/send-otp', (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    const otp = generateOtp();
    saveOtp(email, otp);

    sendOtpEmail(email, otp)
        .then(() => {
            res.status(200).json({ message: 'OTP sent successfully' });
        })
        .catch((error) => {
            console.error('Error sending OTP:', error);
            res.status(500).json({ message: 'Failed to send OTP' });
        });
});

app.post('/api/auth/verify-otp', (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required' });
    }

    if (verifyOtp(email, otp)) {
        res.status(200).json({ message: 'OTP verified successfully' });
    } else {
        res.status(400).json({ message: 'Invalid or expired OTP' });
    }
});




const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

  