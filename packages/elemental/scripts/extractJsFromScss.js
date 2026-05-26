const fs = require("fs");
const path = require("path");
const scssToJson = require("./scssToJson/main");

function flattenObject(obj) {
  const flat = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      if (typeof value === 'object' && value !== null) {
        Object.assign(flat, flattenObject(value));
      } else {
        flat[key] = value;
      }
    }
  }

  return flat;
}

/**
 * 
 * @param {object} obj Object in which we need to remove $ sign from keys.
 * @returns new object with $ sign removed
 */
function removeDollarSign(obj) {
  const newObj = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = key.replace(/^\$/, '');
      newObj[newKey] = obj[key];
    }
  }
  return newObj;
}

const generateDefaultExportJS = (valueObj) => `
export default ${JSON.stringify(valueObj, null, 2)};
`;

const generateNamedExportJS = (valueObj) => {
  return Object.entries(valueObj).map(([key,value])=>{
    return `export const ${key} = ${JSON.stringify(value,null,2)};`;
  }).join("\n")
}

/**
 * 
 * @param {Array} variableFilePaths Array of scss file paths to generate single variable js file 
 * @param {string} targetFilepath File path to generate output js file
 * @param {boolean} needFlattenObj if true it will create flatten object otherwise it will create nested Object with given key
 */
function createJSFileFromScss(variableFilePaths = [], targetFilepath, needFlattenObj = true, isNamedExport = true) {

  if(!Array.isArray(variableFilePaths)) throw new Error("variableFilePaths should be an array");
  
  let result = {};

  variableFilePaths.forEach(({title, filePath})=>{
    const scssFilePath = path.resolve(__dirname, filePath);
    var valueObj = removeDollarSign(scssToJson(scssFilePath));

    result[title] = valueObj;
  })

  if(needFlattenObj){
    result = flattenObject(result);
  }

  let contentString = "";

  if(isNamedExport){
    contentString = generateNamedExportJS(result);
  } else {
    contentString = generateDefaultExportJS(result);
  }

  const outputFilePath = path.resolve(__dirname, targetFilepath);

  fs.writeFileSync(outputFilePath, contentString, {
    flag: "w",
    encoding: "utf-8",
  });
}

module.exports = createJSFileFromScss;
