function rollDice(sides, min = 1) {
    return Math.floor(Math.random() * (sides - min + 1)) + min; //we assume the minimum is always 1
}

function mapDisplay() {
    //2d array to hold map information
    //0 = mapCellSpace, ie walkable tile
    //1 = mapCellWall, ie impassable tile
    //will add further values for other options later
    var mapArray = [[1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,0,0],[1,1,1,1,0,1,1,1,0,1]];
    
    var currentElem = document.getElementById("mapDiv");
    var mapTable = document.getElementById("mapTable");
    var newRow = document.createElement("tr");
    var newCol = document.createElement("td");

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