const prompts = require("prompts");
const { foundFilesToArray } = require("./run");
const { mainMenu } = require("./menus");

const dataObj = {
  searchingPath: "",
  savePath: "",
  codesListFilePath: "",
};

const app = (e) => {
  if (e === "run") {
    const { searchingPath, savePath, codesListFilePath } = dataObj;
    if (
      searchingPath.length === 0 ||
      savePath.length === 0 ||
      codesListFilePath.length === 0
    ) {
      (async () => {
        const response = await prompts({
          type: "text",
          name: "alert",
          message:
            "Opcja 1, 2 lub 3 nie została wprowadzona!, naciśnij Enter aby kontynuować...",
        });
        app();
      })();
    } else {
      console.log("uruchamiam!");
      foundFilesToArray(dataObj);
    }
  } else {
    mainMenu(dataObj);
  }
};
app();

module.exports = { app };
