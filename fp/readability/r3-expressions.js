const forwardEvents1 = (events) => {
  const eventsToForward = []
  for (const event of events) {
    if (!event.legacy) {
      eventsToForward.push(event)
    }
  }
  if (eventsToForward.length) {
    return forwardEvents(eventsToForward)
  }
  return events
}

const forwardEvents2 = (events) => {
  const eventsToForward = events.filter(({ legacy }) => !legacy)
  return eventsToForward.length
    ? forwardEvents(eventsToForward)
    : events
}

const forwardEvents3 = pipe(
  {
    events: _,
    eventsToForward: filter(not(_.legacy)),
  },
  when(_.eventsToForward.length, forwardEvents, _.events),
);
