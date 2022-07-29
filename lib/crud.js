import { server } from '@config/server_config';
import { signIn } from 'next-auth/react';


const readHotel = async (_id) => {
	const result = await fetch(`${server}/api/hotels/` + _id, {
		method: "GET",
	});
	const data = await result.json();

	// setTheHotel((state) => data.hotel);
	return data;

	// if (data.deleted === 1) {
	//   setAllTodos((state) =>
	//     state.filter((todo) => todo._id !== todoToDelete._id)
	//   );
	// }
};


const createNewUser = async ({ name, surname, username, password }) => {
	const result = await fetch(`${server}/api/auth/register`, {
		method: 'POST',
		body: JSON.stringify({
			name: name,
			surname: surname,
			username: username,
			password: password
		}),
		headers: {
    	  'Accept': 'application/json',
    	}
	})
	const data = await result.json()
	return data;
}

const readUser = async (id) => {
	const result = await fetch(`${server}/api/users/` + encodeURI(id), {
		method: "GET",
	});
	const data = await result.json();

	// setTheHotel((state) => data.hotel);
	return data;

	// if (data.deleted === 1) {
	//   setAllTodos((state) =>
	//     state.filter((todo) => todo._id !== todoToDelete._id)
	//   );
	// }
};


const updateUserProperties = async ({ usrname, newReservation, creditAmount, donateAmount }) => {
	const result = await fetch(`${server}/api/users/` + encodeURI(usrname), {
		method: "PUT",
		body: JSON.stringify({ usrname, reservation: newReservation, creditAmount: creditAmount, donateAmount: donateAmount }),
	});
	const data = await result.json();

	// setTheHotel((state) => data.hotel);
	return data;

	// if (data.deleted === 1) {
	//   setAllTodos((state) =>
	//     state.filter((todo) => todo._id !== todoToDelete._id)
	//   );
	// }
};

const updateMenuChoices = async ({ hotelID, newChoiceChange }) => {
	const result = await fetch(`${server}/api/hotels/` + encodeURI(hotelID), {
		method: "PUT",
		body: JSON.stringify({ hotelID, choiceChange: newChoiceChange }),
	});
	const data = await result.json();
	return data;
};

const readUserFromToken = async (token) => {
	const result = await fetch(`${server}/api/auth/qrlogin/` + encodeURI(token), {
		method: "GET",
		// body: JSON.stringify({personaltoken: token}),
		// headers: {
		// 	'Content-Type': 'application/json'
		// }
	}).catch(err => console.log("An error occured: ", err))
	const data = await result.json()
	let user = data.user;
	if (!user) {
		return "no user";
	}
	signIn('credentials', {username: user.username, password: user.password, callbackUrl: `/kullanici/${user._id}`})
	return data;
}
export { readHotel, readUser, updateUserProperties, updateMenuChoices, readUserFromToken, createNewUser };