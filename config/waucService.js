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
      return data;
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      throw error;
    }
  };
  
  // Esporta le funzioni con module.exports
  module.exports = {
    ricercaPerUsername,
    ricercaPerCognome,
  };
  