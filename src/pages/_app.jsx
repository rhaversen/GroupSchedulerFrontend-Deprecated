import { UserProvider } from '../contexts/UserContext.js'

function MyApp ({ Component, pageProps }) {
  return (
        <UserProvider>
            <Component {...pageProps} />
        </UserProvider>
  )
}

export default MyApp
