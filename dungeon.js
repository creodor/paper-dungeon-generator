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

