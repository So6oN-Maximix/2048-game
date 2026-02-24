import http from "http";
import fs from "fs";
import path from "path";
import database from "./database.js";

const PORT = 8080;
const sessions = {};

const server = http.createServer(async (req, res) => {
    if (req.method === "POST") {
        if (req.url === "/api/register") {
            let body = "";
            req.on("data", chunk => body += chunk.toString());
            req.on("end", async () => {
                console.log(body);
                const formDatas = new URLSearchParams(body);
                const username = formDatas.get("username");
                const password = formDatas.get("password");
                try {
                    await database.query("INSERT INTO users (username, password) VALUES ($1, $2);", [username, password]);
                    console.log(`Nouveau compte reçu ! Username: ${username}`);
                    res.writeHead(302, {"Location": "/login"});
                } catch (error) {
                    console.error("Erreur SQL : ", error);
                    res.writeHead(500);
                }
                res.end();
            });
            return;
        } else if (req.url === "/api/login") {
            let body = "";
            req.on("data", chunk => body += chunk.toString());
            req.on("end", async () => {
                console.log(body);
                const formDatas = new URLSearchParams(body);
                const username = formDatas.get("username");
                const password = formDatas.get("password");
                try {
                    const result = await database.query("SELECT username FROM users WHERE username = $1 AND password = $2;", [username, password]);
                    if (result.rows.length > 0) {
                        console.log(`Connexion réussi pour ${username}`);
                        const ticket = Math.random().toString(36).substring(7);
                        sessions[ticket] = username;
                        res.writeHead(302, {
                            "Location": "/",
                            "Set-Cookie": [`session_id=${ticket}; Path=/`, `username=${username}; Path=/`]
                        });
                    } else {
                        console.log(`Echec de connexion ! Mauvais identifiants pour ${username}`);
                        res.writeHead(302, {"Location": "/login"});
                    }
                } catch (error) {
                    console.error("Erreur SQL : ", error);
                    res.writeHead(500);
                }
                res.end();
            });
            return;
        }
    } else if (req.method === "GET" && req.url === "/api/user-stats") {
        const cookieHeader = req.headers.cookie || "";
        const match = cookieHeader.match(/session_id=([^;]+)/);
        const ticket = match ? match[1] : null;
        if (ticket && sessions[ticket]) {
            const username = sessions[ticket];
            try {
                const userIDElement = await database.query("SELECT user_id FROM users WHERE username = $1;", [username]);
                const userID = userIDElement.rows[0].user_id;

                const bestScoreElement = await database.query("SELECT MAX(score) FROM scores WHERE user_id = $1;", [userID]);
                const bestScore = bestScoreElement.rows[0].max;

                const gamesNumberElement = await database.query("SELECT * FROM scores WHERE user_id = $1;", [userID]);
                const gamesNumber = gamesNumberElement.rows.length;

                const creationAccountDateElement = await database.query("SELECT date FROM users WHERE username = $1;", [username]);
                const creationAccountDateString = creationAccountDateElement.rows[0].date;
                const creationAccountDateType = new Date(creationAccountDateString);
                const creationAccountDate = creationAccountDateType.toLocaleDateString("fr-FR");

                const last5GamesElement = await database.query("SELECT * FROM scores WHERE user_id = $1 ORDER BY created_at DESC LIMIT 5;", [userID]);
                const last5Games = last5GamesElement.rows;
                res.writeHead(200, {"Content-Type": "application/json"});
                res.end(JSON.stringify({
                    username: username,
                    created: creationAccountDate,
                    bestScore: bestScore,
                    gamesPlayed: gamesNumber,
                    lastGames: last5Games
                }));
            } catch (error) {
                console.error("Erreur API: ", error);
                res.writeHead(500);
                res.end;
            }
        } else {
            res.writeHead(401);
            res.end("Non autorisé !");
        }
        return;
    }

    let filePath = "." + req.url;
    if (req.url === "/" || req.url === "") {
        filePath = "./index.html";
    } else if (req.url === "/login") {
        filePath = "./login.html";
    } else if (req.url === "/create-account") {
        filePath = "./create-account.html";
    } else if (req.url === "/profile") {
        filePath = "./profile.html";
    }

    const extName = String(path.extname(filePath)).toLowerCase();

    const extTypes = {
        ".html" : "text/html",
        ".css" : "text/css",
        ".js" : "text/javascript"
    };

    const contentType = extTypes[extName];

    fs.readFile(filePath, (err, content) => {
        if (err) {
            fs.readFile('./404.html', (err404, content404) => {
                res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(content404, 'utf-8');
            });
        } else {
            res.writeHead(200, {"Content-Type": `${contentType}; charset=utf-8`});
            res.end(content, "utf-8");
        }
    })
})

server.listen(PORT, () => console.log(`Serveur allumé sur http://localhost:${PORT}`))