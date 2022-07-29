import { useRouter } from 'next/router'
import { createNewUser } from '@lib/crud';
import Head from 'next/head';

export default function SignIn() {
	const router = useRouter();
	
	const onSubmitButtonForm = (event) =>  {
		event.preventDefault();
		
		try {
			const data = {
				name: event.target.name.value.trim(),
				surname: event.target.surname.value.trim(),
				username: event.target.username.value.trim(),
				password: event.target.password.value.trim()
			};
			createNewUser({ name: data.name, surname: data.surname, username: data.username, password: data.password }).then(response => {
				alert(response.message);
				router.push('/');
			}).catch(event => console.error('An error occured!\nErr:', event ))

		} catch (event) {
			console.error('Error: Beklenmedik bir hata oluştu ve sunucuya baglanamadi ya da veri degistirilemedi.\nErr', event)
		}		
	}

	return (
		<>
			<Head>
				<title>Devrialem | Kayıt Ol</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<div className="container bg-white rounded shadow p-6 m-4 w-full lg:w-3/4">

				<div className="flex items-center justify-center ">

					<form onSubmit={onSubmitButtonForm} className="w-full md:w-1/3 bg-white rounded-lg">
						<h2 className="text-3xl text-center text-gray-700 mb-4">Kayıt Formu</h2>
						<div className="px-12 pb-10 items-center justify-center">
							<div className="w-full mb-2 flex items-center justify-center">
								<input name="name" type='text' required placeholder="İsim" className="-mx-6 px-8 w-full border rounded px-3 py-2 text-gray-700 focus:outline" />
							</div>
							<div className="w-full mb-2 flex items-center justify-center">
								<input name="surname" type='text' required placeholder="Soy İsim" className="-mx-6 px-8 w-full border rounded px-3 py-2 text-gray-700 focus:outline" />
							</div>
							<div className="w-full mb-2 flex items-center justify-center">
								<input name="username" type='text' required placeholder="Kullanıcı Adı" className="-mx-6 px-8 w-full border rounded px-3 py-2 text-gray-700 focus:outline" />
							</div>
							<div className="w-full mb-2 flex items-center justify-center">
								<input name="password" type='password' required placeholder="Şifre" className="-mx-6 px-8 w-full border rounded px-3 py-2 text-gray-700 focus:outline" />
							</div>
							<button type="submit" className="transition duration-500 ease-in-out w-full py-2 my-2 rounded-full bg-teal-500 text-gray-100 border-2 border-teal-500 hover:text-teal-500 hover:bg-white focus:outline-none">Kayıt ol</button>
						</div>
					</form>
				</div>
			</div>
		</>
	)
	
}