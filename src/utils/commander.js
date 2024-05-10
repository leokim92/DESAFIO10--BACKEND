const { Command } = require("commander");
const program = new Command();

program
    .option("--mode <mode>", "working mode", "production");
program.parse();

module.exports = program;
