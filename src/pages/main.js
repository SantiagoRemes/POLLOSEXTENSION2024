import React, { useState, useEffect } from 'react';
import Logo from '../images/logo.png';
import Task from './components/task';
import History from './components/history.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, Alert, Modal, Col, Container, Image, Spinner } from 'react-bootstrap';
import { CSVLink, CSVDownload } from 'react-csv';

function Main() {
    const [pageUrl, setPageUrl] = useState('');
    const [tasks, setTasks] = useState([]);
    const [ipAddress, setIPAddress] = useState('');
    const [response, setResponse] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentView, setCurrentView] = useState('main');
    const [loading, setLoading] = useState(false);
    const [predicted_element, setPredictedelement] = useState(null);

    // Create new Task
    const handleAddTask = () => {
        const newTask = {
            id: tasks.length + 1,
            access: '',
            selector: '',
            action: '',
            text: '',
            quantity: '',
            position: 0
        };
        setTasks([...tasks, newTask]);
    };

    useEffect(() => {
        fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => setIPAddress(data.ip))
            .catch(error => console.log(error));
    }, []);

    // Run Tasks
    const handleRunTasks = () => {
        setLoading(true);
        let pythonfile = [];
        for (let task of tasks) {
            let { access, selector, action, text, quantity, position } = task;
            let temp = { 'action': action, 'access': access, 'quantity': quantity, 'selector': selector };
            if (action === "add_text") {
                temp["text"] = text;
            }
            if (quantity === "multiple") {
                temp['position'] = position;
            }
            pythonfile.push(temp);
        }
        const url = `http://localhost:5000/makeTest`;
        const data = {
            url: pageUrl,
            tasks: pythonfile,
            ip: ipAddress
        };
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        };
        fetch(url, options)
            .then((res) => res.json())
            .then((data) => {
                setPredictedelement(data.Success ? null : data.PredictedElement)
                setResponse(data.Success ? 'Test Ran Successfully' : `Test Had Errors: ${data.Results}`);
                setShowModal(true);
            })
            .catch((err) => {
                setResponse(`Test Had Errors: ${err}`);
                setShowModal(true);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleCloseModal = () => setShowModal(false);

    const handleApplyPrediction = () => {
        if (predicted_element && predicted_element.step) {
            const stepIndex = predicted_element.step - 1;
            const updatedTasks = [...tasks]; // Create a copy of the tasks array
    
            if (predicted_element[updatedTasks[stepIndex].access]) {
                updatedTasks[stepIndex].selector = predicted_element[updatedTasks[stepIndex].access];
            }
    
            setTasks(updatedTasks); // Update the state with the new tasks array
        }
        setShowModal(false);
    };
    
    const switchView = (view) => {
        setCurrentView(view);
    };

    if (currentView === 'history') {
        return (
            <History switchView={switchView} ipAddress={ipAddress} pageUrl={pageUrl}/>
        );
    } else {
        return (
            <Container>
                <Form>
                    <Form.Group className="formHolder" controlId='LinkURL'>
                        <Container className="center-logo">
                            <Col xs={6} md={12}>
                                <Image src={Logo} alt="Logo justify-content-center align-items-center" thumbnail />
                                <br /><br />
                            </Col>
                        </Container>
                        <div className="centered">
                            <Form.Control
                                type="URL"
                                value={pageUrl}
                                placeholder="[URL of the Page]"
                                onChange={e => setPageUrl(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <Form.Text className="text-muted">
                            Link of the Page.
                        </Form.Text>
                    </Form.Group>

                    <Container className="todoBlock2">
                        <h1>List of Tests</h1>
                    </Container>

                    <Container className="container">
                        <div className="todoBlock">
                            <div className="todoList">
                                {tasks.map((task) => (
                                    <Task key={task.id} task={task} />
                                ))}
                                <br /><br />
                            </div>
                            <Container className="col_big">
                                <Button onClick={handleAddTask} className="btn-primary" disabled={loading}>Add Test</Button>
                                <Button onClick={handleRunTasks} id="FinishBtn" className="btn-primary" disabled={loading}>
                                    {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Execute Tests'}
                                </Button>
                                <Button onClick={() => switchView('history')} id="Versions" className="btn-primary" disabled={loading}>History Versions</Button>
                            </Container>
                        </div>
                    </Container>
                </Form>

                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Test Result</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Alert variant={response === 'Test Ran Successfully' ? 'success' : 'danger'}>
                            {response}
                            {response !== 'Test Ran Successfully' && predicted_element && (
                                <div>
                                    <pre>Predicted Element</pre><br></br>
                                    <pre>{JSON.stringify(predicted_element, null, 2)}</pre>
                                </div>
                            )}
                        </Alert>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Close
                        </Button>
                        <Button variant="secondary" onClick={handleApplyPrediction}>
                            Apply Prediction
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        );
    }
}

export default Main;
