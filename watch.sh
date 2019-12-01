tsc --build
tsc --watch &
watchify .\\scripts\\dev\\javascript\\main.js -o .\\scripts\\bundle.js
