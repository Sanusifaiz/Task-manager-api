const sgMail = require('@sendgrid/mail')
const { getMaxListeners } = require('../models/user')




sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email, 
        from:'bolakalefaiz@gmail.com',
        subject: 'THANKS FOR SIGNING UP!!!!  ' + name,
        text: 'you are welcome ' + name + ', Let me know if you have any concerns...😊😊😊'
         
    })
}


const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from:'bolakalefaiz@gmail.com',
        subject: 'WE HATE TO SEE YOU LEAVE😑😑😑😑',
        text: 'Dear ' + name + ', We understand you have a reason to leave us but we would like to know if there is anyway we could make things better for you in future. Please send us a reply as we eagerly wait to know your concerns.  THANK YOU!!'
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}