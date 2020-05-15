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

function FullMap(height = 5, width = 10) {
    let min = 1;
    let max = 1;
    let fullMap = GenerateSquareArray(height, width, max, min);
    let roomMaxHeight = 10;
    let roomMaxWidth = 10;
    //roomCount currently only allows roughly half the tiles of the map to be used for rooms
    //the algorithm can be adjusted in future
    let roomCount = Math.floor((height*width)/((roomMaxHeight*roomMaxWidth)*2));

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

    console.log("new run");
    //console.log(roomList);

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


function detectOverlap(map, roomMap) {
/*
mapX and mapY is the coordinate where the top-left corner of the room should go
it checks whether the map and the room would have open spaces in the same spots, and rejects the room if they do
that kind of thing would work for non-rectangular rooms
*/
    for(let roomY = 0; roomY < roomMap.room.length; roomY++) {
        for(let roomX = 0; roomX < roomMap.room[roomY].length; roomX++) {
            //console.log(map[roomMap.coordY+roomY][roomMap.coordX+roomX]);
            if (map[roomMap.coordY + roomY][roomMap.coordX + roomX].cellValue == 0) {
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
