// waucService.js

const ricercaPerUsername = async (username) => {
  const baseUrl = 'https://wauc.dipvvf.it/api/';
  const accountName = username;
  const url = `${baseUrl}personale/?accountName=${accountName}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error;
  }
};

const ricercaPerCognome = async (cognome) => {
  const baseUrl = 'https://wauc.dipvvf.it/api/';
  const url = `${baseUrl}personale/?cognome=${cognome}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    const data = await response.json();

    // Ordinamento per cognome e poi per nome
    data.sort((a, b) => {
      if (a.cognome.toLowerCase() < b.cognome.toLowerCase()) return -1;
      if (a.cognome.toLowerCase() > b.cognome.toLowerCase()) return 1;
      if (a.nome.toLowerCase() < b.nome.toLowerCase()) return -1;
      if (a.nome.toLowerCase() > b.nome.toLowerCase()) return 1;
      return 0;
    });

    return data;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error;
  }
};
const ricercaAnagrafica =async (codiceFiscale)=>{
  const baseUrl = 'https://wauc.dipvvf.it/api/';
  const url = `${baseUrl}AnagraficaPersonale/?codiciFiscali=${codiceFiscale}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error;
  }
}; 

/*

public function ricercaAnagrafica($codFiscale) {
          $strResult = file_get_contents( WS_WAUC . "AnagraficaPersonale/?codiciFiscali=" . $codFiscale );
          $obj = json_decode( $strResult );

          return $obj;
*/

// Esporta le funzioni con module.exports
module.exports = {
  ricercaPerUsername,
  ricercaPerCognome,
  ricercaAnagrafica
};
