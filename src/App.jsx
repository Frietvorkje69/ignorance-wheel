import { useState, useEffect } from 'react';
import { Wheel } from 'react-custom-roulette';
import { initializePlayerStats, updatePlayerStats, rareEventIncrement } from './playerStats'; // Import the functions
import PlayerStatsDashboard from './PlayerStatsDashboard'; // Import the new dashboard component
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
    const [showResultModal, setShowResultModal] = useState(false);
    const [resultSprite, setResultSprite] = useState(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [spinCompleted, setSpinCompleted] = useState(false);
    const [legacyMode, setLegacyMode] = useState(false);
    const [doubleDown, setDoubleDown] = useState(false);
    const [rareEventTriggered, setRareEventTriggered] = useState(false);
    const [rareEventClickable, setRareEventClickable] = useState(false);
    const [errorImage, setErrorImage] = useState(null); // Add state for the preloaded error image

    useEffect(() => {
        const fetchPlayers = async () => {
            const response = await fetch('/players.json');
            const data = await response.json();
            setPlayers(data);
            initializePlayerStats(data); // Initialize player stats after fetching players
        };
        fetchPlayers();
    }, []);

    useEffect(() => {
        if (showResultModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'hidden';
            setResultSprite(null);
            setImageLoaded(false);
        }
    }, [showResultModal]);

    const getSegments = () => {
        return [
            { option: doubleDown ? '2 Sips' : '1 Sip', type: 'kill', style: { backgroundColor: '#131313B2' } },
            { option: doubleDown ? '3 Sips' : '1 Sip', type: 'self', style: { backgroundColor: '#C70039' } },
            { option: doubleDown ? '4 Sips' : '2 Sips', type: 'kill', style: { backgroundColor: '#131313B2' } },
            { option: doubleDown ? '6 Sips' : '2 Sips', type: 'self', style: { backgroundColor: '#C70039' } },
            { option: doubleDown ? '6 Sips' : '3 Sips', type: 'kill', style: { backgroundColor: '#131313B2' } },
            { option: doubleDown ? '9 Sips' : '3 Sips', type: 'self', style: { backgroundColor: '#C70039' } },
            { option: doubleDown ? '8 Sips' : '4 Sips', type: 'kill', style: { backgroundColor: '#131313B2' } },
            { option: doubleDown ? '2 Shots' : '1 Shot', type: 'kill', style: { backgroundColor: '#4F7942' } },
            { option: doubleDown ? '12 Sips' : '4 Sips', type: 'self', style: { backgroundColor: '#C70039' } },
            { option: doubleDown ? '10 Sips' : '5 Sips', type: 'kill', style: { backgroundColor: '#131313B2' } },
            { option: doubleDown ? '15 Sips' : '5 Sips', type: 'self', style: { backgroundColor: '#C70039' } },
            { option: doubleDown ? '12 Sips' : '6 Sips', type: 'kill', style: { backgroundColor: '#131313B2' } },
            { option: doubleDown ? '18 Sips' : '6 Sips', type: 'self', style: { backgroundColor: '#C70039' } },
            { option: doubleDown ? '2 Chugs' : '1 Chug', type: 'kill', style: { backgroundColor: '#131313B2' } },
            { option: doubleDown ? '3 Chugs' : '1 Chug', type: 'self', style: { backgroundColor: '#C70039' } },
            { option: doubleDown ? '3 Shots' : '1 Shot', type: 'self', style: { backgroundColor: '#4F7942' } }
        ];
    };

    const rouletteWheel = (
        <Wheel
            mustStartSpinning={spinStarted}
            prizeNumber={prizeNumber}
            data={getSegments()}
            textColors={['#ffffff']}
            textDistance={65}
            onStopSpinning={() => {
                setSpinStarted(false);
                setSpinCompleted(true);
                preloadImage();
            }}
            innerRadius={27}
            outerBorderWidth={10}
            innerBorderColor={['#ffffff']}
            radiusLineColor={['#be8d15']}
            radiusLineWidth={4}
            pointerProps={{ src: '/img/customPointer.png' }}
        />
    );

    const resetGame = () => {
        setStep(1);
        setRouletteResult(null);
        setShowResultModal(false);
        setSpinCompleted(false);
        setDoubleDown(false);
        setRareEventTriggered(false);
        setRareEventClickable(false);
    };

    const spinWheel = () => {
        if (isSpinning) return;

        const randomPrizeNumber = Math.floor(Math.random() * getSegments().length);
        setPrizeNumber(randomPrizeNumber);

        setSpinStarted(true);
        setIsSpinning(true);
        setSpinCompleted(false);

        let rareEventTriggeredLocal = false; // Local variable to track the rare event

        if (Math.random() < 0.01) { // 1/100 chance
            preloadErrorImage(); // Preload the error image during the delay
            rareEventTriggeredLocal = true;
            setTimeout(() => {
                setRareEventTriggered(true);
                rareEventIncrement(players, spinner, target); // Increment shotsReceived for all players
                setTimeout(() => setRareEventClickable(true), 15000); // Enable clicking after 15 seconds
            }, 2000); // Show blue screen after 2 sec
        }

        setTimeout(() => {
            const result = getSegments()[randomPrizeNumber];
            setRouletteResult(result.option);
            setIsSpinning(false);

            if (!rareEventTriggeredLocal) {
                updatePlayerStats(spinner, target, result, prizeNumber, doubleDown);
            }
        }, 11500);
    };

    const preloadImage = () => {
        const result = getSegments()[prizeNumber]; // Update for segments function
        const img = new Image();

        if (result.type === 'self') {
            img.src = legacyMode ? spinner.legacyDeadSprite : spinner.deadSprite;
            setResultSprite(legacyMode ? spinner.legacyDeadSprite : spinner.deadSprite);
        } else if (result.type === 'kill') {
            img.src = legacyMode ? target.legacyDeadSprite : target.deadSprite;
            setResultSprite(legacyMode ? target.legacyDeadSprite : target.deadSprite);
        }

        img.onload = () => {
            setImageLoaded(true);
            setShowResultModal(true);
        };
    };

    const preloadErrorImage = () => {
        const img = new Image();
        img.src = '/img/error.png';
        img.onload = () => {
            setErrorImage(img.src); // Store the preloaded image URL in the state
        };
    };

    const closeResultModal = () => {
        setStep(4);
    };

    const handleDoubleDown = () => {
        setDoubleDown(true); // Toggle the double down effect
    };

    if (players.length === 0) {
        return <div>Loading players...</div>;
    }

    if (step === 1) {
        return (
            <div className="screen">
                <h1>Wheel of Ignorance</h1>
                <h2>Who is feeling lucky tonight?</h2>
                <div className="player-grid">
                    {players.map((player) => (
                        <div key={player.id} className="player-block"
                             onClick={() => {
                                 setSpinner(player);
                                 setStep(2);
                             }}>
                            <img
                                src={legacyMode ? player.legacyAliveSprite : player.aliveSprite}
                                alt={`${player.name} avatar`}
                                className="player-avatar"
                            />
                            <p>{player.name}</p>
                        </div>
                    ))}
                </div>
                <div className="button-container">
                    <button onClick={() => setLegacyMode(prev => !prev)} className="legacy-button">
                        {legacyMode ? 'Switch to Modern' : 'Switch to Legacy'}
                    </button>
                    <button onClick={() => setStep(5)} className="dashboard-button">Statistics</button>
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
                            <div key={player.id} className="player-block"
                                 onClick={() => {
                                     setTarget(player);
                                     setStep(3);
                                 }}>
                                <img
                                    src={legacyMode ? player.legacyAliveSprite : player.aliveSprite}
                                    alt={`${player.name} avatar`}
                                    className="player-avatar"
                                />
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
                <div className="versus-container">
                    <div className="player-sprite-container">
                        <img
                            src={legacyMode ? spinner.legacyAliveSprite : spinner.aliveSprite}
                            alt={`${spinner.name} sprite`}
                            className="versus-sprite"
                        />
                        <p>{spinner.name}</p>
                    </div>
                    <div className="vs-text">
                        <p>vs.</p>
                    </div>
                    <div className="player-sprite-container">
                        <img
                            src={legacyMode ? target.legacyAliveSprite : target.aliveSprite}
                            alt={`${target.name} sprite`}
                            className="versus-sprite"
                        />
                        <p>{target.name}</p>
                    </div>
                </div>
                <div className="roulette-container">
                    {rouletteWheel}
                    <div className="legend">
                        <div className="legend-item">
                            <span className="color-box kill"></span> Kill
                        </div>
                        <div className="legend-item">
                            <span className="color-box self"></span> Self
                        </div>
                    </div>
                </div>

                <div className="button-container">
                    {!spinStarted && !showResultModal && !spinCompleted && (
                        <>
                            <button onClick={spinWheel} className="spin-button">
                                Spin the Wheel
                            </button>
                            <div className="double-down-container">
                                <button
                                    onClick={handleDoubleDown}
                                    className="double-down-button"
                                    disabled={doubleDown} // Disable if already activated
                                >
                                    {doubleDown ? 'Doubled Down!' : 'Double Down'}
                                </button>
                                {!doubleDown && (
                                    <div className="tooltip">Double the attack, triple the consequences.</div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {showResultModal && imageLoaded && (
                    <div className="result-overlay fade-in" onClick={closeResultModal}>
                        <div className="result-content">
                            <img
                                src={resultSprite}
                                alt={`${spinner.name} or ${target.name} dead sprite`}
                                className="result-dead-sprite"
                            />
                            <h2 className="result-text">{rouletteResult}</h2>
                        </div>
                    </div>
                )}

                {rareEventTriggered && (
                    <div
                        className="rare-event-overlay"
                        onClick={() => rareEventClickable && setStep(4)} // Only allow click if clickable
                    >
                        <img src={errorImage} alt="Rare Event" className="rare-event-image" /> {/* Use preloaded errorImage */}
                    </div>
                )}
            </div>
        );
    }

    if (step === 4) {

        resetGame()

        return null;
    }

    if (step === 5) { // Dashboard step
        return (
            <PlayerStatsDashboard
                players={players}
                onBack={() => setStep(1)} // Go back to main screen
                legacyMode={legacyMode}
            />
        );
    }

    return null;
}

export default App;