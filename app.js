import express from 'express';

const courseGoals = [];

const renderListItems = (id, text) => {
  return `
    <li id="goal-${id}">
      <span>${text}</span>
      <button hx-delete="/goals/${id}" hx-target="#goal-${id}">Remove</button>
    </li>
  `;
}

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Learn HTMX</title>
      <link rel="stylesheet" href="/main.css" />
      <script src="/htmx.js" defer></script>
    </head>
    <body>
      <main>
        <h1>Manage your goals</h1>
        <section>
          <form hx-post="/goals" hx-target="#goals" hx-swap="beforeend" hx-on:submit="document.querySelector('form').reset()" id="goal-form">
            <div>
              <label htmlFor="goal">Goal</label>
              <input type="text" id="goal" name="goal" />
            </div>
            <button type="submit">Add goal</button>
          </form>
        </section>
        <section>
          <ul id="goals" hx-swap="outerHTML" hx-confirm="Delete this item?">
            ${courseGoals.map((goal) =>
              renderListItems(goal.id, goal.text)
            ).join("")}
          </ul>
        </section>
      </main>
    </body>
  </html>
  `);
});

app.post("/goals", (req, res) => {
  const addedGoals = req.body.goal;
  const id = new Date().getTime().toString();
  courseGoals.push({ text: addedGoals, id: id });
  res.send(
    renderListItems(id, addedGoals)
  )
});

app.delete("/goals/:id", (req, res) => {
  const id = req.params.id;
  const index = courseGoals.findIndex(goal => goal.id === id);
  courseGoals.splice(index, 1);
  res.send();
})

app.listen(3000);
