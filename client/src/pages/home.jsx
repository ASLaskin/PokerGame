import React, { useState } from 'react';

const Home = () => {
    const [name, setName] = useState('');

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleCreateGame = () => {
        console.log(`Creating game with name: ${name}`);
    };

    const handleJoinGame = () => {
        const gameId = document.getElementById('gameCodeInput').value;
        console.log(`Joining game ${gameId} with name: ${name}`);
    };

    return (
        <div className="bg-gray-100 flex justify-center items-center h-screen">
            <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="flex justify-center">
                    <h1 className="text-3xl mb-6">PokerUp</h1>
                </div>
                <div className="flex justify-center mb-8">
                    <input
                        type="text"
                        value={name}
                        onChange={handleNameChange}
                        className="border rounded-lg px-4 py-2 focus:outline-none focus:border-green-500 w-60"
                        placeholder="Enter Your Name"
                    />
                </div>
                <div className="flex justify-center mb-4">
                    <button
                        onClick={handleCreateGame}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg mr-4"
                    >
                        Create New Game
                    </button>
                    <button
                        onClick={handleJoinGame}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                    >
                        Join Game
                    </button>
                </div>
                <div className="flex justify-center">
                    <div className="mr-4">
                        <div className="flex justify-center">
                            <h2 className="text-xl mb-4">Join Specific Game</h2>
                        </div>
                        <div className="flex mb-4">
                            <input
                                id="gameCodeInput"
                                type="text"
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
            </div>
        </div>
    );
};

export default Home;
