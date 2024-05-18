const CrudRepository = require("./crud-repo");
const { Role } = require("../models");

class RoleRepository extends CrudRepository {
  constructor() {
    super(Role );
  }

  async getRoleByName(name) {
    const role = await Role.findOne({ where: { name: name } });
    return role;
  }
}

module.exports = RoleRepository;
