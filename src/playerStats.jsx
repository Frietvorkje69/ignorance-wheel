// playerStats.js

// Initialize player stats if not already in localStorage
export const initializePlayerStats = (players) => {
    players.forEach(player => {
        const storedStats = localStorage.getItem(`playerStats-${player.name}`);
        if (!storedStats) {
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
            localStorage.setItem(`playerStats-${player.name}`, JSON.stringify(initialStats));
        }
    });
};

// Update stats when the spinner or target changes
export const updatePlayerStats = (spinner, target, result, prizeNumber, doubleDown) => {
    const spinnerStats = JSON.parse(localStorage.getItem(`playerStats-${spinner.name}`));
    const targetStats = JSON.parse(localStorage.getItem(`playerStats-${target.name}`));

    // Update spinner stats
    spinnerStats.timesSpinner += 1;
    if (doubleDown) {
        spinnerStats.timesDoubledDown += 1; // Track double down
    }

    if (result.type === 'self') {
        spinnerStats.selfSpins += 1;
        spinnerStats.sipsReceived += getSipValue(result.option); // Spinner drinks for 'self'
        // If spinner landed on self and target was chosen, target survived
        targetStats.targetSurvived += 1;
    } else {
        spinnerStats.sipsGiven += getSipValue(result.option); // Spinner gives sips or shots
    }
    if (result.option.includes('Shot')) {
        spinnerStats.shotsGiven += getShotValue(result.option);
    }
    if (result.option.includes('Chug')) {
        spinnerStats.chugsGiven += getChugValue(result.option);
    }

    // Update target stats
    targetStats.timesTargeted += 1;
    if (result.type === 'kill') {
        targetStats.sipsReceived += getSipValue(result.option); // Target drinks for 'kill'
    }
    if (result.option.includes('Shot')) {
        targetStats.shotsReceived += getShotValue(result.option);
    }
    if (result.option.includes('Chug')) {
        targetStats.chugsReceived += getChugValue(result.option);
    }

    // Save updated stats to localStorage
    localStorage.setItem(`playerStats${spinner.name}`, JSON.stringify(spinnerStats));
    localStorage.setItem(`playerStats-${target.name}`, JSON.stringify(targetStats));
};

// Helper function to get sip value from option
const getSipValue = (option) => {
    const match = option.match(/\d+/); // Extract the number of sips
    return match ? parseInt(match[0], 10) : 0;
};

// Helper function to get shot value from option
const getShotValue = (option) => {
    return option.includes('Shot') ? (option.includes('3 Shots') ? 3 : 1) : 0;
};

// Helper function to get chug value from option
const getChugValue = (option) => {
    return option.includes('Chug') ? (option.includes('Chug 2') ? 2 : 1) : 0;
};

