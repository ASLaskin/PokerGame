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
    const [chipStack, setChipStack] = useState(1000);
    const [opponentChipStack, setOpponentChipStack] = useState(1000);
    const [gameState, setGameState] = useState('waiting');
    const [table, setTable] = useState([]);

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
            setGameState('inProgress');
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
        newSocket.on("updateTable", (table) => {
          console.log("This ran")
          setTable(table);
        });

        setSocket(newSocket);

        return () => {
            newSocket.off('gameStart');
            newSocket.off("joinGame");
            newSocket.off("roundStart");
            newSocket.off("updateTable");
            newSocket.disconnect();
        };
    }, [gameID, name]);

    const handleBet = () => {
        socket.emit('handleBet', gameID, name);
    };

    const handleCall = () => {
        socket.emit('handleCall', gameID, name);
    };

    const handleCheck = () => {
        socket.emit('handleCheck', gameID, name);
    };

    return (
        <div className="game-board flex flex-col items-center justify-between h-screen bg-center bg-cover bg-no-repeat p-5 box-border text-white">
            <div className="flex flex-col items-center w-full">
                <div className="flex space-x-4">
                    <h3>Opponent: {opponent.name}</h3>
                    <h3>Chip Stack: {opponentChipStack}</h3>
                </div>
                <div className="flex justify-center mt-2.5">
                    {opponentHand.map((card, index) => (
                        <img
                            key={index}
                            src={cardBack}
                            alt="Card Back"
                            className="h-60 p-2.5 mx-1"
                        />
                    ))}
                </div>
            </div>
            {gameState === 'waiting' ? (
                <div className="flex-grow flex justify-center items-center text-white">
                    <h1>Game: {gameID}</h1>
                </div>
            ) : (
                <div className="flex-grow flex justify-center items-center text-white">
                   {table.map((card, index) => (    
                        <img
                            key={index}
                            src={getCardImage(card)}
                            alt={card}
                            className="h-60 p-2.5 mx-1"
                        />
                    ))}
                </div>
            )}
            <div className="flex flex-col items-center w-full">
                <div className="flex space-x-4">
                    <h3>Player: {name}</h3>
                    <h3>Chip Stack: {chipStack} </h3>
                </div>
                <div className="flex justify-center mt-2.5">
                    {currentHand.map((card, index) => (
                        <img
                            key={index}
                            src={getCardImage(card)}
                            alt={card}
                            className="h-60 p-2.5 mx-1"
                        />
                    ))}
                </div>
            </div>
            <div className="controls">
                <button className="button bg-green-700" onClick={handleCheck}>Check</button>
                <button className="button bg-red-700" onClick={handleBet}>Bet</button>
                <button className="button bg-gray-700" onClick={handleCall}>Call</button>
                <button className="button bg-purple-700" >Fold</button>
            </div>
        </div>
    );
};

export default Game;
