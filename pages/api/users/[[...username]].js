import { connectToDatabase } from "@lib/mongodb";
import { ObjectId } from "bson";

export default async (req, res) => {
	const {
		query: { username },
		method,
	} = req;

	const connection = await connectToDatabase();
	// const { client } = await clientPromise;
	const db = connection.db;
	const collection = db.collection("users");
	let result, user, filter;

	switch (method) {
		// case "POST":
		//     const { newTodoTitle } = JSON.parse(req.body);
		//     result = await collection.insertOne({
		//         title: newTodoTitle,
		//         completed: false,
		//     });
		//     hotel = result.ops[0];
		//     res.json({ hotel });
		//     break;
		case "PUT":
			const { usrname, reservation, creditAmount, donateAmount } = JSON.parse(req.body);
			filter = { username: usrname };
			user = await collection.findOne(filter);
			let userReservations = user.reservations;
			if (reservation) {
				if (!userReservations[reservation.hotel_id]) {
					userReservations[reservation.hotel_id] = [];
				}
				userReservations[reservation.hotel_id].push(reservation);
			}

			let userCredit = user.credit;
			userCredit += parseInt(creditAmount);

			let newDonateCount = user.donates;
			newDonateCount += parseInt(donateAmount);
			const updateDoc = { $set: { reservations: userReservations, credit: userCredit, donates: newDonateCount } };
			result = await collection.updateOne(filter, updateDoc);
			res.json({ user: user, reservations: userReservations, creditAmount: userCredit });
			break;
		// case "DELETE":
		//     const doc = { _id: ObjectId(id[0]) };
		//     result = await collection.deleteOne(doc);
		//     res.json({ deleted: result.deletedCount });
		//     break;
		case "GET":
			filter = { username: username[0] };
			user = await collection.findOne(filter);
			res.json({ user: user });
			break;
		default:
			res.status(400).json({ success: false });
			break;
	}
};