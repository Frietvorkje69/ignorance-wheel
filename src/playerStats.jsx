export const initializePlayerStats = (players) => {
    players.forEach(player => {
        // Try to retrieve stats from localStorage
        const storedStats = localStorage.getItem(`playerStats-${player.name}`);
        if (storedStats) {
            // If stats exist, parse and assign them to the player
            player.stats = JSON.parse(storedStats);
        } else {
            // If no stats exist, initialize them
            const initialStats = {
                timesSpinner: 0,
                timesTargeted: 0,
                selfSpins: 0,
                targetSurvived: 0,
                sipsGiven: 0,
                sipsReceived: 0,
                shotsGiven: 0,
                shotsReceived: 0,
                chugsGiven: 0,
                chugsReceived: 0,
                timesDoubledDown: 0,
            };
            player.stats = initialStats; // Assign initialized stats to player
            localStorage.setItem(`playerStats-${player.name}`, JSON.stringify(initialStats)); // Store in localStorage
        }
    });
};

// Update stats when the spinner or target changes
export const updatePlayerStats = (spinner, target, result, prizeNumber, doubleDown) => {
    const spinnerStats = JSON.parse(localStorage.getItem(`playerStats-${spinner.name}`));
    const targetStats = JSON.parse(localStorage.getItem(`playerStats-${target.name}`));

    // Update spinner stats
    spinnerStats.timesSpinner += 1;
    targetStats.timesTargeted += 1;

    if (doubleDown) {
        spinnerStats.timesDoubledDown += 1; // Track double down
    }

    console.log(result.option + result.type)

    // Check the type of action
    if (result.type === 'self') {
        spinnerStats.selfSpins += 1;
        targetStats.targetSurvived += 1;

        if (result.option.match(/Sip[s]?/i)) {
            spinnerStats.sipsReceived += getValue(result.option);
        } else if (result.option.match(/Shot[s]?/i)) {
            spinnerStats.shotsReceived += getValue(result.option);
        } else if (result.option.match(/Chug[s]?/i)) {
            spinnerStats.chugsReceived += getValue(result.option);
        }
    } else {
        if (result.option.match(/Sip[s]?/i)) {
            targetStats.sipsReceived += getValue(result.option);
            spinnerStats.sipsGiven += getValue(result.option);
        } else if (result.option.match(/Shot[s]?/i)) {
            targetStats.shotsReceived += getValue(result.option);
            spinnerStats.shotsGiven += getValue(result.option);
        } else if (result.option.match(/Chug[s]?/i)) {
            targetStats.chugsReceived += getValue(result.option);
            spinnerStats.chugsGiven += getValue(result.option);
        }
    }

    // Save updated stats to localStorage
    localStorage.setItem(`playerStats-${spinner.name}`, JSON.stringify(spinnerStats));
    localStorage.setItem(`playerStats-${target.name}`, JSON.stringify(targetStats));
};

export const rareEventIncrement = (players, spinner, target) => {
    players.forEach(player => {
        const playerStats = JSON.parse(localStorage.getItem(`playerStats-${player.name}`));
        if (playerStats) {
            playerStats.shotsReceived += 1;
            localStorage.setItem(`playerStats-${player.name}`, JSON.stringify(playerStats));
        }
    });
    const spinnerStats = JSON.parse(localStorage.getItem(`playerStats-${spinner.name}`));
    const targetStats = JSON.parse(localStorage.getItem(`playerStats-${target.name}`));

    spinnerStats.timesSpinner += 1;
    targetStats.timesTargeted += 1;

    localStorage.setItem(`playerStats-${spinner.name}`, JSON.stringify(spinnerStats));
    localStorage.setItem(`playerStats-${target.name}`, JSON.stringify(targetStats));
};


// Helper function to get sip value from option
const getValue = (option) => {
    const match = option.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
};
