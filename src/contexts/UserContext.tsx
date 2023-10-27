import React, {
    createContext,
    useContext,
    useState,
    type ReactNode,
    type FC
} from 'react'

interface UserContextType {
    user: null | any // Replace 'any' with the type of your user object, if available.
    setUser: React.Dispatch<React.SetStateAction<null | any>> // Same here
}

const UserContext = createContext<UserContextType | undefined>(undefined)

interface UserProviderProps {
    children: ReactNode
}

export const UserProvider: FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<null | any>(null) // Replace 'any' with the type of your user object, if available.

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = (): UserContextType => {
    const context = useContext(UserContext)
    if (context === null || context === undefined) {
        throw new Error('useUser must be used within a UserProvider')
    }
    return context
}
