// //  we use node mailer for sending email

// const nodemailer = require("nodemailer");

// // we are set up SMTP connection
// // and for that we are using sendinblue

// async function sendMail({ from, to, subject, text, html }) {
//   let transporter = nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: process.env.SMTP_POST,
//     secure: false,
//     auth: {
//       user: process.env.MAIL_USER,
//       pass: process.env.MAIL_PASS,
//     },
//   });

//   let info = await transporter.sendMail({
//     from: `ShareMe <${from}>`,
//     to: to,
//     subject: subject,
//     text: text,
//     html: html,
//   });
//   console.log(info);

//   // if key and value both are same then you acan write it only once
//   // Like This

//   //   let info = await transporter.sendMail({
//   //     from: `ShareMe <${from}>`,
//   //     to,
//   //     subject,
//   //     text,
//   //     html,
//   //   });
//   //   console.log(info);
// }

// module.exports = sendMail;

const nodemailer = require("nodemailer");
module.exports = async ({ from, to, subject, text, html }) => {
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_USER, // generated ethereal user
      pass: process.env.MAIL_PASS, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `ShareMe <${from}>`, // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    text: text, // plain text body
    html: html, // html body
  });
};
