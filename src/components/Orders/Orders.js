import firebase from 'firebase';
import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loader from 'halogen/PulseLoader';
import { signOutUser, outgoingFetch, incomingFetch } from '../../actions';
import Outgoing from './Outgoing';
import Incoming from './Incoming';
import NewOrder from './NewOrder';
import NewIncomingOrder from './NewIncomingOrder';


class Orders extends Component {
  state = {
    showModal: false,
    sortByOutgoing: 'Date',
    sortByIncoming: 'Date',
    ordersOutgoing: [],
    ordersIncoming: []
  }

  componentWillMount() {
    this.props.outgoingFetch();
    this.props.incomingFetch();
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.sortByOutgoing === 'Date') {
      const ordersOutgoing = nextProps.outgoing.sort((a, b) => {
        if (a.date === 'Unknown' && b.date !== 'Unknown') {
          const stringToNumber = 3002085600000;

          return stringToNumber - new Date(b.date).getTime();
        } else if (a.date === 'Unknown' && b.date === 'Unknown') {
          const stringToNumberA = 3002085600000;
          const stringToNumberB = 3002085600000;

          return stringToNumberA - stringToNumberB;
        } else if (a.date !== 'Unknown' && b.date === 'Unknown') {
          const stringToNumber = 3002085600000;

          return new Date(a.date).getTime() - stringToNumber;
        } else {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
      });

      this.setState({ ordersOutgoing });
    } else if (this.state.sortByOutgoing === 'Name') {
      const ordersOutgoing = _.sortBy(nextProps.outgoing, [(o) => {
        return o.companyName;
      }]);

      this.setState({ ordersOutgoing });
    }

    if (this.state.sortByIncoming === 'Date') {
      const ordersIncoming = nextProps.incoming.sort((a, b) => {
        if (a.date === 'Unknown' && b.date !== 'Unknown') {
          const stringToNumber = 3002085600000;

          return stringToNumber - new Date(b.date).getTime();
        } else if (a.date === 'Unknown' && b.date === 'Unknown') {
          const stringToNumberA = 3002085600000;
          const stringToNumberB = 3002085600000;

          return stringToNumberA - stringToNumberB;
        } else if (a.date !== 'Unknown' && b.date === 'Unknown') {
          const stringToNumber = 3002085600000;

          return new Date(a.date).getTime() - stringToNumber;
        } else {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
      });

      this.setState({ ordersIncoming });
    } else if (this.state.sortByIncoming === 'Name') {
      const ordersIncoming = _.sortBy(nextProps.incoming, [(o) => {
        return o.companyName;
      }]);

      this.setState({ ordersIncoming });
    }
  }

  close() {
    this.setState({ showModal: false });
  }

  setSortByOutgoing() {
    if (document.getElementById('setOrderByOutgoing').value === 'Date') {
      const ordersOutgoing = this.props.outgoing.sort((a, b) => {
        if (a.date === 'Unknown' && b.date !== 'Unknown') {
          const stringToNumber = 3002085600000;

          return stringToNumber - new Date(b.date).getTime();
        } else if (a.date === 'Unknown' && b.date === 'Unknown') {
          const stringToNumberA = 3002085600000;
          const stringToNumberB = 3002085600000;

          return stringToNumberA - stringToNumberB;
        } else if (a.date !== 'Unknown' && b.date === 'Unknown') {
          const stringToNumber = 3002085600000;

          return new Date(a.date).getTime() - stringToNumber;
        } else {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
      });

      this.setState({ ordersOutgoing });
    } else if (document.getElementById('setOrderByOutgoing').value === 'Name') {
      const ordersOutgoing = _.sortBy(this.props.outgoing, [(o) => {
        return o.companyName;
      }]);

      this.setState({ ordersOutgoing });
    }
  }

  setSortByIncoming() {
    if (document.getElementById('setOrderByIncoming').value === 'Date') {
      const ordersIncoming = this.props.incoming.sort((a, b) => {
        if (a.date === 'Unknown' && b.date !== 'Unknown') {
          const stringToNumber = 3002085600000;

          return stringToNumber - new Date(b.date).getTime();
        } else if (a.date === 'Unknown' && b.date === 'Unknown') {
          const stringToNumberA = 3002085600000;
          const stringToNumberB = 3002085600000;

          return stringToNumberA - stringToNumberB;
        } else if (a.date !== 'Unknown' && b.date === 'Unknown') {
          const stringToNumber = 3002085600000;

          return new Date(a.date).getTime() - stringToNumber;
        } else {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
      });

      this.setState({ ordersIncoming });
    } else if (document.getElementById('setOrderByIncoming').value === 'Name') {
      const ordersIncoming = _.sortBy(this.props.incoming, [(o) => {
        return o.companyName;
      }]);

      this.setState({ ordersIncoming });
    }
  }

  getFirebaseJson(ReportTitle, ShowLabel, type) {
    firebase.database().ref(`/data/${type}_orders`)
      .on('value', snapshot => {
        let JSONData = snapshot.val();

        const date = new Date().toLocaleDateString();

        const changeData = () => {
          const jsonARR = [];

          for (let i = 0; i < Object.keys(JSONData).length; i++) {
            if (JSONData[Object.keys(JSONData)[i]] === 'log') {
              break;
            } else {
              jsonARR.push(JSONData[Object.keys(JSONData)[i]]);
            }
          }

          return jsonARR;
        };

        JSONData = changeData();

        //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
        const arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

        let CSV = '';
        //Set Report title in first row or line

        CSV += ReportTitle + '\r\n\n';

        //This condition will generate the Label/Header
        if (ShowLabel) {
            let row = "";

            //This loop will extract the label from 1st index of on array
            for (const index in arrData[0]) {

                //Now convert each value to string and comma-seprated
                row += index + ',';
            }

            row = row.slice(0, -1);

            //append Label row with line break
            CSV += row + '\r\n';
        }

        //1st loop is to extract each row
        for (let i = 0; i < arrData.length; i++) {
            let row = "";

            //2nd loop will extract each column and convert it in string comma-seprated
            for (const index in arrData[i]) {
                row += '"' + arrData[i][index] + '",';
            }

            row.slice(0, row.length - 1);

            //add a line break after each row
            CSV += row + '\r\n';
        }

        if (CSV == '') {
            alert("Invalid data");
            return;
        }

        //Generate a file name
        let fileName = `${type}_${ReportTitle}_${date}`;

        //Initialize file format you want csv or xls
        const uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

        // Now the little tricky part.
        // you can use either>> window.open(uri);
        // but this will not work in some browsers
        // or you will not get the correct file extension

        //this trick will generate a temp <a /> tag
        const link = document.createElement("a");
        link.href = uri;

        //set the visibility hidden so it will not effect on your web-layout
        link.style = "visibility:hidden";
        link.download = fileName + ".csv";

        //this part will append the anchor tag and remove it after automatic click
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
  }

  render() {
      if (this.props.loading) {
        return (
          <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', height: '90vh' }}>
            <Loader color="#DB2728" size="16px" margin="4px" />
            <h3>Loading orders</h3>
          </div>
        );
      }
      return (
        <div className="ordersContainer">
            <div
              className="page-header"
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                position: 'relative'
              }}
            >
              <h2>Outgoing Orders</h2>
              <div style={{ display: 'flex', alignItems: 'center', position: 'absolute', right: '0px', bottom: '15px' }}>
                <p style={{ marginRight: 10, padding: 0, marginTop: 0, marginBottom: 0, marginLeft: 0 }}>Sort By</p>
                <select
                  id="setOrderByOutgoing"
                  onChange={() => this.setSortByOutgoing()}
                  style={{ marginRight: 15 }}
                >
                  <option value="Date">Date</option>
                  <option value="Name">Company Name</option>
                </select>
                <NewOrder type={'outgoing'} />
                <button className='btn btn-danger' onClick={() => this.getFirebaseJson('Orders', true, 'outgoing')}>
                  <span><i className="fa fa-download" aria-hidden="true"></i> Excel Export</span>
                </button>
              </div>
            </div>
          <Outgoing ordersOutgoing={this.state.ordersOutgoing} />
            <div
              className="page-header"
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                position: 'relative'
              }}
            >
              <h2>Incoming Orders</h2>
              <div style={{ display: 'flex', alignItems: 'center', position: 'absolute', right: '0px', bottom: '15px' }}>
                <p style={{ marginRight: 10, padding: 0, marginTop: 0, marginBottom: 0, marginLeft: 0 }}>Sort By</p>
                <select
                  id="setOrderByIncoming"
                  onChange={() => this.setSortByIncoming()}
                  style={{ marginRight: 15 }}
                >
                  <option value="Date">Date</option>
                  <option value="Name">Company Name</option>
                </select>
                <NewIncomingOrder />
                <button className='btn btn-danger' onClick={() => this.getFirebaseJson('Orders', true, 'incoming')}>
                  <span><i className="fa fa-download" aria-hidden="true"></i> Excel Export</span>
                </button>
              </div>
            </div>
          <Incoming ordersIncoming={this.state.ordersIncoming} />
        </div>
      );
    }
}

const mapStateToProps = state => {
  const loading = state.incomingOrders.loading;

  const outgoing = _.map(state.orders.outgoing_list, (val, uid) => {
    return { ...val, uid };
  });

  const incoming = _.map(state.incomingOrders.incoming_list, (val, uid) => {
    return { ...val, uid };
  });

  return { loading, outgoing, incoming };
};

export default connect(mapStateToProps, {
  signOutUser, outgoingFetch, incomingFetch
})(Orders);

