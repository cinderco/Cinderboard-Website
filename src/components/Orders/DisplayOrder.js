import React, { Component } from 'react';
import { connect } from 'react-redux';
import { logFetch, outgoingDelete, incomingDelete } from '../../actions';
import OrderLog from './OrderLog';
import EditOrder from './EditOrder';

class DisplayOrder extends Component {

  state = {
    editOrder: false
  }

  componentDidMount() {
    console.log(this.props.modalName);
  }

  deleteOrder(modalName, type) {
    if (type === 'outgoing') {
      if (confirm('Are you sure you want to delete this order?') == true) {
          this.props.outgoingDelete({ uid: this.props.order.uid, closeModal: this.closeModal(modalName) });
      } else {
          console.log('Delete order canceled');
      }
    } else if (type === 'incoming') {
      if (confirm('Are you sure you want to delete this order?') == true) {
          this.props.incomingDelete({ uid: this.props.order.uid, closeModal: this.closeModal(modalName) });
      } else {
          console.log('Delete order canceled');
      }
    }
  }

  setEditOrder() {
    this.setState({ editOrder: false });
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
                <p className="orderText"><span style={{ fontSize: 50 }}><img src='src/components/orders/delivery-cart.svg' height='50px' width='50px' /></span></p>
                <p>Freight</p>
              </div>
            );
          } else if (this.props.order.other === 'Delivery') {
            return (
              <div className="orderItem">
                <p className="orderText"><span style={{ fontSize: 50 }}><i className="fa fa-truck" aria-hidden="true" /></span></p>
                <p>Delivery</p>
              </div>
            );
          } else if (this.props.order.other === 'Will Call') {
            return (
              <div className="orderItem">
                <p className="orderText"><span style={{ fontSize: 50 }}><i className="fa fa-user" aria-hidden="true" /></span></p>
                <p>Will Call</p>
              </div>
            );
          } else {
            return (
              <div className="orderItem">
                <p className="orderText"><span style={{ fontSize: 50 }}><i className="fa fa-long-arrow-right" aria-hidden="true" /></span></p>
                <p>Incoming</p>
              </div>
            );
          }
    } else if (text === 'date') {
      return (
        <div className="orderItem">
          <p className="orderText"><span style={{ fontSize: 50 }}><i className="fa fa-calendar" aria-hidden="true" /></span></p>
          <p className="orderText">{this.props.order[text]}</p>
        </div>
      );
    } else if (text === 'status') {
      if (this.props.order.status === 'complete') {
        return (
          <div className="itemComplete">
            <p className="statusComplete">Complete</p>
          </div>
        );
      } else if (this.props.order.status === 'ready') {
        return (
          <div className="itemReady">
            <p className="statusReady">Ready</p>
          </div>
        );
      } else if (this.props.order.status === 'processing') {
        return (
          <div className="itemProcessing">
            <p className="statusProcessing">Processing</p>
          </div>
        );
      } else {
        return (
          <div className="orderItem">
            <p className="orderText">New</p>
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

  renderButtons(type) {
    return (
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', paddingRight: 15, marginBottom: 15 }}>
        <button
          type="submit"
          className="btn btn-success"
          style={{ width: 100, marginRight: 20 }}
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
          onClick={() => this.deleteOrder(this.props.modalName, type)}
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
    if (this.props.orderType === 'outgoing') {
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

                {this.renderButtons('outgoing')}
            </div>
          </div>
        </div>
      );
    } else {
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
                    {this.renderOrderItem('Created By', 'createdBy')}
                  </div>

                </div>
                  {this.renderButtons('incoming')}
            </div>
          </div>
        </div>
      );
    }
  }
}

export default connect(null, { logFetch, outgoingDelete, incomingDelete })(DisplayOrder);
