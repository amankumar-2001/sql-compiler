const express = require('express');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const App = require('../src/App').default;
const path = require('path');

const app = express();
const PORT = 5050;

app.use(express.static(path.resolve(__dirname, '../build')));

app.get('/', (req, res) => {
  const content = ReactDOMServer.renderToString(<App />);
  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>React SSR</title>
      </head>
      <body>
        <div id="root">${content}</div>
      </body>
    </html>
  `;

  res.send(html);
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});