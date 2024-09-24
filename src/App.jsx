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
    const [showResultModal, setShowResultModal] = useState(false);
    const [resultSprite, setResultSprite] = useState(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [spinCompleted, setSpinCompleted] = useState(false);  // New state

    useEffect(() => {
        const fetchPlayers = async () => {
            const response = await fetch('/players.json');
            const data = await response.json();
            setPlayers(data);
        };
        fetchPlayers();
    }, []);

    useEffect(() => {
        if (showResultModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'hidden';
            setResultSprite(null);  // Clear previous sprite when modal closes
            setImageLoaded(false);  // Reset image loaded state
        }
    }, [showResultModal]);

    const segments = [
        { option: '1 sip', type: 'kill', style: { backgroundColor: '#131313B2' } },
        { option: '1 sip', type: 'self', style: { backgroundColor: '#C70039' } },
        { option: '2 sips', type: 'kill', style: { backgroundColor: '#131313B2' } },
        { option: '2 sips', type: 'self', style: { backgroundColor: '#C70039' } },
        { option: '3 sips', type: 'kill', style: { backgroundColor: '#131313B2' } },
        { option: '3 sips', type: 'self', style: { backgroundColor: '#C70039' } },
        { option: '4 sips', type: 'kill', style: { backgroundColor: '#131313B2' } },
        { option: '2 Shots', type: 'kill', style: { backgroundColor: '#4F7942' } },
        { option: '4 sips', type: 'self', style: { backgroundColor: '#C70039' } },
        { option: '5 sips', type: 'kill', style: { backgroundColor: '#131313B2' } },
        { option: '5 sips', type: 'self', style: { backgroundColor: '#C70039' } },
        { option: '6 sips', type: 'kill', style: { backgroundColor: '#131313B2' } },
        { option: '6 sips', type: 'self', style: { backgroundColor: '#C70039' } },
        { option: 'Chug', type: 'kill', style: { backgroundColor: '#131313B2' } },
        { option: 'Chug', type: 'self', style: { backgroundColor: '#C70039' } },
        { option: '2 Shots', type: 'self', style: { backgroundColor: '#4F7942' } }
    ];

    const rouletteWheel = (
        <Wheel
            mustStartSpinning={spinStarted}
            prizeNumber={prizeNumber}
            data={segments}
            textColors={['#ffffff']}
            textDistance={65}
            onStopSpinning={() => {
                setSpinStarted(false);
                setSpinCompleted(true);  // Set spinCompleted to true when spinning stops
                preloadImage(); // Preload the image before showing the modal
            }}
            innerRadius={27}
            outerBorderWidth={10}
            innerBorderColor={['#ffffff']}
            radiusLineColor={['#be8d15']}
            radiusLineWidth={4}
            pointerProps={{ src: '/img/customPointer.png' }}
        />
    );

    const spinWheel = () => {
        if (isSpinning) return;

        const randomPrizeNumber = Math.floor(Math.random() * segments.length);
        setPrizeNumber(randomPrizeNumber);
        setSpinStarted(true);
        setIsSpinning(true);
        setSpinCompleted(false); // Reset spinCompleted state before spinning

        setTimeout(() => {
            const result = segments[randomPrizeNumber];
            setRouletteResult(result.option);
            setIsSpinning(false);
        }, 11500);
    };

    const preloadImage = () => {
        const result = segments[prizeNumber];
        const img = new Image();

        if (result.type === 'self') {
            img.src = spinner.deadSprite;
            setResultSprite(spinner.deadSprite);
        } else if (result.type === 'kill') {
            img.src = target.deadSprite;
            setResultSprite(target.deadSprite);
        }

        img.onload = () => {
            setImageLoaded(true); // Image is fully loaded
            setShowResultModal(true); // Now show the modal
        };
    };

    const closeResultModal = () => {
        setShowResultModal(false);
        setRouletteResult(null);
        setStep(1);
        setSpinCompleted(false);  // Reset spinCompleted state when modal is closed
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
                        <div key={player.id} className="player-block" onClick={() => {
                            setSpinner(player);
                            setStep(2);
                        }}>
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
                <div className="versus-container">
                    <div className="player-sprite-container">
                        <img src={spinner.aliveSprite} alt={`${spinner.name} sprite`} className="versus-sprite" />
                        <p>{spinner.name}</p>
                    </div>
                    <div className="vs-text">
                        <p>vs.</p>
                    </div>
                    <div className="player-sprite-container">
                        <img src={target.aliveSprite} alt={`${target.name} sprite`} className="versus-sprite" />
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
                    {/* Update the condition to hide buttons based on spinCompleted and showResultModal */}
                    {!spinStarted && !showResultModal && !spinCompleted && (
                        <>
                            <button onClick={spinWheel} className="spin-button">
                                Spin the Wheel
                            </button>
                            <button onClick={() => setStep(4)} className="play-again-button">
                                Go Back
                            </button>
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
            </div>
        );
    }

    return null;
}

export default App;
