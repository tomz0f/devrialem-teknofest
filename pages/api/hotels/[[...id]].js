import { connectToDatabase } from "@lib/mongodb";
import { ObjectId } from "bson";

export default async (req, res) => {
  const {
    query: { id },
    method,
  } = req;

  const connection = await connectToDatabase();
  // const { client } = await clientPromise;
  const db = connection.db;
  const collection = db.collection("hotels");
  let result, hotel, filter;

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
        const { hotelID, choiceChange } = JSON.parse(req.body);
		    filter = { _id: parseInt(hotelID) };
        hotel = await collection.findOne(filter);

		    let menuChoices = hotel.menu_choices;
    		if (!menuChoices[choiceChange.which]) {
    			menuChoices[choiceChange.which] = 0;
    		}
    		menuChoices[choiceChange.which] += choiceChange.count;

        const updateDoc = { $set: { menu_choices: menuChoices } };
        result = await collection.updateOne(filter, updateDoc);

        res.json({ menu_choices: menuChoices });
        break;
    // case "DELETE":
    //     const doc = { _id: ObjectId(id[0]) };
    //     result = await collection.deleteOne(doc);
    //     res.json({ deleted: result.deletedCount });
    //     break;
    case "GET":
        filter = { _id: parseInt(id[0]) };
        hotel = await collection.findOne(filter);
        res.json({ hotel: hotel });
        break;
    default:
        res.status(400).json({ success: false });
        break;
  }
};