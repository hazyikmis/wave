const mailer = require("nodemailer");

const { welcome } = require("./welcome_template");
const { purchase } = require("./purchase_template");
const { resetPass } = require("./resetpass_template");

require("dotenv").config();

const getEmailData = (to, name, token, template, actionData) => {
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
    case "purchase":
      data = {
        from: "Waves Guitars Inc <" + process.env.GMUSR + ">",
        to,
        subject: `Thanks for shopping with us ${name}`,
        html: purchase(actionData),
      };
      break;
    case "reset_pwd":
      data = {
        from: "Waves Guitars Inc <" + process.env.GMUSR + ">",
        to,
        subject: `Dear ${name}, reset your password`,
        html: resetPass(actionData),
      };
      break;
    default:
      data = "";
  }

  return data;
};

const sendEmail = (to, name, token, type, actionData = null) => {
  const smtpTransport = mailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.GMUSR,
      pass: process.env.GMPWD,
    },
  });

  const mail = getEmailData(to, name, token, type, actionData);

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
