import { isNonLavorativo } from "../../utils/giorniNonLavorativi.js";
import { getDayAbbreviation } from "../../utils/dayOfWeak.js";
import { listaGiustificativi } from "../../utils/giustificativiAssenze.js";
import { listeUfficiEdAmm } from "../../utils/listeAmministrazioniEdUffici.js";
import { APIgetAllUsersInOrdineCognome, APIaddAbsenceById, APIdeleteAbsenceById, APIgetUsersByUfficio } from "../../utils/apiUtils.js";
import { UserModel } from "../../model/userModel.js";

let usersTable=""//*******************test */
document.addEventListener('DOMContentLoaded', async function() {
  const hostApi= document.querySelector('script[type="module"]').getAttribute('apiUserURL');
  usersTable=await APIgetAllUsersInOrdineCognome(hostApi);//*******************test */
  document.getElementById('previousMonth').addEventListener('click', previousMonth);
  document.getElementById('nextMonth').addEventListener('click', nextMonth);
  document.getElementById('monthSelector').addEventListener('change', updateTableHeaders());
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  const formattedDate = `${currentYear}-${currentMonth.toString().padStart(2, '0')}`;
  document.getElementById('monthSelector').value = formattedDate;
  popolaSelect("selectUfficio",listeUfficiEdAmm.uffici,callbackSelectUfficio)
  updateTableHeaders();
});

async function updateTableHeaders(tabella) {
  if(!tabella){
    const hostApi= document.querySelector('script[type="module"]').getAttribute('apiUserURL');
    usersTable=await APIgetAllUsersInOrdineCognome(hostApi);}
  else{
    usersTable=tabella;
  }
  //const usersTable = JSON.parse(usersTableString);
  const userCodiceFiscale=document.querySelector('script[type="module"]').getAttribute('userCodFisc');
  const livelloUser=document.querySelector('script[type="module"]').getAttribute('livelloUser');
  const tableHeader = document.getElementById('tableHeader');
 // const rowsHeader = document.getElementById("rowsHeader");
  const tableBody = document.getElementById("tableBody");
  if (!tableHeader) return;

  const monthSelector = document.getElementById('monthSelector');
  const selectedDate = new Date(monthSelector.value);
  const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
  tableHeader.innerHTML = '<tr><th></th>'; // Resetta le intestazioni della tabella
  tableBody.innerHTML = '<tbody id="tableBody"></tbody>'// Resetta le intestazioni delle righe della tabella
  // Aggiunge le intestazioni per ogni giorno del mese
  for (let i = 1; i <= daysInMonth; i++) {
        const dayOfWeek = changeDay(selectedDate, i);
        //console.log("EEEEEEEEEEEEE",dayOfWeek)
        const giorno = getDayAbbreviation(dayOfWeek.getDay());
        const classOfHeadDay = isNonLavorativo(dayOfWeek) ? "head-non-lavorativo" : "";
        const currentClassDay = isCurrentDay(dayOfWeek) ?  "currentDay" : "";
        tableHeader.innerHTML += `<th class="head-day ${classOfHeadDay} ${currentClassDay}">${giorno}<br>${i}</th>`;
    }
        
  // Crea le righe per ogni dipendente
  usersTable.forEach((dipendente, index) => {
      let persona= new UserModel(dipendente)
      let isUserLogged = persona.getCodiceFiscale()===userCodiceFiscale? true:false;
      const cognomeNome = persona.getFullName();
      let classUserLog=persona.getCodiceFiscale().toUpperCase()===userCodiceFiscale.toUpperCase()? "utenteLoggato": "nonLoggato";
      let classUserLogNotWork=persona.getCodiceFiscale().toUpperCase()===userCodiceFiscale.toUpperCase()? "utenteLoggatoNonLavorativo": "nonLoggato";
 // for(const[index,headRow ]of headRows.entries()){//entries()  restituisce un nuovo oggetto iterabile, coppie chiave-valore per ogni elemento 
      let newTr=document.createElement("tr");
      newTr.textContent = cognomeNome.toUpperCase() ;
      tableBody.appendChild(newTr)
      let classTr="none";
      let classTdnonLAv="";
      if (index % 2 === 0) {
        classTr="trDispari"; // Aggiungi la classe CSS
        classTdnonLAv="non-lavorativo-dispari";
      }
      newTr.classList.add(classTr,classUserLog);
      //newTr.classList.add(classUserLog); 
      for (let i = 1; i <= daysInMonth; i++) {
          let classOfDay="";
          let dayOfWeek2=changeDay(selectedDate, i);
          //console.log("EEEEEEEEEEEEE",dayOfWeek2)
          if(isNonLavorativo(dayOfWeek2)===1){ 
            const currentClassDay2 = isCurrentDay(dayOfWeek2) ?  "currentDay" : "";         
            newTr.innerHTML += `
            <td class="non-lavorativo ${classTdnonLAv} ${currentClassDay2} ${classUserLogNotWork}">
            </td>`;
          }
          else{

            let result =controlDayForUser(listaGiustificativi,isUserLogged,livelloUser,dayOfWeek2,persona.getAssenze());
           // if(isUserLogged){console.log("++++++++++++++++++++++++++++++++",result)}
            //console.log("++++++++++++++++++++++++++++++++",result)
            classOfDay="selezionabile "
            let newTd=document.createElement("td");
            newTd.textContent=result
            newTd.classList.add(classTr, "tdLavorativo",classUserLog);
            if(isCurrentDay(dayOfWeek2)){
              newTd.classList.add("currentDay",classUserLog)
            };
            newTr.appendChild(newTd);
           
            if(livelloUser==="2"){
              // const dataDay=String(selectedDate.getDay()).padStart(2,'0')  // Formatta il giorno con due cifre
              // const dataMonth = selectedDate.getMonth();
              // const dataYear = selectedDate.getFullYear();
              const select_Element = createSelectElement(listaGiustificativi, classOfDay,persona.getId(),dayOfWeek2);
              select_Element.classList.add(classUserLog)
              newTd.appendChild(select_Element);
            }
            else{
              if((dayOfWeek2>=(new Date())||isCurrentDay(dayOfWeek2))&&(persona.getCodiceFiscale().toUpperCase()===userCodiceFiscale.toUpperCase())){
                const select_Element = createSelectElement(listaGiustificativi, classOfDay,persona.getId(),dayOfWeek2);
                select_Element.classList.add(classUserLog)
                newTd.appendChild(select_Element);
              }
            }
        //    newTd.textContent ="tes
            // newTr.innerHTML += `
            // <td class="${classTr} tdLavorativo"></td>`;
          }
      }
  });

  // Aggiungi gestori di eventi onchange ai nuovi elementi select
  const selectElements = document.querySelectorAll('.select-option');
    selectElements.forEach(selectElement => {
        selectElement.addEventListener('change', function() {
            //console.log(this.dataset.user)
            updateCellValue(this,this.classList,this.dataset.user,this.dataset.day);
        });
    });
}

function updateCellValue(selectElement,classOfDay,userId,day) {
  const selectedOption = selectElement.options[selectElement.selectedIndex];
    // Recupera il valore associato dall'attributo 'data-value'
  const actualValue = selectedOption.getAttribute('data-value');
  const cell = selectElement.parentNode;
  cell.textContent = actualValue;
  //console.log("actualvalue -->",actualValue)
  const hostApi= document.querySelector('script[type="module"]').getAttribute('apiUserURL');

  //console.log(`actualValue (type: ${typeof actualValue}):`, actualValue);
  const dateB = new Date(day);
  const giorno = String(dateB.getDate()).padStart(2, '0');
  const month = String(dateB.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = dateB.getFullYear();
  let formattedDate=`${giorno}/${month}/${year}`
if (actualValue.trim() === "") { //trim() rimuove eventuali spazi bianchi
  //console.log("actualvalue is empty");
  APIdeleteAbsenceById(hostApi,userId,day).then((res)=>{
    //alert(`assenza del ${formattedDate}  per ${res.anagrafica.nome} ${res.anagrafica.cognome} cancellata`)
    const alertHtml = `
      <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
        <symbol id="check-circle-fill" fill="currentColor" viewBox="0 0 16 16">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
        </symbol>
        <symbol id="info-fill" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
        </symbol>
        <symbol id="exclamation-triangle-fill" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
        </symbol>
      </svg>
      <div class="alert alert-danger d-flex align-items-center overlay-alert" role="alert">
          <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Success:">
              <use xlink:href="#exclamation-triangle-fill"/>
          </svg>
          <div>
              assenza del ${formattedDate}  per ${res.anagrafica.nome} ${res.anagrafica.cognome} cancellata
          </div>
      </div>
    `;

    // Crea un elemento temporaneo
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = alertHtml;

    // Aggiungilo al body
    document.body.appendChild(tempDiv);
    // Rimuovi l'alert dopo 3 secondi
    setTimeout(function() {
      const alertElement = document.querySelector('.overlay-alert');
      if (alertElement) {
          alertElement.remove();
      }
    }, 2000); // 3000 millisecondi = 3 secondi
  })
} else {
  //console.log("actualvalue is not empty:", actualValue);
 
  APIaddAbsenceById(hostApi, userId, day, actualValue).then((res)=>{
    //alert(`assenza "${listaGiustificativi[actualValue][0]}" del ${formattedDate} inserita per ${res.anagrafica.nome} ${res.anagrafica.cognome}`)
    const alertHtml = `
      <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
        <symbol id="check-circle-fill" fill="currentColor" viewBox="0 0 16 16">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
        </symbol>
        <symbol id="info-fill" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
        </symbol>
        <symbol id="exclamation-triangle-fill" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
        </symbol>
      </svg>
      <div class="alert alert-success d-flex align-items-center overlay-alert" role="alert">
          <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Success:">
              <use xlink:href="#check-circle-fill"/>
          </svg>
          <div>
              assenza "${listaGiustificativi[actualValue][0]}" del ${formattedDate} inserita per ${res.anagrafica.nome} ${res.anagrafica.cognome}
          </div>
      </div>
    `;

    // Crea un elemento temporaneo
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = alertHtml;

    // Aggiungilo al body
    document.body.appendChild(tempDiv);
    // Rimuovi l'alert dopo 3 secondi
    setTimeout(function() {
      const alertElement = document.querySelector('.overlay-alert');
      if (alertElement) {
          alertElement.remove();
      }
    }, 2000); // 3000 millisecondi = 3 secondi
  });
}
  const selectElementNew = createSelectElement(listaGiustificativi,classOfDay,userId,day);
  cell.appendChild(selectElementNew);
  //console.log("***********************",actualValue)
  selectElementNew.addEventListener('change', function() {
    //console.log("***********************",actualValue)
      updateCellValue(this,classOfDay,userId,day);
  });
}
function previousMonth() {
  let monthSelector = document.getElementById('monthSelector');
  let date = new Date(monthSelector.value);
  date.setMonth(date.getMonth() - 1);
  monthSelector.value = formatDate(date);
  updateTableHeaders();
  ripristinaValoreDefaultSelect()
}

function nextMonth() {
  let monthSelector = document.getElementById('monthSelector');
  let date = new Date(monthSelector.value);
  date.setMonth(date.getMonth() + 1);
  monthSelector.value = formatDate(date);
  updateTableHeaders();
  ripristinaValoreDefaultSelect()
}

function formatDate(date) {
  let month = date.getMonth() + 1;
  month = month < 10 ? '0' + month : month;
  return date.getFullYear() + '-' + month;
}

function changeDay(date, newDay) {
  let newDate = new Date(date.getTime());
  newDate.setDate(newDay);
  return newDate;
}
function isCurrentDay(day){
  const currentDate = new Date();
  let currentDay= currentDate.getDate();
  const currentMonth = currentDate.getMonth() ;
  const currentYear = currentDate.getFullYear();
  const isCurrent = (day.getDate() === currentDay && 
                         day.getMonth() === currentMonth && 
                         day.getFullYear() === currentYear) ? 
                         true : false;
  return isCurrent                      
}
// Funzione per creare un elemento <select> con opzioni
function createSelectElement(listaGiustif, classOfDay, idUser, day) {
  const select = document.createElement('select');
  select.setAttribute('data-user', idUser)
  select.setAttribute('data-day',day)
  select.className = `form-control custom-select select-option ${classOfDay}`;
  const defaultOption = document.createElement('option');
  defaultOption.selected = true;
  defaultOption.disabled = true;
  defaultOption.hidden = true;
  select.appendChild(defaultOption);
  const optionEntry = document.createElement('option');
  optionEntry.textContent = "";
  optionEntry.setAttribute('data-value','');
  select.appendChild(optionEntry);

  Object.entries(listaGiustif)
  .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))  // Ordina alfabeticamente le chiavi
  .forEach(([key, value]) => {
    const option = document.createElement('option');
    let descrizione=key+" "+value[0];
    option.setAttribute('data-value',key);
    option.textContent = descrizione;
    select.appendChild(option);
  });
  return select;
}
function controlDayForUser(listaGiustificativi,isUserLogged,level,day, assenze) {
  let result = "";
  let dayDate = new Date(day);
  let year = dayDate.getFullYear();
  let month = ("0" + (dayDate.getMonth() + 1)).slice(-2); // Aggiunge un padding zero per assicurarsi che il mese sia sempre a due cifre
  let date = ("0" + dayDate.getDate()).slice(-2); // Aggiunge un padding zero per assicurarsi che il giorno sia sempre a due cifre
  if (assenze[year] && assenze[year][month] && assenze[year][month][date]) {
      result = assenze[year][month][date];
  } 
  if(isUserLogged||level>0 || result===""){
    return result
  }
  else {
    return listaGiustificativi[result][1]
    
  }
}
// Funzione per popolare la select con le opzioni dall'array
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
async function callbackSelectUfficio(valore){
  if(valore==="Tutti"){
    updateTableHeaders()
  }
  else{
    const hostApi= document.querySelector('script[type="module"]').getAttribute('apiUserURL');
    //console.log('333333333333333333333333',valore)
    APIgetUsersByUfficio(hostApi,valore).then((res)=>{ updateTableHeaders(res)})
  }
}
// Funzione per ripristinare il valore predefinito del select
function ripristinaValoreDefaultSelect() {
  // Trova l'elemento select
  var select = document.getElementById("selectUfficio");
  // Imposta il valore selezionato al valore predefinito desiderato
  select.value = "Tutti"; // Imposta il valore predefinito vuoto
}