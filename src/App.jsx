import { useState, useEffect } from 'react';
import { Wheel } from 'react-custom-roulette';
import './App.css';

function App() {
    const [players, setPlayers] = useState([]);
    const [step, setStep] = useState(1);
    const [spinner, setSpinner] = useState(null);
    const [target, setTarget] = useState(null);
    const [isSpinning, setIsSpinning] = useState(false);
    const [rouletteResult, setRouletteResult] = useState(null);
    const [spinStarted, setSpinStarted] = useState(false);
    const [prizeNumber, setPrizeNumber] = useState(0);


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
        { option: '1 sip (kill)', style: { backgroundColor: '#131313B2',} },
        { option: '1 sip (self)', style: { backgroundColor: '#C70039',} },
        { option: '2 sips (kill)', style: { backgroundColor: '#131313B2'} },
        { option: '2 sips (self)', style: { backgroundColor: '#C70039'} },
        { option: '3 sips (kill)', style: { backgroundColor: '#131313B2'} },
        { option: '3 sips (self)', style: { backgroundColor: '#C70039'} },
        { option: '2 Shots (kill)', style: { backgroundColor: '#4F7942'} },
        { option: '4 sips (kill)', style: { backgroundColor: '#131313B2'} },
        { option: '4 sips (self)', style: { backgroundColor: '#C70039'} },
        { option: '5 sips (kill)', style: { backgroundColor: '#131313B2'} },
        { option: '5 sips (self)', style: { backgroundColor: '#C70039'} },
        { option: '6 sips (kill)', style: { backgroundColor: '#131313B2'} },
        { option: '6 sips (self)', style: { backgroundColor: '#C70039'} },
        { option: '2 Shots (self)', style: { backgroundColor: '#4F7942'} }
    ];

    const rouletteWheel = (
        <Wheel
            mustStartSpinning={spinStarted}
            prizeNumber={prizeNumber}
            data={segments}
            textColors={['#ffffff']}
            textDistance={65}
            onStopSpinning={() => setSpinStarted(false)}
            innerRadius={27} e
            outerBorderWidth={10}
            innerBorderColor={['#ffffff']}
            radiusLineColor={['#be8d15']}
            radiusLineWidth={4}
            // pointerProps={ src: roulettePointer }

        />
    );

    const spinWheel = () => {
        if (isSpinning) return; // Prevent multiple spin initiations

        const randomPrizeNumber = Math.floor(Math.random() * segments.length);
        setPrizeNumber(randomPrizeNumber); // Set the prizeNumber first

        setSpinStarted(true);
        setIsSpinning(true);

        // Timeout to simulate the end of the spin
        setTimeout(() => {
            setRouletteResult(segments[randomPrizeNumber].option);
            setIsSpinning(false);
            setSpinStarted(false);
        }, 11500);
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
                    {rouletteWheel}
                </div>
                {rouletteResult ? (
                    <p className="roulette-result">{rouletteResult}</p>
                ) : (
                    <button onClick={spinWheel} disabled={spinStarted}>
                        {spinStarted ? 'Spinning...' : 'Spin the Wheel'}
                    </button>
                )}
                <button onClick={() => setStep(4)}   disabled={isSpinning}>Play Again</button>
            </div>
        );
    }

    if (step === 4) {
        setRouletteResult(null);
        setStep(1);
    }

    return null;
}

export default App;
