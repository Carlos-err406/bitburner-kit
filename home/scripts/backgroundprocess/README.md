# Instructions for the bckgroundprocess files

The provided files contain two JavaScript scripts that are part of a background process for buying servers.

## buyservers.js

This script contains the main function that runs an infinite loop. In each iteration, the script checks if there are any servers that need to be deleted. If there are, it deletes the server with the minimum RAM and buys a new server with double the RAM. If there are no servers to delete, it buys a new server with the maximum RAM bought so far.

## refresher.js

This script contains the main function that runs an infinite loop. In each iteration, it executes the start-loop script on the home server and prints a message notifying that hacks are being refreshed. The time between iterations can be specified using the time flag.

---

# Specifications
The `buyservers.js` script will kill itself once you have maximum amount of servers and all of them have $2^{20}$ GiB (wich is the maximum amount of RAM a server can have in the game)
These are meant to run in a `16 GiB` server preferably named `backgroundprocess`, i you choose another name make sure to change it everywere else, since the server is excluded from some `ns.getPurchasedServers()` lists