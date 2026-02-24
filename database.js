import {Client} from "pg"

const client = new Client ({
    user: "postgres",
    host: "localhost",
    database: "2048_database",
    password: "LaraCsuge!*",
    port: 5432
});

const createTablesQuery = `
    CREATE TABLE IF NOT EXISTS users(
        user_id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        password VARCHAR(50) NOT NULL,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS scores(
        score_id SERIAL PRIMARY KEY,
        score INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        user_id INT NOT NULL REFERENCES users(user_id)
    );
    `;

client.connect()
    .then(async () => {
        console.log("Connexion réussi !!");
        await client.query(createTablesQuery);
        console.log("Tables prêtes !!");
    })
    .catch((error) => console.error("Erreur avec la DB : ", error.stack));

export default client;