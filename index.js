import http from "http";
import fs from "fs";
import path from "path";

const PORT = 8080;

const server = http.createServer((req, res) => {
    let filePath = "." + req.url;
    if (req.url === "/" || req.url === "") {
        filePath = "./main.html";
    } else if (req.url === "/login") {
        filePath = "./login.html";
    } else if (req.url === "/create-account") {
        filePath = "./create-account.html";
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