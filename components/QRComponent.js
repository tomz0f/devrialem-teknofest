import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

export default function QRComponent({text}){
	const [src, setSrc] = useState("an error has occured");

	useEffect(() => {
		QRCode.toDataURL(text).then((setSrc));
	}, []);

	return (
		<img src={src}/>
	);
}