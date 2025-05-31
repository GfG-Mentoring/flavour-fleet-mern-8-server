const { Router } = require("express");
// const { formatResponse } = require("../utils/formatResponse.js");
const { Restaurant } = require("../db/models/restaurant");

const restaurantRouter = Router();

restaurantRouter.get("/", async (req, res) => {
	const { longitude, latitude, maxDistance } = req.query;

	if (!longitude || !latitude) {
		return res
			.status(400)
			.json({ message: "Longitude and latitude are required." });
	}

	const point = {
		type: "Point",
		coordinates: [parseFloat(latitude), parseFloat(longitude)],
	};

	console.log(point);

	try {
		const restaurants = await Restaurant.find({
			location: {
				$near: {
					$geometry: point,
					$maxDistance: maxDistance ? parseInt(maxDistance) : 5000, // Default to 5000 meters
				},
			},
		});

		console.log(restaurants);
		res
			.status(200)
			.send({ msg: "Restaurants fetched successfully", restaurants });
	} catch (err) {
		console.error(err);
		res.status(500).send({ msg: "Error fetching restaurants." });
	}
});

// restaurantRouter.get("/:id", async (req, res) => {
// 	try {
// 		console.log("\n\n", req.params.id);
// 		const data = await Restaurant.findById(req.params.id);
// 		if (!data) {
// 			res
// 				.status(404)
// 				.send(
// 					formatResponse("Error occurred", null, "Restaurant data not found."),
// 				);
// 			return;
// 		}
// 		console.log("\n\n", data);
// 		res.status(200).send(formatResponse("Restaurant found", data, null));
// 	} catch (err) {
// 		console.error(err);
// 		res
// 			.status(500)
// 			.send(
// 				formatResponse(
// 					"Error occurred",
// 					null,
// 					"Error occured while getting data.",
// 				),
// 			);
// 	}
// });

module.exports = { restaurantRouter };
