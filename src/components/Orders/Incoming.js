import moment from 'moment';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { incomingFetch, orderDelete } from '../../actions';
import DisplayOrder from './DisplayOrder';


class Incoming extends Component {
  renderDate(dateParam) {
    const date = new Date();
    const shortDate = date.toLocaleDateString();
    const orderDate = new Date(dateParam);
    const shortOrderDate = orderDate.toLocaleDateString();
    const start = moment().startOf('week').format('x');
    const end = moment().endOf('week').format('x');
    const today = moment().format('x');
    const dateTwo = moment(dateParam).format('x');
    const dateDay = moment(dateParam).format('dddd');


    if (shortOrderDate === shortDate) {
      return (
        <span style={styles.listItemRight}>Today</span>
      );
    } else if (dateTwo < today) {
      return (
        <span style={styles.listItemTextLate}>{shortOrderDate}</span>
      );
    } else if (dateTwo >= start && dateTwo <= end) {
      return (
        <span style={styles.listItemRight}>{dateDay}</span>
      );
    }
    return (
      <span style={styles.listItemRight}>{shortOrderDate}</span>
    );
  }

  renderOrders() {
    return this.props.ordersIncoming.map((order, index) => {
      return (
        <div key={index}>
          <li
            className="list-group-item"
            style={styles.listItemStyle}
            key={index}
            data-toggle="modal"
            data-target={`#modal${index}incoming`}
          >
              <span style={styles.listItemLeft}>{order.companyName}</span>
              <span style={styles.listItemCenter}>{order.type}</span>
              {this.renderDate(order.date)}
          </li>
          <DisplayOrder order={order} modalName={`modal${index}incoming`} orderType={'incoming'} />
        </div>
      );
    });
  }

  render() {
    console.log('render Orders');
    return (
      <div>
        <ul className="list-group">
          {this.renderOrders()}
        </ul>
      </div>
    );
  }
}

const styles = {
  listItemStyle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    cursor: 'pointer'
  },
  listItemCenter: {
    fontSize: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%'
  },
  listItemLeft: {
    fontSize: 20,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '25%'
  },
  listItemIcon: {
    fontSize: 20,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '5%'
  },
  listItemRight: {
    fontSize: 20,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '25%'
  },
  listItemTextLate: {
    fontSize: 20,
    display: 'flex',
    justifyContent: 'flex-end',
    color: 'red',
    width: '25%'
  }
};

const mapStateToProps = state => {
  const loading = state.orders.loading;

  return { loading };
};

export default connect(mapStateToProps, {
  incomingFetch, orderDelete,
})(Incoming);
