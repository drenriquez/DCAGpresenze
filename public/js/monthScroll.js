import { isNonLavorativo } from "../../utils/giorniNonLavorativi.js";
import { getDayAbbreviation } from "../../utils/dayOfWeak.js";
import { listaGiustificativi } from "../../utils/giustificativiAssenze.js";
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('previousMonth').addEventListener('click', previousMonth);
  document.getElementById('nextMonth').addEventListener('click', nextMonth);
  document.getElementById('monthSelector').addEventListener('change', updateTableHeaders);
  //const dataString = document.currentScript.getAttribute('usersTable');
  //const usersTableString = document.querySelector('script[type="module"]').getAttribute('usersTable');
  //console.log(usersTableString);
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  const formattedDate = `${currentYear}-${currentMonth.toString().padStart(2, '0')}`;
  document.getElementById('monthSelector').value = formattedDate;
  updateTableHeaders();
});

function updateTableHeaders() {
  const usersTableString = document.querySelector('script[type="module"]').getAttribute('usersTable');
  const usersTable = JSON.parse(usersTableString);
  const userCodiceFiscale=document.querySelector('script[type="module"]').getAttribute('userCodFisc');
  const livelloUser=document.querySelector('script[type="module"]').getAttribute('livelloUser');
  let oggi = new Date();
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
  usersTable.forEach((persona, index) => {
      const cognomeNome = `${persona.anagrafica.cognome} ${persona.anagrafica.nome}`;
      let classUserLog=persona.anagrafica.codiceFiscale.toUpperCase()===userCodiceFiscale.toUpperCase()? "utenteLoggato": "nonLoggato";
      let classUserLogNotWork=persona.anagrafica.codiceFiscale.toUpperCase()===userCodiceFiscale.toUpperCase()? "utenteLoggatoNonLavorativo": "nonLoggato";
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
           
            let result =controlDayForUser(dayOfWeek2,persona.assenze);
            classOfDay="selezionabile "
            let newTd=document.createElement("td");
            newTd.textContent=result
            newTd.classList.add(classTr, "tdLavorativo",classUserLog);
            if(isCurrentDay(dayOfWeek2)){
              newTd.classList.add("currentDay",classUserLog)
            };
            newTr.appendChild(newTd);
           
            if(livelloUser==="2"){
             
              const select_Element = createSelectElement(listaGiustificativi, classOfDay);
              select_Element.classList.add(classUserLog)
              newTd.appendChild(select_Element);
            }
            else{
              if((dayOfWeek2>=(new Date())||isCurrentDay(dayOfWeek2))&&(persona.anagrafica.codiceFiscale.toUpperCase()===userCodiceFiscale.toUpperCase())){
                const select_Element = createSelectElement(listaGiustificativi, classOfDay);
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
            updateCellValue(this);
        });
    });
}

function updateCellValue(selectElement) {
  const selectedOption = selectElement.options[selectElement.selectedIndex];
    
    // Recupera il valore associato dall'attributo 'data-value'
  const actualValue = selectedOption.getAttribute('data-value');
  const cell = selectElement.parentNode;
  cell.textContent = actualValue;
  const selectElementNew = createSelectElement(listaGiustificativi, "select-option");
  cell.appendChild(selectElementNew);
  selectElementNew.addEventListener('change', function() {
      updateCellValue(this);
  });
}
function previousMonth() {
  let monthSelector = document.getElementById('monthSelector');
  let date = new Date(monthSelector.value);
  date.setMonth(date.getMonth() - 1);
  monthSelector.value = formatDate(date);
  updateTableHeaders();
}

function nextMonth() {
  let monthSelector = document.getElementById('monthSelector');
  let date = new Date(monthSelector.value);
  date.setMonth(date.getMonth() + 1);
  monthSelector.value = formatDate(date);
  updateTableHeaders();
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
function createSelectElement(listaGiustif, classOfDay) {
  const select = document.createElement('select');
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

  Object.entries(listaGiustif).forEach(([key, value]) => {
    const option = document.createElement('option');
   
    let descrizione=key+" "+value[0];
    option.setAttribute('data-value',key);
    option.textContent = descrizione;
    select.appendChild(option);
  });
  return select;
}
function controlDayForUser(day, assenze) {
  let result = "";
  let dayDate = new Date(day);
  let year = dayDate.getFullYear();
  let month = ("0" + (dayDate.getMonth() + 1)).slice(-2); // Aggiunge un padding zero per assicurarsi che il mese sia sempre a due cifre
  let date = ("0" + dayDate.getDate()).slice(-2); // Aggiunge un padding zero per assicurarsi che il giorno sia sempre a due cifre
  if (assenze[year] && assenze[year][month] && assenze[year][month][date]) {
      result = assenze[year][month][date];
  } 
  return result;
}
