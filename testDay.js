function isNonLavorativo(date, festivita) {
    // Controlla se festivita è un array
    if (!Array.isArray(festivita)) {
        throw new TypeError("festivita must be an array");
    }

    // Controlla se è sabato (6) o domenica (0)
    if (date.getDay() === 6 || date.getDay() === 0) {
        return 1;
    }

    // Estrae giorno e mese dalla data
    const giorno = date.getDate();
    const mese = date.getMonth() + 1; // getMonth() ritorna 0-based, quindi +1
    const anno = date.getFullYear();

    // Controlla se la data è una festività
    for (const festa of festivita) {
        if (festa.anno) {
            // Se la festività è specifica per anno
            if (festa.giorno === giorno && festa.mese === mese && festa.anno === anno) {
                return 1;
            }
        } else {
            // Se la festività è ricorrente ogni anno
            if (festa.giorno === giorno && festa.mese === mese) {
                return 1;
            }
        }
    }

    return 0;
}

// Esempio di utilizzo
const festivita = [
    { giorno: 1, mese: 1 }, // Capodanno
    { giorno: 25, mese: 4 }, // Festa della Liberazione
    { giorno: 1, mese: 5 }, // Festa del Lavoro
    { giorno: 15, mese: 8 }, // Ferragosto
    { giorno: 25, mese: 12 }, // Natale
    { giorno: 31, mese: 12 }, // San Silvestro
    { giorno: 21, mese: 4, anno: 2024 }, // Pasqua 2024
    { giorno: 12, mese: 4, anno: 2025 } // Pasqua 2025
];

const data = new Date('2024-05-21'); // Data di esempio: Pasqua 2024

    const risultato = isNonLavorativo(data, festivita);
    console.log(data)
    console.log(risultato); // Output: 1 (poiché è una festività)
