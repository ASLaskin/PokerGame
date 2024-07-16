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
            <div className="bg-cover bg-center h-screen flex items-center justify-center" style={{ backgroundImage: `url(${backgroundImage})` }}>
                <div className="bg-black bg-opacity-50 w-full h-full absolute"></div>
                <div className="relative flex flex-col z-10 p-10 rounded-lg shadow-lg max-w-md w-full h-1/2 text-center">
                    <div className='flex flex-col p-5'>
                        <h1 className="text-6xl font-bold mb-6 text-white">POKERUP</h1>
                        <h2 className='text-2xl font-bold text-gray-200'>Get your poker</h2>
                    </div>
                    <input
                        type="text"
                        value={name}
                        onChange={handleNameChange}
                        className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your name"
                    />
                    <button
                        onClick={handleMatchMake}
                        className="w-full bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out mb-4"
                    >
                        Play
                    </button>
                    <button
                        onClick={handleCreateGame}
                        className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out mb-4"
                    >
                        Create Private Game
                    </button>
                    <div className="flex items-center">
                        <input
                            type="text"
                            value={gameID}
                            onChange={handleGameIDChange}
                            className="flex-grow px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Game ID"
                        />
                        <button
                            onClick={handleJoinGame}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-lg transition duration-300 ease-in-out"
                        >
                            Join
                        </button>
                    </div>
                </div>
            </div>
            {/* <div>
                We Play Poker Here
            </div> */}
        </>
    );
};

export default Home;
