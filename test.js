import bcrypt from "bcrypt";

const mdp = "123456";
const runTest = async () => {
    try {
        const salt = await bcrypt.genSalt(10); // On attend le sel
        const hashedMdp = await bcrypt.hash(mdp, salt); // On attend le hachage
        
        console.log("----------------------------");
        console.log(`MDP ORIGINAL : ${mdp}`);
        console.log(`HASH GÉNÉRÉ : ${hashedMdp}`);
        console.log("----------------------------");
        
        // Petit test de vérification supplémentaire
        const isMatch = await bcrypt.compare(mdp, hashedMdp);
        console.log(`VÉRIFICATION : ${isMatch ? "✅ Ça match !" : "❌ Erreur"}`);
    } catch (error) {
        console.error("Erreur :", error);
    }
};

runTest();