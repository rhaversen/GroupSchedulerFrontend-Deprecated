import Head from 'next/head'
import axios from 'axios'
import { useEffect } from 'react'

function Index() {
    useEffect(() => {
      axios.get(process.env.NEXT_PUBLIC_API_URL + '/')
        .then(response => {
          // Handle the response data here.
        })
        .catch(error => {
          // Handle the error here.
        });
    }, []);

  return (
        <div>
            <Head>
                <title>Rain Date</title>
                <meta name="description" content="A brief description of your page." />
                <link rel="canonical" href="https://www.raindate.net" />
            </Head>
            {/* You can also add some meaningful content here if needed */}
        </div>
  )
}

export default Index
