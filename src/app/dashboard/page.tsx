'use client'

import React, { useEffect, useState } from 'react'

import fetchUserEvents from '@/utils/fetchUserEvents'
import CreateCard from '@/components/dashboard/CreateCard'
import RaindateLogo from '@/components/ui/svg/RaindateLogo'

const Dashboard: React.FC = () => {
    const [userEvents, setUserEvents] = useState<any[]>([])

    useEffect(() => {
        // Fetch events and update state
        const loadEvents = async () => {
            try {
                const events = await fetchUserEvents()
                setUserEvents(events)
            } catch (error) {
                console.error('Failed to fetch events:', error)
            }
        }

        loadEvents()
    }, [])

    return (
        <div>
            <div className="flex items-center justify-center">
                <div className="flex items-center space-x-4">
                    <div className="w-20 h-20">
                        <RaindateLogo />
                    </div>
                    <h1 className="text-6xl text-blue-800">Your Dashboard</h1>
                </div>
            </div>
            <div className="max-w-md mx-auto">
                <CreateCard 
                    title={'Create an Event'} 
                    description={
                        <>
                            Let RainDate discover the perfect time for your plans. 
                            <br/><br/>
                            From one-on-one dates to large group gatherings, every kind of day can be planned to perfection
                        </>
                    }
                    buttonText={'Make Plans'}
                    buttonLink={''}
                    linkText={'Join an Event'}
                    linkUrl={''}
                />
            </div>
            <div className="max-w-md mx-auto"> {/* Adjust width as needed */}
                <CreateCard
                    title={'Create a Group'}
                    description={'Quickly plan events with your favorite group of people'}
                    buttonText={'Make Socials'}
                    buttonLink={''}
                    linkText={'Join a Group'}
                    linkUrl={''}
                />
            </div>
            {userEvents.length > 0 ? (
                <ul>
                    {userEvents.map((event, index) => (
                        <li key={index}>{event.name}</li> // Assuming each event has a 'name' property
                    ))}
                </ul>
            ) : (
                <p>No events found.</p>
            )}
        </div>
    )
}

export default Dashboard
