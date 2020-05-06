function rollDice(sides, min = 1) {
    return Math.floor(Math.random() * (sides - min + 1)) + min; //we assume the minimum is always 1
}

function test() {
    for (let i = 1; i < rollDice(6); i++){
        var newTable = document.createElement("table");
        var newContent = document.createTextNode("+");
        newTable.appendChild(newContent);
        var currentElem = document.getElementById("map");
        document.body.insertBefore(newTable, currentElem);
        console.log(i);
    }
};

function mapTest() {
    var mapArray = [[1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,0,0],[1,1,1,1,0,1,1,1,0,1]];
    
    var currentElem = document.getElementById("mapDiv");
    var mapTable = document.getElementById("mapTable");
    var newRow = document.createElement("tr");
    var newCol = document.createElement("td");
    
    for (let i = 0; i < mapArray.length; i++ ) {
        //console.log(mapArray[i]);
        
        var newRow = mapTable.insertRow(i);
        newRow.setAttribute("id", "mapRow");

        for (let j = 0; j < mapArray[i].length; j++) {
            //console.log(mapArray[i][j])
            
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