
const express = require("express")
const { lightfetch } = require("lightfetch-node")
const app = express()

app.use(express.static(__dirname + "/static"))

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/static/index.html")
})

app.get("/get", async (req, res) => {
    let resp = await lightfetch(req.query.url, {
        method: "GET",
        headers: {
            "User-Agent": "Mozilla/5.0"
        }
    })
    res.send(resp.text())
})

app.listen(8080, () => {
    console.log("Server is online!")
})