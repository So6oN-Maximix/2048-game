function getUsername(cookie) {
    const splitCookie = cookie.split("; ");
    const userRow = splitCookie.find(row => row.startsWith("username="));
    if (userRow) {
        const username = userRow.split("=")[1];
        console.log("Pseudo trouvé :", username);
        return username;
    }
    return "Inconnu";
}

async function loadProfileStats() {
    try {
        const serverResponse = await fetch("/api/user-stats");
        if (serverResponse.ok) {
            const data = await serverResponse.json();
            const profileUsername = document.getElementById("username");
            const highScoreSpan = document.getElementById("high-score");
            const gamesPlayedSpan = document.getElementById("games-played");
            const joinDateSpan = document.getElementById("join-date");

            if (profileUsername) profileUsername.textContent = data.username;
            if (highScoreSpan) highScoreSpan.textContent = data.bestScore;
            if (gamesPlayedSpan) gamesPlayedSpan.textContent = data.gamesPlayed;
            if (joinDateSpan) joinDateSpan.textContent = data.created;

            const lastGamesHistory = document.getElementById("history-body");
            const lastGames = data.lastGames;
            let historyInnerHTML = "";
            lastGames.forEach((game) => {
                const score = game.score;
                const dateElem = new Date(game.created_at);
                const date = dateElem.toLocaleDateString("fr-FR");
                historyInnerHTML += `
                <tr>
                    <td>${date}</td>
                    <td>${score}</td>
                </tr>
                `
            });
            if (lastGamesHistory) lastGamesHistory.innerHTML = historyInnerHTML;
        }

        if (serverResponse.status === 401) {
            console.log("Deconnexion...");
            document.cookie = "session_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            window.location.reload();
            return;
        }
    } catch (error) {
        console.error("Erreur de communication: ", erreur);
    }
}

async function checkAuth() {
    const isLogged = document.cookie.includes("session_id=");
    if (isLogged) {
        await loadProfileStats();
        document.getElementById("login-btn")?.classList.add("hidden");
        document.getElementById("create-account-btn")?.classList.add("hidden");
        document.getElementById("profile-btn")?.classList.remove("hidden");
    } else {
        if (window.location.pathname === "/profile") window.location.href = "/login";
    }
}

document.addEventListener("DOMContentLoaded", checkAuth);
document.getElementById("logout-btn").addEventListener("click", () => {
    document.cookie = "session_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    localStorage.removeItem("2048-grid");
    localStorage.removeItem("2048-score");
    window.location.href = "/";
})