const fs = require("fs");
const path = require("path");
const { program } = require("commander");
const { COMMAND_DIR } = require("./utils/constant");

module.exports = async () => {
  const commandNames = fs.readdirSync(COMMAND_DIR);
  for (const commandName of commandNames) {
    require(path.join(COMMAND_DIR, commandName))(program);
  }
  await program.parseAsync(process.argv);
};
