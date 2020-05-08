/*
iterate through the desired size grid to assign values to the whole array. then, operate the logic of the procgen against an already existent array,
modifying values in given locations as indicated until you have a map
that way instead of trying to generate it in array-order it can be generated in logic-order

may have to call each item in your array a "room", with a value indicating what kind of room it is. basically generate the overall layout first
will have to do some fancy record-keeping to keep track of where all of the exits of the rooms are
possibly with a queue
that could also lead to the grid size being less of a direct tile count limit and more of a complexity limit
which might be better, also
*/

/*
probably need to treat a 3x3 area of tiles as one room
or draw one tile as 3x3 visual tiles
and yes, it's fully possible i'll need to make each display-tile multiple smaller tiles to contain symbols and visual data
in theory that shouldn't be too hard
*/

//basic randomizer
function RollDice(max, min) {
    return Math.floor(Math.random() * (max - min + 1)) + min; 
}

function RoomGenerator(height = 5, width = 10){
    let innerRoom = MapModifier(height, width, 0, 0);
    let roomWrapTopBottom = MapModifier(1, width-2, 1, 1); //the -2 is a magic number. idk why it makes it work right. need to figure it out.
    //adds the top/bottom walls
    innerRoom.unshift(roomWrapTopBottom[0]);
    innerRoom.push(roomWrapTopBottom[0]);
    
    //adds the left and right walls. something here is wrong, 'fixed' by the magic number above
    for (let i = 0; i < innerRoom.length; i++) {
        innerRoom[i].unshift({
            cellValue: 1,
        });
        innerRoom[i].push({
            cellValue: 1,
        });
    }
        
    return innerRoom;
}



function MapModifier(height = 5, width = 10, max = 1, min = 1) {
    //2d array to hold map information
    //0 = mapCellSpace, ie walkable tile
    //1 = mapCellWall, ie impassable tile
    //will add further values for other options later
    let mapArray = [];
    var row = [];

    for (let i = 0; i < height; i++) { //rows
        for (let j = 0; j < width; j++) { //cols
            if (max == 1 && min == 1) {
                row.push({
                    cellValue: 1,
                });
            }
            else if (max == 0 && min == 0) { 
                row.push({
                    cellValue: 0,
                });
            }
            else {
                row.push({
                    cellValue: RollDice(max, min),
                });
            }
        }
        mapArray.push(row);
        row = [];
    }
    return mapArray;
}

//converts the map array into a table to display
function MapDisplay() {
    //setup map dims from html form
    let mapHeight = document.getElementById('height').value;
    let mapWidth = document.getElementById('width').value;
    let min = 0
    let max = 1
    
    var mapArray = RoomGenerator(mapHeight, mapWidth); //MapModifier(mapHeight, mapWidth, max, min);
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
            if (mapArray[i][j].cellValue == 1) {
                newCell.setAttribute("id", "mapCellWall");
            }
            else {
                newCell.setAttribute("id", "mapCellSpace");
            }
        }
    }
}

