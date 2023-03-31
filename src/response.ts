import {Temperature} from './types'

export function buildResponse(temps: Temperature[], status = 200) {
  // Build a HTML response containing the text
  const temperature = temps.map(t => `<tr><td>${t.time}</td><td>${t.temp}°C</td>`).join('')
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Example</title>
        <style>
        body {
          font-family: sans-serif;
          text-align: center;
        }
        h1 {
          font-size: 7.5rem;
        }
        p {
          color: #555555;
          font-size: 2rem;
        }
        code:not(:last-child) {
          margin-right: 2rem;
        }
        </style>
    </head>
    <body>
        
        <table><th>Time</th><th>Temp</th>${temperature}</table>
    </body>
    </html>
  `;

  return new Response(html, {
    status,
    headers: {
      // Content-Type must include text/html for live reload to work
      "Content-Type": "text/html; charset=UTF-8",
    },
  });
}
