const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS  // App password
    }
});

async function sendVerificationEmail(email, token) {
    const verificationLink = `http://localhost:5000/auth/verify-email/${token}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'PawSphere - Verify Your Email',
        html: `<h2>Welcome to PawSphere!</h2>
               <p>Click the link below to verify your email:</p>
               <a href="${verificationLink}" target="_blank">${verificationLink}</a>
               <p>This link will expire in 1 hour.</p>`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Verification email sent to ${email}`);
    } catch (error) {
        console.error('❌ Error sending email:', error);
    }
}

module.exports = sendVerificationEmail;
