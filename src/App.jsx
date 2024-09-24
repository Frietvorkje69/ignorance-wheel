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

    useEffect(() => {
        const fetchPlayers = async () => {
            const response = await fetch('/players.json');
            const data = await response.json();
            setPlayers(data);
        };
        fetchPlayers();
    }, []);

    // Effect to manage body overflow based on modal visibility
    useEffect(() => {
        if (showResultModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [showResultModal]);

    const segments = [
        { option: '1 sip', type: 'kill', style: { backgroundColor: '#131313B2' } },
        { option: '1 sip', type: 'self', style: { backgroundColor: '#C70039' } },
        { option: '2 sips', type: 'kill', style: { backgroundColor: '#131313B2' } },
        { option: '2 sips', type: 'self', style: { backgroundColor: '#C70039' } },
        { option: '3 sips', type: 'kill', style: { backgroundColor: '#131313B2' } },
        { option: '3 sips', type: 'self', style: { backgroundColor: '#C70039' } },
        { option: '2 Shots', type: 'kill', style: { backgroundColor: '#4F7942' } },
        { option: '4 sips', type: 'kill', style: { backgroundColor: '#131313B2' } },
        { option: '4 sips', type: 'self', style: { backgroundColor: '#C70039' } },
        { option: '5 sips', type: 'kill', style: { backgroundColor: '#131313B2' } },
        { option: '5 sips', type: 'self', style: { backgroundColor: '#C70039' } },
        { option: '6 sips', type: 'kill', style: { backgroundColor: '#131313B2' } },
        { option: '6 sips', type: 'self', style: { backgroundColor: '#C70039' } },
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
                setShowResultModal(true);
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

        setTimeout(() => {
            const result = segments[randomPrizeNumber];
            setRouletteResult(result.option);

            if (result.type === 'self') {
                setResultSprite(spinner.deadSprite);
            } else if (result.type === 'kill') {
                setResultSprite(target.deadSprite);
            }

            setIsSpinning(false);
        }, 11500);
    };

    const closeResultModal = () => {
        setShowResultModal(false);
        setStep(4);
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
                            <img src={player.aliveSprite} alt={`${player.name} avatar`} className="player-avatar"/>
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
                    {/* Only show buttons if the result modal is not visible */}
                    {!showResultModal && (
                        <>
                            {!spinStarted && (
                                <button onClick={spinWheel} className="spin-button">
                                    Spin the Wheel
                                </button>
                            )}
                            {!isSpinning && !spinStarted && (
                                <button onClick={() => setStep(4)} className="play-again-button">
                                    Go Back
                                </button>
                            )}
                        </>
                    )}
                </div>

                {showResultModal && (
                    <div className="result-overlay" onClick={closeResultModal}>
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

    if (step === 4) {
        setRouletteResult(null);
        setStep(1);
    }

    return null;
}

export default App;
