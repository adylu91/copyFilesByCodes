const prompts = require("prompts");

const mainMenu = async (dataObj) => {
  const response = await prompts({
    type: "number",
    name: "menuOption",
    message: `Menu:
        1: wklej ścieżkę wyszukiwania ${
          dataObj.searchingPath.length !== 0
            ? " || " + dataObj.searchingPath
            : ""
        }
        2: wklej ścieżkę zapisu ${
          dataObj.savePath.length !== 0 ? " || " + dataObj.savePath : ""
        }
        3: wklej ścieżkę symboli do pliku z symbolami ${
          dataObj.codesListFilePath.length !== 0
            ? " || " + dataObj.codesListFilePath
            : ""
        }
        4: uruchom
        0: zakończ
        `,
  });

  const { app } = require("./app");
  const { menuOption } = response;
  switch (menuOption) {
    case 1:
      await (async () => {
        const response = await prompts({
          type: "text",
          name: "searchingPath",
          message: "Podaj ściężkę: ",
        });
        dataObj.searchingPath = response.searchingPath;
        app();
      })();
      break;

    case 2:
      await (async () => {
        const response = await prompts({
          type: "text",
          name: "savePath",
          message: "Podaj ściężkę: ",
        });
        dataObj.savePath = response.savePath;
        app();
      })();
      break;

    case 3:
      await (async () => {
        const response = await prompts({
          type: "text",
          name: "codesListFilePath",
          message: "Podaj ścieżkę: ",
        });
        dataObj.codesListFilePath = response.codesListFilePath;
        app();
      })();
      break;

    case 4:
      app("run");
      break;

    case 0:
      return;

    default:
      return;
  }
};

module.exports = { mainMenu };
