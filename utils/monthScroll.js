document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('previousMonth').addEventListener('click', previousMonth);
    document.getElementById('nextMonth').addEventListener('click', nextMonth);
    // console.log("XXXXXXXXXXXXXXXXXXXXXXX DOMContentLoaded")
    // Imposta il valore dell'input del mese al mese e all'anno correnti
    const currentDate = new Date();
    console.log("++++++++++++++ data corrente",currentDate);
    const currentMonth = currentDate.getMonth() + 1;
    console.log("++++++++++++++ mese corrente",currentMonth);
    const currentYear = currentDate.getFullYear();
    console.log("++++++++++++++ anno corrente",currentYear);
    const formattedDate = `${currentYear}-${currentMonth.toString().padStart(2, '0')}`;
    console.log("++++++++++++++ formattedDate",formattedDate);
    document.getElementById('monthSelector').value = formattedDate;
  
    // Aggiorna le intestazioni della tabella al caricamento della pagina
    updateTableHeaders();
  });
  
  function updateTableHeaders() {
    const tableHeader = document.getElementById('tableHeader');
    if (!tableHeader) return; // Verifica se l'elemento esiste
  
    const monthSelector = document.getElementById('monthSelector');
    const selectedDate = new Date(monthSelector.value);
    const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
    //console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxx aysInMonth =",daysInMonth )
  
    tableHeader.innerHTML = '<tr><th></th>'; // Resetta le intestazioni della tabella
  
    // Aggiunge le intestazioni per ogni giorno del mese
    for (let i = 1; i <= daysInMonth; i++) {
      tableHeader.innerHTML += `<th class="text-center <%= isNonWorkingDay(new Date(${selectedDate.getFullYear()}, ${selectedDate.getMonth()}, ${i})) ? 'bg-light' : '' %>">${i}</th>`;
    }
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

    let month = date.getMonth();
    let year = date.getFullYear();
    let totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    console.log("******************* totalDaysInMonth =",totalDaysInMonth )
  
    updateTableHeaders();
  }
  
  // Funzione per formattare la data nel formato corretto per il campo di input month
  function formatDate(date) {
    let month = date.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    return date.getFullYear() + '-' + month;
  }
  