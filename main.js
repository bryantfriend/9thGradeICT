// Cat class to represent our coding cats
class Cat {
    constructor(name, personality, energy) {
        this.name = name;
        this.personality = personality;
        this.energy = energy;
    } 

    // Async method to generate an AI coding tip using GPT-2
    async generateCode() {
        const modelUrl = "https://api-inference.huggingface.co/models/gpt2";

        const prompt = "Pretend like you are an employee at a software company specialising in website development using JavaScript and your personality is " + this.personality + ". Based of your personality give a ONE SENTENCE response with a beginner JavaScript advice like how to work with variables, edit code, interact with HTML and anything else related to the topic. Again, the response must be only ONE sentence fully in character, as if a programmer is just giving an advice.";
        
        try {
            const response = await fetch(modelUrl, {
                method: "POST",
                headers: {
                    "Authorization": "Bearer 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",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    inputs: prompt,
                    parameters: { max_length: 50, temperature: 1.0, top_p: 0.9 }
                })
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            if (Array.isArray(data) && data.length > 0 && data[0]?.generated_text) {
                let tip = data[0].generated_text;

                // Remove the prompt from the response
                tip = tip.replace(prompt, "").trim();

                // Extract only the first complete sentence
                tip = tip.split(". ")[0] + ".";

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
