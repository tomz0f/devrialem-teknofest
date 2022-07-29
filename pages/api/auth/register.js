import { connectToDatabase } from "@lib/mongodb";
import { v4 as uuid } from 'uuid';

export default async (req, res) => {
	const {
    query,
		method
	} = req;

  const connection = await connectToDatabase();
  // const { client } = await clientPromise;
  const db = connection.db;
  const user = db.collection("users"); 
  let result;
  
  switch (method) {
    case "POST":
      const { name, surname, username, password } = JSON.parse(req.body);
      let user_code = uuid();
      let random_user_id = Math.floor(Math.random() * (999999 - 100000)) + 100000;;
      let newUser = {
        _id: random_user_id,
        name: name,
        surname: surname,
        username: username,
        password: password,
        reservations: {},
        credit: 0,
        isAdmin: false,
        code: user_code,
        donates: 0
      };
      result = await user.insertOne(newUser, function (err, res){
        if (err) throw err;
        console.log("islem basarılı");
      });
      
      res.status(200).json({
        newUser,
        status: 200,
        message: "Kullanıcı kaydi basarili"
      })
      break;
    default:
      res.status(404).json({ success: false, error: "Page Not Found", status: 404 });
      break;
  }
}