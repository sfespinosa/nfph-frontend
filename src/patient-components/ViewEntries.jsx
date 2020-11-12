import React, {useEffect, useState} from "react";
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector} from "react-redux";
import ViewComment from "./ViewComment.jsx";
import { fetchEntries } from "../actions/fetchEntries";
import { deleteEntry } from "../actions/deleteEntry";
import { getComments } from "../actions/commentActions";
import {
    Card,
    CardText,
    CardBody,
    CardTitle,
    CardHeader,
    Button,
    Row,
    Col,
    Form,
    FormGroup,
    Label,
    Input,
    UncontrolledCollapse
} from 'reactstrap';
import { enterEditEntryMode } from "../actions/enterEditEntryMode";

const ViewEntries = () => {

  const allEntries = useSelector(state => state.entryReducer.allEntries[0])
  const comments = 1
  const [isOpen, setIsOpen] = useState(false)

  // Fetches all entries when the user goes to view all entries

  useEffect(() => {
      fetchAllEntries();
  }, []);

  const dispatch = useDispatch();

  const fetchAllEntries = () => {
      dispatch(fetchEntries());
  }

  const deleteOneEntry = (event) => {
      dispatch(deleteEntry(event));
      dispatch(fetchEntries());
  }

  const editEntry = (event) => {
    dispatch(enterEditEntryMode(event));
    redirect(event)
  }

  const toggle = (entryId) => {
    // dispatch(getComments(entryId))
    setIsOpen(!isOpen)
  }

  const viewCommentsByEntry = (entryId) => {
    // dispatch(getComments(entryId))
    return <ViewComment entryId={entryId} />
  }

  
  // Formats Date

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const getDate = (date) => {

    let year;
    let month;
    let day;

    if (date) {
        year = date.slice(0, 4);
        month = monthNames[date.slice(5, 7) - 1];
        day = date.slice(8, 10)
    }

    return `${month} ${day}, ${year}`

  }


  // Creates entry cards from allEntries

  const createEntryCards = () => {

      return allEntries.map(entry => {
        const entryToggler = 'comment' + entry.id
        const entryId = entry.id
    
        return (
          <Row>
            <Col>
              <Card outline color="danger" className="border" key={entry.id}>
                <CardHeader>{getDate(entry.date_of_entry)}</CardHeader>
                <CardBody>
                  <CardTitle>Issue</CardTitle>
                  <CardText>{entry.issue}</CardText>
                  <CardTitle>Location</CardTitle>
                  <CardText>{entry.location}</CardText>
                  <CardTitle>Pain Level</CardTitle>
                  <CardText>{entry.pain_level}</CardText>
                  <CardTitle>Symptoms</CardTitle>
                  <CardText>{entry.symptoms}</CardText>
                  <CardText>
                    <small className="text-muted">{comments} comments</small>
                  </CardText>
                  <Button id={entryToggler} isOpen={isOpen} onClick={() => toggle(entryId)}>View Comments</Button>
                  <Button value={entry.id} onClick={(event => editEntry(event))} >Edit Entry</Button>
                  <Button value={entry.id} onClick={(event => deleteOneEntry(event))}>Delete Entry</Button>
                  <UncontrolledCollapse toggler={entryToggler}>
                    { isOpen ? viewCommentsByEntry(entryId) : null }
                    <Form>
                      <FormGroup>
                        <Label for="exampleText">Add Comment</Label>
                        <Input type="textarea" name="text" id="exampleText" />
                      </FormGroup>
                    </Form>
                  </UncontrolledCollapse>
                </CardBody>
              </Card>
            </Col>
          </Row>
        )
      })

  }


  // Takes user to new entry page when they click edit entry

  const history = useHistory();

  const redirect = () => {
    history.push('/patient/newentry');
  }

  return (

    <div>
      <h4 className="mb-3">All Entries</h4>
      {allEntries ? createEntryCards() : null}
    </div>

  );
}

export default ViewEntries;