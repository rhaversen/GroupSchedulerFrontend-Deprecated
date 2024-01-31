import React from 'react'
import Link from 'next/link'
import RaindateLogo from '@/components/ui/svg/RaindateLogo'
import HeaderLink from '@/components/header/HeaderLink'

const Header = () => {
    return (
        <div className="w-full bg-Dark flex items-center justify-center py-1 sticky top-0 z-50">
            <Link href="/" className="flex items-center h-full">
                <RaindateLogo />
            </Link>
            <nav className="max-w-3xl flex justify-center flex-grow">
                <HeaderLink href={'/dashboard'} buttonText={'Dashboard'} />
                <HeaderLink href={'/calendar'} buttonText={'Calendar'} />
                <HeaderLink href={'/events'} buttonText={'Events'} />
                <HeaderLink href={'/groups'} buttonText={'Groups'} />
                <HeaderLink href={'/users'} buttonText={'Users'} />
                <HeaderLink href={'/profile'} buttonText={'Profile'} />
                <HeaderLink href={'/logout'} buttonText={'Logout'} />
            </nav>
        </div>
    )
}

export default Header
