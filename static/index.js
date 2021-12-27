var app = new Vue({
    el: '#app',
    data: {
        addId: "",
        addPrice: "",
        items: localStorage.getItem("items") ? JSON.parse(localStorage.getItem("items")) : []
    },
    methods: {
        addItem: async function() {
            alert("Waiting for response")
            let res = await fetch(`http://localhost:8080/get?url=${encodeURIComponent('https://api.roblox.com/marketplace/productinfo?assetId=' + this.addId)}`, {
                headers: {
                    "x-requested-with": "www.roblox.com"
                }
            })
            let data = await res.json()

            this.items.push({
                id: this.addId,
                price: parseInt(this.addPrice),
                link: `https://www.roblox.com/catalog/${this.addId}`,
                name: data.Name,
                scanprice: "Not scanned"
            })
        }
    },
    beforeMount(){
        for (let item of this.items) {
            fetch(`http://localhost:8080/get?url=${encodeURIComponent('https://www.rolimons.com/item/' + encodeURIComponent(item.id))}`, {
                headers: {
                    "x-requested-with": "www.roblox.com"
                }
            })
            .then(res => res.text())
            .then(html => {
                let doc = (new DOMParser()).parseFromString(html, "text/html")
                
                let price = parseInt(doc.querySelector(".value-stat-data").textContent.replace(/,/g, ""))
                
                item.scanprice = price
            })
        }
        setInterval(() => {
            for (let item of this.items) {
                fetch(`http://localhost:8080/get?url=${encodeURIComponent('https://www.rolimons.com/item/' + encodeURIComponent(item.id))}`, {
                    headers: {
                        "x-requested-with": "www.roblox.com"
                    }
                })
                .then(res => res.text())
                .then(html => {
                    let doc = (new DOMParser()).parseFromString(html, "text/html")
                    
                    let price = parseInt(doc.querySelector(".value-stat-data").textContent.replace(/,/g, ""))
                    
                    item.scanprice = price
                })
            }
        }, 1000 * 60 * 5)
        setInterval(() => {
            for (let item of this.items) {
                if (item.scanprice < item.price) {
                    var msg = new SpeechSynthesisUtterance()
                    msg.text = `${item.name} costs less than the entered price`
                    msg.lang = 'en-US'
                    window.speechSynthesis.speak(msg)
                }
            }
        }, 1000 * 0.5)
    },
})

window.addEventListener("beforeunload", (e) => {
    localStorage.setItem("items", JSON.stringify(app.items))
})

