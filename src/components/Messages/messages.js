import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import { notesFetch } from '../../actions';

class Messages extends Component {
  state = {
    showModal: false,
    messageList: []
  }

  componentDidMount() {
    this.props.notesFetch();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ messageList: nextProps.messageList });
  }

  close() {
    this.setState({ showModal: false });
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

  renderMessages() {
    return this.state.messageList.map((message, index) => {
      return (
        <div key={index}>
          <li
            className="list-group-item"
            style={styles.listItemStyle}
            key={index}
            data-toggle="modal"
            data-target={`#modal${index}`}
          >
              <input type="checkbox" className="pull-right" style={{ display: 'flex', marginRight: '25px', marginTop: '0', alignSelf: 'center' }} />
              <span style={styles.listItemLeft}>{message.from}</span>
              <span style={styles.listItemCenter}>{message.recipient1}</span>
              <span style={styles.listItemCenter}>{message.note}</span>
              {this.renderDate(message.date)}
          </li>
        </div>
      );
    });
  }

  render() {
    return (
        <ul className="list-group">
          {this.renderMessages()}
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
    cursor: 'pointer',
    borderLeft: '0',
    borderRight: '0',
    borderRadius: '0'
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
  const messages = state.messages.conversations_list;

  const messageList = _.map(messages, (val, uid) => {
    return { ...val, uid };
  });

  return { loading, messageList };
};

export default connect(mapStateToProps, { notesFetch })(Messages);
