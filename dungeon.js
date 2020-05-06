function rollDice(max, min) { //basic randomizer
    return Math.floor(Math.random() * (max - min + 1)) + min; 
}

function mapBuild(height = 5, width = 10) {
    //2d array to hold map information
    //0 = mapCellSpace, ie walkable tile
    //1 = mapCellWall, ie impassable tile
    //will add further values for other options later
    var mapArray = [];
    var row = [];

    for (let i = 0; i < height; i++) { //rows
        for (let j = 0; j < width; j++) { //cols
            row.push(rollDice(1,0));
        }
        mapArray.push(row);
        row = [];
    }
    return mapArray;
}

function mapDisplay() {
    //setup map dims from html form
    let mapHeight = document.getElementById('height').value;
    let mapWidth = document.getElementById('width').value;

    var mapArray = mapBuild(mapHeight, mapWidth);
    
    const currentElem = document.getElementById("mapDiv");
    const mapTable = document.getElementById("mapTable");
    
    //clears old map, if it exists
    while(mapTable.firstChild) {
        mapTable.removeChild(mapTable.firstChild);
    }
    
    //draw the map out
    for (let i = 0; i < mapArray.length; i++ ) {
        var newRow = mapTable.insertRow(i);
        newRow.setAttribute("id", "mapRow");

        for (let j = 0; j < mapArray[i].length; j++) {
            var newCell = newRow.insertCell(j);
            if (mapArray[i][j] == 1) {
                newCell.setAttribute("id", "mapCellWall");
            }
            else {
                newCell.setAttribute("id", "mapCellSpace");
            }
        }
    }
}

