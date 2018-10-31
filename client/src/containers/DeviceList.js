import React, { Component } from "react";
import { Button, Modal, ControlLabel, FormControl } from "react-bootstrap";
import axios from "axios";
import FontAwesome from "react-fontawesome";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import "./Login.css";
import "./DeviceList.css";

class DeviceList extends Component {
  constructor(props) {
    super(props);
    this.addNewDevice = this.addNewDevice.bind(this);
    this.deleteButton = this.deleteButton.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleDeviceStatusChange = this.handleDeviceStatusChange.bind(this);
    this.handleDeviceNameChange = this.handleDeviceNameChange.bind(this);
    this.saveNewDevice = this.saveNewDevice.bind(this);
    this.statusCellButton = this.statusCellButton.bind(this);
  }
  state = {
    devices: null,
    showAddDeviceModal: false,
    newDeviceName: "",
    newDeviceStatus: "Paused",
    deviceNameError: null,
    viewer: false
  };
  componentDidMount() {
    if (localStorage.getItem("userRole") === "view"){
      this.setState({viewer: true})
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("authToken")}`;
    axios
      .get("/v1/devices/")
      .then(response => {
        if (response.data.devices) {
          this.setState({
            devices: response.data.devices
          });
        }
      })
      .catch(response => {
        if (response.response.status === 500){
          localStorage.removeItem('authToken');
          localStorage.removeItem('userRole');
          this.props.history.push('/login');
        }
      });
  }
  /**
   * adds new device
   */
  addNewDevice() {
    this.setState({ showAddDeviceModal: true });
  }
  /**
   * toggle device status on click of button
   * @param {*} cell
   * @param {*} row
   * @param {*} rowIndex
   */
  onClickToggleStatus(cell, row, rowIndex) {
    let toggleValue;
    const newStatus = this.state.devices.slice(); //copy the array
    if (cell.toUpperCase() === "UNPAUSED") {
      toggleValue = "PAUSED";
    } else {
      toggleValue = "UNPAUSED";
    }
    newStatus[rowIndex].status = toggleValue; //execute the manipulations
    this.setState({ devices: newStatus });
    axios
      .put(`/v1/devices/${row._id}`, {
        status: toggleValue
      })
      .then(response => {
        // successful response
      })
      .catch(error => {
        console.log(error);
      });
  }
  /**
   * render button element to change status of the device
   * @param {*} cell
   * @param {*} row
   * @param {*} enumObject
   * @param {*} rowIndex
   */
  statusCellButton(cell, row, enumObject, rowIndex) {
    // status view only for user role ='view'
    if (this.state.viewer){
      let statusColor;
      let statusIcon;
      let lowerCell = cell.toLowerCase().charAt(0).toUpperCase() + cell.toLowerCase().slice(1);
      if (cell === "PAUSED"){
        statusColor = 'redStatus';
        statusIcon = 'fa fa-pause';
      } else if (cell === "UNPAUSED"){
        statusColor = 'greenStatus';
        statusIcon = 'statusIcon fab fa-audible';
      }
      return (
        <div><i className={statusIcon}></i><span className={`statusCell ${statusColor}`}>{lowerCell}</span></div>
      )
    }
    let status;
    if (cell === 'PAUSED'){
      status = 'Unpause';
    }else if (cell === 'UNPAUSED'){
      status = 'Pause';
    }
    return (
      <button
        type="button"
        className="status-btn"
        onClick={() => this.onClickToggleStatus(cell, row, rowIndex)}
      >
      {status}
      </button>
    );
  }
  /**
   * renders delete button to delete device
   * @param {*} cell
   * @param {*} row
   * @param {*} enumObject
   * @param {*} rowIndex
   */
  deleteButton(cell, row, enumObject, rowIndex) {
    return (
      <button
        type="button"
        className="btn btn-warning react-bs-table-del-btn"
        onClick={() => this.onClickDeleteDevices(cell, row, rowIndex)}
      >
        <span><i className="fa fa-trash" aria-hidden="true"></i></span>
      </button>
    );
  }
  /**
   * event handler to delete device
   * @param {*} cell
   * @param {*} row
   * @param {*} rowIndex
   */
  onClickDeleteDevices(cell, row, rowIndex) {
    let removedList = this.state.devices.filter(
      item => item.devicename !== row.devicename
    );
    this.setState({ devices: removedList });
    axios
      .delete(`/v1/devices/${row._id}`)
      .then(response => {
        // successful response
      })
      .catch(error => {
        console.log(error);
      });
  }
  /**
   *  save new data to database after user edits the cell
   * @param {*} param0
   * @param {*} cellName
   */
  onAfterSaveCell(row, cellName, cellValue) {
    axios
      .put(`/v1/devices/${row._id}`, {
        devicename: cellValue
      })
      .then(response => {
        // successful response
      })
      .catch(error => {
        console.log(error);
      });
  }
  /**
   * handling devicename edit and save
   * @param {*} event
   */
  handleDeviceNameChange(event) {
    this.setState({ newDeviceName: event.target.value });
  }
  /**
   * handling device status edit and save
   * @param {*} event
   */
  handleDeviceStatusChange(event) {
    this.setState({ newDeviceStatus: event.target.value });
  }
  /**
   * closes 'add new device' modal
   */
  handleClose(){
    this.setState({ showAddDeviceModal: false });
  }
  /**
   * make sure that user enters a device name
   */
  validateModalData(){
    if(this.state.newDeviceName === ""){
      this.setState({deviceNameError: "Please enter a device name"});
      return false;
    }else{
      this.setState({deviceNameError: ""});
      return true;
    }
  }
  /**
   * save new device
   * @param {*} event
   */
  saveNewDevice(event) {
    if (!this.validateModalData()) {
      return;
    }
    let deviceName = this.state.newDeviceName.toLowerCase().charAt(0).toUpperCase() + this.state.newDeviceName.toLowerCase().slice(1);
    axios
      .post("/v1/devices/", {
        devicename: deviceName,
        status: this.state.newDeviceStatus.toUpperCase()
      })
      .then(response => {
        if (response.data.devicename) {
          const data = response.data;
          const newdevice = {
            devicename: data.devicename,
            status: data.status,
            _id: data._id
          };
          this.setState(previousState => ({
            devices: [...this.state.devices, newdevice]
          }));
          this.setState({ showAddDeviceModal: false });
          this.setState({newDeviceName: ""});

        }
      })
      .catch(error => {
        // if device already exists, show error
        if (error.response.status === 409){
          this.setState({deviceNameError: "Device already exists"});
        }else{
          this.setState({ showAddDeviceModal: false });
        }
        this.setState({newDeviceName: ""});
      });
  }
  render() {
    let role = localStorage.getItem("userRole");
    const devices = this.state.devices ? this.state.devices : null;
    const columns = [
      {
        dataField: "_id",
        text: "_id"
      },
      {
        dataField: "devicename",
        text: "devicename"
      },
      {
        dataField: "status",
        text: "status"
      }
    ];
    const cellEditProp = {
      mode: "dbclick",
      blurToSave: true,
      afterSaveCell: this.onAfterSaveCell
    };
    return ( <div>
      {this.state &&
        this.state.devices && (
          <div className="device-list-wrapper">
            {role === "admin" && (
            <div className="row form-group">
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-8">
                <div className="btn-group btn-group-sm" role="group">
                  <button
                    type="button"
                    onClick={this.addNewDevice}
                    className="btn btn-info react-bs-table-add-btn action-btn"
                  >
                    <span>Add New Device</span>
                  </button>
                </div>
              </div>
            </div>
          )}
          {role === "admin" && (
            <p className="info">* Please double click on device name to edit it</p>
          )}
            <BootstrapTable
              maxHeight="800px"
              cellEdit={cellEditProp}
              data={devices}
              tableHeaderClass="col-hidden"
            >
              <TableHeaderColumn dataField="_id" hidden isKey hiddenOnInsert>
                Device ID
              </TableHeaderColumn>
              <TableHeaderColumn  dataField="devicename">
                Device Name
              </TableHeaderColumn>

              <TableHeaderColumn
                dataField="status"
                editable={false}
                dataFormat={this.statusCellButton}
              >
                Device Status
              </TableHeaderColumn>
              <TableHeaderColumn
                dataField="button"
                editable={false}
                dataFormat={this.deleteButton}
                hidden={this.state.viewer}
                hiddenOnInsert
              >
               Delete
              </TableHeaderColumn>
            </BootstrapTable>
            <Modal
        show={this.state.showAddDeviceModal}
        onHide={this.handleClose}
        container={this}
      >
        <Modal.Header closeButton>
          <Modal.Title id="add-new-device-modal">
           Add New Device
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div className="modal-body">
            <div className="form-group">
            <ControlLabel>Device Name</ControlLabel>
        <FormControl
          type="text"
          value={this.state.newDeviceName}
          placeholder="Device Name"
          onChange={this.handleDeviceNameChange}/>
              </div>
              <div className="help-block">{this.state.deviceNameError}</div>
              <div className="form-group">
                  <ControlLabel>Device Status</ControlLabel>
                  <FormControl
                      componentClass="select" placeholder="Select Status"
                      value={this.state.newDeviceStatus}
                      onChange={this.handleDeviceStatusChange}>
                    <option value="Paused">Paused</option>
                    <option value="Unpaused">Unpaused</option>
                  </FormControl>
              </div>
          </div>
        </Modal.Body>
          <div className="modal-footer react-bs-table-inser-modal-footer">
              <Button bsStyle="link" onClick={this.handleClose}>Cancel</Button>
              <Button className="btn btn-primary btn-large centerButton save-device-btn action-btn" onClick={this.saveNewDevice}>Save</Button>
          </div>
      </Modal>
          </div>
        )}
    </div>
  );
  }
}
export default DeviceList;
