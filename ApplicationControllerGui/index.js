const { app, BrowserWindow } = require('electron')
const fs = require('fs')

function createWindow () {
  // Create the browser window.
  let win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  })

  createJSONIfApplicable()
  win.webContents.openDevTools()

  // and load the index.html of the app.
  win.loadFile('index.html')
}

function getFilePath(){
    console.log("Back in index")
    var path = dialog.showOpenDialog({
        properties: ['openDirectory']
    });
    console.log(path)
}


function createJSONIfApplicable(){
    if (!fs.existsSync('./programmableData.json')){
        var jsonObj = [];
        for (var i = 0; i < 10; i++){
            jsonObj.push({
                name: "button-" + (i + 1).toString(),
                websiteOperations: [],
                fileOperations: []
            })
        }
        fs.writeFile('programmableData.json', JSON.stringify(jsonObj), function (err) {
            if (err) throw err;
            console.log('File is created successfully.');
        });
    }
}

function overWriteJSON(jsonStr){
    fs.writeFile('programmableData.json', jsonStr, function (err) {
        if (err) throw err;
        console.log('File is created successfully.');
    });
}

function getJSONData(){
    var content;
    var data = fs.readFileSync('./programmableData.json', "utf8")
    return data
}

module.exports.getFilePath = getFilePath
module.exports.getJSONData = getJSONData
module.exports.overWriteJSON = overWriteJSON


app.on('ready', createWindow)


