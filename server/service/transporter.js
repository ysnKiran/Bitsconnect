const nodemailer = require("nodemailer");

async function sendEmail(email, subject, body) {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "bitsconnect.hub@gmail.com",
        pass: "cfrq trqn kabv cmij",
      },
    });

    const mailOptions = {
      from: "bitsconnect.hub@gmail.com",
      to: email,
      subject: subject,
      text: body,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.response);
  } catch (error) {
    console.error("Error sending email: ", error);
  }
}

module.exports = sendEmail;
