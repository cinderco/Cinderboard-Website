import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import PackageVariantClosedIcon from 'react-mdi/icons/package-variant-closed';
import Walk from 'react-mdi/icons/walk';
import TruckFast from 'react-mdi/icons/truck-delivery';
import Modal from 'react-modal';
import Loader from 'halogen/PulseLoader';
import DayPicker from 'react-day-picker';
import {
  logFetch,
  outgoingDelete,
  incomingDelete,
  setOrderStatus,
  outgoingArchive,
  incomingArchive,
  orderFetch,
  outgoingSave,
  incomingSave
} from '../../actions';
import OrderLog from './OrderLog';
import EditOrder from './EditOrder';
import { browserHistory, Link } from 'react-router';

class DisplayOrder extends Component {

  state = {
    editOrder: false,
    initials: '',
    orderInputText: '',
    orderType: '',
    textAreaVisible: false,
    orderLogBoxHeight: 0,
    loading: true,
    orderText: '',
    orderDate: '',
    orderTitle: '',
    isOpen: false,
    calendarIsOpen: false,
    saving: true,
    date: new Date()
  }

  componentWillMount() {
    if (this.props.location.query.orderType === 'outgoing_orders') {
      this.props.orderFetch({ uid: this.props.location.query.id, type: 'outgoing_orders' });
    } else if (this.props.location.query.orderType === 'incoming_orders') {
      this.props.orderFetch({ uid: this.props.location.query.id, type: 'incoming_orders' });
    }

    $( window ).resize(() => {
      const topHalfDiv = $("#topHalfDiv").height();
      const orderContainerDiv = $("#orderContainerDiv").height();
      const orderButtonsDiv = $("#orderButtons").height();
      const orderLogBoxHeight = (orderContainerDiv - topHalfDiv - orderButtonsDiv) - 10;

      this.setState({ orderLogBoxHeight });
    });
  }

  componentDidMount() {
    setTimeout(() => {
      const topHalfDiv = $("#topHalfDiv").height();
      const orderContainerDiv = $("#orderContainerDiv").height();
      const orderButtonsDiv = $("#orderButtons").height();
      const orderLogBoxHeight = (orderContainerDiv - topHalfDiv - orderButtonsDiv) - 10;

      this.setState({ orderLogBoxHeight });
    }, 100);
  }

  componentWillReceiveProps(nextProps) {
    const initials = this.getInitials(nextProps.order.createdBy);
    this.setState({
      initials,
      orderType: nextProps.order.other,
      orderTitle: nextProps.order.companyName,
      orderText: nextProps.order.type,
      loading: false
    });

    if (nextProps.order.date === 'Unknown') {
      this.setState({ date: 'Unknown' });
    } else {
      this.setState({ date: new Date(nextProps.order.date) });
    }
  }

  onPressArchive(type) {
    if (type === 'outgoing') {
      if (confirm('Are you sure you want to archive this order?') === true) {
        this.props.outgoingArchive({ uid: this.props.order.uid });

        this.closeModal(this.props.modalName);
      } else {
          console.log('Archive outgoing order canceled');
      }
    } else if (type === 'incoming') {
      if (confirm('Are you sure you want to archive this order?') === true) {
        this.props.incomingArchive({ uid: this.props.order.uid });

        this.closeModal(this.props.modalName);
      } else {
          console.log('Archive incoming order canceled');
      }
    }
  }

  onPressSaveButton() {
    this.setState({ isOpen: true });

    if (this.props.order.orderType === 'incoming') {
      if (this.state.date === 'Unknown' || this.state.date === '') {
        const order = this.props.order;
        const uid = order.uid;
        const { date, orderType } = this.state;
        const orderContent = $('#orderText').text();
        const orderTitle = $('#orderTitle').text();
        const newDate = 'Unknown';
        const companyNameOld = order.companyName;
        const typeOld = order.type;
        const status = order.status;
        const { createDate, createdBy } = order;

        const changedValues = _.differenceWith(
          [{ companyName: orderTitle }, { type: orderContent }, { newDate }],
          [{ companyName: companyNameOld }, { type: typeOld }, { newDate: order.date }],
           _.isEqual);

        const changedValuesTwo = () => {
          const changedValuesArr = ['changed '];
          const date1 = this.props.order.date;
          const date2 = 'Unknown';

          for (let i = 0; i < changedValues.length; i++) {
            if (Object.keys(changedValues[i])[0] === 'companyName') {
                changedValuesArr.push(`company name from ${companyNameOld} to ${orderTitle}, `);
            } else if (Object.keys(changedValues[i])[0] === 'type') {
                changedValuesArr.push(`order from ${typeOld} to ${orderContent}, `);
            } else if (Object.keys(changedValues[i])[0] === 'newDate') {
                changedValuesArr.push(`order date from ${date1} to ${date2}`);
            }
          }

          return changedValuesArr;
        };

        const changed = changedValuesTwo();

        this.props.incomingSave({
          companyName: orderTitle, type: orderContent, newDate, status, uid, createDate, changed, createdBy, savingOrder: this.savingOrder.bind(this)
        });
      } else {
        const order = this.props.order;
        const uid = order.uid;
        const { date, orderType } = this.state;
        const orderContent = $('#orderText').text();
        const orderTitle = $('#orderTitle').text();
        const newDate = new Date(date);
        const companyNameOld = order.companyName;
        const typeOld = order.type;
        const status = order.status;
        const { createDate, createdBy } = order;

        const changedValues = _.differenceWith(
          [{ companyName: orderTitle }, { type: orderContent }, { newDate: newDate.toLocaleDateString() }],
          [{ companyName: companyNameOld }, { type: typeOld }, { newDate: order.date }],
           _.isEqual);

        const changedValuesTwo = () => {
          const changedValuesArr = ['changed '];
          const date1 = this.props.order.date;
          const date2 = new Date(newDate).toLocaleDateString();

          for (let i = 0; i < changedValues.length; i++) {
            if (Object.keys(changedValues[i])[0] === 'companyName') {
                changedValuesArr.push(`company name from ${companyNameOld} to ${orderTitle}, `);
            } else if (Object.keys(changedValues[i])[0] === 'type') {
                changedValuesArr.push(`order from ${typeOld} to ${orderContent}, `);
            } else if (Object.keys(changedValues[i])[0] === 'newDate') {
                changedValuesArr.push(`order date from ${date1} to ${date2}`);
            }
          }

          return changedValuesArr;
        };

        const changed = changedValuesTwo();

        this.props.incomingSave({
          companyName: orderTitle, type: orderContent, newDate, status, uid, createDate, changed, createdBy, savingOrder: this.savingOrder.bind(this)
        });
      }
    } else {
      if (this.state.date === 'Unknown' || this.state.date === '') {
        const order = this.props.order;
        const uid = order.uid;
        const { date, orderType } = this.state;
        const orderContent = $('#orderText').text();
        const orderTitle = $('#orderTitle').text();
        const newDate = 'Unknown';
        const companyNameOld = order.companyName;
        const typeOld = order.type;
        const otherOld = order.other;
        const status = order.status;
        const { createDate, createdBy } = order;

        const changedValues = _.differenceWith(
          [{ companyName: orderTitle }, { type: orderContent }, { other: orderType }, { newDate }],
          [{ companyName: companyNameOld }, { type: typeOld }, { other: otherOld }, { newDate: order.date }],
           _.isEqual);

        const changedValuesTwo = () => {
          const changedValuesArr = ['changed '];
          const date1 = this.props.order.date;
          const date2 = 'Unknown';

          for (let i = 0; i < changedValues.length; i++) {
            if (Object.keys(changedValues[i])[0] === 'companyName') {
                changedValuesArr.push(`company name from ${companyNameOld} to ${orderTitle}, `);
            } else if (Object.keys(changedValues[i])[0] === 'type') {
                changedValuesArr.push(`order from ${typeOld} to ${orderContent}, `);
            } else if (Object.keys(changedValues[i])[0] === 'other') {
                changedValuesArr.push(`order type from ${otherOld} to ${orderType}, `);
            } else if (Object.keys(changedValues[i])[0] === 'newDate') {
                changedValuesArr.push(`order ${otherOld} date from ${date1} to ${date2}`);
            }
          }

          return changedValuesArr;
        };

        const changed = changedValuesTwo();

        this.props.outgoingSave({
          companyName: orderTitle, type: orderContent, newDate, other: orderType, status, uid, createDate, changed, createdBy, savingOrder: this.savingOrder.bind(this)
        });
      } else {
        const order = this.props.order;
        const uid = order.uid;
        const { date, orderType } = this.state;
        const orderContent = $('#orderText').text();
        const orderTitle = $('#orderTitle').text();
        const newDate = new Date(date);
        const companyNameOld = order.companyName;
        const typeOld = order.type;
        const otherOld = order.other;
        const status = order.status;
        const { createDate, createdBy } = order;

        const changedValues = _.differenceWith(
          [{ companyName: orderTitle }, { type: orderContent }, { other: orderType }, { newDate: newDate.toLocaleDateString() }],
          [{ companyName: companyNameOld }, { type: typeOld }, { other: otherOld }, { newDate: order.date }],
           _.isEqual);

        const changedValuesTwo = () => {
          const changedValuesArr = ['changed '];
          const date1 = this.props.order.date;
          const date2 = new Date(newDate).toLocaleDateString();

          for (let i = 0; i < changedValues.length; i++) {
            if (Object.keys(changedValues[i])[0] === 'companyName') {
                changedValuesArr.push(`company name from ${companyNameOld} to ${orderTitle}, `);
            } else if (Object.keys(changedValues[i])[0] === 'type') {
                changedValuesArr.push(`order from ${typeOld} to ${orderContent}, `);
            } else if (Object.keys(changedValues[i])[0] === 'other') {
                changedValuesArr.push(`order type from ${otherOld} to ${orderType}, `);
            } else if (Object.keys(changedValues[i])[0] === 'newDate') {
                changedValuesArr.push(`order ${otherOld} date from ${date1} to ${date2}`);
            }
          }

          return changedValuesArr;
        };

        const changed = changedValuesTwo();

        this.props.outgoingSave({
          companyName: orderTitle, type: orderContent, newDate, other: orderType, status, uid, createDate, changed, createdBy, savingOrder: this.savingOrder.bind(this)
        });
      }
    }
  }

  deleteOrder(modalName, type) {
    if (type === 'outgoing') {
      if (confirm('Are you sure you want to delete this order?') === true) {
          this.props.outgoingDelete({
            uid: this.props.order.uid,
            closeModal: this.closeModal(modalName)
          });
      } else {
          console.log('Delete order canceled');
      }
    } else if (type === 'incoming') {
      if (confirm('Are you sure you want to delete this order?') === true) {
          this.props.incomingDelete({
            uid: this.props.order.uid,
            // closeModal: this.closeModal(modalName)
          });

          $(function () {
            $(`#${modalName}`).modal('hide');
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
          });
      } else {
          console.log('Delete order canceled');
      }
    }
  }


  getInitials(name) {
    let names = name.split(' '),
        initials = names[0].substring(0, 1).toUpperCase();

    if (names.length > 1) {
        initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  }

  getOrderLogHeight() {
    const topHalfDiv = $("#topHalfDiv").height();
    const orderContainerDiv = $("#orderContainerDiv").height();
    const orderLogBoxHeight = (orderContainerDiv - topHalfDiv) - 10;
  }

  setOrderText() {
    const text = $('#orderText').text();
    console.log(text);
    this.getOrderLogHeight();
    this.setState({ orderText: text })
  }

  setTitle(orderTitle) {
    console.log(orderTitle);
    this.getOrderLogHeight();
    this.setState({ orderTitle })
  }

  renderTextArea() {
    if (this.state.textAreaVisible) {
      return (
        <textarea
          value={this.state.orderInputText}
          className="orderInput"
          id="orderTextArea"
          onChange={() => this.setState({ orderText: document.getElementById('orderTextArea').value })}
        />
      );
    } else {
      return (
        <p
          className="orderTextArea"
          contentEditable
          onInput={() => this.getOrderLogHeight()}
          suppressContentEditableWarning
          id="orderText"
        >{this.state.orderText}</p>
      );
    }
  }

  renderOrderItem(label, text) {
    if (text === 'type') {
      return (
        <div className="orderItemOrder">
          <p className="orderTextLabel">{label}: </p>
          {this.renderTextArea()}
        </div>
      );
    } else if (text === 'other') {
          if (this.state.orderType === 'Freight') {
            return (
              <div className="orderItem">
                <p className="orderText">
                  <span style={{ fontSize: 50 }}>
                    <PackageVariantClosedIcon size={50} className="iconStyle" />
                  </span>
                </p>
                <select
                  id="selectFreight"
                  onChange={() => this.setState({ orderType: document.getElementById('selectFreight').value })}
                >
                <option value="Delivery">Delivery</option>
                <option value="Freight" selected>Freight</option>
                <option value="Will Call">Will Call</option>
                </select>
              </div>
            );
          } else if (this.state.orderType === 'Delivery') {
            return (
              <div className="orderItem">
                <p className="orderText">
                  <span style={{ fontSize: 50 }}>
                    <TruckFast size={50} className="iconStyle" />
                  </span>
                </p>
                <select
                  id="selectDelivery"
                  onChange={() => this.setState({ orderType: document.getElementById('selectDelivery').value })}
                >
                  <option value="Delivery" selected>Delivery</option>
                  <option value="Freight">Freight</option>
                  <option value="Will Call">Will Call</option>
                </select>
              </div>
            );
          } else if (this.state.orderType === 'Will Call') {
            return (
              <div className="orderItem">
                <p className="orderText">
                  <span style={{ fontSize: 50 }}>
                    <Walk size={40} className="iconStyle" />
                  </span>
                </p>
                <select
                  id="selectWillCall"
                  onChange={() => this.setState({ orderType: document.getElementById('selectWillCall').value })}
                >
                  <option value="Delivery">Delivery</option>
                  <option value="Freight">Freight</option>
                  <option value="Will Call" selected>Will Call</option>
                </select>
              </div>
            );
          } else {
            return (
              <div className="orderItem">
                <p className="orderText">
                  <span style={{ fontSize: 50 }}>
                    <i className="fa fa-long-arrow-right" aria-hidden="true" />
                  </span>
                </p>
                <p style={{ fontSize: 20 }}>Incoming</p>
              </div>
            );
          }
    } else if (text === 'date') {
      if (this.state.date === 'Unknown') {
        const date = this.state.date;

        return (
          <div className="orderItem" onClick={() => this.setState({ calendarIsOpen: true })} style={{ cursor: 'pointer' }}>
            <p className="orderText">
              <span style={{ fontSize: 40 }}>
                <i className="fa fa-calendar" aria-hidden="true" />
              </span>
            </p>
            <p className="orderText" style={{ marginTop: 10 }}>{date}</p>
          </div>
        );
      } else {
        const date = this.state.date.toLocaleDateString();

        return (
          <div className="orderItem" onClick={() => this.setState({ calendarIsOpen: true })} style={{ cursor: 'pointer' }}>
            <p className="orderText">
              <span style={{ fontSize: 40 }}>
                <i className="fa fa-calendar" aria-hidden="true" />
              </span>
            </p>
            <p className="orderText" style={{ marginTop: 10 }}>{date}</p>
          </div>
        );
      }
    } else if (text === 'status') {
      if (this.props.order.status === 'complete') {
        return (
          <div className="itemComplete">
            <p className="statusComplete">Complete</p>
            <div
              onClick={() => this.props.setOrderStatus({
                orderStatus: 'ready',
                uid: this.props.order.uid,
                company: this.props.order.companyName,
                log: 'set order status to ready',
                orderType: 'outgoing_orders'
              })}
              style={styles.statusButtonLeft}
            >
              <div style={{ width: 25, height: 25, position: 'relative', borderRadius: 5 }}>
                <span className="centered">
                  <i className="fa fa-arrow-left" aria-hidden="true" />
                </span>
              </div>
            </div>
          </div>
        );
      } else if (this.props.order.status === 'ready') {
        return (
          <div className="itemReady">
            <p className="statusReady">Ready</p>

              <div
                onClick={() => this.props.setOrderStatus({
                  orderStatus: 'processing',
                  uid: this.props.order.uid,
                  company: this.props.order.companyName,
                  log: 'set order status to processing',
                  orderType: 'outgoing_orders'
                })}
                style={styles.statusButtonLeft}
              >
                <div style={{ width: 25, height: 25, position: 'relative', borderRadius: 5 }}>
                  <span className="centered">
                    <i className="fa fa-arrow-left" aria-hidden="true" />
                  </span>
                </div>
              </div>

              <div
                onClick={() => this.props.setOrderStatus({
                  orderStatus: 'complete',
                  uid: this.props.order.uid,
                  company: this.props.order.companyName,
                  log: 'set order status to complete',
                  orderType: 'outgoing_orders'
                })}
                style={styles.statusButtonRight}
              >
                <div style={{ width: 25, height: 25, position: 'relative', borderRadius: 5 }}>
                  <span className="centered">
                    <i className="fa fa-arrow-right" aria-hidden="true" />
                  </span>
                </div>
              </div>

          </div>
        );
      } else if (this.props.order.status === 'processing') {
        return (
          <div className="itemProcessing">
            <p className="statusProcessing">Processing</p>

              <div
                onClick={() => this.props.setOrderStatus({
                  orderStatus: 'new',
                  uid: this.props.order.uid,
                  company: this.props.order.companyName,
                  log: 'set order status to new',
                  orderType: 'outgoing_orders'
                })}
                style={styles.statusButtonLeft}
              >
                <div style={{ width: 25, height: 25, position: 'relative', borderRadius: 5 }}>
                  <span className="centered">
                    <i className="fa fa-arrow-left" aria-hidden="true" />
                  </span>
                </div>
              </div>

              <div
                onClick={() => this.props.setOrderStatus({
                  orderStatus: 'ready',
                  uid: this.props.order.uid,
                  company: this.props.order.companyName,
                  log: 'set order status to ready',
                  orderType: 'outgoing_orders'
                })}
                style={styles.statusButtonRight}
              >
                <div style={{ width: 25, height: 25, position: 'relative', borderRadius: 5 }}>
                  <span className="centered">
                    <i className="fa fa-arrow-right" aria-hidden="true" />
                  </span>
                </div>
              </div>
          </div>
        );
      } else if (this.props.order.status === 'In Transit') {
        return (
          <div className="orderItem">
            <p className="statusProcessing">In Transit</p>
              <div
                onClick={() => this.props.setOrderStatus({
                  orderStatus: 'Received',
                  uid: this.props.order.uid,
                  company: this.props.order.companyName,
                  log: 'set order status to received',
                  orderType: 'incoming_orders'
                })}
                style={styles.statusButtonRight}
              >
                <div style={{ width: 25, height: 25, position: 'relative', borderRadius: 5 }}>
                  <span className="centered">
                    <i className="fa fa-arrow-right" aria-hidden="true" />
                  </span>
                </div>
              </div>
          </div>
        );
      } else if (this.props.order.status === 'Received') {
        return (
            <div className="itemComplete">
              <p className="statusComplete">Received</p>
              <div
                onClick={() => this.props.setOrderStatus({
                  orderStatus: 'In Transit',
                  uid: this.props.order.uid,
                  company: this.props.order.companyName,
                  log: 'set order status back to In Transit',
                  orderType: 'incoming_orders'
                })}
                style={styles.statusButtonLeft}
              >
                <div style={{ width: 25, height: 25, position: 'relative', borderRadius: 5 }}>
                  <span className="centered">
                    <i className="fa fa-arrow-left" aria-hidden="true" />
                  </span>
                </div>
              </div>
            </div>
        );
      } else {
        return (
          <div className="orderItem">
              <div
                onClick={() => this.props.setOrderStatus({
                  orderStatus: 'processing',
                  uid: this.props.order.uid,
                  company: this.props.order.companyName,
                  log: 'set order status to processing',
                  orderType: 'outgoing_orders'
                })}
                className="centered"
                style={{ height: 100, width: 150, textAlign: 'center' }}
              >
                <a style={{ cursor: 'pointer' }} className="centered">Click to start order!</a>
              </div>
          </div>
        );
      }
    }
    return (
      <div className="orderItem">
        <div className="initials">
          <p className="orderText" style={{ color: 'red', fontSize: 30 }}>{this.state.initials}</p>
        </div>
      </div>
    );
  }

  renderButtons() {
    const orderType = this.props.order.orderType;

    return (
      <div className="orderButtons" id="orderButtons" style={{ position: 'relative' }}>
        <button
          type="submit"
          className="btn btn-primary"
          style={{ marginRight: 20, position: 'absolute', left: 0, top: 0, height: 40 }}
          onClick={() => this.onPressSaveButton()}
        >
          Save Changes
        </button>

        <button
          type="submit"
          className="btn btn-success"
          style={{ width: 100, marginRight: 20, height: 40 }}
          onClick={() => this.onPressArchive(orderType)}
        >
          <span><i className="fa fa-archive" aria-hidden="true" /></span>
        </button>

        <button
          type="submit"
          className="btn btn-danger"
          style={{ width: 100, height: 40 }}
          onClick={() => this.deleteOrder(this.props.modalName, orderType)}
        >
          <span><i className="fa fa-trash" aria-hidden="true" /></span>
        </button>
      </div>
    );
  }

  openModal() {
    this.setState({ isOpen: true });
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = '#f00';
  }

  closeModal() {
    this.setState({ isOpen: false });
  }

  savingOrder() {
    this.setState({ saving: false });

    setTimeout(() => {
      this.setState({ isOpen: false });
    }, 1000)
  }

  renderSavingModal() {
    if (this.state.saving) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', height: '90vh' }}>
          <Loader color="#DB2728" size="16px" margin="4px" />
          <h3>Saving Order</h3>
        </div>
      );
    } else {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', height: '90vh' }}>
          <i className="fa fa-check-circle-o" aria-hidden="true" style={{ fontSize: 75, color: '#5DB85B' }} />
          <h3>Saved</h3>
        </div>
      );
    }
  }

  handleDayClick = day => {
    console.log(day);

    this.setState({
      date: day,
      calendarIsOpen: false
    });
  };

  setDateUnknown() {
    this.setState({
      date: 'Unknown',
      calendarIsOpen: false
    });
  }

  getMonth() {
    if (this.state.date === "Unknown") {
      const date = new Date();
      return date;
    } else {
      const date = new Date(this.state.date);
      return date;
    }
  }

  render() {
    if (this.state.loading) {
      return (
        <div><p>loading.....</p></div>
      );
    }
      return (
        <div>
          <Modal
            isOpen={this.state.isOpen}
            onRequestClose={() => this.closeModal()}
            contentLabel="Example Modal"
            style={styles}
          >
            {this.renderSavingModal()}
          </Modal>

          <Modal
            isOpen={this.state.calendarIsOpen}
            onRequestClose={() => this.closeModal()}
            contentLabel="Example Modal"
            style={styles}
          >
              <DayPicker onDayClick={this.handleDayClick} selectedDays={this.getMonth()} month={this.getMonth()} />

              <button
                type="submit"
                className="btn btn-primary"
                style={{ marginTop: 50, height: 40 }}
                onClick={() => this.setDateUnknown()}
              >
                Unknown
              </button>
          </Modal>


          <div className="outsideOrderContainer">
            <div className="orderContainer" id="orderContainerDiv">
                <div className="topHalf" id="topHalfDiv">

                    <p
                      style={{ padding: 0, margin: 0, width: '100%', fontSize: 26, fontWeight: '600' }}
                      onInput={() => this.getOrderLogHeight()}
                      suppressContentEditableWarning
                      contentEditable
                      id="orderTitle"
                    >{this.props.order.companyName}</p>


                  {this.renderOrderItem('Order', 'type')}

                  <div className="orderItemsContainer">
                    {this.renderOrderItem('Order Type', 'other')}
                    {this.renderOrderItem('Date', 'date')}
                    {this.renderOrderItem('Status', 'status')}
                    {this.renderOrderItem('Created By', 'createdBy')}
                  </div>
                </div>

                <OrderLog order={this.props.order} height={this.state.orderLogBoxHeight} />

                {this.renderButtons()}

            </div>
          </div>
        </div>
      );
    }
}

const styles = {
  statusButtonLeft: {
    height: 25,
    width: 25,
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 10,
    left: 10,
    display: 'flex',
    borderRadius: 5,
    cursor: 'pointer'
  },
  statusButtonRight: {
    height: 25,
    width: 25,
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 10,
    right: 10,
    justifyContent: 'center',
    alignContent: 'center',
    display: 'flex',
    borderRadius: 5,
    cursor: 'pointer',
    borderWidth: 1,
    borderColor: '#ddd'
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  content: {
    margin: 'auto',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: '400px',
    height: '400px',
    border: '1px solid #ccc',
    background: '#fff',
    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    borderRadius: '4px',
    outline: 'none',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  }
};

const calendarStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  content: {
    margin: 'auto',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: '400px',
    height: '400px',
    border: '1px solid #ccc',
    background: '#fff',
    borderRadius: '4px',
    outline: 'none',
    padding: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  }
}

const mapStateToProps = state => {
  const loading = state.orders.loading;

  const { order } = state.orders;

  console.log('ORDER INFO', order);

  return { loading, order };
};

export default connect(mapStateToProps, {
  logFetch, outgoingDelete, incomingDelete, setOrderStatus, outgoingArchive, incomingArchive, orderFetch, outgoingSave, incomingSave
})(DisplayOrder);

