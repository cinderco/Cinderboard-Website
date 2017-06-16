import React, { Component } from 'react';
import _ from 'lodash';

class OrderLog extends Component {

  renderOrderLogItem() {
    const log = _.map(this.props.order.log, (val, uid) => {
      return { ...val, uid };
    });

    return log.map((logItem, index) => {
      return (
        <div key={index}>
          <li
            key={index}
          >
            <div style={{ flexDirection: 'column', paddingBottom: 10 }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ color: '#848484' }}>{logItem.logDate}</span>
                <span style={{ paddingLeft: 5, color: '#848484' }}>{logItem.logTime}</span>
              </div>
              <div>
                <span style={{ color: 'red' }}>{logItem.createdBy} </span>
                <span>{logItem.log}</span>
              </div>
            </div>
          </li>
        </div>
      );
    });
  }

  render() {
    return (
      <container>
        <div style={{ textAlign: 'center' }}>
          <h4>Order Log</h4>
        </div>
        <div className="orderLogBox">
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {this.renderOrderLogItem()}
          </ul>
        </div>
      </container>
    );
  }

}

export default OrderLog;
