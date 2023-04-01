import { useEffect, useState } from 'react';
import { Web3AuthNoModal } from '@web3auth/no-modal';
import { CHAIN_NAMESPACES, SafeEventEmitterProvider, WALLET_ADAPTERS } from '@web3auth/base';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
// import { TorusWalletAdapter } from "@web3auth/torus-evm-adapter";
// import { CoinbaseAdapter } from "@web3auth/coinbase-adapter";
import { PhantomAdapter } from '@web3auth/phantom-adapter';
// import './App.css';
import RPC from '../api/etherRPC'; // for using web3.js
import { MetamaskAdapter } from '@web3auth/metamask-adapter';
import { CoinbaseAdapter } from '@web3auth/coinbase-adapter';
import { SolanaWalletAdapter } from '@web3auth/torus-solana-adapter';
import { WalletConnectV1Adapter } from '@web3auth/wallet-connect-v1-adapter';
//import RPC from "./ethersRPC"; // for using ethers.js

const clientId = 'BOweQo3kUPEy3FhGecCQrT30eF99IpGky0kIrCwev_wuSbCBvCQmSHpMVQTIa2yL6p0c6FB_sC5J-cIbhBNGOKs'; // get from https://dashboard.web3auth.io

function App() {
  const [web3auth, setWeb3auth] = useState(null);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const web3auth = new Web3AuthNoModal({
          clientId,
          chainConfig: {
            chainNamespace: 'eip155',
            chainId: '0x1',
          },
          // web3AuthNetwork: 'cyan',
        });

        setWeb3auth(web3auth);

        const openloginAdapter = new OpenloginAdapter();
        web3auth.configureAdapter(openloginAdapter);

        const adapter = new WalletConnectV1Adapter();
        web3auth.configureAdapter(adapter);

        await web3auth.init();
        if (web3auth.provider) {
          setProvider(web3auth.provider);
        }
      } catch (error) {
        console.error('error', error);
      }
    };

    init();
  }, []);

  const login = async (loginProviderName) => {
    if (!web3auth) {
      uiConsole('web3auth not initialized yet');
      return;
    }
    // const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.WALLET_CONNECT_V1);
    const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
      loginProvider: loginProviderName,
    });
    setProvider(web3authProvider);
  };

  const authenticateUser = async () => {
    if (!web3auth) {
      uiConsole('web3auth not initialized yet');
      return;
    }
    const idToken = await web3auth.authenticateUser();
    uiConsole(idToken);
  };

  const getUserInfo = async () => {
    if (!web3auth) {
      uiConsole('web3auth not initialized yet');
      return;
    }
    const user = await web3auth.getUserInfo();
    uiConsole(user);
  };

  const logout = async () => {
    if (!web3auth) {
      uiConsole('web3auth not initialized yet');
      return;
    }
    await web3auth.logout();
    setProvider(null);
  };

  const getChainId = async () => {
    if (!provider) {
      uiConsole('provider not initialized yet');
      return;
    }
    const rpc = new RPC(provider);
    const chainId = await rpc.getChainId();
    uiConsole(chainId);
  };

  const addChain = async () => {
    if (!provider) {
      uiConsole('provider not initialized yet');
      return;
    }
    const newChain = {
      chainId: '0x5',
      displayName: 'Goerli',
      chainNamespace: 'eip155',
      tickerName: 'Goerli',
      ticker: 'ETH',
      decimals: 18,
      rpcTarget: 'https://rpc.ankr.com/eth_goerli',
      blockExplorer: 'https://goerli.etherscan.io',
    };
    await web3auth?.addChain(newChain);
    uiConsole('New Chain Added');
  };

  const switchChain = async () => {
    if (!provider) {
      uiConsole('provider not initialized yet');
      return;
    }
    await web3auth?.switchChain({ chainId: '0x5' });
    uiConsole('Chain Switched');
  };

  const getAccounts = async () => {
    if (!provider) {
      uiConsole('provider not initialized yet');
      return;
    }
    const rpc = new RPC(provider);
    const address = await rpc.getAccounts();
    uiConsole(address);
  };

  const getBalance = async () => {
    if (!provider) {
      uiConsole('provider not initialized yet');
      return;
    }
    const rpc = new RPC(provider);
    const balance = await rpc.getBalance();
    uiConsole(balance);
  };

  const sendTransaction = async () => {
    if (!provider) {
      uiConsole('provider not initialized yet');
      return;
    }
    const rpc = new RPC(provider);
    const receipt = await rpc.sendTransaction();
    uiConsole(receipt);
  };

  const signMessage = async () => {
    if (!provider) {
      uiConsole('provider not initialized yet');
      return;
    }
    const rpc = new RPC(provider);
    const signedMessage = await rpc.signMessage();
    uiConsole(signedMessage);
  };

  const getPrivateKey = async () => {
    if (!provider) {
      uiConsole('provider not initialized yet');
      return;
    }
    const rpc = new RPC(provider);
    const privateKey = await rpc.getPrivateKey();
    uiConsole(privateKey);
  };

  function uiConsole(...args) {
    const el = document.querySelector('#console>p');
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
  }

  const loggedInView = (
    <>
      <div className="flex-container">
        <div>
          <button onClick={getUserInfo} className="card">
            Get User Info
          </button>
        </div>
        <div>
          <button onClick={authenticateUser} className="card">
            Get ID Token
          </button>
        </div>
        <div>
          <button onClick={getChainId} className="card">
            Get Chain ID
          </button>
        </div>
        <div>
          <button onClick={addChain} className="card">
            Add Chain
          </button>
        </div>
        <div>
          <button onClick={switchChain} className="card">
            Switch Chain
          </button>
        </div>
        <div>
          <button onClick={getAccounts} className="card">
            Get Accounts
          </button>
        </div>
        <div>
          <button onClick={getBalance} className="card">
            Get Balance
          </button>
        </div>
        <div>
          <button onClick={signMessage} className="card">
            Sign Message
          </button>
        </div>
        <div>
          <button onClick={sendTransaction} className="card">
            Send Transaction
          </button>
        </div>
        <div>
          <button onClick={getPrivateKey} className="card">
            Get Private Key
          </button>
        </div>
        <div>
          <button onClick={logout} className="card">
            Log Out
          </button>
        </div>
      </div>
      <div id="console" style={{ whiteSpace: 'pre-line' }}>
        <p style={{ whiteSpace: 'pre-line' }}>Logged in Successfully!</p>
      </div>
    </>
  );

  const unloggedInView = (
    <div style={{ display: 'flex' }}>
      <button onClick={() => login('google')} className="card">
        Google Login
      </button>
      <button onClick={() => login('facebook')} className="card">
        <i class="fa fa-facebook fa-fw"></i> Facebook Login
      </button>
      <button onClick={() => login('github')} className="card">
        GUthub Login
      </button>
      <button onClick={() => login('twitter')} className="card">
        Twitter Login
      </button>
      <button onClick={() => login('discord')} className="card">
        Discord Login
      </button>
      <button onClick={() => login('apple')} className="card">
        Apple Login
      </button>
      <button onClick={() => login('linkedin')} className="card">
        linkedin Login
      </button>
    </div>
  );

  return (
    <div className="container">
      <h1 className="title" style={{ marginBottom: '20px' }}>
        <a target="_blank" href="http://web3auth.io/" rel="noreferrer">
          Web3Auth{' '}
        </a>
        & ReactJS Example
      </h1>

      <div className="grid">{provider ? loggedInView : unloggedInView}</div>
    </div>
  );
}

export default App;
