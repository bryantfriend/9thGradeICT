// Replace with your actual API key.
// WARNING: Exposing your API key in client-side code is insecure for production.
const OPENAI_API_KEY = "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";

class Cat {
  constructor(name, personality, energy, emoji) {
    this.name = name;
    this.personality = personality;
    this.energy = energy;
    this.emoji = emoji || "😺";
    this.adventureContext = `You are a brave cat named ${this.emoji} ${this.name} with a ${this.personality} personality and energy ${this.energy}. Your epic adventure begins now.`;
  }

  work() {
    this.energy--;
    let message = "";
    if (this.energy <= 0) {
      message = `${this.name} is napping and recharging energy!`;
      this.energy = 5;
    } else {
      message = `${this.name} is exploring...`;
    }
    return message;
  }

  extractJSON(text) {
    const start = text.indexOf("{");
    if (start === -1) return null;
    let stack = 0;
    for (let i = start; i < text.length; i++) {
      if (text[i] === "{") {
        stack++;
      } else if (text[i] === "}") {
        stack--;
        if (stack === 0) {
          return text.substring(start, i + 1);
        }
      }
    }
    return null;
  }

  async generateAdventure(decision = "") {
    if (decision) {
      this.adventureContext += `\nDecision: ${decision}`;
    }
    const workMessage = this.work();
    this.adventureContext += `\n${workMessage}`;
    
    const prompt = `You are a creative storyteller. Continue the following choose-your-own-adventure story. Provide the next segment of the story along with two distinct options for what to do next. Format your response strictly as a JSON object with keys "story", "option1", and "option2". Do not include any extra text outside the JSON.

Context:
${this.adventureContext}`;
    
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4", // or use "gpt-3.5-turbo" if preferred
          messages: [{
            role: "user",
            content: prompt,
          }],
          max_tokens: 150,
          temperature: 0.9,
          top_p: 0.9
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const completion = await response.json();
      let generated = completion.choices[0].message.content.trim();
      let adventure;
      try {
        adventure = JSON.parse(generated);
      } catch (e) {
        const jsonString = this.extractJSON(generated);
        if (jsonString) {
          try {
            adventure = JSON.parse(jsonString);
          } catch (err) {
            console.error("JSON parse error after extraction:", err);
            return null;
          }
        } else {
          return null;
        }
      }
      this.adventureContext += `\n${adventure.story}`;
      return adventure;
    } catch (error) {
      console.error("Error generating adventure with OpenAI:", error);
      return { story: "An error interrupted your adventure.", option1: "Try Again", option2: "Quit" };
    }
  }
}

const cats = [
  new Cat("Whiskers", "lazy", 5, "😺"),
  new Cat("Luna", "curious", 5, "😸"),
  new Cat("Paws", "playful", 5, "😻")
];

const startBtn = document.getElementById("startAdventureBtn");
const storyContainer = document.getElementById("storyContainer");
const catEnergyEl = document.getElementById("catEnergy");
const choiceBtn1 = document.getElementById("choice1");
const choiceBtn2 = document.getElementById("choice2");

let currentCat = null;

async function updateAdventure(decision = "") {
  if (!currentCat) return;
  catEnergyEl.textContent = `Energy: ${currentCat.energy}`;
  const adventure = await currentCat.generateAdventure(decision);
  storyContainer.textContent = adventure.story;
  choiceBtn1.textContent = adventure.option1;
  choiceBtn2.textContent = adventure.option2;
}

startBtn.addEventListener("click", async () => {
  currentCat = cats[Math.floor(Math.random() * cats.length)];
  startBtn.style.display = "none";
  updateAdventure();
});

choiceBtn1.addEventListener("click", () => {
  updateAdventure(choiceBtn1.textContent);
});
choiceBtn2.addEventListener("click", () => {
  updateAdventure(choiceBtn2.textContent);
});
