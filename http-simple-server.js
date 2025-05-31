const http = require("node:http");

const server = http.createServer((req, res) => {
	console.log(req.url, req.method);

	if (req.url === "/") {
		switch (req.method) {
			case "GET": {
				res.statusCode = 200;
				res.setHeader("content-type", "application/json");
				res.end(JSON.stringify([{ name: "shikhar", age: 1000 }]));
				break;
			}

			case "POST": {
				req.on("data", (data) => console.log(data));
				break;
			}

			case "DELETE": {
				res.statusCode = 200;
				res.setHeader("content-type", "application/json");
				res.end(JSON.stringify([{ name: "shikhar", age: 1000 }]));
				break;
			}
			case "PUT": {
				break;
			}
		}
	} else if (req.url === "/cats") {
		res.statusCode = 200;
		res.setHeader("content-type", "application/json");
		res.end(JSON.stringify({ catName: "lola", breed: "indie" }));
	}
});

// make the server
server.listen(8001, () => {
	console.log("server is now attached and running on port 8001.");
});
