import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useLocation, useParams } from "react-router-dom";



const socket = io('localhost:3000');
const Game = () => {
    const { gameID } = useParams();

    const { state } = useLocation();
    const { name } = state;
    const [opponent, setOpponent] = useState('');


    useEffect(() => {
        socket.on('connect', () => {
            console.log('Game page loaded and socket is connected');
            socket.emit('joinGame', gameID);
    
            
            socket.on('counterUpdated', (newCounter) => {
                console.log('Counter updated:', newCounter); 
                setCounter(newCounter);
            });
    
            return () => {
                socket.off('counterUpdated');
            };
        })

    }, [gameID]);


    return (
        <div>
            <h1>Game: {gameID}</h1>
            <h3>Player: {name}</h3>
            <h3>Opponent: {opponent.name}</h3>
        </div>
    );
};

export default Game;
