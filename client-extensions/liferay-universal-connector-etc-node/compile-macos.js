const {execSync} = require('child_process');
const fs = require('fs');
const path = require('path');


function copyFilesToFolder(files, destinationFolder) {
    files.forEach(file => {
        const sourceFilePath = path.join(__dirname, file); // Assuming files are in the same directory as this script
        const destinationFilePath = path.join(destinationFolder, path.basename(file));

        fs.copyFile(sourceFilePath, destinationFilePath, (err) => {
            if (err) {
                console.error(`Error copying ${file}: ${err}`);
            }
        });
    });
}

const files = ["action.js","index.js","esprima.js","module.js","application.json"];
const executionFolder = './dist/macos';

if (!fs.existsSync(executionFolder)){
    fs.mkdirSync(executionFolder, { recursive: true });
}

copyFilesToFolder(files,executionFolder)

try {

    execSync(`echo '{ "main": "index.js", "output": "sea-prep.blob" }' > sea-config.json`,{cwd: executionFolder})

    execSync('node --experimental-sea-config sea-config.json', {cwd: executionFolder});

    execSync('cp $(command -v node) server_macos', {cwd: executionFolder});

    execSync('codesign --remove-signature server_macos', {cwd: executionFolder});

    execSync('npx postject server_macos NODE_SEA_BLOB sea-prep.blob --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2 --macho-segment-name NODE_SEA', {cwd: executionFolder});

    execSync('codesign --sign - server_macos', {cwd: executionFolder});

    console.log('Server Compiled successfully.');

} catch (error) {

    console.error('Error executing commands:', error);

} finally {
    //fs.unlinkSync(path.join(executionFolder, 'sea-config.json'));
    //fs.unlinkSync(path.join(executionFolder, 'sea-prep.blob'));
    //fs.unlinkSync(path.join(executionFolder, 'index.js'));
}



