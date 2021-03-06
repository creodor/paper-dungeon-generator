/*
general ideas/suggestions:
make tile lines a toggle (in the html/css, probably)
create two maps, one for GM and one for players with different data revealed 
- create the player map before the pass that adds hidden features
OR
- create whole map, mark hidden features, then remove those on the player map
OR
- a toggle to show/hide hidden features on the same map
label rooms/doors with numbers/letters
generation requirements, ie minimum and maximum values for things like rooms, treasure, encounters, etc.
possibly a 'try to' that the map will treat as a soft minimum?
more organic/rounded rooms? probably would require a total rework of the core generation function.
*/

/*
just sitting here thinking on it, probably determine the outer edge of two rooms, then try to draw a line between them based on coords. as necessary, include 90 degree turns. that seems the most direct/simplest way.
it's also the least interesting
HessuuToday at 2:41 PM
I think the higher level logic is to first pick a random room and move it to a list of "connected" rooms. then search for a path to "disconnected" room and connect it with a corridor, moving the room to the list of connected rooms afterwards.
CreodorToday at 2:41 PM
yes that does handle many more of the potential issues
HessuuToday at 2:41 PM
then just repeat until all rooms are connected
CreodorToday at 2:42 PM
that approach initially would likely create bizarre paths, if it just grabs rooms one at a time and connects to a new one
but
it'd create connections
HessuuToday at 2:42 PM
hmm, true
CreodorToday at 2:43 PM
it probably would need to be adjusted to be aware of relative locations
so that it tries to connect nearby rooms with priority
HessuuToday at 2:44 PM
if you do a breadth-first pathfind, you should find closest rooms first
you should look into making a pathfinding function that has path weight
could try making it so that going straight is always "cheaper" than turning
I'm not 100% sure about this, but I think it might result in more corridor-like paths
CreodorToday at 2:47 PM
that makes sense
*/

//list of room array references, to more easily access & modify them
//yes it's a global. yes i'm a fraud for this all not being a class.
let roomList = [];

//basic randomizer
function RollDice(max, min) {
    return Math.floor(Math.random() * (max - min + 1)) + min; 
}

function GenerateSquareArray(height = 5, width = 10, max = 1, min = 1) {
    //2d array to hold map information
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

function buildRoomList(roomCount, roomMaxHeight, roomMaxWidth) {
    //clear out roomList before generating a new map. will need to handle this differently later.
    roomList = [];
    //builds the roomList global array with random sized rooms
    //roomList contains objects with various useful data now
    for (let i = 0; i < roomCount; i++){
        let roomHeight = RollDice(roomMaxHeight, 3);
        let roomWidth = RollDice(roomMaxWidth, 3)
        roomList.push({
            room: GenerateSquareArray(roomHeight, roomWidth, 0, 0),
            height: roomHeight,
            width: roomWidth,
        });
    }
}

function FullMap(height = 5, width = 10) {
    let min = 1;
    let max = 1;
    let fullMap = GenerateSquareArray(height, width, max, min);
    let roomMaxHeight = 10;
    let roomMaxWidth = 10;
    //roomCount currently only allows roughly half the tiles of the map to be used for rooms
    //the algorithm can be adjusted in future
    let roomCount = Math.floor((height*width)/((roomMaxHeight*roomMaxWidth)*2));

    buildRoomList(roomCount, roomMaxHeight, roomMaxWidth);

    console.log("new run");

    for (let x = 0; x < roomList.length; x++) {
        var startCoordX = RollDice(width - roomList[x].room[0].length - 1, 1);
        var startCoordY = RollDice(height - roomList[x].room.length - 1, 1);
        roomList[x].coordX = startCoordX;
        roomList[x].coordY = startCoordY;

        //each pass of adding a room, check if an overlap is detected where it will be placed.
        if (detectOverlap(fullMap, roomList[x])) {
            console.log("overlap");
        }
        else {
            console.log("no overlap");
        }        

        for(let roomY = 0; roomY < roomList[x].room.length; roomY++) {
            for(let roomX = 0; roomX < roomList[x].room[roomY].length; roomX++) {
                fullMap[startCoordY + roomY][startCoordX + roomX] = roomList[x].room[roomY][roomX];
            }
        }
    }
    return fullMap;
}

//detects value overlaps between maps
function detectOverlap(map, roomMap, value = 0) {
    for(let roomY = 0; roomY < roomMap.room.length; roomY++) {
        for(let roomX = 0; roomX < roomMap.room[roomY].length; roomX++) {
            if (map[roomMap.coordY + roomY][roomMap.coordX + roomX].cellValue == value && roomMap.room[roomY][roomX].cellValue == value) {
                return true;
            }
        }
    }
    return false;
}

//converts the map array into a table to display
function MapDisplay() {
    //setup map dims from html form
    let mapHeight = document.getElementById('height').value;
    let mapWidth = document.getElementById('width').value;

    var mapArray = FullMap(mapHeight, mapWidth);

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
