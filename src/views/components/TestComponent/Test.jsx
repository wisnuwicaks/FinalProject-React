import React from 'react'
import TextField from '../TextField/TextField'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { Button, Form, FormGroup, Label, Input, FormText, FormFeedback } from 'reactstrap';
class Test extends React.Component{
    render(){
        return(
            // <div className="container">
            //     <TextField></TextField>
            // </div>
            <div >
                <Form>
                <FormGroup>
                    <Label for="exampleSelect">Select</Label>
                    <Input type="select" name="select" id="exampleSelect">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                    </Input>
                </FormGroup>
                </Form>
            </div>
        )
    }
}

export default Test