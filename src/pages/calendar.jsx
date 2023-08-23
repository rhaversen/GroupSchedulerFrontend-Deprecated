import React, { Component, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import Modal from 'react-modal';

import InputField from '../components/InputField.jsx';
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

class App extends Component {
  state = {
    events: [
      {
        start: moment().toDate(),
        end: moment().add(1, "days").toDate(),
        title: "Some title",
      },
    ],
    selectedEvent: null, // Track the selected event
    showModal: false // Control whether the modal is shown
  };

  onEventResize = (data) => {
    const { start, end } = data;

    this.setState((state) => {
      state.events[0].start = start;
      state.events[0].end = end;
      return { events: [...state.events] };
    });
  };

  onEventDrop = ({ event, start, end, allDay }) => {
    this.setState((state) => {
        const idx = state.events.indexOf(event);
        const updatedEvent = { ...event, start, end, allDay };

        const nextEvents = [...state.events];
        nextEvents.splice(idx, 1, updatedEvent);

        return { events: nextEvents };
    });
  };

  onSelectEvent = (event) => {
    // Code to confirm and handle deletion of the clicked event
    if (window.confirm(`Are you sure you want to delete "${event.title}"?`)) {
      this.setState((state) => ({
        events: state.events.filter((e) => e !== event),
      }));
    }
  };

  onSelectSlot = (slotInfo) => {
    if (slotInfo.action !== "select" || slotInfo.slots.length <= 1 || slotInfo.box.ctrlKey || slotInfo.box.metaKey) {
      return; // Return early if selection is just a click or if meta/ctrl key is pressed
    }
    const { start, end } = slotInfo;
    const newEvent = {
      start,
      end,
      title: "New Event",
    };
    this.setState((state) => ({
      events: [...state.events, newEvent],
    }));
  };
  

  onUpdateAvailability = (formData) => {
    this.setState((state) => {
      const updatedEvents = state.events.map((event) =>
        event === state.selectedEvent
          ? {
              ...event,
              title: formData.title,
              start: moment(formData.start).toDate(),
              end: moment(formData.end).toDate(),
              // Add other fields as needed
            }
          : event
      );
      return { events: updatedEvents, showModal: false, selectedEvent: null };
    });
  };
  

  handleOpenModal = (event) => {
    this.setState({ selectedEvent: event, showModal: true });
  };

  handleCloseModal = () => {
    this.setState({ showModal: false, selectedEvent: null });
  };

  render() {
    const { selectedEvent, showModal } = this.state;

        const inputConfigs = [
            { type: 'text', name: 'title', label: 'Title', autoComplete: 'off' },
            { type: 'text', name: 'start', label: 'Start Date', autoComplete: 'off' },
            { type: 'text', name: 'end', label: 'End Date', autoComplete: 'off' },
            // Add more input configurations as needed
        ];
    return (
      <div className="App">
        <DnDCalendar
          defaultDate={moment().toDate()}
          defaultView="month"
          events={this.state.events}
          localizer={localizer}
          onEventDrop={this.onEventDrop}
          onEventResize={this.onEventResize}
          onSelectSlot={this.onSelectSlot}
          onSelectEvent={this.handleOpenModal}
          resizable
          selectable
          views={['month']} // Only show the month view
          style={{ height: "100vh" }}
        />
        <Modal isOpen={showModal} onRequestClose={this.handleCloseModal}>
        <form onSubmit={(e) => { e.preventDefault(); this.onUpdateAvailability(formData); }}>
            {inputConfigs.map(input => (
              <InputField
                key={input.name}
                type={input.type}
                name={input.name}
                label={input.label}
                autoComplete={input.autoComplete}
                value={selectedEvent ? selectedEvent[input.name] : ''}
                onChange={(e) => this.handleChange(selectedEvent, input.name, e.target.value)}
                // Add error handling as needed
              />
            ))}
            <button type="submit">Update Event</button>
            <button onClick={this.handleCloseModal}>Cancel</button>
        </form>
        </Modal>
      </div>
    );
  }

  handleChange = (event, name, value) => {
    this.setState({
      selectedEvent: { ...event, [name]: value },
    });
  };
}

export default App;