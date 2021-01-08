let petxp = 0;
let health = 100;
let coins = 50;
let currentPettingObject = 0;
let petting;
let dragonHealth;
let inventory = ["fish"];

const button1 = document.getElementById("button1");
const button2 = document.getElementById("button2");
const button3 = document.getElementById("button3");
const text = document.getElementById("text");
const petxpText = document.getElementById("petxp");
const healthText = document.getElementById("health");
const coinsText = document.getElementById("coins");
const dragonStats = document.getElementById("dragonStats");
const dragonNameText = document.getElementById("dragonName");
const dragonHealthText = document.getElementById("dragonHealth");

const dragons = [{
        name: "baby dragon",
        level: 2,
        health: 15
    },
    {
        name: "young dragon",
        level: 8,
        health: 60
    },
    {
        name: "the dragon Night Fury",
        level: 20,
        health: 300
    },
]

const pettingObjects = [{
        name: "fish",
        power: 5
    },
    {
        name: "dragon juice",
        power: 30
    },
    {
        name: "petting potion",
        power: 50
    },
    {
        name: "dragon's food",
        power: 100
    }
]

const locations = [{
        name: "the center of Berk",
        "button text": ["Go to the dragon shop", "Go to find dragons to pet", "Pet the dragon \"Night Fury\""],
        "button functions": [goDragonStore, goDragonLand, fightDragon],
        text: "You are in the center of Berk. You see a sign that says \"Dragon shop.\""
    },
    {
        name: "Dragon store",
        "button text": ["Buy 10 health (10 coins)", "Buy petting object (30 coins)", "Go to the Berk's center"],
        "button functions": [buyHealth, buyPettingObject, goBerksCenter],
        text: "You enter the Dragon shop."
    },
    {
        name: "dragon land",
        "button text": ["Pet a baby dragon", "Pet a young dragon", "Go to the Berk's center"],
        "button functions": [fightSlime, fightBeast, goBerksCenter],
        text: "You found a dragon. It's time to pet it."
    },
    {
        name: "pet",
        "button text": ["Pet", "Dodge its attack", "Run"],
        "button functions": [attack, dodge, goBerksCenter],
        text: "You are petting a dragon."
    },
    {
        name: "pet dragon",
        "button text": ["Go to the Berk's center", "Go to the Berk's center", "Go to the Berk's center"],
        "button functions": [goBerksCenter, goBerksCenter, goEasterEgg],
        text: 'You petted the dragon! It\'s now yours. You gain expereince points and find coins.',
    },
    {
        name: "lose",
        "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
        "button functions": [restart, restart, restart],
        text: "You die. You couldn\'t pet the dragon. ☠️ "
    },
    {
        name: "win",
        "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
        "button functions": [restart, restart, restart],
        text: "You petted the dragon \"Night Fury\"! YOU WIN THE GAME! 🎉"
    },
    {
        name: "easter egg",
        "button text": ["2", "8", "Go to the Berk's center?"],
        "button functions": [pickTwo, pickEight, goBerksCenter],
        text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!"
    }
]

// initialize game
button1.onclick = goDragonStore;
button2.onclick = goDragonLand;
button3.onclick = fightDragon;

function update(location) {
    dragonStats.style.display = "none"
    button1.innerText = location["button text"][0]
    button2.innerText = location["button text"][1]
    button3.innerText = location["button text"][2]
    button1.onclick = location["button functions"][0];
    button2.onclick = location["button functions"][1];
    button3.onclick = location["button functions"][2];
    text.innerText = location.text;
}

function goBerksCenter() {
    update(locations[0]);
}

function goDragonStore() {
    update(locations[1]);
}

function goDragonLand() {
    update(locations[2]);
}

function goFight() {
    update(locations[3]);
    dragonHealth = dragons[petting].health;
    dragonStats.style.display = "block";
    dragonNameText.innerText = dragons[petting].name;
    dragonHealthText.innerText = dragonHealth;
}

function buyHealth() {
    if (coins < 10) {
        text.innerText = "You do not have enough coins to buy health."
    } else {
        coins -= 10;
        health += 10;
        coinsText.innerText = coins;
        healthText.innerText = health;
    }
}

function buyPettingObject() {
    if (coins < 30) {
        text.innerText = "You do not have enough coins to buy a petting object."
    } else {
        if (currentPettingObject + 1 >= pettingObjects.length) {
            text.innerText = "You already have the most powerful petting object!"
            button2.innerText = "Sell petting object for 15 coins"
            button2.onclick = sellPettingObject;
        } else {
            coins -= 30;
            currentPettingObject++;
            coinsText.innerText = coins;
            text.innerText = "You now have a " + pettingObjects[currentPettingObject].name + ".";
            inventory.push(pettingObjects[currentPettingObject].name);
            text.innerText += " In your inventory you have: " + inventory;
        }
    }
}

function sellPettingObject() {
    if (inventory.length >= 2) {
        coins += 15;
        coinsText.innerText = coins;
        let currentPettingObject = inventory.shift();
        text.innerText = "You sold a " + currentPettingObject + ".";
        text.innerText += " In your inventory you have: " + inventory;
    } else {
        text.innerText = "Don't sell your only petting object!";
    }

}

function fightSlime() {
    petting = 0;
    goFight()
}

function fightBeast() {
    petting = 1;
    goFight()
}

function fightDragon() {
    petting = 2;
    goFight()
}

function attack() {
    text.innerText = "The " + dragons[petting].name + " attacks.";
    text.innerText += " You calmed it with your " + pettingObjects[currentPettingObject].name + ".";

    health -= getDragonAttackValue(dragons[petting].level);

    if (isDragonHit()) {
        dragonHealth -= pettingObjects[currentPettingObject].power + Math.floor((Math.random() * (petxp - 1) + 1));
    } else {
        text.innerText += " It dodged."
    }
    healthText.innerText = health;
    dragonHealthText.innerText = dragonHealth;

    if (health <= 0) {
        lose();
    } else if (dragonHealth <= 0) {
        petting === 2 ? winGame() : defeatDragon();
    }

    if (Math.random() <= .1 && currentPettingObject !== 0) {
        text.innerText += " Your " + inventory.pop() + " disappears."
        currentPettingObject--;
    }
}

function getDragonAttackValue(level) {
    let hit = (level * 5) - (Math.floor(Math.random() * petxp));
    console.log(hit)
    return hit;
}

function isDragonHit() {
    let isHit = Math.random() > .2 || health < 20;
    return isHit;
}

function dodge() {
    text.innerText = "You dodge the attack from the " + dragons[petting].name + ".";
}

function lose() {
    update(locations[5]);
}

function defeatDragon() {
    coins += Math.floor(dragons[petting].level * 6.7);
    petxp += dragons[petting].level;
    coinsText.innerText = coins;
    petxpText.innerText = petxp;
    update(locations[4]);
}

function winGame() {
    update(locations[6]);
}

function restart() {
    petxp = 0;
    health = 100;
    coins = 50;
    currentPettingObject = 0;
    inventory = ["fish"];
    coinsText.innerText = coins;
    healthText.innerText = health;
    petxpText.innerText = petxp;
    goBerksCenter();
}

// Easter egg

function goEasterEgg() {
    update(locations[7])
}

function pickTwo() {
    pick(2);
}

function pickEight() {
    pick(8);
}

function pick(guess) {
    let numbers = [];
    while (numbers.length < 10) {
        numbers.push(Math.floor(Math.random() * 11))
    }

    text.innerText = "You picked " + guess + ". Here are the random numbers:\n"

    for (let i = 0; i < 10; i++) {
        text.innerText += numbers[i] + "\n";
    }

    if (numbers.indexOf(guess) !== -1) {
        text.innerText += "Right! You win 20 coins!"
        coins += 20;
        coinsText.innerText = coins;
    } else {
        text.innerText += "Wrong! You lose 10 health!"
        health -= 10;
        healthText.innerText = health;
        if (health <= 0) {
            lose();
        }
    }
}