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

//list of room array references, to more easily access & modify them
//yes it's a global. yes i'm a fraud for this all not being a class.
let roomList = [];

//basic randomizer
function RollDice(max, min) {
    return Math.floor(Math.random() * (max - min + 1)) + min; 
}

/* unused for now
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
*/

function GenerateSquareArray(height = 5, width = 10, max = 1, min = 1) {
    //2d array to hold map information
    let mapArray = [];
    var row = [];
    
    for (let i = 0; i < height; i++) { //rows
        for (let j = 0; j < width; j++) { //cols
            if (max == 1 && min == 1) { //replace with .fill()
                row.push({
                    cellValue: 1,
                });
            }
            else if (max == 0 && min == 0) { //replace with .fill()
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
    let roomMaxHeight = 10;
    let roomMaxWidth = 10;
    let roomCount = Math.floor((height*width)/((roomMaxHeight*roomMaxWidth)*2)); //this will probably need to be modified in the future

    //clear out roomList before generating a new map. will need to handle this differently later.
    roomList = [];
    //builds the roomList global array with random sized rooms
    for (let i = 0; i < roomCount; i++){
        let roomHeight = RollDice(roomMaxHeight, 3);
        let roomWidth = RollDice(roomMaxWidth, 3)
        roomList.push(GenerateSquareArray(roomHeight, roomWidth, 0, 0));
    }

    //two ways to approach this.
    //iterate over fullMap, and depending on randomizer values plop a room
    //room dims will be random. place it down, then go back to iterating the array
    //after the first room, check ahead in the array to see if it will overlap an
    //existing room. if so, either change dims, move the room, or cancel placement
    //when it's placed, save a reference into roomList
    //alternative:
    //generate a set of rooms initially, put them in roomList, possibly with
    //some metadata. number of rooms determined by map dimensions.
    //once a list is generated, THEN iterate fullMap placing the rooms
    //with this approach it would be technically possible to plan placement ahead
    //so that there isn't a risk of overlap.
    

//not sure how to do this so that it goes over the whole map while spitting out new rooms...
    //room-wise with a random starting i&j value on each pass?
    console.log("new run");

    for (let x = 0; x < roomList.length; x++) {
        var startCoordX = RollDice(width - roomList[x][0].length - 1, 1);
        var startCoordY = RollDice(height - roomList[x].length - 1, 1);
        console.log(startCoordX);
        console.log(startCoordY);

        for(let roomY = 0; roomY < roomList[x].length; roomY++) {
            //console.log("roomI " + roomI);
            //console.log("i " + i);
            for(let roomX = 0; roomX < roomList[x][roomY].length; roomX++) {
                //console.log("roomJ " + roomJ);
                //console.log("j " + j);
                fullMap[startCoordY + roomY][startCoordX + roomX] = roomList[x][roomY][roomX];
            }
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
