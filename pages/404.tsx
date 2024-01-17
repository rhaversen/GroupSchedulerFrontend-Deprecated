import React from 'react'
import './404.scss'
import Image from 'next/image'
import RaindateLogo from 'src/assets/svg/raindate.svg'
import Head from 'next/head'

function NotFound () {
    return (
        <div className="container">
            <Head>
                <title>Raindate - 404</title>
            </Head>

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

export default NotFound
