# MemGPT UI

This is a simple HTML UI with vanilla JavaScript to connect to MemGPT's websocket_server.  It
allows you to chat with MemGPT and, optionally, see inner thoughts and OpenAI function calls.

It's just static HTML and doesn't require a server but the server.js is there mainly for my 
websocket testing.  It listens for a connection on port 3000 for HTTP requests and serves index.html.
It also listens on port 3001 for websocket connections and just echos back whatever message is sent.

To run server.js you need to do:

```npm install```

## Markdown

Some of the responses from MemGPT include markdown (numbered lists, code block, etc.).  To render
the response correctly I'm using [drawdown](https://github.com/adamvleggett/drawdown), a neat little 
markdown converter.
