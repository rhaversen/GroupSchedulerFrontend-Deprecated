import React, { useEffect, useState } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import Head from 'next/head'
import axios from 'axios'

const localizer = momentLocalizer(moment)
const API_V1_URL = process.env.NEXT_PUBLIC_API_V1_URL ?? ''

function CalendarPage (): JSX.Element {
    const [blockedDates, setBlockedDates] = useState<Date[]>([])

    // Fetch blocked dates from the server on component mount
    useEffect(() => {
        axios.get(`${API_V1_URL}users/current-user`)
            .then(response => {
                // Convert the dates from the server format to Date objects
                const dates = response.data.blockedDates.map((dateString: string) => new Date(dateString))
                setBlockedDates(dates)
            })
            .catch(error => { console.error('Error fetching blocked dates:', error) })
    }, [])

    async function updateDateRangeBackend (startDate: { toISOString: () => string }, endDate: Date, isDeleting = false) {
        const method = isDeleting ? 'delete' : 'put'
        try {
            await axios[method](`${API_V1_URL}users/blockedDates/${startDate.toISOString()}/${endDate.toISOString()}`)
        } catch (err) {
            console.log(`Error ${isDeleting ? 'deleting' : 'saving'} date range: ${err}`)
        }
    }

    const handleSelect = ({ start, end }: { start: Date, end: Date }) => {
        const adjustedEnd = new Date(end)
        adjustedEnd.setDate(end.getDate() - 1)

        const range = getDatesInRange(start, adjustedEnd)
        const rangeIsBlocked = range.every(date => blockedDates.some(d => isSameDay(d, date)))

        let newBlockedDates = [...blockedDates]

        if (rangeIsBlocked) {
            newBlockedDates = newBlockedDates.filter(blockedDate => !range.some(date => isSameDay(date, blockedDate)))
            updateDateRangeBackend(start, adjustedEnd, true)
        } else {
            // If at least one date is not blocked, block all unblocked dates
            range.forEach(date => {
                if (!newBlockedDates.some(d => isSameDay(d, date))) {
                    newBlockedDates.push(date)
                }
            })
            updateDateRangeBackend(start, adjustedEnd, false)
        }

        setBlockedDates(newBlockedDates)
    }

    const calendarEvents = blockedDates.map(date => ({
        start: date,
        end: date,
        title: 'Blocked',
        allDay: true
    }))

    // Utility function to get an array of dates between start and end
    function getDatesInRange (startDate: Date, endDate: Date) {
        const dates = []
        for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
            dates.push(new Date(date))
        }
        return dates
    }

    function isSameDay (date1: Date, date2: Date) {
        return date1.toISOString() === date2.toISOString()
    }

    return (
        <div className="calendar-container">
            <Head>
                <title>Calendar - Blocked Dates</title>
            </Head>
            <Calendar
                selectable
                defaultDate={new Date()}
                defaultView="month"
                events={calendarEvents}
                localizer={localizer}
                style={{ height: '80vh' }}
                onSelectSlot={handleSelect}
                views={['month']}
            />
        </div>
    )
}

export default CalendarPage
