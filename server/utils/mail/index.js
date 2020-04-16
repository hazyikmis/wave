const mailer = require("nodemailer");

const { welcome } = require("./welcome_template");

require("dotenv").config();

const getEmailData = (to, name, token, template) => {
  let data = null;

  switch (template) {
    case "welcome":
      data = {
        from: "Waves Guitars Inc <" + process.env.GMUSR + ">",
        to,
        subject: `Welcome to Waves ${name}`,
        //text: "Testing our app for sending emails...",
        html: welcome(),
      };
      break;
    default:
      data = "";
  }

  return data;
};

const sendEmail = (to, name, token, type) => {
  const smtpTransport = mailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.GMUSR,
      pass: process.env.GMPWD,
    },
  });

  const mail = getEmailData(to, name, token, type);

  smtpTransport.sendMail(mail, function (error, response) {
    if (error) {
      console.log(error);
    } else {
      console.log("email sent");
    }
    smtpTransport.close();
  });
};

module.exports = { sendEmail };
