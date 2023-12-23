import React, { useState } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import Head from 'next/head'

const localizer = momentLocalizer(moment)

function CalendarPage (): JSX.Element {
    const [blockedDates, setBlockedDates] = useState<Date[]>([])

    const handleSelect = ({ start, end }: { start: Date, end: Date }) => {
        const range = getDatesInRange(start, end)
        const rangeIsBlocked = range.every(date =>
            blockedDates.some(d => isSameDay(d, date))
        )

        let newBlockedDates = [...blockedDates]

        if (rangeIsBlocked) {
            // If all dates are blocked, unblock them
            newBlockedDates = newBlockedDates.filter(
                blockedDate => !range.some(date => isSameDay(date, blockedDate))
            )
        } else {
            // If at least one date is not blocked, block all unblocked dates
            range.forEach(date => {
                if (!newBlockedDates.some(d => isSameDay(d, date))) {
                    newBlockedDates.push(date)
                }
            })
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
        const date = new Date(startDate.getTime())
        const dates = []

        // Check if start and end dates are the same
        const isSingleDay = isSameDay(startDate, endDate)

        while (date < endDate || (isSingleDay && date <= endDate)) {
            dates.push(new Date(date))
            date.setDate(date.getDate() + 1)
        }

        return dates
    }

    // Utility function to check if two dates are the same day
    function isSameDay (date1: Date, date2: Date) {
        return date1.getDate() === date2.getDate() &&
          date1.getMonth() === date2.getMonth() &&
          date1.getFullYear() === date2.getFullYear()
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
