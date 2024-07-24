import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTickets } from '../slices/ticketSlice';
import CreateTicket from './CreateTicket';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { tickets, loading, error } = useSelector((state) => state.tickets);
    const { user } = useSelector((state) => state.user);
    console.log("user",user)

    useEffect(() => {
        dispatch(fetchTickets());
    }, [dispatch]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-semibold mb-4">Dashboard</h2>

            {/* Loading state */}
            {loading && <p className="text-gray-600">Loading...</p>}

            {/* Error state */}
            {/* {error && <p className="text-red-500">{error}</p>} */}
            {user && user.role === 'end_user' && <CreateTicket />}
            {/* Ticket list */}
            <ul className="divide-y divide-gray-300">
                {tickets.map((ticket) => (
                    <li key={ticket._id} className="py-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold">{ticket.title}</h3>
                                <p className="text-sm text-gray-600">{ticket.status}</p>
                            </div>
                            <button className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600">Edit</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;

