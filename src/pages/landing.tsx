import React from 'react'
import './landing.scss'
import Image from 'next/image'
import RaindateLogo from '../assets/svg/raindate.svg'

function Landing (): JSX.Element {
    return (
        <div className="container">
            <div className="logo">
                <RaindateLogo/>
            </div>
            <div className="black-bar"></div>
            <Image
                src="/landing/landing_lake.webp"
                alt="Whoops, looks like something went wrong, please reload the page. If the problem persists, please contact support."
                draggable="false"
                className="background-image"
                width={1756}
                height={1024}
            />
            <div className="overlay-text">Your Text Here</div>
        </div>
    )
}

export default Landing
