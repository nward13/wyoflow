import React, { Component } from 'react';
import './assets/css/App.css';
import { Switch, Route } from 'react-router-dom';
import Header from './Components/Header';
import Subheader from './Components/Subheader';
import Buyers from './Components/Buyers';
import Sellers from './Components/Sellers';
import Validators from './Components/Validators';

// Web3 and contracts
import getWeb3 from './utils/getWeb3';
import WaterTrackingToken from '../build/contracts/WaterTrackingToken.json';
import WaterOffsetToken from '../build/contracts/WaterOffsetToken.json';
import WaterOffsetCrowdsale from '../build/contracts/WaterOffsetCrowdsale.json';
import Wallet from '../build/contracts/Wallet.json';

class App extends Component {
  constructor(){
    super();
    this.state = {
      web3: null,
      accounts: ['0x0'],
      trackingToken: null,
      offsetToken: null,
      offsetCrowdsale: null,
      wallet: null,
    };
  }

  componentWillMount() {
    getWeb3.then(results => {
      this.setState({
        web3: results.web3
      })
      this.instantiateContracts();
    })
    .catch((error) => {
      console.log("Error finding web3.")
      console.log(error)
    })
  }


  instantiateContracts() {
    const contract = require('truffle-contract');

    // Instantiate WaterOffsetToken contract
    const offsetToken = contract(WaterOffsetToken)
    offsetToken.setProvider(this.state.web3.currentProvider)

    // Instantiate WaterTrackingToken contract
    const trackingToken = contract(WaterTrackingToken)
    trackingToken.setProvider(this.state.web3.currentProvider)

    // Instantiate WaterOffsetCrowdsale contract
    const offsetCrowdsale = contract(WaterOffsetCrowdsale)
    offsetCrowdsale.setProvider(this.state.web3.currentProvider)

    // Instantiate Wallet contract
    const wallet = contract(Wallet)
    wallet.setProvider(this.state.web3.currentProvider)

    // Get accounts
    this.state.web3.eth.getAccounts((error, accounts) => { 
      // Deploy contracts
      offsetToken.deployed().then((offsetTokenInstance) => {
        trackingToken.deployed().then((trackingTokenInstance) => {
          offsetCrowdsale.deployed().then((offsetCrowdsaleInstance) => {
            wallet.deployed().then((walletContractInstance) => {
              this.setState({
                accounts: accounts,
                trackingToken: trackingTokenInstance,
                offsetToken: offsetTokenInstance,
                offsetCrowdsale: offsetCrowdsaleInstance,
                wallet: walletContractInstance,
              })
            })
          })
        })
      })
    })

  }

  render() {
    return (
      <div className="App">
        <Header />
        <Subheader />
        <Switch>
          <Route exact path='/' render={() => <Buyers activeUser={ this.state.accounts[0] } web3={ this.state.web3 } offsetToken={ this.state.offsetToken } offsetCrowdsale={ this.state.offsetCrowdsale }/>}  />
          <Route path='/buyers'  render={() => <Buyers activeUser={ this.state.accounts[0] } web3={ this.state.web3 } offsetToken={ this.state.offsetToken } offsetCrowdsale={ this.state.offsetCrowdsale }/>} />
          <Route path='/sellers'  render={() => <Sellers activeUser={ this.state.accounts[0] } web3={ this.state.web3 } trackingToken={ this.state.trackingToken } offsetToken={ this.state.offsetToken } offsetCrowdsale={ this.state.offsetCrowdsale } />} />
          <Route path='/validators'  render={() => <Validators activeUser={ this.state.accounts[0] } web3={ this.state.web3 } trackingToken={ this.state.trackingToken }/>} />
        </Switch>
      </div>
    );
  }
}

export default App;
