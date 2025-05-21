
import { APIgetUserByCodiceFiscale, APIgetAbsencesSummaryByCodiceFiscale,APIwaucCercaPerCognome,APIwaucCercaPerCodiceFiscale } from "../../utils/apiUtils.js";


document.addEventListener("DOMContentLoaded", async function() {
    const apiUserURL = document.querySelector('script[type="module"]').getAttribute('apiUserURL');
    const codiceFiscale = document.querySelector('script[type="module"]').getAttribute('codiceFiscale');
    
    const container = document.getElementById("data-container");
    
    // Aggiungi lo spinner di caricamento
    container.innerHTML = `
        <div class="d-flex justify-content-center">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    `;
    
    try {
        const data = await APIwaucCercaPerCodiceFiscale(apiUserURL, codiceFiscale);
        
        if (!data || data.length === 0) {
            console.error("Nessun dato ricevuto");
            container.innerHTML = "<p>Nessun dato trovato.</p>";
            return;
        }
        
        // Pulisce il contenitore prima di inserire nuovi dati
        container.innerHTML = "";
        
        const user = data[0];
        
        const rows = [
            ["Codice Fiscale", user.codiceFiscale],
            ["Cognome", user.cognome],
            ["Nome", user.nome],
            ["Sesso", user.sesso],
            ["Data di Nascita", user.nascita?.data],
            ["Comune di Nascita", user.nascita?.comune],
            ["Provincia di Nascita", user.nascita?.provincia],
            ["Indirizzo Residenza", user.residenza?.indirizzo],
            ["CAP Residenza", user.residenza?.cap],
            ["Comune Residenza", user.residenza?.comune],
            ["Provincia Residenza", user.residenza?.provincia],
            ["Indirizzo Domicilio", user.domicilio?.indirizzo],
            ["CAP Domicilio", user.domicilio?.cap],
            ["Comune Domicilio", user.domicilio?.comune],
            ["Provincia Domicilio", user.domicilio?.provincia],
            ["Contatti", user.contatti?.join(", ")],
            ["Sede", user.sede?.descrizione]
        ];
        
        rows.forEach(([label, value]) => {
            const row = `<tr><th>${label}</th><td>${value || "N/A"}</td></tr>`;
            container.innerHTML += row;
        });
        
    } catch (error) {
        console.error("Errore durante il caricamento dei dati:", error);
        container.innerHTML = "<p>Si è verificato un errore durante il caricamento dei dati.</p>";
    }
});