import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/styles/globals.scss';

// import { Provider } from 'react-redux';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>MagicPic.ai - AI Profile Picture Generator</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href="/magicpic.png" />
      </Head>
      {/* <Provider> */}
      <Component {...pageProps} />
      {/* </Provider> */}
    </>
  );
}

export default MyApp;
