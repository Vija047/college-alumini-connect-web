import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {  AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaTrophy, FaSearch, FaPlus, FaCalendarAlt } from 'react-icons/fa';

const AchievementsFeed = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [achievements, setAchievements] = useState([]);
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const navigate = useNavigate();

    const handleBackButton = () => {
        navigate("/");
    };

    useEffect(() => {
        const fetchAchievements = async () => {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');

            if (!token || !userId) {
                setIsLoading(false);
                return;
            }

            try {
                const res = await fetch(`https://alumini-connect-backend.vercel.app/api/users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error('Failed to fetch user data');

                const data = await res.json();
                const userAchievements = data.achievements || [];

                const formatted = userAchievements.map((ach, index) => ({
                    id: index,
                    title: ach.title,
                    description: ach.description,
                    date: new Date(ach.date).toLocaleDateString(),
                    icon: getRandomIcon(),
                }));

                setAchievements(formatted.reverse());
            } catch (err) {
                console.error('Error fetching achievements:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAchievements();
    }, []);

    const handlePostAchievement = async () => {
        if (!title || !description || !date) {
            return;
        }

        setIsSubmitting(true);
        const token = localStorage.getItem('token');
        if (!token) {
            setIsSubmitting(false);
            return alert("User not authenticated");
        }

        const newAchievement = { title, description, date };

        try {
            const res = await fetch('https://alumini-connect-backend.vercel.app/api/achievements/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newAchievement),
            });

            if (!res.ok) throw new Error('Failed to add achievement');

            const updatedAchievements = await res.json();

            const formatted = updatedAchievements.map((ach, index) => ({
                id: index,
                title: ach.title,
                description: ach.description,
                date: new Date(ach.date).toLocaleDateString(),
                icon: getRandomIcon(),
            }));

            setAchievements(formatted.reverse());
            setTitle('');
            setDescription('');
            setDate('');

            setSuccessMessage('Achievement added successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            console.error(err);
            alert('Error posting achievement');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getRandomIcon = () => {
        const icons = ['award', 'certificate', 'medal', 'trophy', 'star'];
        return icons[Math.floor(Math.random() * icons.length)];
    };

    const filteredAchievements = achievements.filter(
        (ach) =>
            ach.title.toLowerCase().includes(search.toLowerCase()) ||
            ach.description.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-6xl mx-auto p-4 sm:p-6 pb-20 mt-12 text-gray-900"
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <FaTrophy className="text-yellow-500 text-3xl" />
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            My Achievements
                        </h1>
                    </div>
                    <p className="text-gray-600 text-lg">Track and showcase your professional accomplishments</p>
                </div>

                <button
                    onClick={handleBackButton}
                    className="flex items-center gap-2 bg-white shadow-md hover:shadow-lg transition-all mt-4 md:mt-0 text-gray-700 font-medium px-4 py-2 rounded-full"
                >
                    <FaArrowLeft className="text-blue-600" /> Back to Dashboard
                </button>
            </div>

            {/* Input Form */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white shadow-lg rounded-2xl p-6 mb-8 space-y-5 border-l-4 border-blue-500"
            >
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Achievement</h2>

                <div className="grid gap-5 md:grid-cols-2">
                    <div>
                        <label htmlFor="title" className="block mb-1 text-sm font-medium text-gray-700">Achievement Title</label>
                        <input
                            id="title"
                            type="text"
                            placeholder="E.g., Completed Project, Award Won..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>

                    <div>
                        <label htmlFor="date" className="block mb-1 text-sm font-medium text-gray-700">Date Achieved</label>
                        <div className="relative">
                            <input
                                id="date"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                            <FaCalendarAlt className="absolute right-4 top-3.5 text-gray-500" />
                        </div>
                    </div>
                </div>

                <div>
                    <label htmlFor="description" className="block mb-1 text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        id="description"
                        rows="3"
                        placeholder="Describe your achievement and why it matters..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                </div>

                <div className="flex justify-between items-center pt-2">
                    <AnimatePresence>
                        {successMessage && (
                            <motion.span
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0 }}
                                className="text-green-600 font-medium flex items-center"
                            >
                                {successMessage}
                            </motion.span>
                        )}
                    </AnimatePresence>

                    <button
                        onClick={handlePostAchievement}
                        disabled={isSubmitting || !title || !description || !date}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium transition-all
              ${(!title || !description || !date)
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:opacity-90'}`}
                    >
                        {isSubmitting ?
                            'Saving...' :
                            <>
                                <FaPlus /> Add Achievement
                            </>
                        }
                    </button>
                </div>
            </motion.div>

            {/* Search */}
            <div className="mb-8 relative">
                <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search your achievements..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full border border-gray-300 bg-white shadow rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
            </div>

            {/* Achievements List */}
            {isLoading ? (
                <div className="flex justify-center py-10">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : filteredAchievements.length === 0 ? (
                <div className="bg-white shadow-md rounded-2xl p-10 text-center">
                    <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <FaTrophy className="text-gray-400 text-2xl" />
                    </div>
                    <p className="text-xl text-gray-500 mb-2">No achievements to show</p>
                    <p className="text-gray-400">Add your first achievement using the form above</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    <AnimatePresence>
                        {filteredAchievements.map((ach, index) => (
                            <motion.div
                                key={ach.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white shadow-md hover:shadow-lg transition-all rounded-2xl overflow-hidden"
                            >
                                <div className="p-6 border-l-4 border-blue-500">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-start gap-3">
                                            <div className={`p-2 rounded-full bg-blue-50 text-blue-600`}>
                                                <FaTrophy />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-semibold text-gray-800">{ach.title}</h2>
                                                <span className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                                    <FaCalendarAlt className="text-blue-500" /> {ach.date}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{ach.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </motion.div>
    );
};

export default AchievementsFeed;
