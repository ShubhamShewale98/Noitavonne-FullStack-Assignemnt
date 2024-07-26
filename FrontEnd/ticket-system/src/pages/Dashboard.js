


import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { fetchTickets } from '../slices/ticketSlice';
// import { fetchTickets, resolveTicket, rejectTicket, addReply, assignTicket } from '../slices/ticketSlice';
import CreateTicket from './CreateTicket';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import Loader from './Loader';
import userLogo from '../images/userLogo.png'; // Import the image

const Dashboard = () => {
    const [isCreateTicket, setIsCreateTicket] = useState(false);
    const [replies, setReplies] = useState({});
    const [customReply, setCustomReply] = useState("");
    const [selectedUser, setSelectedUser] = useState({});
    const [selectedTicketId, setSelectedTicketId] = useState("");

    const [users, setUser] = useState([]);
    // const [selectedUser,setSelectedUser] = useState()
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { tickets, loading, error } = useSelector((state) => state.tickets);
    // const { user } = useSelector((state) => state.user);
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    // const { users } = useSelector((state) => state.users); // Assuming you have a list of users
    // const users  = [{name:"yeas",_id:"objID"},{name:"sonu",_id:"objID"},{name:"sani",_id:"objID"},{name:"soma",_id:"objID"}]



    useEffect(() => {
        console.log("user", user)
        if (!user) {
            navigate("/login");
        } else {
            dispatch(fetchTickets());
            getUserList()
        }
    }, [isCreateTicket]);

    useEffect(() => {
        console.log("user", user)
        if (!user) {
            navigate("/login");
        }
    }, [user]);
    const getUserList = async () => {
        try {
            let res = await axios.get('http://localhost:5000/api/users/techsupport', {
                headers: { Authorization: `Bearer ${user?.token}` },
            })
            console.log("res", res)
            setUser(res?.data?.users)
        } catch (error) {
            console.log("error", error)
            enqueueSnackbar('Error', { variant: 'error' })

        }
    }

    const handleReplyChange = (ticketId, event) => {
        setCustomReply(event.target.value)
        setReplies({
            ...replies,
            [ticketId]: event.target.value
        });
    };

    const handleAddReply = (ticketId) => {
        let ticketFound = tickets.find((e) => e._id === ticketId)

        updateReply(ticketId, ticketFound)
    };

    const handleResolve = (ticketId) => {
        updateCloseAndUpdate(ticketId, "resolved")
    };

    const handleReject = (ticketId) => {
        updateCloseAndUpdate(ticketId, "closed")



    };

    const handleAssign = (ticketId) => {
        // dispatch(assignTicket({ ticketId, userId: selectedUser[ticketId] }));
        updateAssign(ticketId, selectedUser[ticketId])
    };
    const updateAssign = async (ticketId, userId) => {
        try {
            let res = await axios.put(`http://localhost:5000/api/tickets/${ticketId}`, {
                assignedTo: userId
            }, {
                headers: { Authorization: `Bearer ${user?.token}` },
            })
            console.log("res", res)
            if (res) {
                enqueueSnackbar(`Ticket Assigned Succesfully`, { variant: 'info' })
                dispatch(fetchTickets());
                getUserList()
            }

        } catch (error) {
            console.log("error", error)
            enqueueSnackbar('Error', { variant: 'error' })

        }
    }
    const updateCloseAndUpdate = async (ticketId, ticketStatus) => {
        try {
            let res = await axios.put(`http://localhost:5000/api/tickets/${ticketId}`, {
                status: ticketStatus
            }, {
                headers: { Authorization: `Bearer ${user?.token}` },
            })
            console.log("res", res)
            if (res) {
                enqueueSnackbar(`Ticket Marked As ${ticketStatus} Successfully`, { variant: 'info' })
                dispatch(fetchTickets());
                getUserList()
            }

        } catch (error) {
            console.log("error", error)
            enqueueSnackbar('Error', { variant: 'error' })

        }
    }
    const updateReply = async (ticketId, ticketFound) => {

        console.log("ticketFound", ticketFound, "customReply", customReply)

        try {
            let res = await axios.put(`http://localhost:5000/api/tickets/${ticketId}`, {
                replies: [...ticketFound?.replies, customReply]
            }, {
                headers: { Authorization: `Bearer ${user?.token}` },
            })
            console.log("res", res)
            if (res) {
                enqueueSnackbar(`Ticket's Comment Added Succesffuly`, { variant: 'info' })
                setCustomReply("")
                setReplies({
                    ...replies,
                    [ticketId]: null
                });
                dispatch(fetchTickets());
                getUserList()
            }

        } catch (error) {
            console.log("error", error)
            enqueueSnackbar('Error', { variant: 'error' })

        }
    }
    const handleUserChange = (ticketId, event) => {
        console.log("selectedUser", selectedUser)
        setSelectedTicketId(ticketId)
        setSelectedUser({
            ...selectedUser,
            [ticketId]: event.target.value
        });
        console.log("[ticketId]: event.target.value", ticketId, event.target.value)
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-semibold" >{!isCreateTicket ? "Dashboard" : "Create Ticket"} </h2>
                {/* User Profile Section without Button */}
                <div className="flex items-center text-gray-300">
                    <img src={userLogo} alt="User Avatar" className="w-10 h-10 rounded-full mr-2" />
                    <span className="text-black font-bold text-3xl">Hello, {user?.name}</span>
                </div>
            </div>

            {/* Loading state */}
            {loading && <Loader />}

            {/* Error state */}
            {/* {error && <p className="text-red-500">{error}</p>} */}

            {/* Conditional rendering of Create Ticket component */}
            {user && (user?.role === 'end_user' || user?.role === 'admin') && (
                <button
                    onClick={() => {
                        

                        if(isCreateTicket){
                            setIsCreateTicket(false)
                        }else{
                            setIsCreateTicket(true)
                        }
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md mb-5"
                >
                     {!isCreateTicket ? "Create Ticket" : "View Tickets"}
                </button>
            )}
            {user && (user?.role === 'end_user' || user?.role === 'admin') && isCreateTicket && <CreateTicket setIsCreateTicket={setIsCreateTicket} />}



            {!isCreateTicket && tickets?.length > 0 ?
             <ul className="divide-y divide-gray-300 mt-10">
                {tickets?.length > 0 && tickets?.map((ticket, index) => (
                    <li key={ticket._id} className="py-4">
                        <div className="bg-white shadow-lg rounded-lg p-4 border border-gray-200">
                            <div className="flex items-start justify-between">
                                <div className="flex flex-col flex-grow">
                                    <h3 className="text-lg font-semibold text-red-600">
                                        <span className="font-bold">Title:</span> {ticket.title}
                                    </h3>
                                    <h5 className="text-md font-medium text-gray-700">
                                        <span className="font-bold">Description:</span> {ticket.description}
                                    </h5>
                                    <p className={`text-sm font-semibold px-3 py-1 rounded-full max-w-[100px] text-center mt-2 ${ticket.status === "open" ? "bg-yellow-300 text-yellow-900" : "bg-red-300 text-red-900"}`}>
                                        {ticket.status}
                                    </p>
                                    <div className="mt-2">
                                        <label htmlFor={`user-${ticket._id}`} className="block text-sm font-medium text-gray-700">Assign to:</label>
                                        <div className="flex items-center space-x-2">
                                            <select
                                                disabled={user?.role !== "admin"}
                                                id={`user-${ticket._id}`}
                                                value={selectedUser[ticket._id] || (ticket.assignedTo ? ticket.assignedTo._id : '')}
                                                onChange={(e) => handleUserChange(ticket._id, e)}
                                                className="max-w-[300px] mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            >
                                                <option value="">Select a user</option>
                                                {users?.map((u) => (
                                                    <option key={u._id} value={u._id}>{u.username}</option>
                                                ))}
                                            </select>
                                            <button
                                                disabled={user?.role !== "admin"}
                                                onClick={() => {
                                                    if (!selectedUser[ticket._id] && !ticket.assignedTo) {
                                                        enqueueSnackbar('Please Select Assignee First', { variant: 'info' });
                                                    } else {
                                                        handleAssign(ticket._id);
                                                    }
                                                }}
                                                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-md"
                                            >
                                                Assign
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        disabled={ticket.status === "resolved" || (user?.role === "tech_support" && ticket?.assignedTo?.username !== user?.name)}
                                        onClick={() => handleResolve(ticket._id)}
                                        className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                                    >
                                        Resolve
                                    </button>
                                    <button
                                        disabled={ticket.status === "closed" || (user?.role === "tech_support" && ticket?.assignedTo?.username !== user?.name)}
                                        onClick={() => handleReject(ticket._id)}
                                        className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>

                            {/* Attachments Section */}
                            <div className="mt-4">
                                <h4 className="text-lg font-semibold text-gray-800">Attachments:</h4>
                                {ticket?.attachments?.length > 0 ? (
                                    <ul className="mt-2 space-y-2">
                                        {ticket?.attachments?.map((attachment, idx) => (
                                            <li key={idx} className="bg-gray-100 p-2 rounded-md">
                                                <a
                                                    href={`http://localhost:5000/${attachment}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-500 hover:underline"
                                                >
                                                    Attachment {idx + 1}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500">No attachments</p>
                                )}
                            </div>

                            {/* Replies Section */}
                            <div className="mt-4">
                                <textarea
                                    disabled={user?.role === "tech_support" && ticket?.assignedTo?.username !== user?.name}
                                    value={replies[ticket._id] || ''}
                                    onChange={(e) => handleReplyChange(ticket._id, e)}
                                    placeholder="Add a reply..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
                                />
                                <button
                                    onClick={() => {
                                        if (customReply === "") {
                                            enqueueSnackbar("Can't Add An Empty Comment", { variant: "error" });
                                        } else {
                                            handleAddReply(ticket._id);
                                        }
                                    }}
                                    disabled={user?.role === "tech_support" && ticket?.assignedTo?.username !== user?.name}
                                    className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md"
                                >
                                    Add Reply
                                </button>
                                {/* Replies list */}
                                <ul className="mt-2 space-y-2">
                                    {ticket?.replies?.map((reply, idx) => (
                                        <li key={idx} className="bg-gray-100 p-2 rounded-md">
                                            <p className="text-sm text-gray-800">{reply}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </li>
                    // <li key={ticket._id} className="py-4">
                    //     <div className="bg-white shadow-lg rounded-lg p-4 border border-gray-200">
                    //         <div className="flex items-start justify-between">
                    //             <div className="flex flex-col flex-grow">
                    //                 <h3 className="text-lg font-semibold text-red-600">
                    //                     <span className="font-bold">Title:</span> {ticket.title}
                    //                 </h3>
                    //                 <h5 className="text-md font-medium text-gray-700">
                    //                     <span className="font-bold">Description:</span> {ticket.description}
                    //                 </h5>
                    //                 <p className={`text-sm font-semibold px-3 py-1 rounded-full max-w-[100px] text-center mt-2 ${ticket.status === "open" ? "bg-yellow-300 text-yellow-900" : "bg-red-300 text-red-900"}`}>
                    //                     {ticket.status}
                    //                 </p>
                    //                 <div className="mt-2">
                    //                     <label htmlFor={`user-${ticket._id}`} className="block text-sm font-medium text-gray-700">Assign to:</label>
                    //                     <div className="flex items-center space-x-2">
                    //                         <select
                    //                             disabled={user?.role !== "admin"}
                    //                             id={`user-${ticket._id}`}
                    //                             value={selectedUser[ticket._id] || (ticket.assignedTo ? ticket.assignedTo._id : '')}
                    //                             onChange={(e) => handleUserChange(ticket._id, e)}
                    //                             className="max-w-[300px] mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    //                         >
                    //                             <option value="">Select a user</option>
                    //                             {users?.map((u) => (
                    //                                 <option key={u._id} value={u._id}>{u.username}</option>
                    //                             ))}
                    //                         </select>
                    //                         <button
                    //                             disabled={user?.role !== "admin"}
                    //                             onClick={() => {
                    //                                 if (!selectedUser[ticket._id] && !ticket.assignedTo) {
                    //                                     enqueueSnackbar('Please Select Assignee First', { variant: 'info' });
                    //                                 } else {
                    //                                     handleAssign(ticket._id);
                    //                                 }
                    //                             }}
                    //                             className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-md"
                    //                         >
                    //                             Assign
                    //                         </button>
                    //                     </div>
                    //                 </div>
                    //             </div>
                    //             <div className="flex items-center space-x-2">
                    //                 <button
                    //                     disabled={ticket.status === "resolved" || (user?.role === "tech_support" && ticket?.assignedTo?.username !== user?.name)}
                    //                     onClick={() => handleResolve(ticket._id)}
                    //                     className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                    //                 >
                    //                     Resolve
                    //                 </button>
                    //                 <button
                    //                     disabled={ticket.status === "closed" || (user?.role === "tech_support" && ticket?.assignedTo?.username !== user?.name)}
                    //                     onClick={() => handleReject(ticket._id)}
                    //                     className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                    //                 >
                    //                     Close
                    //                 </button>
                    //             </div>
                    //         </div>

                    //         <div className="mt-4">
                    //             <textarea
                    //                 disabled={user?.role === "tech_support" && ticket?.assignedTo?.username !== user?.name}
                    //                 value={replies[ticket._id] || ''}
                    //                 onChange={(e) => handleReplyChange(ticket._id, e)}
                    //                 placeholder="Add a reply..."
                    //                 className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
                    //             />
                    //             <button
                    //                 onClick={() => {
                    //                     if (customReply === "") {
                    //                         enqueueSnackbar("Can't Add An Empty Comment", { variant: "error" });
                    //                     } else {
                    //                         handleAddReply(ticket._id);
                    //                     }
                    //                 }}
                    //                 disabled={user?.role === "tech_support" && ticket?.assignedTo?.username !== user?.name}
                    //                 className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md"
                    //             >
                    //                 Add Reply
                    //             </button>

                    //             <ul className="mt-2 space-y-2">
                    //                 {ticket?.replies?.map((reply, idx) => (
                    //                     <li key={idx} className="bg-gray-100 p-2 rounded-md">
                    //                         <p className="text-sm text-gray-800">{reply}</p>
                    //                     </li>
                    //                 ))}
                    //             </ul>
                    //         </div>
                    //     </div>
                    // </li>
                ))}
            </ul>
            : (
                !isCreateTicket ? <p class="text-center text-lg pt-5 font-bold">No Tickets Found</p> : ""
            ) }




        </div>
    );
};

export default Dashboard;
