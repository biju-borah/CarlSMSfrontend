import React from 'react'
import axios from 'axios';
import './deletepopup.css'
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from './Loader';

function DeletePopup(props) {

    const [loading, setLoading] = useState(false)
    const [input, setInput] = useState('')

    const submitHandler = async (e) => {
        e.preventDefault();
        if (input !== 'delete') {
            toast.error('Type delete to continue', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return
        }
        setLoading(true)
        try {
            const response = await axios.post('https://us-central1-hdem-app.cloudfunctions.net/function-2/api/deleteSubAccount',
                {
                    locationId: props.data.id
                }
            );

            if (response.status === 200) {
                toast.warn('Client deleted successfully!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                setLoading(false)
                props.handler(false, 'delete', props.data.id)
            } else {
                toast.error('Something went wrong', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
        } catch (error) {
            console.log(error)
            toast.error('Something went wrong', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    };

    return (
        <>
            <ToastContainer
                position="bottom-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            {loading ? <Loader /> :
                <div className='pop-up'>
                    <div className="main">
                        <div className="wrapper">
                            <h1>Delete this Client?</h1>
                            <i className='bx bx-x' onClick={() => { props.handler(false, null, null) }}></i>
                            <p><strong>Warning: </strong>This is a irreversible process ! Type down the following word to continue</p>

                            <input type="text" onChange={(e) => { setInput(e.target.value) }} placeholder="Type delete" required />
                            <br />
                            <button className="btn" onClick={submitHandler}>Delete</button>
                        </div>
                    </div>
                </div>
            }
        </>

    )
}

export default DeletePopup