import Head from 'next/head'
import React, { useEffect, useState } from 'react'

// Import components
import DashboardComponent from '@/components/DashboardComponent'
import LandingComponent from '@/components/LandingComponent'

// Import utility functions
import checkAuthentication from '@/utils/isUserAuthenticated'

function Index (): JSX.Element {
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        // Define an asynchronous function inside the effect
        const authenticate = async () => {
            try {
                const authenticated = await checkAuthentication()
                setIsLoggedIn(authenticated)
            } catch (error) {
                setIsLoggedIn(false)
            }
        }

        // Call the asynchronous function
        authenticate()
    }, [])

    return (
        <div>
            <Head>
                <title>Rain Date</title>
                <link rel="canonical" href="https://www.raindate.net"/>
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
            {/* Conditionally render components based on login status */}
            {isLoggedIn ? <DashboardComponent /> : <LandingComponent />}
        </div>
    )
}

export default Index
