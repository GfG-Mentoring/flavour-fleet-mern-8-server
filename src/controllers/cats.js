const { Router } = require("express");

const catsRouter = Router();

const cats = [
	{
		name: "Coco",
		breed: "Indie",
	},
	{
		name: "lemon",
		breed: "Tuxedo",
	},
	{
		name: "lono",
		breed: "Tuxedo",
	},
];

catsRouter.get("/", (req, res) => {
	console.log(req);
	res.send(cats);
});

catsRouter.post("/", (req, res) => {
	if (req.body) {
		cats.push(req.body);
	}

	res.send("Cat added to database");
});

catsRouter.delete("/:catName", (req, res) => {
	const params = req.params;
	const indexOfCatToDelete = cats.findIndex(
		(cat) => cat.name === params.catName,
	);
	if (indexOfCatToDelete > -1) {
		cats.splice(indexOfCatToDelete, 1);
		res.send(`cat with name ${req.params.catName} deleted.`);
	}
	res.status(404).send(`cat with name ${req.params.catName} not found.`);
});

module.exports = { catsRouter };
