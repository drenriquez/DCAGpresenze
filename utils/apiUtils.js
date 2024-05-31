const APIgetAllUsersInOrdineCognome = async (host) => {
    try {
        //console.log("++++++++++++++++++++++",host)
        const response = await fetch(`${host}api/users/ordinaCognome`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin' // Assicura l'invio dei cookie con la richiesta
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching user level:', error);
      throw error;
    }
  };
export{
    APIgetAllUsersInOrdineCognome
}