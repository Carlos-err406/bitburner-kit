/** @param {NS} ns */
export async function main(ns) {
	let target = ns.args[0];
	let { start } = ns.flags([['start', 'home']])
	let shortestPath = findShortestPath(ns, target, start);
	if (shortestPath)
		printShortestPath(ns, shortestPath, target)
	else {
		ns.alert(`Could not find path to ${target}\nWrong server name?`)
	}
}

const findShortestPath = (ns, target, start, visited = new Set()) => {
	if (start === target) return [start];
	visited.add(start);
	let shortest = null;
	for (let neighbor of ns.scan(start)) {
		if (!visited.has(neighbor)) {
			let path = findShortestPath(ns, target, neighbor, visited);
			if (path) {
				if (!shortest || path.length < shortest.length) {
					shortest = [start, ...path];
				}
			}
		}
	}
	visited.delete(start);
	return shortest;
}

const printShortestPath = (ns, path, target) => {
	let message = `\nSHORTEST PATH TO: ${target}\n`
	const length = message.length
	message += `${'-'.repeat(length)}\n`
	path.forEach((step, index) => {
		message += `\t${index}: ${step}\n`
	})
	message += `${'-'.repeat(length)}\n`
	ns.tprint(message)
}