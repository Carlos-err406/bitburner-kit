import { NS } from "@ns";
export async function main(ns: NS) {
  let target = ns.args[0] as string;
  let shortestPath = findShortestPath(ns, target);
  if (shortestPath) printShortestPath(ns, shortestPath, target);
  else {
    ns.alert(`Could not find path to ${target}\nWrong server name?`);
  }
}

const findShortestPath = (
  ns: NS,
  target: string,
  start = "home",
  visited = new Set()
) => {
  if (start.toLowerCase() === target.toLowerCase()) return [start];
  visited.add(start);
  let shortest: string[] = [];
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
};

const printShortestPath = (ns: NS, path: string[], target: string) => {
  let message = `\nSHORTEST PATH TO: ${target}\n`;
  const length = message.length;
  message += `${"-".repeat(length)}\n`;
  path.forEach((step, index) => {
    message += `\t${index}: ${step}\n`;
  });
  message += `${"-".repeat(length)}\n`;
  ns.tprint(message);
};
