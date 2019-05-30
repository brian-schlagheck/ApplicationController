const { remote } = require('electron');
const mainProcess = remote.require('./index.js');
const {dialog} = require('electron').remote;

function buttonClick(event){
    console.log(event.id)
    localStorage.setItem("buttonId", event.id)
    resetForm()
    getFileDataIfApplicable()
}

function browseForLocation(){
    let path = dialog.showOpenDialog({
        properties: ['openFile']
    });
    if (path != undefined && path != "undefined"){
        path = "file - " + path
        console.log(path)
        addToList(path)
    }
}

window.onload = function(){
    localStorage.setItem("buttonId", undefined)
}

function addWebsite(){
    console.log("Website")
    document.getElementById("btn-add-website").style.backgroundColor = "#4CAF50"
    document.getElementById("btn-add-exe").style.backgroundColor = "white"
    document.getElementById("website-location").style.display = 'inline';
    document.getElementById("btn-submit-website").style.display = 'inline';
    document.getElementById("btn-add-exe").style.color = "black"
    document.getElementById("btn-add-website").style.color = "white"
}

function addExecutable(){
    document.getElementById("btn-add-exe").style.backgroundColor = "#4CAF50"
    document.getElementById("btn-add-exe").style.color = "white"
    document.getElementById("btn-add-website").style.backgroundColor = "white"
    document.getElementById("btn-add-website").style.color = "black"
    document.getElementById("website-location").style.display = 'none';
    document.getElementById("btn-submit-website").style.display = 'none';
    browseForLocation()
    resetToggleSwitches()
}

function resetToggleSwitches(){
    document.getElementById("btn-add-website").style.backgroundColor = "white"
    document.getElementById("btn-add-exe").style.backgroundColor = "white"
    document.getElementById("btn-add-website").style.color = "black"
    document.getElementById("btn-add-exe").style.color = "black"
}

function addToList(data){
    var ul = document.getElementById("operation-list")
    var li = document.createElement("li");
    li.setAttribute("class", "removable")
    li.setAttribute("onclick", "removeOperation(this)")
    li.appendChild(document.createTextNode(data));
    ul.appendChild(li);
}

function addWebsiteToList(){
    console.log(document.getElementById("website-location").value)
    var website = document.getElementById("website-location").value
    if (website != undefined && website != "" && website != null){
        console.log("Adding to list")
        website = "web - " + website
        addToList(website)
    }
}

function removeOperation(event){
    event.parentNode.removeChild(event);
}

function resetForm(){
    document.getElementById("operation-list").innerHTML = "";
    resetToggleSwitches()
    document.getElementById("website-location").style.display = 'none';
    document.getElementById("btn-submit-website").style.display = 'none';
}

function submitForm(){
    var fileOperationArray = []
    var webOperationArray = []
    var lis = document.getElementById("operation-list").getElementsByTagName("li");
    for (var i = 0; i < lis.length; i++){
        if (lis[i].innerText.startsWith("web - ")){
            webOperationArray.push(lis[i].innerText.replace("web - ", ""))
        }
        else {
            fileOperationArray.push(lis[i].innerText.replace("file - ", ""))
        }
    }
    constructJSON(fileOperationArray, webOperationArray)
}

function constructJSON(fileArray, webArray){
    console.log(fileArray)
    console.log(webArray)
    existingJSONObject = getExistingJSON()
    var buttonId = localStorage.getItem("buttonId")
    console.log(buttonId)
    if (buttonId != undefined && buttonId != "undefined" && buttonId != null && buttonId != ""){
        console.log(buttonId + " is defined")
        for (var i = 0; i < existingJSONObject.length; i++){
            if (existingJSONObject[i].name == buttonId){
                existingJSONObject[i].websiteOperations = webArray
                existingJSONObject[i].fileOperations = fileArray
                console.log(existingJSONObject)
                console.log("Found " + buttonId)
                mainProcess.overWriteJSON(JSON.stringify(existingJSONObject))
            }
        }
    }
    else {
        console.log("no button selected")
        alert("Please select a button")
    }
}
    
function getExistingJSON(){
    var strJson = mainProcess.getJSONData()
    return JSON.parse(strJson)
}

function getFileDataIfApplicable(){
    JSONObject = getExistingJSON();
    buttonId = localStorage.getItem("buttonId")
    console.log(JSONObject)
    for (var i = 0; i < JSONObject.length; i++){
        console.log(JSONObject[i].name)
        if (JSONObject[i].name == buttonId){
            console.log("Found existing data")
            addArraysToList(JSONObject[i].websiteOperations, JSONObject[i].fileOperations)
        }
    }
}

function addArraysToList(websiteOperations, fileOperations){
    for (var i = 0; i < websiteOperations.length; i++){
        addToList("web - " + websiteOperations[i])
    }
    for (var i = 0; i < fileOperations.length; i++){
        addToList("file - " + fileOperations[i])
    }
}