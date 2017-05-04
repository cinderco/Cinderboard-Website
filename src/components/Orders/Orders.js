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
  }

  componentWillMount() {
    this.props.outgoingFetch();
    this.props.incomingFetch();
  }

  close() {
    this.setState({ showModal: false });
  }

  getFirebaseJson(ReportTitle, ShowLabel, type) {
    firebase.database().ref(`/data/${type}_orders`)
      .on('value', snapshot => {
        let JSONData = snapshot.val();

        console.log(JSONData[Object.keys(JSONData)[0]]);
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


        console.log(JSONData);

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
    console.log('render Orders');
      if (this.props.loading) {
        return (
          <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', height: '90vh' }}>
            <Loader color="#DB2728" size="16px" margin="4px" />
            <h3>Loading orders</h3>
          </div>
        );
      }
      return (
        <div style={{ paddingLeft: '15px', paddingRight: '15px' }}>
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
                <NewOrder type={'outgoing'} />
                <button className='btn btn-danger' onClick={() => this.getFirebaseJson('Orders', true, 'outgoing')}>
                  <span><i className="fa fa-download" aria-hidden="true"></i> Excel Export</span>
                </button>
              </div>
            </div>
          <Outgoing ordersOutgoing={this.props.ordersOutgoing} />
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
                <NewIncomingOrder />
                <button className='btn btn-danger' onClick={() => this.getFirebaseJson('Orders', true, 'incoming')}>
                  <span><i className="fa fa-download" aria-hidden="true"></i> Excel Export</span>
                </button>
              </div>
            </div>
          <Incoming ordersIncoming={this.props.ordersIncoming} />
        </div>
      );
    }
}

const mapStateToProps = state => {
  console.log(state);
  const loading = state.incomingOrders.loading;
  console.log(loading);

  const outgoing = _.map(state.orders.outgoing_list, (val, uid) => {
    return { ...val, uid };
  });

  const ordersOutgoing = outgoing.sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const incoming = _.map(state.incomingOrders.incoming_list, (val, uid) => {
    return { ...val, uid };
  });

  const ordersIncoming = incoming.sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  return { loading, ordersOutgoing, ordersIncoming };
};

export default connect(mapStateToProps, {
  signOutUser, outgoingFetch, incomingFetch
})(Orders);
