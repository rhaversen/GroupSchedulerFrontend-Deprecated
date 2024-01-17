import axios from 'axios'

const API_V1_URL = process.env.NEXT_PUBLIC_API_V1_URL ?? ''

// Function to get the user and then fetch each event by ID
const fetchUserEvents = () => {
    axios.get(API_V1_URL + 'users/current-user')
        .then(response => {
            // Assuming the response data's structure is { user: { events: [id1, id2, ...] } }
            const { user } = response.data
            console.info('User fetched:', user)

            // If the user has event IDs, fetch each event
            if (user.events && user.events.length > 0) {
                user.events.forEach((eventId: string) => {
                    axios.get(API_V1_URL + 'events/' + eventId)
                        .then(eventResponse => {
                            console.info('Event fetched:', eventResponse.data)
                            // Process each event data as needed
                        })
                        .catch(eventError => {
                            console.error('Error fetching event:', eventError)
                            // Handle errors for each event fetch
                        })
                })
            }
        })
        .catch(error => {
            console.error('Error fetching user:', error)
            // Handle error for user fetch
        })
}

export default fetchUserEvents
