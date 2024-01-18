import { type AppProps } from 'next/app'
import { UserProvider } from '@/contexts/UserContext'
import React from 'react'

const AppWrapper: React.FC<AppProps> = ({ Component, pageProps }) => {
    return (
        <UserProvider>
            <Component {...pageProps} />
        </UserProvider>
    )
}

export default AppWrapper
