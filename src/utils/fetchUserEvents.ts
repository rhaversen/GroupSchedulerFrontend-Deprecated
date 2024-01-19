import axios from 'axios'

const API_V1_URL = process.env.NEXT_PUBLIC_API_V1_URL ?? ''

// Function to get the user and then fetch each event by ID
const fetchUserEvents = async (): Promise<any[]> => {
    try {
        const userResponse = await axios.get(`${API_V1_URL}users`)
        const { events } = userResponse.data

        console.info('Events fetched:', events)

        if (events && events.length > 0) {
            const eventsPromises = events.map(async (eventId: string) =>
                await axios.get(`${API_V1_URL}events/${eventId}`)
            )

            const eventsResponses = await Promise.all(eventsPromises)
            const eventsData = eventsResponses.map(res => res.data)

            console.info('Event details fetched:', eventsData)
            return eventsData // Return the events data
        }

        return [] // Return empty array if no events
    } catch (error) {
        console.error('Error occurred:', error)
        throw error // Rethrow the error for further handling
    }
}

export default fetchUserEvents
