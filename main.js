// Cat class to represent our coding cats
class Cat {
    constructor(name, personality, energy) {
        this.name = name;
        this.personality = personality;
        this.energy = energy;
    }

    // Async method to generate an AI coding tip using the Hugging Face Inference API
    async generateCode() {
        const modelUrl = "https://api-inference.huggingface.co/models/gpt2"; // You can choose another model if desired
        // Create a prompt tailored to the cat's personality
        const prompt = `Generate a creative and fun coding tip for a ${this.personality} programmer.`;
        
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
            
            // Check if we received a valid response with generated text
            if (Array.isArray(data) && data[0]?.generated_text) {
                return `${this.name} (${this.personality}) says: "${data[0].generated_text.trim()}"`;
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
    // Pick a random cat
    const randomCat = cats[Math.floor(Math.random() * cats.length)];

    // Display the cat working with a typing animation
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

    // Disable button briefly to prevent spam
    hireBtn.disabled = true;
    
    // Wait until the typing animation finishes before fetching the tip (approximate timing)
    setTimeout(async () => {
        if (randomCat.energy > 0) {
            // Generate AI tip and display it
            catTask.textContent = await randomCat.generateCode();
        } else {
            catTask.textContent = "Zzz...";
        }
        hireBtn.disabled = false;
    }, workText.length * 50 + 500);
});
