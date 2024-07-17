import { listeUfficiEdAmm } from "../../utils/listeAmministrazioniEdUffici.js";
import { APIcreateUser, APIupdateUser, APIdeleteUser, APIgetUserByCodiceFiscale ,APIgetAllUsersInOrdineCognome, APIgetUsersByUfficio} from "../../utils/apiUtils.js";
import { UserModel } from "../../model/userModel.js";
import { listaGiustificativi } from "../../utils/giustificativiAssenze.js";
import { imgData } from '../../utils/imgData.js'; // Importa la stringa base64


let livelloUser='0';
let usersTable=""
document.addEventListener('DOMContentLoaded', async function() {
    usersTable= await getAllUsers();
    popolaSelect("selectUfficio2",listeUfficiEdAmm.uffici,callbackSelectUfficio);
    popolaSelect("selectUfficio",listeUfficiEdAmm.uffici,callbackSelect);
    popolaSelect("selectAmministrazione",listeUfficiEdAmm.amministrazioni,callbackSelect);
    popolaSelect("selectLivello",listeUfficiEdAmm.livelliUser,callbackSelectlivello);
    setStartDayForInput();
    createFile();
    btnElimina();
    addNewUser()
})

async function setStartDayForInput(){
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    const currentDay = currentDate.getDate();
    const starDay=document.getElementById("startDay");
    starDay.value=`${currentYear}-${currentMonth.toString().padStart(2, '0')}-${currentDay}`
    // const endDay=document.getElementById("endDay");
    // endDay.value=`${currentYear}-${currentMonth.toString().padStart(2, '0')}-${currentDay}`
}
async function popolaSelect(idSelectElement, opzioniArray, onChangeFunction) {
    var select = document.getElementById(idSelectElement);
    // Rimuovi le opzioni esistenti
    select.innerHTML = "";
    // Aggiungi le opzioni dall'array alla select
    opzioniArray.forEach(function(opzione, index) {
        var option = document.createElement("option");
        option.text = opzione;
        option.value = opzione;
  
        // Se è il primo elemento dell'array, selezionalo di default
        if (index === 0) {
            option.selected = true;
        }
  
        select.appendChild(option);
    });
     // Aggiungi un gestore di eventi per l'evento "change"
     select.addEventListener("change", function() {
      var selectedValue = this.value; // Ottieni il valore selezionato
      // Chiama la funzione onChangeFunction passando il valore selezionato come parametro
      onChangeFunction(selectedValue);
    });
  }
async function callbackSelect(valore){
  console.log(valore)
}
async function callbackSelectUfficio(valore){
    if(valore==="Tutti"){
        usersTable= await getAllUsers()
      }
    else{
        usersTable= await getUsersByUfficio(valore)
    }
  }
async function callbackSelectlivello(valore){
    if(valore==='1'||valore==='2'){
        alert("ATTEZIONE: SI STA INSERENDO UN UTENTE CON AUTORIZZAZIONI DA AMMINISTRATORE")
    }
    livelloUser=valore
  console.log(valore)
}
 async function btnElimina(){
    const hostApi= document.querySelector('script[type="module"]').getAttribute('apiUserURL');
    document.getElementById('eliminaUtente').addEventListener('click', async function() {
        const form = document.getElementById('userForm');
        form.querySelectorAll('input, select').forEach(function(element) {
            if (element.id !== 'codiceFiscale') {
                console.log('*********',element.id)
                element.removeAttribute('required');
            }
        });
        // Mostra un alert di conferma
        const codiceFiscale = document.getElementById('codiceFiscale').value;
        if(codiceFiscale===""){
            alert("inserire il codice fiscale dell'utente da cancellare")
        }
        else{
            if (confirm("Sei sicuro di voler eliminare questo utente?")) {
                // Rimuovi l'attributo required da tutti i campi tranne codiceFiscale
                form.querySelectorAll('input, select').forEach(async function(element) {
                    if (element.id !== 'codiceFiscale') {
                        element.removeAttribute('required');
                    }
                });
                // Cambia l'azione del form per eliminare l'utente
                const respGetUserByCod = await APIgetUserByCodiceFiscale(hostApi,codiceFiscale)
                //console.log(respGetUserByCod._id)
                const respDeleteUser=await APIdeleteUser(hostApi,respGetUserByCod._id)
                //console.log(respDeleteUser);
                alert (`utente  ${codiceFiscale} cancellato con successo`)
                location.reload();

                //form.submit();
            } else {
                // Annulla l'operazione di eliminazione
                alert("Operazione di eliminazione annullata.");
            }
        }
    })
  }
async function addNewUser(){
    const hostApi= document.querySelector('script[type="module"]').getAttribute('apiUserURL');
    document.getElementById('aggiungiUtente').addEventListener('click', async function() {
        
        const nome =await document.getElementById('nome').value;
        const cognome =await document.getElementById('cognome').value;
        const codiceFiscale =await document.getElementById('codiceFiscale').value;
        const amministrazione =await document.getElementById('selectAmministrazione').value;
        const qualifica  =await document.getElementById('qualifica').value;
        const ufficio  =await document.getElementById('selectUfficio').value;
        const livello  =await document.getElementById('selectLivello').value;
        console.log(nome,cognome,codiceFiscale,amministrazione,qualifica,ufficio,livello)
            let newUser= new UserModel({});
            newUser.setAnagrafica({
                "nome":nome,
                "cognome":cognome,
                "codiceFiscale":codiceFiscale
            })
            newUser.setAmministrazione(amministrazione);
            newUser.setQualifica(qualifica);
            newUser.setUfficio(ufficio);
            newUser.setLivelloUser(livello);
            newUser.setAssenze({})
            console.log(newUser.anagrafica)
         
       
        if(livelloUser==='1'||livelloUser==='2'){
            confirm(`SI STA PER INSERIRE UN UTENTE CON AUTORIZZAZIONI DA AMMINISTRATORE DI LIVELLO: ${livelloUser} `)
        }
        let anagrafica={
            "nome":nome,
            "cognome":cognome,
            "codiceFiscale":codiceFiscale
        }
        let respCreateUser= await APIcreateUser(hostApi,newUser)
        alert("utente inserito correttamente")   
    }

)}
async function createFile(){
    const hostApi= document.querySelector('script[type="module"]').getAttribute('apiUserURL');
    document.getElementById('esportaDati').addEventListener('click', async function() {
        const starDay=document.getElementById("startDay");
        let office=document.getElementById("selectUfficio2");
        let nameOffice= office.value==="Tutti"?"":office.value
        // const endDay=document.getElementById("endDay");
        let tabellaAssenti=[];
        const selectedDate = new Date(starDay.value);
        const selectedMonth = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
        const selectedYear = selectedDate.getFullYear();
        const selectedDay = (selectedDate.getDate()).toString().padStart(2, '0');
        console.log("++++++++++++++++++++++++++++++++++++")
        usersTable.forEach((dipendente, index) => {
           
            //console.log(selectedMonth)
            // if(dipendente.assenze[selectedYear][selectedMonth]){
            //     console.log(dipendente.assenze[selectedYear][selectedMonth])
            // }
            if(selectedYear in dipendente.assenze){
                
                if(selectedMonth in dipendente.assenze[selectedYear]){
                    //console.log(dipendente.assenze[selectedYear][selectedMonth])
                    if(selectedDay in dipendente.assenze[selectedYear][selectedMonth]){
                        console.log(dipendente.anagrafica.cognome,"",dipendente.anagrafica.nome)
                        console.log(dipendente.assenze[selectedYear][selectedMonth][selectedDay])
                        let newLine=[dipendente.anagrafica.cognome,dipendente.anagrafica.nome,listaGiustificativi[dipendente.assenze[selectedYear][selectedMonth][selectedDay]][0]]
                        tabellaAssenti.push(newLine);
                    }
                }
            }
        })
        console.log(tabellaAssenti)
        if(tabellaAssenti.length === 0){
            console.log("tabella vuota")
        }
        else{
            console.log("tabella non vuota")
            var data =tabellaAssenti
            data.unshift(['COGNOME', 'NOME', 'MOTIVO ASSENZA']);
            data.unshift([starDay.value]);
            data.unshift(['ASSENZE DEL GIORNO']);
            data.unshift([nameOffice]);
          
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
            XLSX.utils.book_append_sheet(wb, ws, `${starDay.value}`);          
            // Salvare il file Excel
            XLSX.writeFile(wb, `ASSENZE_DEL_${starDay.value}_${nameOffice}.xlsx`);

        }      
    })

    document.getElementById('esportaDatiPDF').addEventListener('click', async function() {
        const starDay=document.getElementById("startDay");
        let office=document.getElementById("selectUfficio2");
        let nameOffice= office.value==="Tutti"?"":office.value
        // const endDay=document.getElementById("endDay");
        let tabellaAssenti=[];
        const selectedDate = new Date(starDay.value);
        const selectedMonth = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
        const selectedYear = selectedDate.getFullYear();
        const selectedDay = (selectedDate.getDate()).toString().padStart(2, '0');
        console.log("++++++++++++++++++++++++++++++++++++")
        usersTable.forEach((dipendente, index) => {
            //console.log(selectedMonth)
            // if(dipendente.assenze[selectedYear][selectedMonth]){
            //     console.log(dipendente.assenze[selectedYear][selectedMonth])
            // }
            if(selectedYear in dipendente.assenze){
                
                if(selectedMonth in dipendente.assenze[selectedYear]){
                    //console.log(dipendente.assenze[selectedYear][selectedMonth])
                    if(selectedDay in dipendente.assenze[selectedYear][selectedMonth]){
                        console.log(dipendente.anagrafica.cognome,"",dipendente.anagrafica.nome)
                        console.log(dipendente.assenze[selectedYear][selectedMonth][selectedDay])
                        let newLine=[dipendente.anagrafica.cognome,dipendente.anagrafica.nome,listaGiustificativi[dipendente.assenze[selectedYear][selectedMonth][selectedDay]][0]]
                        tabellaAssenti.push(newLine);
                    }
                }
            }
        })
        console.log(tabellaAssenti)
        if(tabellaAssenti.length === 0){
            console.log("tabella vuota")
        }
        else{
            console.log("tabella non vuota")
            var data =tabellaAssenti
            data.unshift(['COGNOME', 'NOME', 'MOTIVO ASSENZA']);
            data.unshift([starDay.value]);
            data.unshift(['ASSENZE DEL GIORNO']);
            data.unshift([nameOffice]);
            // Creare un nuovo documento PDF
            var doc = new jsPDF();
            // Impostazioni di base
           // Inserire l'immagine come intestazione
            doc.addImage(imgData, 'PNG', 10, 10, 200, 30); // Aggiunge l'immagine al PDF (x, y, width, height)

            // Impostazioni di base
            var startY = 60; // Posizione iniziale Y dopo l'immagine
            var lineHeight = 10;

            
            var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
            var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
            var cellPadding = 5;
            var startX = cellPadding;
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
            doc.save(`ASSENZE_DEL_${starDay.value}_${nameOffice}.pdf`);
            console.log(imgData)
        }
       
        
    })




}
async function getAllUsers(){
    const hostApi= document.querySelector('script[type="module"]').getAttribute('apiUserURL');
    const allUsers=await APIgetAllUsersInOrdineCognome(hostApi);
    return allUsers
}
async function getUsersByUfficio(valore){
    const hostApi= document.querySelector('script[type="module"]').getAttribute('apiUserURL');
    const users=await APIgetUsersByUfficio(hostApi,valore)
    return users
}

  