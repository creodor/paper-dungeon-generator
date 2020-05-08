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
    let innerRoom = GenerateSquareArray(height, width, 0, 0);
    let roomWrapTopBottom = GenerateSquareArray(1, width, 1, 1);
    //adds the top/bottom walls
    innerRoom.unshift(roomWrapTopBottom[0]);
    innerRoom.push(roomWrapTopBottom[0]);
    
    for (let i = 1; i < innerRoom.length; i++) {
        innerRoom[i].unshift({
            cellValue: 1,
        });
        innerRoom[i].push({
            cellValue: 1,
        });
    }
    return innerRoom;
}

function GenerateSquareArray(height = 5, width = 10, max = 1, min = 1) {
    //2d array to hold map information
    //0 = mapCellSpace, ie walkable tile
    //1 = mapCellWall, ie impassable tile
    //will add further values for other options later
    let mapArray = [];
    var row = [];
    
    for (let i = 0; i < height; i++) { //rows
        for (let j = 0; j < width; j++) { //cols
            if (max == 1 && min == 1) { //replace with .fill()
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

function FullMap(height = 5, width = 10) {
    let min = 1;
    let max = 1;
    let fullMap = GenerateSquareArray(height, width, max, min);
    
    /*
    iterate over fullMap
    temporarily: create a set number of rooms of set sizes
    let's say, 3 rooms, 2x2, 3x4, 5x5
    pick a location for those rooms to exist (can be predetermined atm)
    get that index. use that index as the start for the iteration.
    overwrite the fullMap array with the room array based on that index.
    */
    var room = GenerateSquareArray(2, 2, 0, 0);

    for (let i = 5; i < 7 ; i++) {
        for (let j = 5; j < 7; j++) {
            fullMap[i][j] = room[i-5][j-5];
            console.log("i " + i + " j " + j);
            console.log(fullMap[i][j]);
            console.log(room[i-5][j-5]);
        }
    }

    room = GenerateSquareArray(3, 4, 0, 0);

    for (let i = 10; i < 13 ; i++) {
        for (let j = 10; j < 14; j++) {
            fullMap[i][j] = room[i-10][j-10];
            console.log("i " + i + " j " + j);
            console.log(fullMap[i][j]);
            console.log(room[i-10][j-10]);
        }
    }

    return fullMap;
}

//converts the map array into a table to display
function MapDisplay() {
    //setup map dims from html form
    let mapHeight = document.getElementById('height').value;
    let mapWidth = document.getElementById('width').value;

    
    var mapArray = FullMap(mapHeight, mapWidth); //GenerateSquareArray(mapHeight, mapWidth, max, min);
    const currentElem = document.getElementById("mapDiv");
    const mapTable = document.getElementById("mapTable");
    
    //random array merging test area
    let testArr1 = [[1,1,1,1,1],[0,0,0,0,0]];
    let testArr2 = [[0,0,0,0,0],[1,1,1,1,1]];

    //get length of main array, len of room array (inner & outer)
    //pick location in main array to start placing room array
    //


    //end test area

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
