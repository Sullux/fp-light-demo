const saveEventToArchiveTable = () => {}
const saveEventToArchive = () => {}
const copyEventToIndexes = () => {}

// spaghetti
async function archive1 (event) {
  const parallelOperations = []
  if (Array.isArray(event)) {
    for (const e of event) {
      if (e.retention) {
        parallelOperations.push(saveEventToArchiveTable(e))
        parallelOperations.push(saveEventToArchive(e))
        parallelOperations.push(copyEventToIndexes(e))
      }
    }
  } else {
    if (event.retention) {
      parallelOperations.push(saveEventToArchiveTable(event))
      parallelOperations.push(saveEventToArchive(event))
      parallelOperations.push(copyEventToIndexes(event))
    }
  }
  await Promise.all(parallelOperations)
  return event
}

// functional branches
const maybeArchiveEvent2 = (event) =>
  event.retention
    ? [
        saveEventToArchiveTable(event),
        saveEventToArchive(event),
        copyEventToIndexes(event),
      ]
    : []

const archiveSingleOrArray2 = (event) => Promise.all(
  Array.isArray(event)
    ? event.map(maybeArchiveEvent2).flat()
    : maybeArchiveEvent2(event),
)

const archive2 = async (event) =>
  (await archiveSingleOrArray2(event)) && event

// declarative
const maybeArchived = when(_.retention, {
  saveEventToArchiveTable,
  saveEventToArchive,
  copyEventToIndexes,
})

const archived = aside(when(isArray,
  parallel(maybeArchived),
  maybeArchived,
))

module.exports = {
  archive1,
  archive2,
  archived,
}
