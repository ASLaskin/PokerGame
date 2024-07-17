import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/purple.jpg';

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

    const handleMatchMake = async () => {
        if (!name) {
            alert('Please enter your name');
            return;
        }
        try {
            const response = await axios.post('http://localhost:3000/api/game/matchMake', { name });
            const matchedGameID = response.data.gameID;
            navigate(`/game/${matchedGameID}`, { state: { name } });
        } catch (error) {
            console.error('Error matchmaking:', error);
        }
    };

    const handleCreateGame = async () => {
        if (!name) {
            alert('Please enter your name');
            return;
        }
        try {
            const response = await axios.post('http://localhost:3000/api/game/create', { name });
            const createdGameID = response.data.gameID;
            navigate(`/game/${createdGameID}`, { state: { name } });
        } catch (error) {
            console.error('Error creating game:', error);
        }
    };

    const handleJoinGame = async () => {
        if (!name) {
            alert('Please enter your name');
            return;
        }
        try {
            await axios.post('http://localhost:3000/api/game/join', { gameID, name });
            navigate(`/game/${gameID}`, { state: { name } });
        } catch (error) {
            console.error('Error joining game:', error);
        }
    };

    return (
        <>
            <header className="flex justify-between items-center p-4 fixed w-full z-20">
                <button className="text-white font-bold text-xl">Store</button>
                <button className="text-white font-bold text-xl">Login</button>
            </header>
            <div className="bg-cover bg-center h-screen flex items-center justify-center" style={{ backgroundImage: `url(${backgroundImage})` }}>
                <div className="bg-black bg-opacity-50 w-full h-full absolute"></div>
                <div className="relative z-10 p-10 rounded-lg shadow-lg max-w-3xl w-full text-center bg-opacity-25  bg-gray-800">
                    <div className="flex flex-col lg:flex-row justify-between items-center h-full">
                        <div className="flex flex-col items-center lg:items-start p-5 text-white">
                            <h1 className="text-7xl font-bold mb-6">POKERUP</h1>
                            <h2 className="text-3xl font-bold mb-6">Get your poker</h2>
                            <input
                                type="text"
                                value={name}
                                onChange={handleNameChange}
                                className="w-full lg:w-auto px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your name"
                            />
                        </div>
                        <div className="flex flex-col items-center lg:items-end p-5 w-full lg:w-auto">
                            <button
                                onClick={handleMatchMake}
                                className="w-full bg-purple-500 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out mb-4 text-xl"
                            >
                                Play
                            </button>
                            <button
                                onClick={handleCreateGame}
                                className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out mb-4 text-xl"
                            >
                                Create Private Game
                            </button>
                            <div className="flex items-center w-full">
                                <input
                                    type="text"
                                    value={gameID}
                                    onChange={handleGameIDChange}
                                    className="flex-grow px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Game ID"
                                />
                                <button
                                    onClick={handleJoinGame}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-lg transition duration-300 ease-in-out text-xl"
                                >
                                    Join
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
