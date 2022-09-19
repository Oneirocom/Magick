process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

import { useState, useEffect, Fragment } from 'react'
import DayLabels from './DayLabels'
import './calendar.css'
import axios from 'axios'
import { useSnackbar } from 'notistack'

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const toStartOfDay = date => {
  const newDate = new Date(date)
  newDate.setHours(0)
  newDate.setMinutes(0)
  newDate.setSeconds(0)
  newDate.setMilliseconds(0)
  return newDate
}

const pad = input => {
  return input < 10 ? '0' + input : input
}

const dateToInputFormat = date => {
  if (!date) {
    return null
  }

  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  // const hours = pad(date.getHours())
  // const minutes = pad(date.getMinutes())

  return `${date.getFullYear()}-${month}-${day}`
}

const findEventsForDate = (events, date) => {
  return events.filter(
    event => date.toDateString() === new Date(event.date).toDateString()
  )
}

const Navigation = ({ date, setDate, setShowingEventForm }) => {
  return (
    <div className="navigation">
      <div
        className="back"
        onClick={() => {
          const newDate = new Date(date)
          newDate.setMonth(newDate.getMonth() - 1)
          setDate(newDate)
        }}
      >
        {'<'} {MONTHS[date.getMonth() === 0 ? 11 : date.getMonth() - 1]}
      </div>

      <div className="monthAndYear">
        {MONTHS[date.getMonth()]} {date.getFullYear()}
        <a onClick={() => setShowingEventForm({ visible: true })}></a>
      </div>

      <div
        className="forward"
        onClick={() => {
          const newDate = new Date(date)
          newDate.setMonth(newDate.getMonth() + 1)
          setDate(newDate)
        }}
      >
        {MONTHS[date.getMonth() === 11 ? 0 : date.getMonth() + 1]} {'>'}
      </div>
    </div>
  )
}

const MiniEvent = ({ event, setViewingEvent }) => {
  return (
    <div
      className={`miniEvent ${
        event.type ? event.type.toLowerCase() : 'standard'
      }`}
      onClick={() => setViewingEvent(event)}
    >
      {event.name}
    </div>
  )
}

const EventModal = ({
  event,
  setViewingEvent,
  setShowingEventForm,
  deleteEvent,
}) => {
  return (
    <Modal
      onClose={() => setViewingEvent(null)}
      title={`${event.name} (${event.type})`}
      className="eventModal"
    >
      <p>
        Date: <b>{event.date}</b> Time: <b>{event.time}</b>
      </p>
      <p>{event.moreInfo}</p>

      <button
        className="calendarBtn"
        onClick={() => {
          setViewingEvent(null)
          setShowingEventForm({ visible: true, withEvent: event })
        }}
      >
        Edit event
      </button>

      <button className="calendarBtn red" onClick={() => deleteEvent(event)}>
        Delete event
      </button>

      <a className="close" onClick={() => setViewingEvent(null)}>
        Back to calendar
      </a>
    </Modal>
  )
}

const EventForm = ({
  setShowingEventForm,
  addEvent,
  editEvent,
  withEvent,
  setViewingEvent,
  preselectedDate,
}) => {
  const newEvent = withEvent || {
    name: '',
    date: '',
    time: '',
    type: 'standard',
    moreInfo: '',
  }
  if (!withEvent && !!preselectedDate) {
    newEvent.date = dateToInputFormat(preselectedDate)
  }
  const [event, setEvent] = useState(newEvent)

  return (
    <Modal
      className="eventheader"
      onClose={() => setShowingEventForm({ visible: false })}
      title={`${withEvent ? 'Edit event' : 'Add a new event'}`}
    >
      <div className="form">
        <label>
          Name
          <textarea
            placeholder="ie. My Event"
            defaultValue={event.name}
            onChange={e => setEvent({ ...event, name: e.target.value })}
          />
        </label>

        <label>
          Date
          <input
            type="date"
            defaultValue={event.date || dateToInputFormat(preselectedDate)}
            onChange={e => setEvent({ ...event, date: e.target.value })}
          />
        </label>

        <label>
          Time
          <input
            type="time"
            defaultValue={event.time || dateToInputFormat(preselectedDate)}
            onChange={e => setEvent({ ...event, time: e.target.value })}
          />
        </label>

        <label>
          Type
          <select
            value={event.type ? event.type.toLowerCase() : 'standard'}
            onChange={e => setEvent({ ...event, type: e.target.value })}
          >
            <option value="standard">Standard</option>
            <option value="busy">Busy</option>
            <option value="holiday">Holiday</option>
          </select>
        </label>

        <label>
          Description
          <textarea
            placeholder="Describe the event"
            defaultValue={event.moreInfo}
            onChange={e => setEvent({ ...event, moreInfo: e.target.value })}
          />
        </label>

        {withEvent ? (
          <Fragment>
            <button className="calendarBtn" onClick={() => editEvent(event)}>
              Edit event
            </button>
            <a
              className="close"
              onClick={() => {
                setShowingEventForm({ visible: false })
                setViewingEvent(event)
              }}
            >
              Cancel
            </a>
          </Fragment>
        ) : (
          <Fragment>
            <button className="calendarBtn Add" onClick={() => addEvent(event)}>
              Add event
            </button>

            <button
              className="calendarBtn close"
              onClick={() => setShowingEventForm({ visible: false })}
            >
              Cancel
            </button>
          </Fragment>
        )}
      </div>
    </Modal>
  )
}

const Modal = ({ children, onClose, title, className }) => {
  return (
    <Fragment>
      <div className="overlay" onClick={onClose} />
      <div className={`modal ${className}`}>
        <h3>{title}</h3>
        <div className="inner">{children}</div>
      </div>
    </Fragment>
  )
}

const Loader = () => {
  return (
    <Fragment>
      <div className="overlay" />
      <div className="loader">
        <div className="lds-roller">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </Fragment>
  )
}

const Grid = ({
  date,
  events,
  setViewingEvent,
  setShowingEventForm,
  actualDate,
}) => {
  const ROWS_COUNT = 6
  const currentDate = toStartOfDay(new Date())
  const startingDate = new Date(date.getFullYear(), date.getMonth(), 1)
  startingDate.setDate(startingDate.getDate() - (startingDate.getDay() - 1))

  const dates: any[] = []
  for (let i = 0; i < ROWS_COUNT * 7; i++) {
    const date = new Date(startingDate)
    dates.push({ date, events: findEventsForDate(events, date) })
    startingDate.setDate(startingDate.getDate() + 1)
  }

  return (
    <Fragment>
      {dates.map((date, index) => {
        return (
          <div
            key={index}
            className={`cell ${
              date.date.getTime() == currentDate.getTime() ? 'current' : ''
            } ${
              date.date.getMonth() != actualDate.getMonth() ? 'otherMonth' : ''
            }`}
          >
            <div className="date">
              <a
                className="addEventOnDay"
                onClick={() =>
                  setShowingEventForm({
                    visible: true,
                    preselectedDate: date.date,
                  })
                }
              >
                {date.date.getDate()}
              </a>
            </div>
            {date.events.map((event, index) => (
              <MiniEvent
                key={index}
                event={event}
                setViewingEvent={setViewingEvent}
              />
            ))}
          </div>
        )
      })}
    </Fragment>
  )
}

export const CalendarApp = () => {
  const [date, setDate] = useState(new Date())
  const [viewingEvent, setViewingEvent] = useState(false)
  const [showingEventForm, setShowingEventForm] = useState({
    visible: false,
    withEvent: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [events, setEvents] = useState([] as any)
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    axios
      .get(`${process.env.REACT_APP_API_ROOT_URL}/calendar_event`)
      .then(({ data }) => {
        console.log(data)
        setEvents(data)
      })
      .catch(err => {
        console.log(err)
        enqueueSnackbar('Error fetching events', { variant: 'error' })
      })
  }

  const addEvent = event => {
    if (
      event.name?.length <= 0 ||
      event.moreInfo?.length <= 0 ||
      event.name?.length <= 0 ||
      event.time?.length <= 0
    ) {
      enqueueSnackbar('invalid event info!', {
        variant: 'error',
      })
      return
    }
    setIsLoading(true)
    setShowingEventForm({ visible: false, withEvent: false })
    axios
      .post(`${process.env.REACT_APP_API_ROOT_URL}/calendar_event`, event)
      .then(res => {
        setIsLoading(false)
        fetchEvents()
        enqueueSnackbar('Event created successfully', { variant: 'success' })
      })
      .catch(err => {
        setIsLoading(false)
        console.log(err)
        enqueueSnackbar('Event not created', { variant: 'error' })
      })
  }

  const editEvent = event => {
    setIsLoading(true)
    setShowingEventForm({ visible: false, withEvent: false })
    let { id, ...eventBody } = event
    axios
      .patch(
        `${process.env.REACT_APP_API_ROOT_URL}/calendar_event/${id}`,
        eventBody
      )
      .then(res => {
        setIsLoading(false)
        fetchEvents()
        enqueueSnackbar('Event updated successfully', { variant: 'success' })
      })
      .catch(err => {
        setIsLoading(false)
        console.log(err)
        enqueueSnackbar('Event not updated', { variant: 'error' })
      })
  }

  const deleteEvent = event => {
    setIsLoading(true)
    setViewingEvent(false)
    setShowingEventForm({ visible: false, withEvent: false })

    axios
      .delete(
        `${process.env.REACT_APP_API_ROOT_URL}/calendar_event/${event.id}`
      )
      .then(res => {
        setIsLoading(false)
        fetchEvents()
        enqueueSnackbar('Event deleted successfully', { variant: 'success' })
      })
      .catch(err => {
        setIsLoading(false)
        console.log(err)
        enqueueSnackbar('Event not deleted', { variant: 'error' })
      })
  }

  return (
    <div className="calendar-UI">
      {isLoading && <Loader />}

      <Navigation
        date={date}
        setDate={setDate}
        setShowingEventForm={setShowingEventForm}
      />

      <DayLabels />

      <Grid
        date={date}
        events={events}
        setShowingEventForm={setShowingEventForm}
        setViewingEvent={setViewingEvent}
        actualDate={date}
      />

      {viewingEvent && (
        <EventModal
          event={viewingEvent}
          setShowingEventForm={setShowingEventForm}
          setViewingEvent={setViewingEvent}
          deleteEvent={deleteEvent}
        />
      )}

      {showingEventForm && showingEventForm.visible && (
        <EventForm
          withEvent={showingEventForm.withEvent}
          preselectedDate={showingEventForm.withEvent}
          setShowingEventForm={setShowingEventForm}
          addEvent={addEvent}
          editEvent={editEvent}
          setViewingEvent={setViewingEvent}
        />
      )}
    </div>
  )
}
