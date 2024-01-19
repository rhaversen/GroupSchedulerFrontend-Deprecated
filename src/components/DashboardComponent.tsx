'use client'

import React, { useEffect, useState } from 'react'

import fetchUserEvents from '@/utils/fetchUserEvents'

const API_V1_URL = process.env.NEXT_PUBLIC_API_V1_URL ?? ''

const DashboardComponent: React.FC = () => {
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
            <h1>User Events</h1>
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

export default DashboardComponent
