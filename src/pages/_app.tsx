import { type AppProps } from 'next/app'
import { UserProvider } from '../contexts/UserContext' // Adjust the import path if needed

const AppWrapper: React.FC<AppProps> = ({ Component, pageProps }) => {
    return (
        <UserProvider>
            <Component {...pageProps} />
        </UserProvider>
    )
}

export default AppWrapper
