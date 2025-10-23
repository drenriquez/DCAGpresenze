const UserDao = require('../dao/userDao');
//const userDao=new UserDAO("350VF")

const resolvers = {


 getAllUsersInOrdineCognome: async () => {
    try {
        const userDao = new UserDao();
        await userDao.initializeDatabase();
        const users = await userDao.getAllUsersInOrdineCognome();
        return users;
      } catch (error) {
        console.error("Error fetching users:", error);
        throw new Error("Unable to fetch users");
      }
    },
  getAllUsersAssenzePerAnnoEMese: async ({anno,mese}) => {
    try {
      console.log("test resolver getAllUsersAssenzePerAnnoEMese")
        const userDao = new UserDao();
        await userDao.initializeDatabase();
        const users = await userDao.getAllUsersAssenzePerAnnoEMese(anno,mese);
        return users;
      } catch (error) {
        console.error("Error fetching users:", error);
        throw new Error("Unable to fetch users");
      }
    },
/* -------------------------------------------------------------------------------------------------

                          MUTATION
------------------------------------------------------------------------------------------------------*/




};

module.exports = resolvers;
