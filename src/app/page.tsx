'use client'

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
            const authenticated = await checkAuthentication()
            console.info('User is authenticated? ' + authenticated)
            setIsLoggedIn(authenticated)
        }

        // Call the asynchronous function
        authenticate()
    }, [])

    return (
        <div>
            {/* Conditionally render components based on login status */}
            {isLoggedIn ? <DashboardComponent /> : <LandingComponent />}
        </div>
    )
}

export default Index
