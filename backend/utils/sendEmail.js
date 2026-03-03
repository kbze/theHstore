const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create a transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // Define the email options
    const mailOptions = {
        from: `The 8 Store <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.htmlMessage || options.message // Fallback to plain text if HTML isn't provided
    };

    // Send the email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
