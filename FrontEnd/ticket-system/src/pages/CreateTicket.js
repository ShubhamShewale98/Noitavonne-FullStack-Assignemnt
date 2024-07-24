import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTicket } from '../slices/ticketSlice';

const CreateTicket = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [attachments, setAttachments] = useState([]);
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        attachments.forEach((file) => formData.append('attachments', file));
        dispatch(createTicket(formData));
    };

    const handleFileChange = (e) => {
        setAttachments([...e.target.files]);
    };

    return (
        <div className="container mx-auto">
            <h2>Create Ticket</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Attachments</label>
                    <input type="file" multiple onChange={handleFileChange} />
                </div>
                <button type="submit">Create Ticket</button>
            </form>
        </div>
    );
};

export default CreateTicket;
