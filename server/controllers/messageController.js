const nodemailer = require("nodemailer");

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendMessage(req, res) {
  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "name, email, and message are required"
    });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address"
    });
  }

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return res.status(500).json({
      success: false,
      message: "SMTP credentials are not configured on the server"
    });
  }

  try {
    await transporter.sendMail({
      from: `Kakla Sane & Crew <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "New Contact Message – Kakla Sane & Crew",
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    });
    console.log(`[mail] Admin notification sent for ${email}`);

    await transporter.sendMail({
      from: `Kakla Sane & Crew <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "We’ve received your message – Kakla Sane & Crew",
      text: `Hello ${name},\n\nThank you for reaching out to Kakla Sane & Crew.\n\nWe’ve received your message and our team will get back to you shortly.\n\nWe look forward to having you on our Boti Falls trip 🌿✨\n\n– Kakla Sane & Crew`
    });
    console.log(`[mail] Auto-reply sent to ${email}`);

    return res.status(200).json({
      success: true,
      message: "Message sent successfully"
    });
  } catch (error) {
    console.error("[mail] Failed to send message:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send email. Please try again later."
    });
  }
}

module.exports = {
  sendMessage
};
