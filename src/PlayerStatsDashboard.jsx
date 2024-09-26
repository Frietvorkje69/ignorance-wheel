import React, { useEffect, useState } from 'react';
import './PlayerStatsDashboard.css'; // Import your existing CSS styles

const PlayerStatsDashboard = ({ players, onBack, legacyMode }) => {
    const [playerStats, setPlayerStats] = useState([]);

    useEffect(() => {
        const updatedStats = players.map(player => {
            const storedStats = JSON.parse(localStorage.getItem(`playerStats-${player.name}`)) || {};
            return {
                ...player,
                stats: {
                    ...storedStats,
                    timesSpinner: storedStats.timesSpinner || 0,
                    timesTargeted: storedStats.timesTargeted || 0,
                    selfSpins: storedStats.selfSpins || 0,
                    targetSurvived: storedStats.targetSurvived || 0,
                    sipsGiven: storedStats.sipsGiven || 0,
                    sipsReceived: storedStats.sipsReceived || 0,
                    shotsGiven: storedStats.shotsGiven || 0,
                    shotsReceived: storedStats.shotsReceived || 0,
                    chugsGiven: storedStats.chugsGiven || 0,
                    chugsReceived: storedStats.chugsReceived || 0,
                    timesDoubledDown: storedStats.timesDoubledDown || 0,
                },
            };
        });
        setPlayerStats(updatedStats);
    }, [players]);

    // Utility function to replace 0 with '-'
    const formatStatValue = (value) => {
        return value === 0 ? ' ' : value;
    };

    // Utility function to get class name based on value
    const getClassName = (value, isPositive, isDoubleDown = false) => {
        if (value === 0 || formatStatValue(value) === ' ') {
            return 'no-color'; // No color for dash or zero
        }
        return isDoubleDown ? 'doubled-down' : (isPositive ? 'positive' : 'negative');
    };

    return (
        <div className="dashboard-container fade-in">
            <h1>Player Stats Dashboard</h1>
            <table className="stats-table">
                <thead>
                <tr>
                    <th>Player</th>
                    <th>Times Spinner</th>
                    <th>Times Targeted</th>
                    <th>Self Spins</th>
                    <th>Survived Target</th>
                    <th>Sips Given</th>
                    <th>Sips Received</th>
                    <th>Shots Given</th>
                    <th>Shots Received</th>
                    <th>Chugs Given</th>
                    <th>Chugs Received</th>
                    <th className="doubled-down">Times Doubled Down</th>
                </tr>
                </thead>
                <tbody>
                {playerStats.map(player => (
                    <tr key={player.id}>
                        <td>
                            <img
                                src={legacyMode ? player.legacyAliveSprite : player.aliveSprite}
                                alt={player.name}
                                className="player-avatar-dashboard"
                            />
                        </td>
                        <td className={getClassName(player.stats.timesSpinner, true)}>
                            {formatStatValue(player.stats.timesSpinner)}
                        </td>
                        <td className={getClassName(player.stats.timesTargeted, false)}>
                            {formatStatValue(player.stats.timesTargeted)}
                        </td>
                        <td className={getClassName(player.stats.selfSpins, false)}>
                            {formatStatValue(player.stats.selfSpins)}
                        </td>
                        <td className={getClassName(player.stats.targetSurvived, true)}>
                            {formatStatValue(player.stats.targetSurvived)}
                        </td>
                        <td className={getClassName(player.stats.sipsGiven, true)}>
                            {formatStatValue(player.stats.sipsGiven)}
                        </td>
                        <td className={getClassName(player.stats.sipsReceived, false)}>
                            {formatStatValue(player.stats.sipsReceived)}
                        </td>
                        <td className={getClassName(player.stats.shotsGiven, true)}>
                            {formatStatValue(player.stats.shotsGiven)}
                        </td>
                        <td className={getClassName(player.stats.shotsReceived, false)}>
                            {formatStatValue(player.stats.shotsReceived)}
                        </td>
                        <td className={getClassName(player.stats.chugsGiven, true)}>
                            {formatStatValue(player.stats.chugsGiven)}
                        </td>
                        <td className={getClassName(player.stats.chugsReceived, false)}>
                            {formatStatValue(player.stats.chugsReceived)}
                        </td>
                        <td className={getClassName(player.stats.timesDoubledDown, true, true)}>
                            {formatStatValue(player.stats.timesDoubledDown)}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <button onClick={onBack} className="back-button">Back</button>
        </div>
    );
};

export default PlayerStatsDashboard;
