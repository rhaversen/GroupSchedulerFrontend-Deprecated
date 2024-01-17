'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

const API_V1_URL = process.env.NEXT_PUBLIC_API_V1_URL ?? ''

const DashboardComponent: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
    const [userEvents, setUserEvents] = useState<any[]>([])

    useEffect(() => {
    // Function to get the user and then fetch each event by ID
        const fetchUserEvents = () => {
            axios.get(API_V1_URL + 'users/current-user')
                .then(response => {
                    // Assuming the response data's structure is { user: { events: [id1, id2, ...] } }
                    const { user } = response.data
                    console.info('User fetched:', user)
                    setIsLoggedIn(true)

                    // If the user has event IDs, fetch each event
                    const eventsPromises = user.events.map(async (eventId: string) =>
                        await axios.get(`${API_V1_URL}events/${eventId}`)
                    )

                    // Use Promise.all to fetch all events in parallel
                    Promise.all(eventsPromises)
                        .then(eventsResponses => {
                            const eventsData = eventsResponses.map(res => res.data)
                            setUserEvents(eventsData) // Save the events data in the state
                        })
                        .catch(eventsError => {
                            console.error('Error fetching events:', eventsError)
                        })
                })
                .catch(error => {
                    console.error('Error fetching user:', error)
                    setIsLoggedIn(false)
                })
        }

        fetchUserEvents()
    }, [])

    // Render the dashboard
    // Dashboard UI with events listed
    return (
        <div className="flex flex-col bg-gray-100 h-screen p-4">
            {/* ... other components ... */}

            {/* Events Section */}
            {isLoggedIn && (
                <section className="mt-4">
                    <h2 className="text-xl font-bold mb-2">Your Events</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {(userEvents.length > 0) ? (
                            userEvents.map((event, index) => (
                                <div key={index} className="bg-white p-4 shadow rounded">
                                    <h3 className="text-lg font-semibold">{event.name}</h3>
                                    {/* Other event details here */}
                                </div>
                            ))
                        ) : (
                            <p>No upcoming events.</p>
                        )}
                    </div>
                </section>
            )}

            {/* Additional UI elements such as 'New Event' and 'Search Events' can be added here */}
        </div>
    )
}

export default DashboardComponent
