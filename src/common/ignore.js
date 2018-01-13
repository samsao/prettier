"use strict";

const fs = require("fs");
const ignore = require("ignore");
const path = require("path");

/**
 * Create the ignorer instance that can be used later to determine if
 * a given file path is ignored or not.
 *
 * @param {null|string|Array<string>} ignorePaths The ignore path(s) to use, can be `null` in
 * which case the default `.prettierignore` file is used, a string pointing to a path or
 * an array of strings pointing to multiple paths.
 *
 * @param {(error, ignorePath) => void} errorHandler An error handler function that will be called when
 * an error occurred while reading one of the ignored path. The function will be called with the `error`
 * object as the first argument and the absolute `ignoredPath` as the second argument.
 *
 * @returns An `Ignore` object that can later be used to determine if a path should be ignored of not.
 */
function createIgnorer(ignorePaths, errorHandler) {
  ignorePaths = ignorePaths || [".prettierignore"];
  if (!Array.isArray(ignorePaths)) {
    ignorePaths = [ignorePaths];
  }

  return ignorePaths
    .map(ignorePath => readIgnoreFile(ignorePath, errorHandler))
    .reduce(
      (ignorer, ignoreFileContent) => ignorer.add(ignoreFileContent),
      ignore()
    );
}

function readIgnoreFile(ignorePath, errorHandler) {
  const ignoreFilePath = path.resolve(ignorePath);
  let ignoreFileContent = "";

  try {
    ignoreFileContent = fs.readFileSync(ignoreFilePath, "utf8");
  } catch (readError) {
    if (readError.code !== "ENOENT") {
      errorHandler(readError, ignoreFilePath);
    }
  }

  return ignoreFileContent;
}

module.exports = {
  createIgnorer
};
