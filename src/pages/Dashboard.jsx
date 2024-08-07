import React, { useState, useEffect, useRef } from 'react';
import './dashboard.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DeletePopup from '../components/DeletePopup'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from 'react-router-dom';
import green from '../assets/green.png'
import red from '../assets/red.png'
import user from '../assets/userimage.png'
import Loader from '../components/Loader';

function Dashboard() {
    const [loading, setLoading] = useState(true)
    const [clients, setClients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [popup, setPopup] = useState({ enable: false, type: null, id: null })
    const navigate = useNavigate()
    const { state } = useLocation()
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            navigate('/')
            return
        }
        axios.get('https://us-central1-hdem-app.cloudfunctions.net/function-2/api/getSubAccounts')
            .then(response => {
                console.log(response.data)
                setClients(response.data);
                setLoading(false)
            })
            .catch(error => {
                console.error('Error fetching client data:', error);
            });
        if (state) {
            if (state === 'added') {
                toast.success('Client added successfully!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            } else if (state === 'updated') {
                toast.success('Client updated successfully!', {
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
        }

    }, []);

    function handlePopup(enable, type, id) {
        if (!enable && type === 'Delete') {
            var f;
            var found = clients.some(function (record, index) { f = index; return record['locationId'] === id; });
            if (found) {
                console.log(enable)
                clients.splice(f, 1);
                setClients(clients)
                setPopup({
                    enable: false,
                    type: null,
                    id: null
                })
            }
        }
        else {
            setPopup({
                enable: enable,
                type: type,
                id: id
            })
        }
        setIsDropdownVisible(false);
    }

    const filteredClients = clients.filter(client =>
        client['name'].toLowerCase().includes(searchTerm.toLowerCase())
    );

    const [selectedClient, setSelectedClient] = useState(null);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    const handleDotClick = (clientId) => {
        console.log(clientId)
        setSelectedClient(clientId);
        setIsDropdownVisible(!isDropdownVisible);
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !buttonRef.current.contains(event.target)) {
                setIsDropdownVisible(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef, buttonRef]);

    function getDate(client) {
        if (client['resetDate'] === '') return ('Not Set')
        var resetDate = new Date(client['resetDate']);
        var today = new Date();
        if (resetDate > today) {
            var day = resetDate.getDate();
            var month = resetDate.getMonth() + 1;
            var year = resetDate.getFullYear();
            return day + '/' + month + '/' + year;
        }
        else {
            let newResetDate = new Date(resetDate);
            const today = new Date();

            while (newResetDate <= today) {
                newResetDate.setDate(newResetDate.getDate() + 30);
            }
            var day = newResetDate.getDate();
            var month = newResetDate.getMonth() + 1;
            var year = newResetDate.getFullYear();
            return day + '/' + month + '/' + year;
        }
    }

    function copyToClipboard(id) {
        var copyText = "https://hdem-app.uc.r.appspot.com/quota?id=" + id;
        navigator.clipboard.writeText(copyText);
        setIsDropdownVisible(false)
        toast.success('Link copied to clipboard!', {
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

    return (
        <>
            {popup.enable ? <DeletePopup handler={handlePopup} data={popup} /> : <></>}
            <div className={"dashboard" + (popup.enable ? " enable" : "")}>
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
                        <h1>Dashboard</h1>
                    </div>
                    <div className="user-image">
                        <img src={user} alt="" />
                    </div>
                </div>
                <div className="wrapper">
                    <div className="main">
                        <div className="input-box">
                            <input type="text"
                                placeholder="Search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <i className='bx bx-search'></i>
                        </div>
                        <div className="input-box">
                            <input type="text" placeholder="All" readOnly />
                            <i className='bx bx-chevron-down'></i>
                        </div>
                        <button className="btn" onClick={() => { navigate('/addclient') }}><i className='bx bx-plus'></i>Add</button>
                    </div>
                    {loading ? <Loader /> :
                        <>
                            {filteredClients.map(client => (
                                <div key={client['locationId']} className="second-main">
                                    <p className="current-client"><b>{client['name']}</b> | SMS usage: {new Date(client['resetDate']) <= new Date() ? 0 : client['usage']} / {client['limit']} | MMS usage: {new Date(client['resetDate']) <= new Date() ? 0 : client['mms_usage']} / {client['mms_limit']} | <b>Reset on :</b> {getDate(client)}</p>
                                    <div className="dot" onClick={() => handleDotClick(client['locationId'])} ref={buttonRef}><i className='bx bx-dots-vertical-rounded'></i></div>
                                    <div className="green"><img src={client['status'] === 'Active' ? green : red} alt='' /></div>
                                    {isDropdownVisible && selectedClient === client['locationId'] && (
                                        <div className="dropdown-menu" ref={dropdownRef}>
                                            <button onClick={() => navigate('/editclient', { state: client })}>Edit</button>
                                            <button onClick={() => copyToClipboard(client['locationId'])}>Widget link</button>
                                            <button className='pause' onClick={() => handlePopup(true, 'Pause', client['locationId'])}>Pause</button>
                                            <button className='delete' onClick={() => handlePopup(true, 'Delete', client['locationId'])}>Delete</button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </>
                    }
                </div>
            </div>
        </>
    );
}

export default Dashboard;
