import { getProviders, getSession, signIn } from "next-auth/react"
import { getCsrfToken } from "next-auth/react"
import Head from 'next/head';

export default function SignIn({ providers, csrfToken, loading, setLoading }) {
	setTimeout(() => {
		setLoading(false);
	}, 200);
	return (
		<>
			<Head>
				<title>Devrialem | Giriş</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<div className="container bg-white rounded shadow p-6 m-4 w-full lg:w-3/4">

				<div className="flex items-center justify-center ">

					<form className="w-full md:w-1/3 bg-white rounded-lg" method="post" action="/api/auth/callback/credentials">
						<h2 className="text-3xl text-center text-gray-700 mb-4">Giriş Formu</h2>
						<div className="px-12 pb-10 items-center justify-center">
						<input name="csrfToken" type="hidden" defaultValue={csrfToken} />
							<div className="w-full mb-2 flex items-center justify-center">
								<input name="username" type='text' placeholder="Kullanıcı Adı" className="-mx-6 px-8 w-full border rounded px-3 py-2 text-gray-700 focus:outline" />
							</div>
							<div className="w-full mb-2 flex items-center justify-center">
								<input name="password" type='password' placeholder="Şifre" className="-mx-6 px-8 w-full border rounded px-3 py-2 text-gray-700 focus:outline" />
							</div>
							<button type="submit" className="transition duration-500 ease-in-out w-full py-2 my-2 rounded-full bg-teal-500 text-gray-100 border-2 border-teal-500 hover:text-teal-500 hover:bg-white focus:outline-none">Giriş Yap</button>
						</div>
					</form>
				</div>
			</div>
		</>
	)
}

// SignIn.getInitialProps = async(context) => {
//   const {req, res} = context;
//   const session = await getSession({ req });

//   if (session && res && session.accessToken) {
//     return {
//       redirect: { destination: `/kullanici/${session.user.id}`},
//     };
//   }
//   return {
//     props: {
//       providers: await getProviders(),
//       csrfToken: await getCsrfToken(context),
//     },
//   }
// }


export async function getServerSideProps(context) {

	const { req, res } = context;
	const session = await getSession({ req });

	if (session && res) {
		return {
			redirect: { destination: `/kullanici/${session.user.id}` },
		};
	}
	return {
		props: {
			providers: await getProviders(),
			csrfToken: await getCsrfToken(context),
		},
	}
}