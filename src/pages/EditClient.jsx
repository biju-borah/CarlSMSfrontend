import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './addclient.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import user from '../assets/userimage.png'
import Loader from '../components/Loader';


function EditClient({ }) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        accsid: '',
        acctoken: '',
        name: '',
        locationId: '',
        phone: '',
        refreshToken: '',
        status: 'Active',
        usage: '0',
        limit: '0',
        mms_usage: '0',
        mms_limit: '0',
        resetDate: ''
    });

    const { state } = useLocation()

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            navigate('/')
        }
        if (state) {
            setFormData({
                accsid: state['accsid'],
                acctoken: state['acctoken'],
                name: state['name'],
                locationId: state['locationId'],
                phone: state['phone'],
                refreshToken: state['refreshToken'],
                status: 'Active',
                usage: state['usage'],
                limit: state['limit'],
                mms_usage: state['mms_usage'],
                mms_limit: state['mms_limit'],
                resetDate: state['resetDate'] === '' ? new Date(new Date().setDate(new Date().getDate() + 30)).toISOString() : state['resetDate']
            });
        }
    }, []);

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const response = await axios.post('https://us-central1-hdem-app.cloudfunctions.net/function-2/api/updateSubAccount', formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                navigate('/dashboard', { state: 'updated' })
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
        setLoading(false)
    };

    return (
        <>
            {loading ? <Loader /> : <></>}
            <div className={'add-details' + (loading ? " enable" : "")}>
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
                <div className="top">
                    <div className="main-text">
                        <h1>EDIT</h1>
                    </div>
                    <div className="user-image">
                        <img src={user} alt="" />
                    </div>
                </div>
                <div className="wrapper">
                    <div className="main">
                        <form onSubmit={submitHandler}>
                            <div className="input-box-first">
                                <div className="name">
                                    <p>Sub Account Name</p>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder=""
                                        required
                                    />
                                </div>
                                <div className="limit">
                                    <p>SMS Limit</p>
                                    <input
                                        type="text"
                                        name="limit"
                                        value={formData.limit}
                                        onChange={handleInputChange}
                                        placeholder=""
                                        required
                                    />
                                </div>
                                <div className="limit">
                                    <p>MMS Limit</p>
                                    <input
                                        type="text"
                                        name="mms_limit"
                                        value={formData.mms_limit}
                                        onChange={handleInputChange}
                                        placeholder=""
                                        required
                                    />
                                </div>
                            </div>
                            <div className="input-box-second">
                                <div className="location-id">
                                    <p>Location ID</p>
                                    <input
                                        type="text"
                                        name="locationId"
                                        value={formData.locationId}
                                        onChange={handleInputChange}
                                        placeholder=""
                                        readOnly='true'
                                        required
                                    />
                                </div>
                                <div className="phone">
                                    <p>Active Number</p>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder=""
                                        required
                                    />
                                </div>
                            </div>

                            <div className="input-box-third">
                                <div className="acc-token">
                                    <p>Acc Token</p>
                                    <input
                                        type="text"
                                        name="acctoken"
                                        value={formData.acctoken}
                                        onChange={handleInputChange}
                                        placeholder=""
                                        required
                                    />
                                </div>
                                <div className="acc-sid">
                                    <p>Acc Sid</p>
                                    <input
                                        type="text"
                                        name="accsid"
                                        value={formData.accsid}
                                        onChange={handleInputChange}
                                        placeholder=""
                                        required
                                    />
                                </div>
                            </div>
                            <button onClick={() => { navigate('/dashboard') }} className="btn">Cancel</button>
                            <button type="submit" className="black-btn">Update</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default EditClient;