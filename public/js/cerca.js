import { listaGiustificativi } from "../../utils/giustificativiAssenze.js";
import { ricercaPerCognome, ricercaPerUsername } from "../../utils/serviziWauc.js";
import { APIgetUserByCodiceFiscale, APIgetAbsencesSummaryByCodiceFiscale,APIwaucCercaPerCognome,APIwaucCercaPerCodiceFiscale } from "../../utils/apiUtils.js";

document.addEventListener('DOMContentLoaded', async function() {
    // const hostApi= document.querySelector('script[type="module"]').getAttribute('apiUserURL');
    // let codiceFiscale="NTRNRC80S15G273K"
    // let startDate="2024-07-01"
    // let endDate="2024-08-25"
    // let test = await APIgetAbsencesSummaryByCodiceFiscale(hostApi, codiceFiscale, startDate, endDate)
   
    
    showTable()
})
async function showTable(){
    document.getElementById('createTable').addEventListener('click', async function() {

        const hostApi= document.querySelector('script[type="module"]').getAttribute('apiUserURL');
        let cognome=document.getElementById("cognome").value 
        let resultWaucService = await APIwaucCercaPerCognome(hostApi,cognome)
        updateTable(resultWaucService)

    })
    document.getElementById("cognome").addEventListener("keydown", async function(event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Previene il comportamento predefinito
            const hostApi= document.querySelector('script[type="module"]').getAttribute('apiUserURL');
            //let cognome=document.getElementById("cognome").value 
            let resultWaucService = await APIwaucCercaPerCognome(hostApi,this.value)
            updateTable(resultWaucService)
        }
    });
}
async function updateTable(listaDip){
    // Simulazione dell'array di dati ottenuti
    // const datiAssenze = [
    //     { _id: 'CS42', codiceGiustificativo: 'CS42', totale: 3 },
    //     { _id: 'MR', codiceGiustificativo: 'MR', totale: 1 },
    //     { _id: 'Ap', codiceGiustificativo: 'Ap', totale: 1 },
    //     { _id: 'L.104', codiceGiustificativo: 'L.104', totale: 1 },
    //     { _id: 'M', codiceGiustificativo: 'M', totale: 1 },
    //     { _id: 'CO', codiceGiustificativo: 'CO', totale: 1 },
    //     { _id: 'BO', codiceGiustificativo: 'BO', totale: 2 }
    // ];

    // Seleziona il corpo della tabella
    const tbody = document.getElementById('tabellaRiepilogativa').getElementsByTagName('tbody')[0];

    // Pulisci il contenuto esistente
    tbody.innerHTML = '';

    // Popola la tabella con i dati ottenuti
    listaDip.forEach((elemento, indice) => {
        // Crea una nuova riga
        const row = document.createElement('tr');

        // Crea la cella per l'indice
        const th = document.createElement('th');
        th.scope = 'row';
        th.textContent =elemento.codiceFiscale //indice + 1; // 1-based index
        row.appendChild(th);

        // Crea la cella per il codice giustificativo
        const tdCognome = document.createElement('td');
        tdCognome.textContent = elemento.cognome;
        row.appendChild(tdCognome);

        // Crea la cella per il totale
        const tdNome = document.createElement('td');
        tdNome.textContent = elemento.nome;
        row.appendChild(tdNome);

        const tdAccount = document.createElement('td');
        tdAccount.textContent = elemento.accountDipvvf;
        row.appendChild(tdAccount);

        const tdEmail = document.createElement('td');
        tdEmail.textContent = elemento.emailVigilfuoco;
        row.appendChild(tdEmail);

        const tdQualifica = document.createElement('td');
        tdQualifica.textContent = elemento["qualifica"]["descrizione"];
        row.appendChild(tdQualifica);

        const tdSede = document.createElement('td');
        tdSede.textContent = elemento["sede"]["descrizione"];
        row.appendChild(tdSede);
        // Creazione del pulsante Bootstrap
        const tdButton = document.createElement('td');
        const button = document.createElement('button');
        button.className = 'btn btn-secondary'; // Bootstrap class for a gray button
        button.id = elemento.codiceFiscale;
        button.innerHTML = '<i class="bi bi-person"></i>'; // Bootstrap arrow icon
        
        // Event listener per il click del pulsante
        button.addEventListener('click', function() {
            console.log('Pulsante cliccato per:', this.id);
            // Aggiungi qui eventuale logica aggiuntiva
            //const apiUserURL = document.querySelector('script[type="module"]').getAttribute('apiUserURL');
            
            const url = `/tabellaDipendente?codiceFiscale=${this.id}`; 
            const windowFeatures = "width=800,height=600,resizable,scrollbars";
    
        window.open(url, "_blank", windowFeatures);
        }); 
        tdButton.appendChild(button);
        row.appendChild(tdButton);

        // Aggiungi la riga alla tabella
        tbody.appendChild(row);
    });
}
