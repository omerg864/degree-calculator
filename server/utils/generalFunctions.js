import { createTransport } from 'nodemailer';

export const sendEmail = async (reciever, subject, text) => {
    var transporter = createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
        }
    });
    
    var mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: reciever,
        subject: subject,
        text: text
    };
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
        console.log(error);
        return false;
        } else {
        console.log('Email sent: ' + info.response);
        return true;
        }
    });
}