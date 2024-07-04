import React from 'react'
import './quotapage.css'
import { useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import Loader from '../components/Loader'

function QuotaPage() {
    const [searchParams] = useSearchParams()
    const [acc, setAcc] = useState({})
    const id = searchParams.get('id')
    const [isLoading, setLoading] = useState(true)

    function getDate(client) {
        if (client['resetDate'] === '') return ('Not Set')
        var date = new Date(client['resetDate']);
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        return day + '/' + month + '/' + year;
    }

    useEffect(() => {
        axios.post('https://us-central1-hdem-app.cloudfunctions.net/function-2/api/getSubAccount', { locationId: id })
            .then(response => {
                console.log(response.data)
                setAcc(response.data)
                setLoading(false)
            })
            .catch(error => {
                console.error('Error fetching client data:', error);
            });
    }, [id])

    return (
        isLoading ? <Loader /> :
            <div className="quotabox">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 flex-container">
                            <div className="flex-item">
                                <div className="flex-item-inner">
                                    <a href="#">
                                        <div className="card-front bg-blue">
                                            <i className="fa fa-pie-chart fa-3x tile-icon icon-white"></i>
                                            <h4>SMS Usage</h4>
                                            <p className="detail">{new Date(acc['resetDate']) <= new Date() ? 0 : acc['usage']} <span>out of {acc.limit}</span></p>
                                            {/* <p>Reset on {getDate(acc)}</p> */}
                                        </div>
                                    </a>
                                </div>
                            </div>
                            <div className="flex-item">
                                <div className="flex-item-inner">
                                    <a href="#">
                                        <div className="card-front bg-green">
                                            <i className="fa fa-heart fa-3x tile-icon icon-white"></i>
                                            <h4>MMS Sent</h4>
                                            <p className="detail">{new Date(acc['resetDate']) <= new Date() ? 0 : acc['mms_usage']}</p>
                                            {/* <p>Reset on {getDate(acc)}</p> */}
                                        </div>
                                    </a>
                                </div>
                            </div>
                            {/* <div className="flex-item">
                                <div className="flex-item-inner">
                                    <a href="#">
                                        <div className="card-front bg-blue">
                                            <i className="fa fa-sun-o fa-3x tile-icon icon-white"></i>
                                            <h4>Your Paid Time Off Balance</h4>
                                            <p className="detail">$XXX,XXX</p>
                                        </div>
                                    </a>
                                </div>
                            </div>
                            <div className="flex-item">
                                <div className="flex-item-inner">
                                    <a href="#">
                                        <div className="card-front bg-green">
                                            <i className="fa fa-bar-chart fa-3x tile-icon icon-white"></i>
                                            <h4>Savings Plan Total Balance</h4>
                                            <p className="detail">$XXX,XXX</p>
                                        </div>
                                    </a>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
    )
}

export default QuotaPage