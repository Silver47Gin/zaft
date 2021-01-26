module.exports = (program) =>
  program.command("helloworld").action(async () => console.log("helloworld"));
