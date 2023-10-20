import Head from 'next/head'
import axios from 'axios'
import cookie from 'cookie'

function Index () {
  // This will be a static page on the client side, so there's no client-side logic required.

  return (
    <div>
      <Head>
        <title>Rain Date</title>
        <link
            rel="canonical"
            href="https://www.raindate.net"
        />
        <meta
          name="description"
          content="Your Event Planning App is a one-stop shop for all your event planning needs. With our app, you can view all your upcoming events, create and manage calendars, and see when other users are available. Plus, our event pages let you see more info about events, such as descriptions, dates, and locations."
        />
        <meta
            name="keywords"
            content="event planning, calendar, events, dashboard, availability, group scheduler, friends, holiday, vacation, plans, rally, reindate"
        />
        </Head>
        {/* Add some meaningful content here if needed, such as a brief overview of your website or a call to action. */}
        {/* Use internal links to link to other pages on your website. */}
        {/* Optimize your images for SEO. */}
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
          destination: '/landing',
          permanent: true // This means it's a 301 redirection
        }
      }
    }

    const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/api/v1/validate-token', { token })

    if (response.data.valid) {
      return {
        redirect: {
          destination: '/dashboard',
          permanent: true
        }
      }
    } else {
      return {
        redirect: {
          destination: '/landing',
          permanent: true
        }
      }
    }
  } catch (error) {
    console.error('Error validating token:', error)
    return {
      redirect: {
        destination: '/landing',
        permanent: true
      }
    }
  }
}
