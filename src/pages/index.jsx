import Head from 'next/head'
import axios from 'axios'
import cookie from 'cookie'

function Index () {
  // This will be a static page on the client side, so there's no client-side logic required.

  return (
        <div>
            <Head>
                <title>Your Page Title</title>
                <meta name="description" content="A brief description of your page." />
                <link rel="canonical" href="https://www.yourdomain.com/official-url" />
            </Head>
            {/* You can also add some meaningful content here if needed */}
        </div>
  )
}

export default Index

// Server-side redirection logic
export async function getServerSideProps (context) {
  try {
    // Parse cookies from request headers
    const parsedCookies = cookie.parse(context.req.headers.cookie || '')

    // Retrieve the token
    const token = parsedCookies.token

    if (!token) {
      return {
        redirect: {
          destination: '/promo',
          permanent: false // This means it's a 302 redirection
        }
      }
    }

    const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/api/v1/validate-token', { token })

    if (response.data.valid) {
      return {
        redirect: {
          destination: '/dashboard',
          permanent: false
        }
      }
    } else {
      return {
        redirect: {
          destination: '/promo',
          permanent: false
        }
      }
    }
  } catch (error) {
    console.error('Error validating token:', error)
    return {
      redirect: {
        destination: '/promo',
        permanent: false
      }
    }
  }
}
