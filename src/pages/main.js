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
    const [currentView, setCurrentView] = useState('main'); // Estado para la vista actual
    const [loading, setLoading] = useState(false); // State for loading status
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
        setLoading(true); // Set loading to true when the test execution starts
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
                setLoading(false); // Set loading to false when the test execution finishes
            });
    };

    const handleCloseModal = () => setShowModal(false);

    // Delete WOP
    // const handleDeleteTask = (taskId) => {
    //     const updatedTasks = tasks.filter((task) => task.id !== taskId);
    //     setTasks(updatedTasks);
    // };

    // Función para cambiar la vista
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
                    {/* Insert URL */}
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
                                disabled={loading} // Disable input when loading
                            />
                        </div>
                        <Form.Text className="text-muted">
                            Link of the Page.
                        </Form.Text>
                    </Form.Group>

                    <Container className="todoBlock2">
                        <h1>List of Tests</h1>
                    </Container>

                    {/* Main Container */}
                    <Container className="container">
                        <div className="todoBlock">
                            {/* Tasks */}
                            <div className="todoList">
                                {tasks.map((task) => (
                                    // <Task key={task.id} task={task} onDelete={handleDeleteTask} /> Delet Handler WOP
                                    <Task key={task.id} task={task} />
                                ))}
                                <br /><br />
                            </div>
                            {/* Buttons */}
                            <Container className="col_big">
                                <Button onClick={handleAddTask} className="btn-primary" disabled={loading}>Add Test</Button>
                                <Button onClick={handleRunTasks} id="FinishBtn" className="btn-primary" disabled={loading}>
                                    {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Execute Tests'}
                                </Button>
                                <Button onClick={() => switchView('history')} id="Versions" className="btn-primary" disabled={loading}>History Versions</Button> {/* WOP */}
                            </Container>
                        </div>
                    </Container>
                </Form>

                {/* Response Modal */}
                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Test Result</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Alert variant={response === 'Test Ran Successfully' ? 'success' : 'danger'}>
                            {response}
                            {response !== 'Test Ran Successfully' && predicted_element && (
                                <pre>{JSON.stringify(predicted_element, null, 2)}</pre>
                            )}
                        </Alert>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        );
    }
}

export default Main;