import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useLocation, useParams } from "react-router-dom";
import './game.css';
import cardImages from '../assets/cards/cardImages';
import cardBack from '../assets/cardback.svg';

const reverseString = (str) => str.split('').reverse().join('');

const getCardImage = (card) => {
    const reversedCardName = reverseString(card);
    if (cardImages[reversedCardName]) {
        return cardImages[reversedCardName];
    } else {
        console.error(`No image found for card: ${card}`);
        console.log('Available card images:', Object.keys(cardImages));
        return null;
    }
};

const Game = () => {
    const { gameID } = useParams();
    const [socket, setSocket] = useState(null);
    const { state } = useLocation();
    const { name } = state;
    const [opponent, setOpponent] = useState('');
    const [currentHand, setCurrentHand] = useState([]);
    const [opponentHand, setOpponentHand] = useState([]); 

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
                } else {
                    setOpponentHand(hand); 
                }
            }
        });

        setSocket(newSocket);

        return () => {
            newSocket.off('gameStart');
            newSocket.off("joinGame");
            newSocket.off("roundStart");
            newSocket.disconnect();
        };
    }, [gameID, name]);

    //bruh
    return (
        <div className="game-board flex flex-col items-center justify-between h-screen bg-center bg-cover bg-no-repeat p-5 box-border text-white">
            <div className="flex flex-col items-center w-full">
                <h3>Opponent: {opponent.name}</h3>
                <div className="flex justify-center mt-2.5">
                    {opponentHand.map((card, index) => (
                        <img 
                            key={index} 
                            src={cardBack} 
                            alt="Card Back" 
                            className="bg-white text-black p-2.5 mx-1 border border-black rounded"
                        />
                    ))}
                </div>
            </div>
            <div className="flex-grow flex justify-center items-center text-white">
                <h1>Game: {gameID}</h1>
            </div>
            <div className="flex flex-col items-center w-full">
                <h3>Player: {name}</h3>
                <div className="flex justify-center mt-2.5">
                    {currentHand.map((card, index) => (
                        <img 
                            key={index} 
                            src={getCardImage(card)} 
                            alt={card} 
                            className="bg-white text-black p-2.5 mx-1 border border-black rounded"
                        />
                    ))}
                </div>
            </div>
            <div className="flex justify-end fixed bottom-5 right-5">
                <button className="text-white border-none py-2 px-5 mx-1 rounded bg-green-700 hover:bg-gray-800">Check</button>
                <button className="text-white border-none py-2 px-5 mx-1 rounded bg-red-700 hover:bg-gray-800">Bet</button>
                <button className="text-white border-none py-2 px-5 mx-1 rounded bg-gray-700 hover:bg-gray-800">Call</button>
                <button className="text-white border-none py-2 px-5 mx-1 rounded bg-purple-700 hover:bg-gray-800">Fold</button>
            </div>
        </div>
    );
};

export default Game;
