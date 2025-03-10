// Cat class to represent our coding cats
class Cat {
  constructor(name, personality, energy) {
    this.name = name;
    this.personality = personality;
    this.energy = energy;
  }

  // Async method to generate an AI coding tip using GPT-2
  async generateCode(userInputPrompt = "") {
    const modelUrl = "https://api-inference.huggingface.co/models/gpt2";

    // Build the prompt from a base description plus the user input (if provided)
    const basePrompt = `Pretend you are an employee at a software company specializing in website development using JavaScript and your personality is ${this.personality}. `;
    const defaultPrompt = "Give a ONE SENTENCE response with beginner JavaScript advice (like how to work with variables, edit code, interact with HTML, etc.) in character.";
    const prompt = basePrompt + (userInputPrompt.trim() || defaultPrompt);

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
        // Remove the prompt text from the response if it appears
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

  // Retrieve the user prompt if available (requires an HTML input with id "userPrompt")
  const userPromptElement = document.getElementById("userPrompt");
  const userPrompt = userPromptElement ? userPromptElement.value : "";

  setTimeout(async () => {
    catTask.textContent = randomCat.energy > 0 ? await randomCat.generateCode(userPrompt) : "Zzz...";
    hireBtn.disabled = false;
  }, workText.length * 50 + 500);
});
