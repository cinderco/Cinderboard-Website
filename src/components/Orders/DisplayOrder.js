import React, { Component } from 'react';

class DisplayOrder extends Component {
  render() {
    return (
        <div id={this.props.modalName} className="modal fade" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content" style={{ height: '80vh' }}>
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
                <h3>Order: {this.props.order.type}</h3>
                <h3>Order Type: {this.props.order.other}</h3>
                <h3>{this.props.order.other} Date: {this.props.order.createDate}</h3>
                <h3>Created By: {this.props.order.createdBy}</h3>

            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DisplayOrder;
