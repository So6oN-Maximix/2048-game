const grid = Array.from(document.querySelectorAll("#grid-element"));
const newGameButton = document.querySelector(".new-game");
const fenetre = document.querySelector("body");
const score = document.querySelector(".score");

function getRandomStart() {
    const rndRow1 = Math.floor(Math.random() * 4);
    const rndCol1 = Math.floor(Math.random() * 4);
    const rndRow2 = Math.floor(Math.random() * 4);
    let rndCol2 = Math.floor(Math.random() * 4);
    rndCol2 = rndCol2 == rndCol1 ? Math.floor((rndCol2 + 1)%4) : rndCol2;
    const nb1 = Math.random() > 0.1 ? 2 : 4;
    const nb2 = Math.random() > 0.1 ? 2 : 4;

    for (let i=0; i<grid.length; i++) {
        if (i == rndRow1 * 4 + rndCol1) {
            grid[i].setAttribute("class", `tile tile-${nb1}`);
            grid[i].innerText = nb1;
        } else if (i == rndRow2 * 4 + rndCol2) {
            grid[i].setAttribute("class", `tile tile-${nb2}`);
            grid[i].innerText = nb2;
        } else {
            grid[i].setAttribute("class", "tile empty");
            grid[i].innerText = "";
        }
    }
}

function simplifiedGrid() {
    let newGrid = Array.from({ length: 4 }, () => []);
    let nbr = 0;
    let switchElem = 0;
    for (let i=0; i<grid.length; i++) {
        nbr = grid[i].textContent == "" ? 0 : grid[i].textContent;
        newGrid[Math.floor(i/4)].push(nbr);
    }
    return newGrid
}

function movementRow2(keyPressed, simpleGrid) {
    let newGrid = [];
    for (let i=0; i<=3; i++) {
        let rowFiltered = simpleGrid[i].filter(num => num > 0);
        for (let j=0; j<rowFiltered.length-1; j++) {
            if (rowFiltered[j] == rowFiltered[j+1]) {
                rowFiltered[j] *= 2;
                rowFiltered[j+1] = 0;
            }
        }
        rowFiltered = rowFiltered.filter(num => num > 0);
        if (keyPressed == "ArrowLeft") {
            while (rowFiltered.length < 4) {
                rowFiltered.push(0);
            }
        } else if (keyPressed == "ArrowRight") {
            rowFiltered.reverse();
            while (rowFiltered.length < 4) {
                rowFiltered.unshift(0);
            }
        }
        newGrid.push(rowFiltered);
    }
    return newGrid;
}

function movementRow(keyPressed, simpleGrid) {
    let newGrid = [];
    for (let i = 0; i < 4; i++) {
        let row = simpleGrid[i]; // On prend la ligne
        if (keyPressed === "ArrowRight") {
            row.reverse();
        }
        let rowFiltered = row.filter(num => num > 0);
        for (let j = 0; j < rowFiltered.length - 1; j++) {
            if (rowFiltered[j] === rowFiltered[j+1]) {
                rowFiltered[j] *= 2;
                score += rowFiltered[j];
                rowFiltered[j+1] = 0;
            }
        }
        rowFiltered = rowFiltered.filter(num => num > 0);
        while (rowFiltered.length < 4) {
            rowFiltered.push(0);
        }
        if (keyPressed === "ArrowRight") {
            rowFiltered.reverse();
        }

        newGrid.push(rowFiltered);
    }
    return newGrid;
}

function transpose(grille) {
    let toChange;
    for (let i=0; i<=3; i++) {
        for (j=0; j<=3; j++) {
            if (i < j) {
                toChange = grille[i][j]
                grille[i][j] = grille[j][i];
                grille[j][i] = toChange;
            }
        }
    }
    return grille;
}

function movementColumn(keyPressed, simpleGrid) {
    let newGridTranspose;
    let newGrid;
    const simpleGridTranspose = transpose(simpleGrid)
    if (keyPressed == "ArrowDown") {
        newGridTranspose = movementRow("ArrowRight", simpleGridTranspose);
    } else if (keyPressed == "ArrowUp") {
        newGridTranspose = movementRow("ArrowLeft", simpleGridTranspose);
    }
    newGrid = transpose(newGridTranspose);
    return newGrid;
}

function generateRandom() {
    let rndRow = Math.floor(Math.random()*4);
    let rndCol = Math.floor(Math.random()*4);
    const simplegrid = simplifiedGrid();
    while (simplegrid[rndRow][rndCol] != 0) {
        rndRow = Math.floor(Math.random()*4);
        rndCol = Math.floor(Math.random()*4);
    }
    const nb = Math.random() > 0.1 ? 2 : 4;
    grid[4*rndRow+rndCol].setAttribute("class", `tile tile-${nb}`);
    grid[4*rndRow+rndCol].textContent = nb;
}

function movementGestion(keyPressed) {
    const simpleGrid = simplifiedGrid();
    let simpleNewGrid;
    if (keyPressed == "ArrowRight" || keyPressed == "ArrowLeft") {
        simpleNewGrid = movementRow(keyPressed, simpleGrid);
    } else if (keyPressed == "ArrowUp" || keyPressed == "ArrowDown") {
        simpleNewGrid = movementColumn(keyPressed, simpleGrid);
    }
    for (let i=0; i<=3; i++) {
        for (j=0; j<=3; j++) {
            if (simpleNewGrid[i][j] == 0) {
                grid[4*i+j].setAttribute("class", "tile empty");
                grid[4*i+j].textContent = "";
            } else {
                grid[4*i+j].setAttribute("class", `tile tile-${simpleNewGrid[i][j]}`);
                grid[4*i+j].textContent = simpleNewGrid[i][j];
            }
        }
    }
    generateRandom();
    return grid;
}

newGameButton.addEventListener("click", getRandomStart);
fenetre.addEventListener("keydown", (event) => movementGestion(event.key));