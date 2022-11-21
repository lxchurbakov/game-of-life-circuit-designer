export const shouldBeAlive = (indexedCells, x, y) => {
	const countOfNeightbors = [
		[x - 1, y - 1],
		[x - 1, y],
		[x - 1, y + 1],
		[x, y + 1],
		[x + 1, y + 1],
		[x + 1, y],
		[x + 1, y - 1],
		[x, y - 1],
	].reduce((acc, [x, y]) => acc + (!!((indexedCells || [])[x] || [])[y] ? 1 : 0), 0)

	const isLive = !!((indexedCells || [])[x] || [])[y]

	if (countOfNeightbors < 2) {
		// go commit die
	} else if (countOfNeightbors === 2) {
		// stay
		if (isLive) {
			return true
		}
	} else if (countOfNeightbors === 3) {
		// go commit live
		return true
	} else if (countOfNeightbors > 3) {
		// die again
	}

	return false;
};
