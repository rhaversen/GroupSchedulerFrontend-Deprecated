'use client' // Ensure this is the first line

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

// Import components
import LandingComponent from '@/components/landing/LandingComponent'

// Import utility functions
import checkAuthentication from '@/utils/isUserAuthenticated'

function Index (): JSX.Element {
    const router = useRouter()
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isCheckingAuth, setIsCheckingAuth] = useState(true)

    useEffect(() => {
        if (!router) return

        const authenticate = async () => {
            const authenticated = await checkAuthentication()
            console.info('User is authenticated? ' + authenticated)

            setIsAuthenticated(authenticated)
            setIsCheckingAuth(false)

            if (authenticated) {
                router.push('/dashboard')
            }
        }

        authenticate()
    }, [router])

    if (isCheckingAuth) {
        return <div/>
    }

    return (
        <div>
            {!isAuthenticated && <LandingComponent />}
        </div>
    )
}

export default Index
