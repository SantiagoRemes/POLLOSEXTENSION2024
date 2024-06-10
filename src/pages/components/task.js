import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown, DropdownButton, Form, InputGroup, Row, Col, Button } from 'react-bootstrap';

function Task({ task, predictedelementinsert, setPredictedelementinsert}) {
  const [access, setAccess] = useState(task.access);
  const [accesstext, setAccesstext] = useState('Class'); // Adjusted default value

  const [selector, setSelector] = useState(task.selector);

  const [action, setAction] = useState(task.action);
  const [actiontext, setActiontext] = useState('Add Text'); // Adjusted default value

  const [text, setText] = useState(task.text);

  const [quantity, setQuantity] = useState(task.quantity);
  const [quantitytext, setQuantitytext] = useState('Singular'); // Adjusted default value

  const [position, setPosition] = useState(task.position);

  useEffect(() => {
    if(predictedelementinsert === true){
      setSelector(task.selector);
      setPredictedelementinsert(false)
    }
  }, [task.selector]);

  useEffect(() => {
    task.access = access;
  }, [access]);

  useEffect(() => {
    task.selector = selector;
  }, [selector]);

  useEffect(() => {
    task.action = action;
  }, [action]);

  useEffect(() => {
    task.text = text;
  }, [text]);

  useEffect(() => {
    task.quantity = quantity;
  }, [quantity]);

  useEffect(() => {
    task.position = position;
  }, [position]);

  const handleSelectAccess = (eventKey, event) => {
    setAccess(event.target.getAttribute('value'));
    setAccesstext(eventKey);
  };

  const handleSelectAction = (eventKey, event) => {
    setAction(event.target.getAttribute('value'));
    setActiontext(eventKey);
  };

  const handleSelectQuantity = (eventKey, event) => {
    setQuantity(event.target.getAttribute('value'));
    setQuantitytext(eventKey);
  };

  return (
    <div>
      <h2>Task {task.id}</h2>
      <InputGroup className="mb-3">
        <Row>
          <Col>
            <DropdownButton
              variant="secondary"
              title={accesstext}
              onSelect={handleSelectAccess}
            >
              <Dropdown.Item eventKey="Class" value="class">Class</Dropdown.Item>
              <Dropdown.Item eventKey="CSS Selector" value="css_selector">CSS Selector</Dropdown.Item>
              <Dropdown.Item eventKey="ID" value="id">ID</Dropdown.Item>
              <Dropdown.Item eventKey="Text Link" value="link_text">Text Link</Dropdown.Item>
              <Dropdown.Item eventKey="Partial Link Text" value="partial_link_text">Partial Link Text</Dropdown.Item>
              <Dropdown.Item eventKey="Name" value="name">Name</Dropdown.Item>
              <Dropdown.Item eventKey="Tag Name" value="tag_name">Tag Name</Dropdown.Item>
              <Dropdown.Item eventKey="XPath" value="xpath">XPath</Dropdown.Item>
            </DropdownButton>
          </Col>
          <Form.Control
            aria-label="Select Selector"
            placeholder='[Insert Selector]'
            value={selector} // Controlled input
            onChange={e => setSelector(e.target.value)}
          />
        </Row>
      </InputGroup>

      <InputGroup className="mb-3">
        <Row>
          <Col>
            <DropdownButton
              variant='secondary'
              title={actiontext}
              id="Texto"
              onSelect={handleSelectAction}
            >
              <Dropdown.Item eventKey="Add Text" value="add_text">Add Text</Dropdown.Item>
              <Dropdown.Item eventKey="Click Element" value="click_element">Click Element</Dropdown.Item>
            </DropdownButton>
          </Col>
          {actiontext === 'Add Text' && (
            <Form.Control
              aria-label="Add Text"
              placeholder='[Insert Text]'
              value={text} // Controlled input
              onChange={e => setText(e.target.value)}
            />
          )}
        </Row>
      </InputGroup>

      <Row className="mb-3">
        <Col>
          <DropdownButton
            variant="secondary"
            title={quantitytext}
            id="S&M"
            onSelect={handleSelectQuantity}
          >
            <Dropdown.Item eventKey="Singular" value="singular">Singular</Dropdown.Item>
            <Dropdown.Item eventKey="Multiple" value="multiple">Multiple</Dropdown.Item>
          </DropdownButton>
        </Col>
        {quantitytext === 'Multiple' && (
          <Form.Control
            aria-label="Additional Input"
            placeholder='[Posición]'
            value={position} // Controlled input
            onChange={e => setPosition(e.target.value)}
          />
        )}
      </Row>
    </div>
  );
}

export default Task;
