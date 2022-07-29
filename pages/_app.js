import { useState } from "react";
import Router from "next/router";
import { useRouter } from "next/router";
import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";
// const router = useRouter();

import Loader from "@components/Loader";
import Navbar from "@components/Navbar";
import Home from ".";
import "@styles/globals.css";

import { registerLocale, setDefaultLocale } from "react-datepicker";
import tr from "date-fns/locale/tr";

import "tailwindcss/tailwind.css";
// import "antd/dist/antd.css";

function MyApp({ Component, pageProps }) {
	registerLocale("tr", tr);
	setDefaultLocale('tr');

	const { pathname } = useRouter();

	useEffect(() => {
		setLoading(false);
	}, [pathname]);

	const [loading, setLoading] = useState(true);

	Router.events.on("routeChangeStart", (url) => {
		//   console.log("Route is changing");
		setLoading(true);
	});

	Router.events.on("routeChangeComplete", (url) => {
		//   console.log("Route is complete");
		setLoading(false);
	});

	let args = { ...pageProps };
	args.loading = loading;
	args.setLoading = setLoading;

	pageProps = args;
	// {setLoading(true)}

	return (
		<SessionProvider>
			<>
				{loading && <Loader />}
				<div className={"flex flex-col min-h-screen"}>
					<Navbar />
					<div className="flex flex-grow justify-center bg-teal-600">
						<Component {...pageProps} />
					</div>
				</div>
			</>
		</SessionProvider>
	);
}

export default MyApp;
