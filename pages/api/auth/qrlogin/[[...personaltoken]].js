import {connectToDatabase} from '@lib/mongodb'

export default async (req, res) => {
	const {
		query: { personaltoken },
		method,
	} = req;

  const connection = await connectToDatabase();
  // const { client } = await clientPromise;
  const db = connection.db;
  const collection = db.collection("users");
  let result, user, filter;

  console.log("PERSONAL TOKEN: ", personaltoken);

  switch (method) {
    case "GET":
        filter = { code: personaltoken[0].toString() };
        user = await collection.findOne(filter);
		res.json({ user: user });
        break;
    default:
        res.status(500).json({ success: false, error: "Internal Server Error"});
        break;
  }
};