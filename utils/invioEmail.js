const nodemailer = require('nodemailer');
const cron = require('node-cron');
const { isNonLavorativo }=require('./giorniNonLavorativi')
const { createFile }=require('./createXslxPdf');
const { createFileAC }=require('./createXslxPdfAC');
const { createFileCNVVF }=require('./createXslxPdfCNVVF');


const { startSession } = require('mongoose');


const Password = 'xxxxxxx'
// Configurazione di Nodemailer
const transporter = nodemailer.createTransport({
  host: 'smtp-s.vigilfuoco.it',
  port: 465,
  secure: true, // Usa `true` solo per la porta 465
  auth: {
    user: 'riu.concorsipubblici@vigilfuoco.it', // Sostituisci con il tuo indirizzo email
    pass: Password // Sostituisci con la password o l'app password di Gmail
  }
});

// Funzione per inviare l'email
function inviaEmail(to_email,amministrazione) {
    let nameOffice= "DCRU UFFICIO V CONCORSI"
    const selectedDate = new Date();
    const oggi = [
        selectedDate.getDate().toString().padStart(2, '0'), // Giorno
        (selectedDate.getMonth() + 1).toString().padStart(2, '0'), // Mese
        selectedDate.getFullYear() // Anno
    ].join('-');
  const mailOptions = {
    from: 'riu.concorsipubblici@vigilfuoco.it',
    to: to_email,             //"fabio.sampaolo@vigilfuoco.it",
    bcc:['enrico.notaro@vigilfuoco.it','demetrio1.nicolo@vigilfuoco.it','stefano.censoni@vigilfuoco.it', 'fabio.sampaolo@vigilfuoco.it'],
    subject: `prospetto assenze del giorno ${oggi} - ${nameOffice} - ${amministrazione} `,
    text: 'Buongiorno, si allega quanto in oggetto',
    attachments: [
      {
        filename: `ASSENZE_DEL_${oggi}_${nameOffice}_${amministrazione}.xlsx`,
        path: `./assenze/ASSENZE_DEL_${oggi}_${nameOffice}_${amministrazione}.xlsx`
      },
      {
        filename: `ASSENZE_DEL_${oggi}_${nameOffice}_${amministrazione}.pdf`,
        path: `./assenze/ASSENZE_DEL_${oggi}_${nameOffice}_${amministrazione}.pdf`
      }
    ]
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log('Errore durante l\'invio dell\'email:', error);
    }
    console.log('Email inviata:', info.response);
  });
}

// Imposta il job cron per l'esecuzione giornaliera alle 9:30
function invioProgrammato(){

  cron.schedule('30 09 * * *', () => {
    //createFile()
    createFileAC();
    createFileCNVVF();
    const oggi = new Date();
    if(isNonLavorativo(oggi)===0 ){
        console.log('Invio dell\'email programmato alle 9:30','giorno:',oggi);
        inviaEmail("transiti.gabinetto@vigilfuoco.it","AC");
        inviaEmail("transiti.risorseumane@vigilfuoco.it","CNVVF");
        //inviaEmail("transiti.gabinetto@vigilfuoco.it","")
    }
    else{
        console.log("non lavorativo")
    }
 
  });
}
module.exports ={
    invioProgrammato
}