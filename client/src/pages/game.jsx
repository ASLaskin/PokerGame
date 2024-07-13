import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";

const Game = () => {
    const { gameID } = useParams();
    const [counter, setCounter] = useState(0);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io('http://localhost:3000');

        newSocket.emit('joinGame', gameID);
        newSocket.on('counterUpdated', (newCounter) => {
            console.log('Counter updated:', newCounter);
            setCounter(newCounter);
        });

        setSocket(newSocket);

        return () => {
            newSocket.off('counterUpdated');
            newSocket.disconnect();
        };
    }, [gameID]);

    const handleIncrement = () => {
        if (socket) {
            console.log('Increment button clicked');
            socket.emit('incrementCounter');
        }
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
