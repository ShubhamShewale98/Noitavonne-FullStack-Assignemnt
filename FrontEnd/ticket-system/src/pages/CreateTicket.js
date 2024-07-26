import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTicket } from '../slices/ticketSlice';
import { enqueueSnackbar } from 'notistack';

const CreateTicket = ({
    setIsCreateTicket
}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [attachments, setAttachments] = useState([]);
    const [files, setFiles] = useState([]);
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);

    const onFileChange = (e) => {
        setFiles([...e.target.files]);
      };


    const handleSubmit = async(e) => {

        e.preventDefault();
         




        // var formData = new FormData();
        // console.log('title', String(title))
        // console.log('description', description)

        // formData.append('title', "SHUBHAM" );
        // console.log("formData LOGA",formData)
        // formData.append('description',description.toString() );
        
        // attachments.forEach((file) => formData.append('attachments', file));
        // console.log("formData Description",formData)
        var formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        files.forEach(file => {
          formData.append('attachments', file);
        });
        try {
            // let res = await   dispatch(createTicket({title,description}));
            let res = await   dispatch(createTicket(formData));
             
            
            console.log("res create ticket",res)
            if(res?.payload?.msg){
               setIsCreateTicket(false);
               enqueueSnackbar(`${res?.payload?.msg}`,{ variant: 'success' })
            }
        } catch (error) {
            enqueueSnackbar('Opps Error',{ variant: 'error' })
        }
    

    };

    const handleFileChange = (e) => {
        setAttachments([...e.target.files]);
    };

    return (
        <div className="container mx-auto p-4 max-w-screen-md">
        {/* <h2 className="text-2xl font-bold mb-4">Create Ticket</h2> */}
        <form onSubmit={handleSubmit} className="max-w-md">
            <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="title">
                    Title
                </label>
                <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="description">
                    Description
                </label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="4"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Attachments</label>
                <input
                    type="file"
                    multiple
                    onChange={onFileChange}
                    className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>
            <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
                Create Ticket
            </button>
        </form>
    </div>
    );
};

export default CreateTicket;
