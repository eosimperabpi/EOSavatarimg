import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom'

/* tslint:disable */
const ScatterJS = require('scatter-js/dist/scatter.cjs')

import {
  Alignment,
  Button,
  Classes,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading,
  Callout,
  Intent,
} from "@blueprintjs/core";

// import * as Eos from 'eosjs'


import './App.css'
import { userStore, notificationStore } from '../stores';


@inject('routing', 'fileStore', 'userStore', 'notificationStore')
@observer
export class App extends React.Component<any> {
  componentDidMount() {
    document.addEventListener('scatterLoaded', scatterExtension => {
      if (localStorage.getItem('hasScatter')) {
        notificationStore.push({ message: 'Trying to open Scatte..' })
        this._scatterInit()
      }
    })
  }

  _scatterInit() {

    const network = {
      blockchain: 'eos',
      host: 'nodes.get-scatter.com',
      port: 443,
      protocol: 'https',
      chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
      // chainId: '038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca',
    };

    notificationStore.push({ message: 'Trying to open Scatter..' })

    ScatterJS.scatter.connect("eosfilestore").then((connected: any) => {
      if (!connected) {
        notificationStore.push({ message: 'You need to install Scatter EOS Desktop wallet to login and upload files. More info at https://get-scatter.com' })
      }

      // Use `scatter` normally now.
      try {
        ScatterJS.scatter.getIdentity({ accounts: [network] }).then((identity: any) => {

          const account = identity.accounts.find((acc: any) => acc.blockchain === 'eos');
          // console.log(account, Eos)
          userStore.setAccount(account)
          notificationStore.clear()
          localStorage.setItem('hasScatter', "yes")

        }).catch((error: any) => {
          notificationStore.push({
            message: error.type === 'locked' ? 'The Scatter wallet is locked. Please unlock it and try again.' : error.message
          })
          // console.error('ERROR: ', error)
        });

      } catch {
        notificationStore.push({ message: 'You need Scatter EOS desktop wallet enabled' })
      }
    });

  }
  _forget() {
    ScatterJS.scatter.forgetIdentity().then(() => {
      userStore.setAccount(null)
      localStorage.removeItem('hasScatter')
    })
  }

  render() {
    return (
      <div className="App row center-xs">
        {/* <header className="App-header row">
          <div className="col-lg-12">
            <div className="box">
              <img className="App-logo" src={logo} alt="EOSfilestore" />
            </div>
          </div>
        </header> */}


        <div className="App-wrapper row center-xs">
          <div className="col-xs-10">
            <Navbar>
              <NavbarGroup align={Alignment.RIGHT}>
                <NavbarHeading>EOSavatarimg dApp</NavbarHeading>
                <NavbarDivider />
                <Link to="/info" style={{ display: 'none' }}>
                  <Button
                    className={Classes.MINIMAL}
                    icon="info-sign"
                    text="Info & FAQ"
                    active={location.pathname.startsWith('/info')}
                  />
                </Link>
                <Link to="/download">
                  <Button
                    className={Classes.MINIMAL}
                    icon="download"
                    text="Download"
                    active={location.pathname.startsWith('/download')}
                  />
                </Link>
                <Link to="/upload">
                  <Button className={Classes.MINIMAL}
                    icon="cloud-upload"
                    text="Upload"
                    active={location.pathname.startsWith('/upload')}
                  />
                </Link>
                <Navbar.Divider />
                {(userStore.account) ? (
                  <Button className={Classes.MINIMAL}
                    icon="log-in"
                    text={userStore.account.name}
                    onClick={this._forget}
                  />
                ) : (
                    <Button className={Classes.MINIMAL}
                      icon="log-in"
                      text="Login with Scatter"
                      onClick={() => { this._scatterInit() }}
                    />
                  )}
              </NavbarGroup>
            </Navbar>
          </div>
        </div> {/* /App-wrapper */}


        <div className="Notifications row center-xs fill">
          <div className="col-xs-10">
            <div className="box">
              {notificationStore.notifications.map((e, i) => (
                <Callout key={i}
                  intent={Intent.WARNING}
                  icon="warning-sign"
                  title={e.title}
                  id={i.toString()}>
                  {e.message}
                </Callout>
              ))}
            </div>
          </div>
        </div>

        <div className="row center-xs fill" style={{ minHeight: 400 }}>
          <div className="col-xs-10">
            <div className="box">
              {this.props.children}
            </div>
          </div>
        </div>

        <div className="App-partners row fill center-xs" style={{ margin: 30 }}>
          <div className="footercenter row col-lg-9 middle-xs">
            <div className="col-xs-3 col-sm">
              <img style={{ width: 90 }} src="logo.jpg" alt="" />
            </div>
            <div className="col-xs-3 col-sm">
              <h2>Sponsors and partners</h2>
            </div>
            <div className="col-xs-3 col-sm">
              <a href="https://eosimpera.io">
                <img style={{ width: 200 }} src="/assets/sponsors/eosimpera.png" alt="EOS Impera" />
              </a>
            </div>

          </div>
        </div>

        <div className="App-footer row fill center-xs">
          <div className="footercenter row col-sm-9 start-xs">
            <div className="col-xs-12 col-sm">
              <h2>Usage</h2>
              <ul>
                <li>
                  <a href="https://github.com/eosimperabpi/EOSavatarimg">github</a>
                </li>
              </ul>
            </div>
            <div className="col-xs-12 col-sm">
              <div className="box">
                <h2>Source Code</h2>
                <p>
                  <a href="https://github.com/eosimperabpi/EOSavatarimg">EOSavatarimg</a> is on Github.
              </p>
              </div>
            </div>
            <div className="col-xs-12 col-sm">
              <div className="box">
                <h2>Support</h2>
                If you like EOSavatarimg you can fund the development with an EOS donation to <strong>@eosavatarimg</strong> and a vote for <strong>@eosimperabpi</strong> BP.
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

// NOTE: hack https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/guides/blocked-updates.md#quick-solution
export default withRouter(App)