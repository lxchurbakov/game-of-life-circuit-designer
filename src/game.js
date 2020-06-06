const upsert = (collection, search, update, insert = update) => {
  const value = collection.filter(search).pop()

  if (value) {
    return collection.map((item) => search(item) ? update(item) : item)
  } else {
    return colleciton.concat([insert()])
  }
}

const drawSquare = (context, x, y, color) => {
  context.fillRect(x * 20, y * 20, 19, 19)
}

const range = (from, to) => new Array(to - from + 1).fill(0).map((_, i) => i + from)

const isNeighbor = (item, x, y) => {
  if (item.x === x && item.y === y) {
    return false
  }

  return Math.abs(item.x - x) <= 1 && Math.abs(item.y - y) <= 1
}

const isDigit = (s) => '0123456789'.indexOf(s) > -1

const parse = (pattern) => {
  let runCount = 1
  let x = 0
  let y = 0
  let result = []
  pattern.split('').reduce((acc, item) => {
    if (acc.length > 0 && isDigit(item) && isDigit(acc.slice().pop())) {
      acc[acc.length - 1] += item
      return acc
    } else {
      return acc.concat(item)
    }
  }, []).forEach((symbol) => {

    const intRepr = parseInt(symbol, 10)
    // console.log(symbol, intRepr)
    if (!isNaN(intRepr)) {
      runCount = intRepr
    } else {
      // dead cell - do nothing
      if (symbol === 'b') {
        // result.push()
        x += runCount
        runCount = 1
      }
      // live cell push
      if (symbol === 'o') {
        for (let i = 0; i < runCount; i++) {
          result.push({ x: x + i, y })
        }
        x += runCount
        runCount = 1
      }

      if (symbol === '$') {
        x = 0
        y++
        runCount = 1
      }
    }
  })

  return result
}

export default (node) => {
  const canvas = document.createElement('canvas')

  /* Game state */
  let items = parse('24bo$22bobo$12b2o6b2o12b2o$11bo3bo4b2o12b2o$2o8bo5bo3b2o$2o8bo3bob2o4bobo$10bo5bo7bo$11bo3bo$12b2o!')
  // let items = parse('11bo38b$10b2o38b$9b2o39b$10b2o2b2o34b$38bo11b$38b2o8b2o$39b2o7b2o$10b2o2b2o18b2o2b2o10b$2o7b2o39b$2o8b2o38b$11bo38b$34b2o2b2o10b$39b2o9b$38b2o10b$38bo!')
  // let items = parse('b2o23b2o21b$b2o23bo22b$24bobo22b$15b2o7b2o23b$2o13bobo31b$2o13bob2o30b$16b2o31b$16bo32b$44b2o3b$16bo27b2o3b$16b2o31b$2o13bob2o13bo3bo12b$2o13bobo13bo5bo7b2o2b$15b2o14bo13b2o2b$31b2o3bo12b$b2o30b3o13b$b2o46b$33b3o13b$31b2o3bo12b$31bo13b2o2b$31bo5bo7b2o2b$32bo3bo12b2$44b2o3b$44b2o3b5$37b2o10b$37bobo7b2o$39bo7b2o$37b3o9b$22bobo24b$21b3o25b$21b3o25b$21bo15b3o9b$25bobo11bo9b$21b2o4bo9bobo9b$16b2o4bo3b2o9b2o10b$15bobo6bo24b$15bo33b$14b2o!')
  // [
    // { x: 10, y: 10 },
    // { x: 11, y: 10 },
    // { x: 12, y: 10 },
    // { x: 12, y: 9 },
    // { x: 11, y: 8 },
  // ]

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

    const xystoprocess = items.reduce((acc, item) => acc.concat([
      { x: item.x, y: item.y },

      { x: item.x - 1, y: item.y },
      { x: item.x - 1, y: item.y - 1 },
      { x: item.x, y: item.y - 1 },

      { x: item.x + 1, y: item.y },
      { x: item.x + 1, y: item.y + 1 },
      { x: item.x, y: item.y + 1 },

      { x: item.x - 1, y: item.y + 1 },
      { x: item.x + 1, y: item.y - 1 },
    ]), []).sort((a, b) => (a.x === b.x ? (a.y > b.y ? 1 : -1) : (a.x > b.x ? 1 : -1)))

    // const xmax = items.reduce((acc, item) => Math.max(acc, item.x), -Infinity) + 1
    // const xmin = items.reduce((acc, item) => Math.min(acc, item.x), Infinity) - 1
    // const ymax = items.reduce((acc, item) => Math.max(acc, item.y), -Infinity) + 1
    // const ymin = items.reduce((acc, item) => Math.min(acc, item.y), Infinity) - 1

    let nextItems = []
    let prev = { x: null, y: null }
    xystoprocess.forEach(({ x, y }) => {
      if (prev.x !== x || prev.y !== y) {
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

        prev = {x, y}
      }
    })

    items = nextItems
  }, 0)

  /* Setup clicks and pauses */
  document.addEventListener('keydown', (e) => {
    // console.log(e.keyCode)
    if (e.keyCode === 32) {
      paused = !paused
    }
  })

  let lastmousepos = null
  let dragged = 0
  let offset = { x: 0, y: 0 }
  let zoom = 1
  document.addEventListener('mousedown', (e) => {
    const { clientX, clientY } = e
    lastmousepos = { x: clientX, y: clientY }
    dragged = 0
  })

  document.addEventListener('mousemove', (e) => {
    if (lastmousepos !== null) {
      const { clientX, clientY } = e

      // console.log('move', clientX - lastmousepos.x, clientY - lastmousepos.y)
      offset.x += clientX - lastmousepos.x
      offset.y += clientY - lastmousepos.y
      dragged += Math.abs(clientX - lastmousepos.x)
      dragged += Math.abs(clientY - lastmousepos.y)
      lastmousepos = { x: clientX, y: clientY }
      // console.log(dragged)
    }
  })

  document.addEventListener('mouseup', (e) => {
    const { clientX, clientY } = e
    // console.log(dragged)

    if (
      dragged < 20
    ) {
      const x = Math.floor((clientX - offset.x) / 20)
      const y = Math.floor((clientY - offset.y) / 20)

      const isLive = !!items.filter((item) => item.x === x && item.y === y).pop()

      if (isLive) {
        items = items.filter((item) => item.x !== x || item.y !== y)
      } else {
        items.push({ x, y })
      }
    }

    lastmousepos = null
  })

  document.addEventListener('mousewheel', (e) => {
    // console.log(e.deltaX)
    zoom *= e.deltaY > 0 ? 1.02 : .98
  })

  /* Setup rendering with optimizations */
  const draw = () => {
    context.clearRect(0, 0,rect.width, rect.height)
    context.scale(zoom, zoom)
    context.translate(offset.x, offset.y)
    // context.translate(-rect.width/2, -rect.height/2)

    // for (const [key] in items.entries()

    items.forEach(({ x, y }) => {
      /* Render an item */
      drawSquare(context, x, y, 'white')
    })
    // context.translate(rect.width/2, rect.height/2)
    context.translate(-offset.x, -offset.y)
    context.scale(1/zoom, 1/zoom)

    /* Drawing code */
    requestAnimationFrame(draw)
  }
  requestAnimationFrame(draw)

  node.appendChild(canvas)
}