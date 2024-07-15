import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";

const socket = io('localhost:3000');

const Game = () => {
    const { gameID } = useParams();
    const [counter, setCounter] = useState(0);

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

    const handleIncrement = () => {
        console.log('Increment button clicked'); 
        socket.emit('incrementCounter');
    };

    return (
        <div>
            <h1>Game: {gameID}</h1>
            <h2>Counter: {counter}</h2>
            <button onClick={handleIncrement}>Increment Counter</button>
        </div>
    );
};

export default Game;
