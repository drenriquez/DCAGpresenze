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

  const headRows=['riga1', 'riga2', 'riga3','riga4'];
  const monthSelector = document.getElementById('monthSelector');
  const selectedDate = new Date(monthSelector.value);
  const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
  
  tableHeader.innerHTML = '<tr><th></th>'; // Resetta le intestazioni della tabella
  tableBody.innerHTML = '<tbody id="tableBody"></tbody>'// Resetta le intestazioni delle righe della tabella

  // Aggiunge le intestazioni per ogni giorno del mese
  for (let i = 1; i <= daysInMonth; i++) {
      let dayOfWeek=changeDay(selectedDate, i);
      let classOfHeadDay="";
      let giorno=getDayAbbreviation(dayOfWeek.getDay());
    
      if(isNonLavorativo(dayOfWeek,festivita)===1){
          classOfHeadDay="head-non-lavorativo";
      }
      tableHeader.innerHTML += `<th class="head-day ${classOfHeadDay}">${giorno}<br>${i}</th>`;
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
          if(isNonLavorativo(dayOfWeek2,festivita)===1){
              
              //classOfDay=`non-lavorativo non-lavorativo-dispari`;
              newTr.innerHTML += `
              <td class="non-lavorativo ${classTdnonLAv}">
              </td>`;
          }
          else{
              classOfDay="selezionabile "
              newTr.innerHTML += `
              <td class="${classTr} tdLavorativo">
                  <select class="form-control custom-select select-option ${classOfDay}">
                      <option selected disabled hidden></option>
                      <option>Val1</option>
                      <option>Val2</option>
                      <option>Val3</option>
                  </select>
              </td>`;
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
  const selectedValue = selectElement.value;
  const cell = selectElement.parentNode;
  cell.textContent = selectedValue;
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

function getDayAbbreviation(dayOfWeek) {
  switch(dayOfWeek) {
      case 0:
          return "Dom"; // Domenica
      case 1:
          return "Lun"; // Lunedì
      case 2:
          return "Mar"; // Martedì
      case 3:
          return "Mer"; // Mercoledì
      case 4:
          return "Gio"; // Giovedì
      case 5:
          return "Ven"; // Venerdì
      case 6:
          return "Sab"; // Sabato
      default:
          return ""; // Restituisce una stringa vuota per valori non validi
  }
}

function isNonLavorativo(date, festivita) {
  if (!Array.isArray(festivita)) {
      throw new TypeError("festivita must be an array");
  }

  if (date.getDay() === 6 || date.getDay() === 0) {
      return 1;
  }

  const giorno = date.getDate();
  const mese = date.getMonth() + 1;
  const anno = date.getFullYear();

  for (const festa of festivita) {
      if (festa.anno) {
          if (festa.giorno === giorno && festa.mese === mese && festa.anno === anno) {
              return 1;
          }
      } else {
          if (festa.giorno === giorno && festa.mese === mese) {
              return 1;
          }
      }
  }

  const pasqua = calculateEaster(anno);
  const pasquetta = new Date(pasqua);
  pasquetta.setDate(pasquetta.getDate() + 1);

  if ((date.getDate() === pasqua.getDate() && date.getMonth() === pasqua.getMonth()) ||
      (date.getDate() === pasquetta.getDate() && date.getMonth() === pasquetta.getMonth())) {
      return 1;
  }

  return 0;
}

function calculateEaster(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

const festivita = [
  { giorno: 1, mese: 1 }, // Capodanno
  { giorno: 6, mese: 1 }, // Befana
  { giorno: 25, mese: 4 }, // Festa della Liberazione
  { giorno: 1, mese: 5 }, // Festa del Lavoro
  { giorno: 2, mese: 6},  // Festa della Republica
  { giorno: 15, mese: 8 }, // Ferragosto
  { giorno: 1, mese: 11 },//tutti i Santi
  { giorno: 8, mese: 12 },//La Madonna
  { giorno: 25, mese: 12 }, // Natale
  { giorno: 31, mese: 12 }, // San Silvestro
];