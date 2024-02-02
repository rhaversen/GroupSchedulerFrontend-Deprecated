import React from 'react'
import Image from 'next/image'
import RaindateLogo from '@/components/ui/svg/RaindateLogo'
import './404.scss'

function Custom404 () {
    return (
        <div className="container">
            <div className="logo">
                <RaindateLogo/>
            </div>
            <div className="black-bar"></div>
            <Image
                src="/404/404_ocean.webp"
                alt="A rough, wide ocean."
                draggable="false"
                className="background-image"
                width='1920'
                height='1080'
                quality={100}
            />
            <h1>404</h1>
            <h2>Sorry, this page got lost at sea</h2>
            <h3>This app is still under development, please come back later</h3>
        </div>
    )
}

export default Custom404
