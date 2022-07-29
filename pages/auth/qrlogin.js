import React, { useState, useEffect, useRef } from 'react';
import { QrReader } from 'react-qr-reader';
import "tailwindcss/tailwind.css";
import { readUserFromToken } from '@lib/crud';

export default function QrLogin(props) {
	const initmsg = "LÜTFEN KAMERAYA KİŞİSEL KAREKODUNUZU OKUTUN";
	const [tokenData, setTokenData] = useState(initmsg);

	useEffect(() => {
		readUserFromToken(tokenData)
	}, [tokenData]);

	return (
		<>
			<main className="container bg-white rounded shadow p-6 m-4 w-full lg:w-3/4">
				<QrReader
					delay={300}
					onResult={(result, error) => {
						if (!!result) {
							setTokenData(result.text);
						}
						if (!!error) {
							console.error(error);
						}
					}}
					style={{ width: '100%' }}
				/>
				<p style={tokenData == initmsg ? { fontSize: '40px' } : { fontSize: '25x' }}>{`${tokenData != initmsg ? `Giriş isteği algılandı!\nKod:${tokenData}` : initmsg}`}</p>
				<p className={`${tokenData != initmsg ? "" : "hidden"}`} style={{ fontSize: '25px', textAlign: 'center' }}>Giriş yapılıyor...</p>
			</main>
		</>
	);
}