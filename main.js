// Cat class to represent our coding cats
class Cat {
    constructor(name, personality, energy) {
        this.name = name;
        this.personality = personality;
        this.energy = energy;
    }

    // Method to generate a coding tip or task
    generateCode() {
        const tips = {
            lazy: [
                "Use a 'for' loop instead of writing the same code 10 times. Even I wouldn’t nap through that!",
                "Let functions do the work—cats hate repetitive tasks.",
                "Arrays are like Yarn balls—unravel them with .map()!"
            ],
            curious: [
                "Try 'console.log()' to debug—like sniffing out a hidden treat!",
                "Explore 'fetch()' to grab data from APIs. What’s out there?",
                "Use 'if/else' to make decisions—curiosity demands options!"
            ],
            playful: [
                "Add a 'setTimeout()' to make things pop up like a cat toy!",
                "Create a game with 'addEventListener()'—click me, human!",
                "Animate with CSS and JS—make it bounce like a pouncing cat!"
            ]
        };

        // Pick a random tip based on personality
        const tipList = tips[this.personality];
        const randomTip = tipList[Math.floor(Math.random() * tipList.length)];
        return `${this.name} (${this.personality}) says: "${randomTip}"`;
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

// Event listener for hiring a cat
hireBtn.addEventListener("click", () => {
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
            // Show the coding tip/task after "typing" is done
            catTask.textContent = randomCat.energy > 0 ? randomCat.generateCode() : "Zzz...";
        }
    }, 50);

    // Disable button briefly to prevent spam
    hireBtn.disabled = true;
    setTimeout(() => {
        hireBtn.disabled = false;
    }, 2000);
});
