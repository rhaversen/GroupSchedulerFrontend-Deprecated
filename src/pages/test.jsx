import Head from 'next/head'
import axios from 'axios'

function Index () {
  // This will be a static page on the client side, so there's no client-side logic required.
  axios.get(process.env.NEXT_PUBLIC_API_URL + '/')

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
