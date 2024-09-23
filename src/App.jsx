import { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [players, setPlayers] = useState([]);
    const [step, setStep] = useState(1);
    const [spinner, setSpinner] = useState(null);
    const [target, setTarget] = useState(null);
    const [isSpinning, setIsSpinning] = useState(false);
    const [rouletteResult, setRouletteResult] = useState(null);
    const [spinStarted, setSpinStarted] = useState(false);

    useEffect(() => {
        // Fetch players.json from the public folder
        const fetchPlayers = async () => {
            const response = await fetch('/players.json'); // Fetch from public folder
            const data = await response.json();
            setPlayers(data);
        };
        fetchPlayers();
    }, []);

    const segments = [
        { color: 'black', text: '1 sip (Target)' },
        { color: 'red', text: '1 sip (Spinner)' },
        { color: 'black', text: '2 sips (Target)' },
        { color: 'red', text: '2 sips (Spinner)' },
        { color: 'black', text: '3 sips (Target)' },
        { color: 'red', text: '3 sips (Spinner)' },
        { color: 'black', text: '4 sips (Target)' },
        { color: 'red', text: '4 sips (Spinner)' },
        { color: 'black', text: '5 sips (Target)' },
        { color: 'red', text: '5 sips (Spinner)' },
        { color: 'black', text: '6 sips (Target)' },
        { color: 'red', text: '6 sips (Spinner)' },
        { color: 'green', text: 'Shot (Spinner)' },
        { color: 'green', text: 'Shot (Target)' }
    ];

    const spinWheel = () => {
        setSpinStarted(true);
        setIsSpinning(true);
        const randomRotation = Math.floor(Math.random() * 360) + 1440; // Ensure multiple spins (1440 = 4 full spins)

        // Timeout to simulate the end of the spin
        setTimeout(() => {
            const segmentIndex = Math.floor(((randomRotation % 360) / 360) * segments.length); // Determine the segment
            const result = segments[segmentIndex].text;

            setRouletteResult(result);
            setIsSpinning(false);
        }, 5000); // Spin for 5 seconds
    };

    if (players.length === 0) {
        return <div>Loading players...</div>;
    }

    if (step === 1) {
        return (
            <div className="screen">
                <h1>Who is feeling lucky tonight?</h1>
                <div className="player-grid">
                    {players.map((player) => (
                        <div key={player.id} className="player-block" onClick={() => { setSpinner(player); setStep(2); }}>
                            <img src={player.aliveSprite} alt={`${player.name} avatar`} className="player-avatar" />
                            <p>{player.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (step === 2) {
        return (
            <div className="screen">
                <h1>{spinner.name} is the spinner!</h1>
                <h2>Choose your target</h2>
                <div className="player-grid">
                    {players
                        .filter((player) => player.id !== spinner.id)
                        .map((player) => (
                            <div key={player.id} className="player-block" onClick={() => { setTarget(player); setStep(3); }}>
                                <img src={player.aliveSprite} alt={`${player.name} avatar`} className="player-avatar" />
                                <p>{player.name}</p>
                            </div>
                        ))}
                </div>
            </div>
        );
    }

    if (step === 3) {
        return (
            <div className="screen">
                <h1>{spinner.name} vs {target.name}</h1>
                <div className="roulette-container">
                    <div className={`roulette-wheel ${isSpinning ? 'spin' : ''}`}></div>
                </div>
                {rouletteResult ? (
                    <p className="roulette-result">{rouletteResult}</p>
                ) : (
                    <button onClick={spinWheel} disabled={spinStarted}>
                        {spinStarted ? 'Spinning...' : 'Spin the Wheel'}
                    </button>
                )}
                <button onClick={() => setStep(1)} disabled={isSpinning}>Play Again</button>
            </div>
        );
    }

    return null;
}

export default App;
