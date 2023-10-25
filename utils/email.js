const nodemailer = require('nodemailer');
const sendEmail = async (options) =>{

    // Create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port:process.env.EMAIL_PORT,
        auth:{
            user:process.env.EMAIL_USERNAME,
            pass:process.env.EMAIL_PASSWORD
        }
        // Activate In Gmail "less secure app" Options
    })
    // Define the email option
    const mailOptions = {
        from : 'Waleed Bukhari <waleed@gmail.com>',

        to: options.email, // options is the parameter of the sendEmail Function
        subject:options.subject,
        text:options.message

    }
    // Actually send the email 

        await transporter.sendMail(mailOptions)

}

module.exports = sendEmail;