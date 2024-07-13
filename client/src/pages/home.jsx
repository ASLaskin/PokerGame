import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [name, setName] = useState('');
    const [gameID, setGameID] = useState('');
    const navigate = useNavigate();

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleGameIDChange = (e) => {
        setGameID(e.target.value);
    };

    const handleCreateGame = async () => {
        try {
            //this needs to be change to the server's URL
            const response = await axios.post('http://localhost:3000/api/game/create', { name });
            const createdGameID = response.data.gameID;
            navigate(`/game/${createdGameID}`);
        } catch (error) {
            console.error('Error creating game:', error);
        }
    };

    const handleJoinGame = async () => {
        try {
            await axios.post('http://localhost:3000/api/game/join', { gameID });
            navigate(`/game/${gameID}`);
        } catch (error) {
            console.error('Error joining game:', error);
        }
    };

    return (
        <div className="bg-gray-100 flex justify-center items-center h-screen">
            <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="flex justify-center">
                    <h1 className="text-3xl mb-6">PokerUp</h1>
                </div>
                <div className="flex justify-center">
                    <input
                        type="text"
                        value={name}
                        onChange={handleNameChange}
                        className="border rounded-lg px-4 py-2 mb-4"
                        placeholder="Enter your name"
                    />
                </div>
                <div className="flex justify-center">
                    <button
                        onClick={handleCreateGame}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
                    >
                        Create Game
                    </button>
                </div>
                <div className="flex justify-center mt-4">
                    <input
                        type="text"
                        value={gameID}
                        onChange={handleGameIDChange}
                        className="border rounded-l-lg px-4 py-2 focus:outline-none focus:border-blue-500 w-40"
                        placeholder="Game ID"
                    />
                    <button
                        onClick={handleJoinGame}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-lg"
                    >
                        Join
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;
