const { execSync } = require('child_process');
const path = require("path");

const currentDirectory = process.cwd();

const currentFolderName = path.basename(currentDirectory);

const executionFolder = path.resolve(`../${currentFolderName.replaceAll('-etc-node','-source-etc-node')}`);

execSync("npm run build",{cwd:executionFolder});


