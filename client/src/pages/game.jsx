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

        // if (name) {
        //     console.log('joining game with name:', name);
        //     newSocket.emit('joinGame', gameID, name);
        // }else {
        //    console.log('someone joined using link, time to prompt them for name')
        // }
        newSocket.emit('joinGame', gameID, name);
        newSocket.on('gameStart', (players) => {
            console.log('game started:', players);
            for (let player of players) {
                if (player.name !== name) {
                    setOpponent(player);
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
        <div>
            <h1>Game: {gameID}</h1>
            <h3>Player: {name}</h3>
            <h3>Opponent: {opponent.name}</h3>
        </div>
    );
};

export default Game;
