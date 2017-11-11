import React from 'react';
import { withStateHandlers } from 'recompose';
import { Modal, Button, Form, FormControl, ControlLabel } from 'react-bootstrap';
import './PostNew.css';
import api from '../actions/api';

const addState = withStateHandlers(
  {
    bidAmount: '0',
  },
  {
    setBid: () => bidAmount => ({
      bidAmount,
    }),
  },
);

const Bid = props => (
  <Modal show={props.show} onHide={props.onHide} className="PostNew">
    <Modal.Header closeButton>
      <Modal.Title>Bid for {props.stuff.name}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form inline className="formGroup">
        <ControlLabel>Bid amount: $</ControlLabel>
        {' '}
        <FormControl
          type="number"
          min={0}
          max={9999}
          step={10}
          value={props.bidAmount}
          onChange={e => props.setBid(e.target.value)}
        />
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button
        disabled={props.bidAmount.trim() === ''}
        bsStyle="primary"
        onClick={() => {
          api.bid({
            bidAmt: props.bidAmount,
            stuffId: props.stuff.id,
          }).then(() => props.onHide())
            .catch(e => alert('Bid failed', e.message));
        }}
      >
          Bid
        </Button>
      <Button onClick={props.onHide}>Close</Button>
    </Modal.Footer>
  </Modal>
);

export default addState(Bid);
