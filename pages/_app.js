import '../styles/globals.css'
import { SWRConfig } from 'swr';


const fetcher = ({ url }, init) => {
  const access_token = localStorage.getItem('access_token');
  return fetch(url, {
    headers: {
      Authorization: `${access_token}`
    }
  })
    .then((res) => {
      if (res.ok) {
        return res.json()
      }
      return res.text()
    });
};


function MyApp({ Component, pageProps }) {
  return <SWRConfig value={{ fetcher }}>
    <Component {...pageProps} />
  </SWRConfig>
}

export default MyApp
