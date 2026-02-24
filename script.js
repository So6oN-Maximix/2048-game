const grid = Array.from(document.querySelectorAll("#grid-element"));
const newGameButton = document.querySelector(".new-game");
const fenetre = document.querySelector("body");
const scoreSpan = document.querySelector(".score");
let score = 0;

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
    scoreSpan.textContent = 0;
    document.getElementById("game-over-screen")?.setAttribute("class", "hidden");
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

function movementRow(keyPressed, simpleGrid) {
    let newGrid = [];
    for (let i = 0; i < 4; i++) {
        let row = simpleGrid[i];
        if (keyPressed === "ArrowRight") {
            row.reverse();
        }
        let rowFiltered = row.filter(num => num > 0);
        for (let j = 0; j < rowFiltered.length - 1; j++) {
            if (rowFiltered[j] === rowFiltered[j+1]) {
                rowFiltered[j] *= 2;
                score += rowFiltered[j];
                scoreSpan.textContent = score;
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
    const simpleGridTranspose = transpose(simpleGrid);
    if (keyPressed == "ArrowDown") {
        newGridTranspose = movementRow("ArrowRight", simpleGridTranspose);
    } else if (keyPressed == "ArrowUp") {
        newGridTranspose = movementRow("ArrowLeft", simpleGridTranspose);
    }
    newGrid = transpose(newGridTranspose);
    return newGrid;
}

function generateRandom() {
    const availableIndex = [];
    grid.forEach((tile, index) => {
        if (tile.textContent === "") availableIndex.push(index);
    });
    if (availableIndex.length === 0) return;
    const randomIndex = availableIndex[Math.floor(Math.random()*availableIndex.length)]
    const nb = Math.random() > 0.1 ? 2 : 4;
    grid[randomIndex].setAttribute("class", `tile tile-${nb}`);
    grid[randomIndex].textContent = nb;
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

function movementIsPossible(keyPressed) {
    let simpleGrid = simplifiedGrid();
    if (keyPressed == "ArrowDown") simpleGrid = transpose(simpleGrid);
    if (keyPressed == "ArrowLeft") {
        for (let i=0; i<=3; i++) {
            simpleGrid[i] = simpleGrid[i].reverse();
        }
    }
    if (keyPressed == "ArrowUp") {
        simpleGrid = transpose(simpleGrid);
        for (let i=0; i<=3; i++) {
            simpleGrid[i] = simpleGrid[i].reverse();
        }
    }
    for (const row of simpleGrid) {
        const indicesOfVoid = [];
        row.forEach((element, index) => {
            if (element === 0) indicesOfVoid.push(index);
        });
        for (let i=0; i<=indicesOfVoid.length-1; i++) {
            console.log(indicesOfVoid[i], i);
            if (indicesOfVoid[i] != i) return true;
        }
        for (let i=0; i<row.length-1; i++) {
            console.log(row);
            if (row[i] == row[i+1] && row[i] != 0) return true;
        }
    }
    return false;
}

async function saveScore(finalScore) {
    await fetch("/api/save-score", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({score: finalScore})
    });
}

newGameButton.addEventListener("click", getRandomStart);
fenetre.addEventListener("keydown", (event) => {
    const allMovement = ["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"];
    let possibleMovements = [];
    for (const move of allMovement) {
        if (movementIsPossible(move)) {
            possibleMovements.push(move);
        }
    }
    if (possibleMovements.length > 0 && possibleMovements.includes(event.key)) {
        movementGestion(event.key);
        let movesLeft = false;
        for (const move of allMovement) {
            if (movementIsPossible(move)) {
                movesLeft = true;
                break;
            }
        }
        if (!movesLeft) {
            saveScore(score);
            const gameOverScreen = document.getElementById("game-over-screen");
            gameOverScreen.setAttribute("class", "");
            const gameOverScore = gameOverScreen.querySelector("span");
            gameOverScore.textContent = score;
        }
    }
});