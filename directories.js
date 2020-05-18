/* eslint-disable no-console */
console.log('Please enter your commands. Press Ctrl + C to quit.');

const ACTIONS = {
    CREATE: 'CREATE',
    MOVE: 'MOVE',
    LIST: 'LIST',
    DELETE: 'DELETE',
};
let dirTree = {};
let userInput = process.stdin;
userInput.setEncoding('utf-8');

userInput.on('data', (data) => {
    const args = data.split(/\s/);
    const cmd = args[0].toUpperCase();

    if(!ACTIONS[cmd]) console.log(`This command is invalid: ${cmd}`);

    let arg = args.slice(1);
    processCommand(cmd, dirTree, arg);
});

const processCommand = (cmd, dirTree, args) => {
    if(!args || !args.length) return;
    const dirName = args[0];

    switch (cmd) {
    case ACTIONS.CREATE:
        createFolder(dirTree, dirName);
        break;
    case ACTIONS.LIST:
        listDirectories(dirTree);
        break;
    case ACTIONS.MOVE:
        moveFolder(dirTree, args);
        break;
    case ACTIONS.DELETE:
        removeFolder(dirTree, dirName);
        break;
    }
};

const createFolder = (dirTree, dirName) => {
    if (!dirTree || !dirName) console.log('The directory tree and the director name must be provided.');
    dirName = dirName.split('/');

    dirName.forEach(dir => {
        if(!dirTree[dir]) {
            dirTree[dir] = {};
        }

        dirTree = dirTree[dir];
    });
};

const moveFolder = (dirTree, args) => {
    let [folderToMove, pathToMoveTo] = args;
    let key, tempDir;

    if(folderToMove && pathToMoveTo) {
        let currentDir = dirTree;
        const path = folderToMove.split('/');

        for(let i = 0; i < path.length; i++) {
            const dir = path[i];
            if(!currentDir[dir]) {
                return console.log(`Unable to move ${folderToMove}: the ${dir} folder is not found.`);
            }

            if(i < path.length - 1) {
                currentDir = currentDir[dir];
            } else {
                key = dir;
                tempDir = currentDir[dir];
                delete currentDir[dir];
            }
        }
    }

    if(pathToMoveTo && tempDir) {
        let currentDir = dirTree;
        const path = pathToMoveTo.split('/');
        path.forEach((dir) => {
            if(!currentDir[dir]) {
                currentDir[dir] = {};
            }
            currentDir = currentDir[dir];
        });

        currentDir[key] = tempDir;
    }
};

const listDirectories = (dirTree) => {
    // list in alphabetical order
    const sortedTree = {};
    Object.keys(dirTree).sort().forEach(key => sortedTree[key] = dirTree[key]);

    console.log(JSON.stringify(sortedTree, null, 2).replace(/[*{}":,]/g, ''));
};

const removeFolder= (currentDir, dirPath) => {
    const path = dirPath.split('/');
    for(let i = 0; i < path.length ; i++) {
        const dir = path[i];
        if(!currentDir[dir]) {
            return console.log(`Cannot delete ${dirPath} - ${dir} does not exist.`);
        }

        if(i < path.length - 1) {
            currentDir = currentDir[dir];
        } else {
            delete currentDir[dir];
        }
    }
};

module.exports = { createFolder, moveFolder, removeFolder, listDirectories};
