import React, { useEffect, useState } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import Head from 'next/head'
import axios from 'axios'

const localizer = momentLocalizer(moment)

const API_V1_URL = process.env.NEXT_PUBLIC_API_V1_URL ?? ''

interface DateRange {
    start: Date
    end: Date
}

interface CalendarEvent {
    start: Date
    end: Date
    title: string
    allDay: boolean
}

function CalendarPage (): JSX.Element {
    const [blockedDates, setBlockedDates] = useState<Date[]>([])

    // Fetch blocked dates from the server on component mount
    useEffect(() => {
        axios.get(`${API_V1_URL}users/current-user`)
            .then(response => {
                // Convert the dates from the server format to Date objects
                const dates = response.data.blockedDates.map((dateString: string) => fromUTCDate(dateString))
                setBlockedDates(dates)
            })
            .catch(error => {
                // Handle errors here
                console.error('Error fetching blocked dates:', error)
            })
    }, [])

    // Converting to UTC before sending to the backend
    const toUTCDate = (date: Date) => {
        return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    }

    // Converting from UTC after receiving from the backend
    const fromUTCDate = (dateString: string) => {
        const date = new Date(dateString)
        return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
    }

    async function createDateRangeBackend (startDate: Date, endDate: Date) {
        try {
            await axios.put(`${API_V1_URL}users/blockedDates/${toUTCDate(startDate).toISOString()}/${toUTCDate(endDate).toISOString()}`)
        } catch (err) {
            console.error('Error saving date range: ' + err)
        }
    }

    async function deleteDateRangeBackend (startDate: Date, endDate: Date) {
        try {
            await axios.delete(`${API_V1_URL}users/blockedDates/${toUTCDate(startDate).toISOString()}/${toUTCDate(endDate).toISOString()}`)
        } catch (err) {
            console.error('Error deleting date range: ' + err)
        }
    }

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
            deleteDateRangeBackend(start, range[range.length - 1])
        } else {
            // If at least one date is not blocked, block all unblocked dates
            range.forEach(date => {
                if (!newBlockedDates.some(d => isSameDay(d, date))) {
                    newBlockedDates.push(date)
                }
            })
            createDateRangeBackend(start, range[range.length - 1])
        }

        setBlockedDates(newBlockedDates)
    }

    const calendarEvents: CalendarEvent[] = mergeConsecutiveDates(blockedDates).map(({ start, end }) => ({
        start,
        end,
        title: 'Blocked',
        allDay: true
    }))

    // Utility function to merge consecutive dates into ranges
    function mergeConsecutiveDates (dates: Date[]): DateRange[] {
        const sortedDates = dates.toSorted((a, b) => a.getTime() - b.getTime())
        const merged: DateRange[] = []
        let rangeStart: Date | null = null
        let rangeEnd: Date | null = null

        sortedDates.forEach((date, i) => {
            if (!rangeStart) {
                rangeStart = date
                rangeEnd = date
            } else if (rangeEnd && isNextDay(rangeEnd, date)) {
                rangeEnd = date
            } else {
                if (rangeStart && rangeEnd) {
                    merged.push({ start: new Date(rangeStart), end: new Date(rangeEnd) })
                }
                rangeStart = date
                rangeEnd = date
            }

            if (i === sortedDates.length - 1 && rangeStart && rangeEnd) {
                merged.push({ start: new Date(rangeStart), end: new Date(rangeEnd) })
            }
        })

        return merged.map(range => {
            const adjustedEnd = new Date(range.end)
            adjustedEnd.setDate(adjustedEnd.getDate() + 1)
            return { ...range, end: adjustedEnd }
        })
    }

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

    // Utility function to check if the second date is the next day of the first
    function isNextDay (date1: Date, date2: Date) {
        const nextDay = new Date(date1)
        nextDay.setDate(nextDay.getDate() + 1)
        return isSameDay(nextDay, date2)
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
