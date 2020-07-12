const sgMail = require('@sendgrid/mail');


sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name)=>{

    sgMail.send({
        to:email,
        from:'rohit0311@outlook.com',
        subject:'This is my first creation',
        text:`Hello ${name} welcome to task manager application`
    })
}

const sendDeleteEamil = (email, name)=>{
    sgMail.send({
        to: email,
        from: 'rohit0311@outlook.com',
        subject: 'Sorry to see you go',
        text: `Hello ${name} is there any thing we can improve about. thank you for your feedback`
    })
}

module.exports ={
    sendWelcomeEmail,
    sendDeleteEamil
}
