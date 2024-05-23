const nodemailer = require('nodemailer');
const pug = require('pug');
const { htmlToText } = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Muhammad Ahmad <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    // FOR PRODUCTION
    if (process.env.NODE_ENV === 'production') {
      return 1;
    }

    // FOR DEVELOPMENT
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Send the actual email
  async send(template, subject) {
    // 1) Render HTML based on a pug template.
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
    });
    // here __dirname points to the current directory, which is utils.

    // 2) Define the Email Options.
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: subject,
      html: html,
      text: htmlToText(html),
    };

    // 3) Create a Transport and send the email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    // It'll call the send method with it's own template and the subject. which makes it very easy to send different emails for different situations.
    await this.send('welcome', 'Welcome to the findReunite Family!');
  }

  async matchNotification() {
    await this.send('matchPerson', 'Potential Match Found for Missing Person');
  }
};
