export type LivingCell = { x: number, y : number }

export default class GameState {
  // livingCells: LivingCell[] = [
  //   { x: 10, y: 10 },
  //   { x: 10, y: 11 },
  //   { x: 11, y: 12 },
  //   { x: 11, y: 10 },
  //   { x: 12, y: 10 },
  //   // { x: 13, y: 10 },
  // ]
  livingCells: LivingCell[] = parse('24bo$22bobo$12b2o6b2o12b2o$11bo3bo4b2o12b2o$2o8bo5bo3b2o$2o8bo3bob2o4bobo$10bo5bo7bo$11bo3bo$12b2o!')
}


// parse('24bo$22bobo$12b2o6b2o12b2o$11bo3bo4b2o12b2o$2o8bo5bo3b2o$2o8bo3bob2o4bobo$10bo5bo7bo$11bo3bo$12b2o!')



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