import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useLocation, useParams } from "react-router-dom";

const Game = ({}) => {
    const { gameID } = useParams();
    const [socket, setSocket] = useState(null);
    const { state } = useLocation();
    const { name } = state;
    const [opponent, setOpponent] = useState('');


    useEffect(() => {
        const newSocket = io('http://localhost:3000');

        newSocket.emit('joinGame', gameID, name);
        newSocket.on('gameStart', (players) => {
            console.log('game started:', players);
            const opponent = players.find((player) => player !== name);
            setOpponent(opponent);
            console.log('opponent:', opponent);
        });


        setSocket(newSocket);

        return () => {
            //newSocket.off('counterUpdated');
            newSocket.disconnect();
        };
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
