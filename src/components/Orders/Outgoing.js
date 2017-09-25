import moment from 'moment';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PackageVariantClosedIcon from 'react-mdi/icons/package-variant-closed';
import Walk from 'react-mdi/icons/walk';
import TruckFast from 'react-mdi/icons/truck-delivery';
import { outgoingFetch, orderDelete } from '../../actions';
import DisplayOrder from './DisplayOrder';
import { browserHistory, Link } from 'react-router';

class Outgoing extends Component {

  renderDate(dateParam) {
    if (dateParam === 'Unknown') {
      return (
        <span style={styles.listItemRight}>?</span>
      );
    } else {
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
  }

  renderIcon(type) {
    switch (type) {
      case 'Will Call':
        return (
          <span style={styles.listItemIcon}><Walk size={26} className="myClassName" /></span>
        );
      case 'Delivery':
        return (
          <span style={styles.listItemIcon}><TruckFast size={26} className="myClassName" /></span>
        );
      case 'Freight':
        return (
          <span style={styles.listItemIcon}><PackageVariantClosedIcon size={26} className="myClassName" /></span>
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
            <Link to={{ pathname: '/order', query: { id: order.uid, orderType: 'outgoing_orders' } }}>
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
            </Link>
          </div>
        );
      } else if (order.status === 'ready') {
        return (
          <div key={index}>
            <Link to={{ pathname: '/order', query: { id: order.uid, orderType: 'outgoing_orders' } }}>
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
            </Link>
          </div>
        );
      } else if (order.status === 'processing') {
        return (
          <div key={index}>
            <Link to={{ pathname: '/order', query: { id: order.uid, orderType: 'outgoing_orders' } }}>
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
            </Link>
          </div>
        );
      }
      return (
        <div key={index}>
          <Link to={{ pathname: '/order', query: { id: order.uid, orderType: 'outgoing_orders' } }}>
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
          </Link>
        </div>
      );
    });
  }

  render() {
    return (
        <ul className="list-group">
          {this.renderOrders()}
        </ul>
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

