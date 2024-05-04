const CrudRepository = require("./crud-repo");
const { User } = require("../models");

class UserRepository extends CrudRepository {
  constructor() {
    super(User);
  }

  async getUserByEmail(email){
    const user =  await User.findOne({where: {email: email}});
    return user;
  }
}

module.exports = UserRepository;
