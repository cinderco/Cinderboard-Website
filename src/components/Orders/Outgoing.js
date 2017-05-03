import moment from 'moment';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { outgoingFetch, orderDelete } from '../../actions';
import DisplayOrder from './DisplayOrder';

class Outgoing extends Component {
  componentWillMount() {
    console.log('in outgoing', this.props);
  }

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

  renderIcon(type) {
    console.log(type);
    switch (type) {
      case 'Will Call':
        return (
          <span style={styles.listItemIcon}><i className="fa fa-user" aria-hidden="true" /></span>
        );
      case 'Delivery':
        return (
          <span style={styles.listItemIcon}><i className="fa fa-truck" aria-hidden="true" /></span>
        );
      case 'Freight':
        return (
          <span style={styles.listItemIcon}><img src='src/components/orders/delivery-cart.svg' height='20px' width='20px' /></span>
        );
      default:
        return (
        <span style={styles.listItemIcon}><i className="fa fa-envelope" aria-hidden="true" /></span>
        );
    }
  }

  renderOrders() {
    return this.props.ordersOutgoing.map((order, index) => {
      if (order.status === 'complete') {
        return (
          <div key={index}>
            <li
              className="list-group-item"
              style={styles.listItemStyleComplete}
              key={index}
              data-toggle="modal"
              data-target={`#modal${index}`}
            >
                {this.renderIcon(order.other)}
                <span style={styles.listItemLeft}>{order.companyName}</span>
                <span style={styles.listItemCenter}>{order.type}</span>
                {this.renderDate(order.date)}
            </li>
            <DisplayOrder order={order} modalName={`modal${index}`} />
          </div>
        );
      } else if (order.status === 'ready') {
        return (
          <div key={index}>
            <li
              className="list-group-item"
              style={styles.listItemStyleReady}
              key={index}
              data-toggle="modal"
              data-target={`#modal${index}`}
            >
                {this.renderIcon(order.other)}
                <span style={styles.listItemLeft}>{order.companyName}</span>
                <span style={styles.listItemCenter}>{order.type}</span>
                {this.renderDate(order.date)}
            </li>
            <DisplayOrder order={order} modalName={`modal${index}`} />
          </div>
        );
      } else if (order.status === 'processing') {
        return (
          <div key={index}>
            <li
              className="list-group-item"
              style={styles.listItemStyleProcessing}
              key={index}
              data-toggle="modal"
              data-target={`#modal${index}`}
            >
                {this.renderIcon(order.other)}
                <span style={styles.listItemLeft}>{order.companyName}</span>
                <span style={styles.listItemCenter}>{order.type}</span>
                {this.renderDate(order.date)}
            </li>
            <DisplayOrder order={order} modalName={`modal${index}`} />
          </div>
        );
      }
      return (
        <div key={index}>
          <li
            className="list-group-item"
            style={styles.listItemStyle}
            key={index}
            data-toggle="modal"
            data-target={`#modal${index}`}
          >
              {this.renderIcon(order.other)}
              <span style={styles.listItemLeft}>{order.companyName}</span>
              <span style={styles.listItemCenter}>{order.type}</span>
              {this.renderDate(order.date)}
          </li>
          <DisplayOrder order={order} modalName={`modal${index}`} />
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
  listItemStyleComplete: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#0288D1',
    cursor: 'pointer'
  },
  listItemStyleReady: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#4ff765',
    cursor: 'pointer'
  },
  listItemStyleProcessing: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff163',
    cursor: 'pointer'
  },
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
    width: '20%'
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
  outgoingFetch, orderDelete
})(Outgoing);
