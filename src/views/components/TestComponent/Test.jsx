import React from 'react'
import TextField from '../TextField/TextField'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { Dropdown, DropdownToggle, DropdownItem, DropdownMenu } from 'reactstrap';

class Test extends React.Component{
    state = {
        dropdownOpen : false
    }
    toggle = () =>{
        this.setState({dropdownOpen:!this.state.dropdownOpen})
    }
    render(){
      
       
        // const [dropdownOpen, setDropdownOpen] = useState(false);

        // const toggle = () => setDropdownOpen(prevState => !prevState);
        return (
          <div>
            {/* <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
              <DropdownToggle
                tag="span"
                data-toggle="dropdown"
                aria-expanded={this.state.dropdownOpen}
              >
                Custom Dropdown Content
              </DropdownToggle>
              <DropdownMenu>
                <div onClick={this.toggle}>Custom dropdown item</div>
                <div onClick={this.toggle}>Custom dropdown item</div>
                <div onClick={this.toggle}>Custom dropdown item</div>
                <div onClick={this.toggle}>Custom dropdown item</div>
              </DropdownMenu>
            </Dropdown> */}

            <Dropdown
              group
              isOpen={this.state.dropdownOpen}
              size="sm"
              toggle={this.toggle}
            >
              <DropdownToggle caret>Dropdown das</DropdownToggle>
              <DropdownMenu>
              <DropdownItem onClick={()=>alert("asdas")}>Action</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
    }
}

export default Test