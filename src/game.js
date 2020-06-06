const upsert = (collection, search, update, insert = update) => {
  const value = collection.filter(search).pop()

  if (value) {
    return collection.map((item) => search(item) ? update(item) : item)
  } else {
    return colleciton.concat([insert()])
  }
}

const drawSquare = (context, x, y, color) => {
  context.fillRect(x * 20, y * 20, 20, 20)
}

const range = (from, to) => new Array(to - from + 1).fill(0).map((_, i) => i + from)

const isNeighbor = (item, x, y) => {
  if (item.x === x && item.y === y) {
    return false
  }

  return Math.abs(item.x - x) <= 1 && Math.abs(item.y - y) <= 1
}

export default (node) => {
  const canvas = document.createElement('canvas')

  /* Game state */
  let items = [
    { x: 10, y: 10 },
    { x: 11, y: 10 },
    { x: 12, y: 10 },
    { x: 12, y: 9 },
    { x: 11, y: 8 },
    // { x: 10, y: 11 },
    // { x: 11, y: 12 },
  ]
  // const getValue = (x, y) => !!items.filter((item) => item.x === x && item.y === y).pop() ? true : false
  // const setValue = (x, y, value) => {
  //   if (value) {
  //     items = upsert(items, (item) => item.x === x && item.y === y, () => ({ x, y }))
  //   } else {
  //     items = items.filter((item) => item.x !== x || item.y !== y)
  //   }
  // }

  /* Setup sizing and context*/
  const rect = node.getBoundingClientRect();
  canvas.style.width = rect.width + 'px'
  canvas.style.height = rect.height + 'px'
  canvas.width = rect.width
  canvas.height = rect.height
  const context = canvas.getContext('2d')

  /* Setup gaming ticker */
  let paused = false
  setInterval(() => {
    if (items.length === 0) {
      return
    }

    if (paused) {
      return
    }

    const xmax = items.reduce((acc, item) => Math.max(acc, item.x), -Infinity) + 1
    const xmin = items.reduce((acc, item) => Math.min(acc, item.x), Infinity) - 1
    const ymax = items.reduce((acc, item) => Math.max(acc, item.y), -Infinity) + 1
    const ymin = items.reduce((acc, item) => Math.min(acc, item.y), Infinity) - 1

    let nextItems = []
    range(xmin, xmax).forEach((x) => {
      range(ymin, ymax).forEach((y) => {
        const countOfNeightbors = items.filter((item) => isNeighbor(item, x, y)).length
        const isLive = !!items.filter((item) => item.x === x && item.y === y).pop()

        // console.log({ x, y, countOfNeightbors })

        if (countOfNeightbors < 2) {
          // go commit die
        } else if (countOfNeightbors === 2) {
          // stay
          if (isLive) {
            nextItems.push({ x, y })
          }
        } else if (countOfNeightbors === 3) {
          // go commit live
          nextItems.push({ x, y })
        } else if (countOfNeightbors > 3) {
          // die again
        }
      })
    })

    items = nextItems
  }, 100)

  /* Setup clicks and pauses */
  document.addEventListener('keydown', (e) => {
    // console.log(e.keyCode)
    if (e.keyCode === 32) {
      paused = !paused
    }
  })

  document.addEventListener('mousedown', (e) => {
    const { clientX, clientY } = e
    // console.log({ clientX, clientY })
    const x = Math.floor(clientX / 20)
    const y = Math.floor(clientY / 20)

    const isLive = !!items.filter((item) => item.x === x && item.y === y).pop()

    if (isLive) {
      items = items.filter((item) => item.x !== x || item.y !== y)
    } else {
      items.push({ x, y })
    }
    // console.log(e.keyCode)
    // if (e.keyCode === 32) {
    //   paused = !paused
    // }
  })

  /* Setup rendering with optimizations */
  const draw = () => {
    // for (const [key] in items.entries()
    context.clearRect(0, 0, rect.width, rect.height)
    items.forEach(({ x, y }) => {
      /* Render an item */
      drawSquare(context, x, y, 'white')
    })

    /* Drawing code */
    requestAnimationFrame(draw)
  }
  requestAnimationFrame(draw)

  node.appendChild(canvas)
}