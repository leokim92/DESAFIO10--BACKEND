const bcrypt = require("bcrypt");

//createHash: aplicar el hash al password.
const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

//comparar el password proporcionado por la base de datos.
const isValidPassworld = (password, user) => bcrypt.compareSync(password, user.password);

module.exports = {createHash, isValidPassworld};