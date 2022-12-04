const nff = require("node-find-files");
const { readFileSync, writeFileSync, copyFileSync } = require("fs");

/*refDataObj = referencja do obiektu z app.js:
const dataObj = {
  searchingPath: "",
  savePath: "",
  codesListFilePath: "",
};
 */
let refDataObj = {};

//resultsDataObj = obiekt do którego zostają zapisane wszystkie dane związane z uruchomieniem
const resultsDataObj = {
  pathsList: [],
  codesList: [],
};

/*
1. foundFilesToArray = stworzenie tablicy ścieżek dla folderu wyszukiwania +
czyszczenie obiektu resltsDataObj
sukces => przejście do funkcji codesListsToArray
błąd => przejście do menu głównego
 */
const foundFilesToArray = (dataObj) => {
  resultsDataObj.pathsList.length = 0; //clear
  resultsDataObj.codesList.length = 0; //clear

  refDataObj = dataObj;
  const { searchingPath } = refDataObj;
  const finder = new nff({
    rootFolder: searchingPath,
  });
  finder.on("match", function (strPath) {
    console.log(`Dodaje ściężkę do tablicy ${strPath}`);
    resultsDataObj.pathsList.push({
      fullPath: strPath,
      nameFile: strPath.split("\\").reverse()[0].split(".")[0],
      nameFileWithExtension: strPath.split("\\").reverse()[0],
      isPathToCopy: false,
    });
  });

  finder.on("complete", function () {
    console.log("Finished");
    // console.log(resultsDataObj.pathsList);
    codesListFileToArray();
  });
  finder.on("patherror", function (err, strPath) {
    console.log("Błąd ścieżki!");
    console.log("Error for Path " + strPath + " " + err); // Note that an error in accessing a particular file does not stop the whole show
  });
  finder.on("error", function (err) {
    console.log(
      "Błąd krytyczny [ścieżka wyszukiwania], przechodzę do głównego menu!"
    );
    console.log("Global Error " + err);
    const { app } = require("./app");
    app();
  });
  finder.startSearch();
};

/*
2. codeListFileToArray = stworzenie tablicy z pliku z kodami

sukces => przejście do funkcji filterData
błąd => przejście do menu głównego
 */
const codesListFileToArray = () => {
  const { app } = require("./app");
  try {
    const file = readFileSync(refDataObj.codesListFilePath, {
      encoding: "utf8",
      flag: "r",
    });
    file.split(/\r\n|\r|\n/).forEach((e) => {
      resultsDataObj.codesList.push({
        code: e,
        isFound: false,
      });
    });
    filterData();
  } catch (err) {
    console.log("Błąd krytyczny [lista kodów], przechodzę do głównego menu!");
    console.log(err);
    app();
  } finally {
    // console.log(resultsDataObj.codesList);
  }
};

/*
3. filterData = filtrowanie danych w oparciu o listę kodów, zmiany w tablicach codeList.isFound i pathList.isPathToCopy
sukces => przejście do funkcji copyFilesAndMakeLogFile
błąd => przejście do menu głównego
 */
const filterData = () => {
  const { app } = require("./app");
  try {
    const { pathsList, codesList } = resultsDataObj;
    pathsList.forEach((elPath) => {
      console.log("elPath:", elPath);
      codesList.forEach((elCode) => {
        if (elPath.nameFile.match(new RegExp(elCode.code, "i"))) {
          elCode.isFound = true;
          elPath.isPathToCopy = true;
        }
      });
    });
    copyFilesAndMakeLogFile();
  } catch (err) {
    console.log(
      err,
      "Błąd krytyczny [filtrowanie danych], przechodzę do głównego menu!"
    );
    app();
  }
};

/*
4. copyFilesAndMakeLogFile
 */
const copyFilesAndMakeLogFile = () => {
  try {
    const { app } = require("./app");
    const makeLogFile = () => {
      const savePathName = refDataObj.savePath + "\\" + "log.txt";

      writeFileSync(savePathName, "Nie znaleziono następujących symboli:\n", {
        flag: "as",
      });
      resultsDataObj.codesList.forEach((el) => {
        el.isFound === false &&
          writeFileSync(savePathName, `${el.code} \n`, {
            flag: "as",
          });
      });
    };
    const copyFiles = () => {
      resultsDataObj.pathsList.forEach((el) => {
        if (el.isPathToCopy) {
          const savePathName =
            refDataObj.savePath + "\\" + el.nameFileWithExtension;
          copyFileSync(el.fullPath, savePathName);
          console.log(`skopiowano plik ${savePathName}`);
        }
      });
    };
    makeLogFile();
    copyFiles();
    console.log("Kopiowanie zakończone");
    app();
  } catch (err) {
    const { app } = require("./app");
    console.log(
      err,
      "Błąd krytyczny [kopiowanie danych], przechodzę do głównego menu!"
    );
    app();
  }
};

module.exports = { foundFilesToArray };
