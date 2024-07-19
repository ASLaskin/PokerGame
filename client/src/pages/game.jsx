import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useLocation, useParams } from "react-router-dom";
import './game.css';

const Game = () => {
    const { gameID } = useParams();
    const [socket, setSocket] = useState(null);
    const { state } = useLocation();
    const { name } = state;
    const [opponent, setOpponent] = useState('');
    const [currentHand, setCurrentHand] = useState([]);

    useEffect(() => {
        const newSocket = io('http://localhost:3000');

        newSocket.emit('joinGame', gameID, name);
        newSocket.on('gameStart', (players) => {
            console.log('game started:', players);
            for (let player of players) {
                if (player.name !== name) {
                    setOpponent(player);
                }
            }
            newSocket.emit('startRound', gameID);
        });
        newSocket.on('roundStart', (handsArray) => {
            console.log('getting hands:', handsArray);
            const hands = new Map(handsArray);
            for (let [player, hand] of hands) {
                if (player === name) {
                    setCurrentHand(hand);
                }
            }
        });

        setSocket(newSocket);

        return () => {
            newSocket.off('gameStart');
            newSocket.off("joinGame");
            newSocket.disconnect();
        };
    }, [gameID, name]);


    return (
        <div className="game-board">
            <div className="opponent">
                <h3>Opponent: {opponent.name}</h3>
            </div>
            <div className="table">
                <h1>Game: {gameID}</h1>
            </div>
            <div className="player">
                <h3>Player: {name}</h3>
                <div className="hand">
                    {currentHand.map((card, index) => (
                        <span key={index} className="card">{card}</span>
                    ))}
                </div>
            </div>
            <div className="controls">
                <button className="button bg-green-700">Check</button>
                <button className="button bg-red-700" >Bet</button>
                <button className="button bg-gray-700" >Call</button>
                <button className="button bg-purple-700" >Fold</button>
            </div>
        </div>
    );
};

export default Game;
