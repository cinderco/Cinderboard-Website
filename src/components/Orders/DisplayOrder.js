import React, { Component } from 'react';
import { connect } from 'react-redux';
import PackageVariantClosedIcon from 'react-mdi/icons/package-variant-closed';
import Walk from 'react-mdi/icons/walk';
import TruckFast from 'react-mdi/icons/truck-delivery';
import {
  logFetch,
  outgoingDelete,
  incomingDelete,
  setOrderStatus,
  outgoingArchive,
  incomingArchive
} from '../../actions';
import OrderLog from './OrderLog';
import EditOrder from './EditOrder';

class DisplayOrder extends Component {

  state = {
    editOrder: false
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

  setEditOrder() {
    this.setState({ editOrder: false });
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

  closeModal(modalName) {
    $(function () {
      $(`#${modalName}`).modal('toggle');
    });
  }

  renderOrderItem(label, text) {
    if (text === 'type') {
      return (
        <div className="orderItemOrder">
          <p className="orderTextLabel">{label}: </p>
          <p className="orderText">{this.props.order[text]}</p>
        </div>
      );
    } else if (text === 'other') {
          if (this.props.order.other === 'Freight') {
            return (
              <div className="orderItem">
                <p className="orderText">
                  <span style={{ fontSize: 50 }}>
                    <PackageVariantClosedIcon size={50} className="iconStyle" />
                  </span>
                </p>
                <p>Freight</p>
              </div>
            );
          } else if (this.props.order.other === 'Delivery') {
            return (
              <div className="orderItem">
                <p className="orderText">
                  <span style={{ fontSize: 50 }}>
                    <TruckFast size={50} className="iconStyle" />
                  </span>
                </p>
                <p>Delivery</p>
              </div>
            );
          } else if (this.props.order.other === 'Will Call') {
            return (
              <div className="orderItem">
                <p className="orderText">
                  <span style={{ fontSize: 50 }}>
                    <Walk size={50} className="iconStyle" />
                  </span>
                </p>
                <p>Will Call</p>
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
                <p>Incoming</p>
              </div>
            );
          }
    } else if (text === 'date') {
      return (
        <div className="orderItem">
          <p className="orderText">
            <span style={{ fontSize: 50 }}>
              <i className="fa fa-calendar" aria-hidden="true" />
            </span>
          </p>
          <p className="orderText">{this.props.order[text]}</p>
        </div>
      );
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
        <p className="orderText">{this.props.order[text]}</p>
      </div>
    );
  }

  renderButtons() {
    const orderType = this.props.orderType;

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          paddingRight: 15,
          marginBottom: 15
        }}
      >
        <button
          type="submit"
          className="btn btn-success"
          style={{ width: 100, marginRight: 20 }}
          onClick={() => this.onPressArchive(orderType)}
        >
          <span><i className="fa fa-archive" aria-hidden="true" /></span>
        </button>

        <button
          type="submit"
          className="btn btn-default"
          style={{ width: 100, marginRight: 20 }}
          onClick={() => this.setState({ editOrder: true })}
        >
          <span><i className="fa fa-pencil-square-o" aria-hidden="true" /></span> Edit
        </button>

        <button
          type="submit"
          className="btn btn-danger"
          style={{ width: 100 }}
          onClick={() => this.deleteOrder(this.props.modalName, orderType)}
        >
          <span><i className="fa fa-trash" aria-hidden="true" /></span>
        </button>
      </div>
    );
  }

  render() {
    if (this.state.editOrder) {
      return (
        <div id={this.props.modalName} className="modal fade" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">

              <div className="modal-header">
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  style={{ fontSize: '30px' }}
                  onClick={() => this.setState({ editOrder: false })}
                >
                  &times;
                </button>

                <h3 className="modal-title">{this.props.order.companyName}</h3>
              </div>

              <div className="modal-body">
                <EditOrder order={this.props.order} setEditOrder={this.setEditOrder.bind(this)} />
              </div>
            </div>
          </div>
        </div>
      );
    }
      return (
          <div id={this.props.modalName} className="modal fade" role="dialog">
            <div className="modal-dialog" role="document">
              <div className="modal-content">

                <div className="modal-header">
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    style={{ fontSize: '30px' }}
                  >
                    &times;
                  </button>

                  <h3 className="modal-title">{this.props.order.companyName}</h3>
                </div>

                <div className="modal-body">

                  {this.renderOrderItem('Order', 'type')}

                  <div className="orderItemsContainer">
                    {this.renderOrderItem('Order Type', 'other')}
                    {this.renderOrderItem('Date', 'date')}
                    {this.renderOrderItem('Status', 'status')}
                    {this.renderOrderItem('Created By', 'createdBy')}
                  </div>

                  <OrderLog order={this.props.order} />
                </div>

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
  }
};

export default connect(null, {
  logFetch, outgoingDelete, incomingDelete, setOrderStatus, outgoingArchive, incomingArchive
})(DisplayOrder);
