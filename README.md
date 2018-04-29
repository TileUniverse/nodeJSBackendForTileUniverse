# nodeJSBackendForTileUniverse

This is the API guide for Tile Universe: a shareable world for infinite games to collaborate and interact in emergent patterns.

to get the entire game world:
GET tilesUniverse:3000/
returns a json object that includes the global state of the game and an array of every tile in the game.

to get a specific tile
GET tilesUniverse:3000/?x=1&y=2
returns a tile a position x = 1, y = 2 where the universe's origin of 0,0 is the tile in the first column and first row of the grid

to get a group of tiles
--todo

to write to the DB:

to write to a given tile
POST tilesUniverse:3000/ with body {x: 1, y: 2}

POST tilesUniverse:3000/ with body {tiles:[{x:1,y:2,data:someData},{x:0,y:0,data:someData},{x:3,y:3,data:someData}]}
