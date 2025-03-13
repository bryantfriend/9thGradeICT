import OpenAI from "openai";
const client = new OpenAI();

// Cat class to represent our coding cat adventurer
class Cat {
  constructor(name, personality, energy, emoji) {
    this.name = name;
    this.personality = personality;
    this.energy = energy;
    this.emoji = emoji || "😺";
    // Initialize the adventure context with a starting narrative
    this.adventureContext = `You are a brave cat named ${this.emoji} ${this.name} with a ${this.personality} personality and energy ${this.energy}. Your epic adventure begins now.`;
  }

  // Simulate the cat "working" (exploring) and decrease energy.
  // When energy runs out, the cat takes a nap and recharges.
  work() {
    this.energy--;
    let message = "";
    if (this.energy <= 0) {
      message = `${this.name} is napping and recharging energy!`;
      this.energy = 5; // Reset energy after the nap
    } else {
      message = `${this.name} is exploring...`;
    }
    return message;
  }

  // Helper function to extract the first valid JSON object from a string
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

  // Async method to generate the next segment of the adventure using OpenAI's Chat API.
  async generateAdventure(decision = "") {
    // Append the decision (if any) to the ongoing adventure context
    if (decision) {
      this.adventureContext += `\nDecision: ${decision}`;
    }
    // Add a work step (and update energy) to the context
    const workMessage = this.work();
    this.adventureContext += `\n${workMessage}`;
    
    // Build the prompt for the AI
    const prompt = `You are a creative storyteller. Continue the following choose-your-own-adventure story. Provide the next segment of the story along with two distinct options for what to do next. Format your response strictly as a JSON object with keys "story", "option1", and "option2". Do not include any extra text outside the JSON.

Context:
${this.adventureContext}`;
    
    // Use OpenAI's Chat Completions API
    try {
      const completion = await client.chat.completions.create({
        model: "gpt-4o",
        messages: [{
          role: "user",
          content: prompt,
        }],
        max_tokens: 150,
        temperature: 0.9,
        top_p: 0.9,
      });
      
      let generated = completion.choices[0].message.content.trim();
      let adventure;
      try {
        adventure = JSON.parse(generated);
      } catch (e) {
        // If direct parsing fails, try to extract a valid JSON substring
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
      // Append the new story segment to the ongoing context
      this.adventureContext += `\n${adventure.story}`;
      return adventure;
    } catch (error) {
      console.error("Error generating adventure with OpenAI:", error);
      return { story: "An error interrupted your adventure.", option1: "Try Again", option2: "Quit" };
    }
  }
}

// Array of cat instances (with different personalities, energies, and emojis)
const cats = [
  new Cat("Whiskers", "lazy", 5, "😺"),
  new Cat("Luna", "curious", 5, "😸"),
  new Cat("Paws", "playful", 5, "😻")
];

// DOM elements
const startBtn = document.getElementById("startAdventureBtn");
const storyContainer = document.getElementById("storyContainer");
const catEnergyEl = document.getElementById("catEnergy");
const choiceBtn1 = document.getElementById("choice1");
const choiceBtn2 = document.getElementById("choice2");

let currentCat = null;

// Function to update the adventure UI by generating the next segment.
async function updateAdventure(decision = "") {
  if (!currentCat) return;
  
  // Update the displayed energy
  catEnergyEl.textContent = `Energy: ${currentCat.energy}`;
  
  // Generate the next adventure segment
  const adventure = await currentCat.generateAdventure(decision);
  
  // Update the story container and the option buttons with the AI-generated content
  storyContainer.textContent = adventure.story;
  choiceBtn1.textContent = adventure.option1;
  choiceBtn2.textContent = adventure.option2;
}

// Start the adventure when the user clicks the start button
startBtn.addEventListener("click", async () => {
  // Pick a random cat from the cats array
  currentCat = cats[Math.floor(Math.random() * cats.length)];
  // Hide the start button once the adventure begins
  startBtn.style.display = "none";
  // Begin the adventure with an initial story segment
  updateAdventure();
});

// When the user clicks a choice, update the adventure based on that decision
choiceBtn1.addEventListener("click", () => {
  updateAdventure(choiceBtn1.textContent);
});
choiceBtn2.addEventListener("click", () => {
  updateAdventure(choiceBtn2.textContent);
});
