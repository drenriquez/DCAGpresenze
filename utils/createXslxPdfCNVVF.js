const UserDao = require('../dao/userDao');
const userDao = new UserDao();
const {jsPDF}  = require('jspdf');
const XLSX  = require('xlsx');
const { listaGiustificativi } = require('./giustificativiAssenze');
const {imgData}=require('./imgData')

const amministrazione="CNVVF";


async function createFileCNVVF(){
    let nameOffice= `DCRU UFFICIO V CONCORSI`
   
    let usersTable= await userDao.getAllUsers()//
    //let usersTable2=usersTable.filter((dip)=>{dip.amministrazione==amministrazione})
        // const endDay=document.getElementById("endDay");
        let tabellaAssenti=[];
        const selectedDate = new Date();
        const selectedMonth = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
        const selectedYear = selectedDate.getFullYear();
        const selectedDay = (selectedDate.getDate()).toString().padStart(2, '0');
        const oggi = [
            selectedDate.getDate().toString().padStart(2, '0'), // Giorno
            (selectedDate.getMonth() + 1).toString().padStart(2, '0'), // Mese
            selectedDate.getFullYear() // Anno
        ].join('-');
        console.log(oggi);
       
        usersTable.forEach((dipendente, index) => {
           
            //console.log(selectedMonth)
            // if(dipendente.assenze[selectedYear][selectedMonth]){
            //     console.log(dipendente.assenze[selectedYear][selectedMonth])
            // }
           //if(dipendente.amministrazione===amministrazione){
                if(selectedYear in dipendente.assenze && dipendente.amministrazione===amministrazione){
                    
                    if(selectedMonth in dipendente.assenze[selectedYear]){
                        //console.log(dipendente.assenze[selectedYear][selectedMonth])
                        if(selectedDay in dipendente.assenze[selectedYear][selectedMonth]){
                            let newLine=[dipendente.anagrafica.cognome,dipendente.anagrafica.nome,listaGiustificativi[dipendente.assenze[selectedYear][selectedMonth][selectedDay]][0]]
                            tabellaAssenti.push(newLine);
                        }
                    }
                }
           // }
        })
        if(tabellaAssenti.length === 0){
            console.log("tabella vuota")
        }
        else{
            console.log("tabella non vuota")
            var data =tabellaAssenti
            data.unshift(['COGNOME', 'NOME', 'MOTIVO ASSENZA']);
            data.unshift([oggi]);
            data.unshift(['ASSENZE DEL GIORNO']);
            data.unshift([nameOffice]);
            console.log('-------------- data ',data)
            // Creare un nuovo workbook
            var wb = XLSX.utils.book_new();
    
            // Convertire i dati in un foglio di lavoro
            var ws = XLSX.utils.aoa_to_sheet(data);
            // Calcolare la larghezza massima di ciascuna colonna
            var maxLengths = [];
            data.forEach(row => {
                
                row.forEach((cell, i) => {
                    
                    const length = cell.toString().length;
                    maxLengths[i] = maxLengths[i] ? Math.max(maxLengths[i], length) : length;
                });
            });
            // Impostare la larghezza delle colonne
            ws['!cols'] = maxLengths.map(length => ({ wch: length }));
            // Aggiungere il foglio di lavoro al workbook
            XLSX.utils.book_append_sheet(wb, ws, `${selectedDate.value}`);          
            // Salvare il file Excel
            XLSX.writeFile(wb, `assenze/ASSENZE_DEL_${oggi}_${nameOffice}_${amministrazione}.xlsx`);

        }      
  
        
        // const endDay=document.getElementById("endDay");
        if(tabellaAssenti.length === 0){
            console.log("Non sono presenti assenti")
        }
        else{
            console.log("tabella non vuota")
           
            // Creare un nuovo documento PDF
            var doc = new jsPDF();

            // Definisci i margini in punti, 72punti equivalgono ad un pollice 2.54cm
            const margineSinistro = 10;
            const margineDestro = 10;
            const margineSuperiore = 10;
            const margineInferiore = 10;
            // Impostazioni di base
           // Inserire l'immagine come intestazione
            doc.addImage(imgData, 'PNG', 0, margineSuperiore, 200, 40); // Aggiunge l'immagine al PDF (x, y, width, height)
            // Aggiunge intestazione sotto all'immagine
            doc.setFont("Times", "italic"); // Imposta il font Helvetica in corsivo
            doc.setFontSize(12);
            doc.text("Dipartimento dei Vigili del fuoco, del Soccorso pubblico e della Difesa civile - D.C.R.U. Ufficio Concorsi", margineSinistro + 7, margineSuperiore + 45);

            // Ripristina il testo normale per i dati
            doc.setFont("Times","normal");

            // Impostazioni di base
            var startY = margineSuperiore + 20 + 40; // Posizione iniziale Y dopo l'immagine
            var lineHeight = 10;

            
            var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
            var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
            var cellPadding = 3;
            var startX = cellPadding + margineSinistro;
           // var startY = cellPadding;
            var lineHeight = 10;
            var fontSize = 10; // Dimensione del carattere

            // Impostare la dimensione del carattere
            doc.setFontSize(fontSize);
            // Impostare il contenuto del PDF
            data.forEach(function(row, rowIndex) {
               
                row.forEach(function(cell, colIndex) {
                    doc.text(cell.toString(), startX + colIndex * 40, startY + rowIndex * lineHeight);
                });
            });

            // Salvare il file PDF
            doc.save(`assenze/ASSENZE_DEL_${oggi}_${nameOffice}_${amministrazione}.pdf`);
            //let prova= await ricercaPerCognome('Notaro')
           // console.log(prova)
        }    
   
}
module.exports ={
    createFileCNVVF
}