import React, { useState, useEffect } from 'react';
import Logo from '../../images/logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, Alert, Modal, Col, Container, Image, Table } from 'react-bootstrap';
import { CSVLink } from 'react-csv';

function History({switchView, ipAddress, pageUrl}) {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const encodedUrl = encodeURIComponent(pageUrl);
        fetch(`http://10.22.198.111:5000/getHistory?TestId=${ipAddress}:${encodedUrl}`)
        .then( response => response.json())
        .then( 
            data => {setHistory(data.History);
            console.log(data);
        })
        .catch(error => console.log(error));
    },[]);

    useEffect(() => {
        
    },[history]);


    return(
        <Container className="history-container">
                <Container className="center-logo">
                    <Col xs={6} md={12}>
                    <Image src={Logo} alt="Logo justify-content-center align-items-center" thumbnail />
                        <br /><br />
                    </Col>
                </Container>
            <h1 className="history-title">History Versions</h1>
            <div className="white-block">
                <Table striped bordered hover className="history-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Time Created</th>
                            <th>State</th>
                            <th>EType</th>
                            <th>Step</th>
                        </tr>
                    </thead>
                    <tbody>
                    {history.length === 0 ? (
                    <tr>
                        <td colSpan="5">No test history available</td>
                    </tr>) : 
                    (history.map((test, index) => (
                        <tr key={index}>
                            <td>{test.id}</td>
                            <td>{test.timecreated}</td>
                            <td>{test.status}</td>
                            <td>{test.etype}</td>
                            <td>{test.steps}</td>
                        </tr>
                    )))}
                    </tbody>
                </Table>
                {history.length > 0 && (
                    <CSVLink data={history} filename={"test_history.csv"}>
                    <Button className="download-button">Download</Button>
                    </CSVLink>
                )}
                
            </div>
            <Button onClick={() => switchView('main')} className="back-button">Back to Main</Button>
        </Container>
    )}

export default History;