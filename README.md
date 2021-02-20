# newsline-api

an API, built around scrapping http://cliffy.ucs.mun.ca/archives/newsline.html

An instance is currently hosted at `https://jackharrhy.dev/newsline/`

----

MUNs Newsline Email List is a pretty useful resource (at times, most of the time it's deaths and asbestos notices), but it seems people are pretty inconsistently added to said list.

This api is built around scrapping the publically available archives of newsline, which are kept up to date as the emails are sent out it seems.

It was designed so [Automata](https://github.com/MUNComputerScienceSociety/Automata), the bot built for the MUNCS Discord, can hook into said list easily, and post its contents in a discord channel.

Data is kept up to date by fetching new posts every 5 minutes.

---

### API 'docs'

For the shape of what is returned from the API, check `src/interfaces.ts`, specifically `ISqlPostOverview`, and `ISqlPostDetails`.

`GET /posts/`

- returns a list of posts
- `page` & `limit` are used for pagination, they default to `0` and `10` accordingly.
- `limit` can't be greater than `100`
- post `id`s are generated as so `md5(url + "/" + title)`

`GET /posts/:id/detail`

- returns posts in detail, such as both their `text` and `html`
