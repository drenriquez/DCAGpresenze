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

  const APIaddAbsenceById = async (host, id, data, motivo) => {
    try {
      const response = await fetch(`${host}api/users/addAbsenceById`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin', // Assicura l'invio dei cookie con la richiesta
        body: JSON.stringify({ id, data, motivo })
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const user = await response.json();
      return user;
    } catch (error) {
      console.error('Error adding absence:', error);
      throw error;
    }
  };

  const APIdeleteAbsenceById = async (host, id, data) => {
    try {
      const response = await fetch(`${host}api/users/deleteAbsenceById`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin', // Assicura l'invio dei cookie con la richiesta
        body: JSON.stringify({ id, data })
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const user = await response.json();
      return user;
    } catch (error) {
      console.error('Error deleting absence:', error);
      throw error;
    }
  };
  export {
    APIgetAllUsersInOrdineCognome,
    APIaddAbsenceById,
    APIdeleteAbsenceById
  };