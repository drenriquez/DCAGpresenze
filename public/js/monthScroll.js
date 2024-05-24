import { isNonLavorativo } from "../../utils/giorniNonLavorativi.js";
import { getDayAbbreviation } from "../../utils/dayOfWeak.js";
import { listaGiustificativi } from "../../utils/giustificativiAssenze.js";
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('previousMonth').addEventListener('click', previousMonth);
  document.getElementById('nextMonth').addEventListener('click', nextMonth);
  document.getElementById('monthSelector').addEventListener('change', updateTableHeaders);
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  const formattedDate = `${currentYear}-${currentMonth.toString().padStart(2, '0')}`;
  document.getElementById('monthSelector').value = formattedDate;
  updateTableHeaders();
});

function updateTableHeaders() {
  const tableHeader = document.getElementById('tableHeader');
  const rowsHeader = document.getElementById("rowsHeader");
  const tableBody = document.getElementById("tableBody");
  if (!tableHeader) return;
  const headRows=['riga1', 'riga2', 'riga3','riga4', 'riga5', 'riga6','riga7','riga8', 'riga9','riga10','riga11'];
  const monthSelector = document.getElementById('monthSelector');
  const selectedDate = new Date(monthSelector.value);
  const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
  tableHeader.innerHTML = '<tr><th></th>'; // Resetta le intestazioni della tabella
  tableBody.innerHTML = '<tbody id="tableBody"></tbody>'// Resetta le intestazioni delle righe della tabella
  // Aggiunge le intestazioni per ogni giorno del mese
  for (let i = 1; i <= daysInMonth; i++) {
        const dayOfWeek = changeDay(selectedDate, i);
        const giorno = getDayAbbreviation(dayOfWeek.getDay());
        const classOfHeadDay = isNonLavorativo(dayOfWeek) ? "head-non-lavorativo" : "";
        const currentClassDay = isCurrentDay(dayOfWeek) ?  "currentDay" : "";
        tableHeader.innerHTML += `<th class="head-day ${classOfHeadDay} ${currentClassDay}">${giorno}<br>${i}</th>`;
    }
        
  // Crea le righe per ogni dipendente
  for(const[index,headRow ]of headRows.entries()){//entries()  restituisce un nuovo oggetto iterabile, coppie chiave-valore per ogni elemento 
      let newTr=document.createElement("tr");
      newTr.textContent = headRow
      tableBody.appendChild(newTr)
      let classTr="none"
      let classTdnonLAv=""
      if (index % 2 === 0) {
        classTr="trDispari"; // Aggiungi la classe CSS
        classTdnonLAv="non-lavorativo-dispari";
      }
      newTr.classList.add(classTr); 
      for (let i = 1; i <= daysInMonth; i++) {
          let classOfDay="";
          let dayOfWeek2=changeDay(selectedDate, i);
          if(isNonLavorativo(dayOfWeek2)===1){ 
            const currentClassDay2 = isCurrentDay(dayOfWeek2) ?  "currentDay" : "";         
            newTr.innerHTML += `
            <td class="non-lavorativo ${classTdnonLAv} ${currentClassDay2}">
            </td>`;
          }
          else{
              
            classOfDay="selezionabile "
            let newTd=document.createElement("td");
            newTd.classList.add(classTr, "tdLavorativo");
            if(isCurrentDay(dayOfWeek2)){
              newTd.classList.add("currentDay")
            };
            newTr.appendChild(newTd);
            const select_Element = createSelectElement(listaGiustificativi, classOfDay);
            newTd.appendChild(select_Element);
            // newTr.innerHTML += `
            // <td class="${classTr} tdLavorativo"></td>`;
          }
      }
  }

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
