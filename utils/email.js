const nodemailer = require('nodemailer');
const mailgunTransport = require('nodemailer-mailgun-transport');
const pug = require('pug');
const { htmlToText } = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Your Name <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Use Mailgun for production
      return nodemailer.createTransport(
        mailgunTransport({
          auth: {
            api_key: process.env.MAILGUN_API_KEY,
            domain: process.env.MAILGUN_DOMAIN,
          },
        }),
      );
    }

    return nodemailer.createTransport({
      service: 'gmail',
      secure: true,
      port: 465,
      auth: {
        user: 'muhammadugv66@gmail.com',
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    /*
    // FOR DEVELOPMENT
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    */
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
    // It'll call the send method with its own template and the subject. which makes it very easy to send different emails for different situations.
    await this.send('welcome', 'Welcome to the FindReunite Family!');
  }

  async matchNotification() {
    await this.send('matchPerson', 'Potential Match Found for Missing Person');
  }
};
