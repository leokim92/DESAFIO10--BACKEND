const mongoose = require ("mongoose");
const configObject = require ("./config/config.js");
const { mongo_url } = configObject;

class BaseDatos {
    static #instance;

    constructor() {
        mongoose.connect(mongo_url);
    }

    static getInstancia() {
        if (this.#instance) {
            console.log("previous connection");
            return this.#instance;
        }

        this.#instance = new BaseDatos();
        console.log("Connection generated");
        return this.#instance;
    }

}

module.exports = BaseDatos.getInstancia();
