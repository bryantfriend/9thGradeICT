// Cat class to represent our coding cats
class Cat {
    constructor(name, personality, energy) {
        this.name = name;
        this.personality = personality;
        this.energy = energy;
    }

    // Async method to generate an AI coding tip using the Hugging Face Inference API
    async generateCode() {
        const modelUrl = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct"; // Better model
        const prompt = `
            You are an expert programming tutor. 
            Give a single short and useful coding tip for a ${this.personality} programmer.
            Keep it concise (1-2 sentences). 
            Example tips: 
            - "Use 'console.log()' to debug—like sniffing out a hidden treat!"
            - "For cleaner code, follow DRY (Don't Repeat Yourself) principles."
        `;

        try {
            const response = await fetch(modelUrl, {
                method: "POST",
                headers: {
                    "Authorization": "Bearer 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",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ inputs: prompt })
            });

            const data = await response.json();

            if (data && data.generated_text) {
                // Extract only the first sentence to avoid weird output
                let tip = data.generated_text.split(". ")[0] + "."; 
                return `${this.name} (${this.personality}) says: "${tip}"`;
            } else {
                return `${this.name} (${this.personality}) says: "Hmm, I couldn't think of a tip right now."`;
            }

        } catch (error) {
            console.error("Error generating AI tip:", error);
            return `${this.name} (${this.personality}) says: "Oops, something went wrong with the AI tip."`;
        }
    }

    // Method to simulate the cat "working"
    work() {
        this.energy--;
        return this.energy > 0 
            ? `${this.name} is typing furiously with tiny paws...`
            : `${this.name} is napping. Out of energy!`;
    }
}

// Array of cat instances
const cats = [
    new Cat("Whiskers", "lazy", 3),
    new Cat("Luna", "curious", 5),
    new Cat("Paws", "playful", 4)
];

// DOM elements
const hireBtn = document.getElementById("hireCatBtn");
const catMessage = document.getElementById("catMessage");
const catTask = document.getElementById("catTask");

// Event listener for hiring a cat (made async to await the AI tip)
hireBtn.addEventListener("click", async () => {
    const randomCat = cats[Math.floor(Math.random() * cats.length)];
    catMessage.textContent = "";
    let workText = randomCat.work();
    let i = 0;

    const typeEffect = setInterval(() => {
        if (i < workText.length) {
            catMessage.textContent += workText[i];
            i++;
        } else {
            clearInterval(typeEffect);
        }
    }, 50);

    hireBtn.disabled = true;

    setTimeout(async () => {
        catTask.textContent = randomCat.energy > 0 ? await randomCat.generateCode() : "Zzz...";
        hireBtn.disabled = false;
    }, workText.length * 50 + 500);
});
