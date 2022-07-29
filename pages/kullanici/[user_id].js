import Head from 'next/head'
import Link from "next/link"
import Router from "next/router";
import React from "react";
import "tailwindcss/tailwind.css";
// import {registerLocale, setDefaultLocale} from "react-datepicker";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import tr from "date-fns/locale/tr";
import { getSession, signIn, useSession } from "next-auth/react";

import { useRouter } from 'next/router'
import { useState, useEffect, useRef, forwardRef } from 'react';
import { connectToDatabase } from '@lib/mongodb'

import Loader from "@components/Loader";
import QRComponent from '@components/QRComponent';

import { readUser, updateUserProperties, fetchCertificate } from '@lib/crud';
import { server } from '@config/server_config';
// import styles from '@styles/About.module.css'

// import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';
// import fontkit from '@pdf-lib/fontkit'
// import { readFile, writeFile } from 'node:fs';

export default function User({ userFromDB, users, loading, setLoading }) {
	// registerLocale("tr", tr);
	// setDefaultLocale('tr');

	const componentMounted = useRef(true);
	const { data: session, status } = useSession(
		{
			required: true,
			onUnauthenticated() {

				if (componentMounted.current) {

					router.push(`/auth/giris`);
				}
				// return () => {
				//     componentMounted.current = false;
				//     setTimeout(() => {
				//         setLoading(false);
				//       }, 200);
				// }

			}
		}
	);


	var user;
	const router = useRouter();

	const { user_id } = router.query;
	// console.log("session: ", session);
	// if (!user_id) {
	//     useEffect(() => {
	//         if (componentMounted.current){

	//           setTimeout(() => {
	//             router.push(`${server}/api/auth/signin`);
	//           }, 200);

	//         }
	//         return () => {
	//             componentMounted.current = false;
	//             setTimeout(() => {
	//                 setLoading(false);
	//               }, 200);
	//         }


	//       }, []);
	// }



	if (status === "authenticated") {
		user = session.user;
		// readUser(user.username).then((result) => {
		// 	user = result.user;
		// 	session.user.reservations = user.reservations;
		// })
		setTimeout(() => {
			setLoading(false);
		}, 200);
		if (user_id != session.id) {
			router.push(`/kullanici/${session.id}`)
		}

	}

	// else if (status === "unauthenticated") {
	//     return (
	// 		<></>
	// 	)
	// }

	const UpdateLog = (props) => {
		if (props.success == "true") {
			<h2 style = {{ color: "green"}}>Kredi değişimi başarılı!</h2>
		} else if (props.success == "false") {
			<h2 style= {{ color: "red"}}>Kredi değişimi başarısız!</h2>	
		}
	} 
	const Reservations = (props) => {
		const isThisUserAdmin = props.isThisUserAdmin;
		if (isThisUserAdmin) {
			return <br/>;
		} else {
			return (
				<>
					<h2 className="text-xl underline font-bold text-gray-darkest pt-10">
					Rezervasyonlar:
				</h2>
				<ul className=" w-full">
					<li className="flex border-b-4 border-gray-500 font-bold" key="hotelsListHeader"><h1 className={"flex-none w-4/12 m-2 p-2 text-left truncate"} key="hotelsListHeader1">Otel</h1><h1 className={"flex-none w-4/12 my-2 py-2 text-left truncate"} key="hotelsListHeader2">Giriş</h1><h1 className={"flex-none w-4/12 my-2 py-2 text-left truncate"} key="hotelsListHeader3">Çıkış</h1></li>
					{
						(userFromDB && userFromDB.reservations && Object.keys(userFromDB.reservations).length) ? Object.keys(userFromDB.reservations).map((userKey, userIndex) => {

							let userReservations = userFromDB.reservations[userKey];
							return userReservations.map((reservation, reservationIndex) => {
								return (
									<Link href={`/otel/${reservation.hotel_id}`} key={`${reservation.hotel_id}_link_${reservationIndex}`}>
										<li className={"transition duration-500 ease-in-out flex items-center border-t-2 border-b-2 border-gray-300 ring-inset ring-teal-500 hover:ring-4 transform hover:scale-102 cursor-pointer"} key={`${reservation.hotel_id}_${reservationIndex}`}>

											<a className="flex-none w-4/12  m-2 my-4 p-2 py-3 truncate" key={`${reservation.hotel_name}_id_${reservationIndex}`}>
												{reservation.hotel_name}
											</a>

											<p className={`flex-none w-4/12 mr-6 pr-6 text-gray-500 truncate`} key={`${reservation.hotel_id}_startDate_${reservationIndex}`}>
												{new Date(reservation.startDate).toLocaleDateString("tr")}
											</p>

											<p className="flex-none w-4/12 -ml-6 -pl-6 mr-6 pr-6 text-gray-500 truncate" key={`${reservation.hotel_id}_endDate_${reservationIndex}`}>
												{new Date(reservation.endDate).toLocaleDateString("tr")}
											</p>

										</li>
									</Link>
								)
							})
						}) : ""
					}
				</ul>

				</>
			);
		}
	}
	const onSubmitButtonForm = (event) =>  {
		event.preventDefault();
		try {
			const data = {
				fuserCredit: event.target.fuserCredit.value,
				fcreditQuantity: parseInt(event.target.fcreditQuantity.value)
			};
			updateUserProperties({ usrname: data.fuserCredit, newReservation: null, creditAmount: data.fcreditQuantity }).then(response => {
				router.reload(window.location.pathname)
			})
			// incCredit(data.fuserCredit, data.fcreditQuantity); 

			return <UpdateLog success="true"/>
		} catch (event) {
			console.error('Error: Beklenmedik bir hata oluştu ve sunucuya baglanamadi ya da veri degistirilemedi.\nErr', event)
			return <UpdateLog success="false"/>
		}		
	}
	const AdminCreditManipulation = (props) => {
		const isThisUserAdmin = props.isThisUserAdmin;
		if (isThisUserAdmin) {
			return (
			<>
					<h2 className="text-xl underline font-bold text-gray-darkest pt-10">
						Admin Kredi Manipülasyonu:
					</h2>
					<form onSubmit={onSubmitButtonForm}>
						<label htmlFor="userForCreditManipulation" className = "text-gray-500 pt-4">Kredisi değiştirilecek kisi:</label><br/>
						<input style ={{border: "1px solid black", padding: '10px'}} id="userForCreditManipulation" name="fuserCredit" type="text" required /><br/>
						<label htmlFor="creditManipulationQuantity" className = "text-gray-500 pt-4">Kredisi degisim miktarı:</label><br/>
						<input style ={{border: "1px solid black", padding: '10px'}} id="creditManipulationQuantity" name="fcreditQuantity" type="text" required /><br/>
						<button type="submit"><a className={`${userFromDB.isAdmin ? "" : "hidden"} transition duration-500 ease-in-out inline-block cursor-pointer text-md px-4 py-2 leading-none bg-teal-600 border-2 rounded text-white border-teal-600 hover:text-teal-600 hover:bg-transparent mt-4`}>Kredi Manüplasyonunu Gerçekleştir!</a></button>
					</form>
			</>
			)} else { 
			return (<br/>)}
		};


	const decreaseCredit = () => {
		const someMath =  userFromDB ? (Math.floor(userFromDB.credit / 300) >= 1 ? Math.floor(userFromDB.credit / 300) : 0) : 0 // someMath :D
		const moreMath =  - (someMath * 300);
		updateUserProperties({ usrname: userFromDB.username, newReservation: null, creditAmount:  moreMath, donateAmount: someMath}).then(response => {
				router.reload(window.location.pathname)
			})
	}
	return (
		<>
			<Head>
				<title>Devrialem | {`${userFromDB ? userFromDB.name + " " + userFromDB.surname : "Kullanıcı"}`}</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className="container bg-white rounded shadow p-6 m-4 w-full lg:w-3/4">
				<h1 className="text-2xl font-bold text-grey-darkest">
					{`${userFromDB ? (userFromDB.name && userFromDB.surname ? userFromDB.name + " " + userFromDB.surname : "") : ""}`}
				</h1>
				<h2 className="text-gray-500 pt-4">
					Kullanıcı Adı: {`${userFromDB ? (userFromDB.username ? userFromDB.username : "") : ""}`}
				</h2>
				<h2 className="text-gray-500 pt-4">
					Kullanıcı ID'si: {`${userFromDB ? (userFromDB._id ? userFromDB._id : "") : ""}`}
				</h2>
				<h2 className="text-gray-500 pt-4">
					Kullanıcı Tipi: {`${userFromDB ? (userFromDB.isAdmin ? "Admin" : "Üye") : ""}`}
				</h2>
				<h2 className={`${userFromDB ? (userFromDB.isAdmin ? "hidden" : ""): "err"} text-gray-500 pt-4`}>
					Kredi Puanı: {`${userFromDB ? (userFromDB.credit != undefined ? userFromDB.credit : "") : ""}`}
				</h2>
				<h2 className={`${userFromDB ? (userFromDB.isAdmin ? "hidden" : ""): "err"} text-gray-500 pt-4`}>
					Şuana kadar yaptığın bağış sayısı: {`${userFromDB ? (userFromDB.donates != undefined ? userFromDB.donates : "") : ""}`}
				</h2>
				<h2 className={`${userFromDB ? (userFromDB.isAdmin ? "hidden" : ""): "err"} ${userFromDB ? (userFromDB.credit != undefined ? (Math.floor(userFromDB.credit / 300) >= 1 ? Math.floor(userFromDB.credit / 300) : "hidden"): "hidden") : "hidden"} text-gray-500 pt-4`}>
					Yapılabilecek Bağış Sayısı: {`${ userFromDB ? Math.floor(userFromDB.credit / 300) : ""}`}
				</h2>
				<h5 className={`${userFromDB ? (userFromDB.credit != undefined ? (Math.floor(userFromDB.credit / 300) >= 1 ? Math.floor(userFromDB.credit / 300) : "hidden"): "hidden") : "hidden"} text-gray-500`}>
					Not: Bağışlar her 300 kredide bir yapılır. Ve sertifikanı indir butonuna bastığın an toplam kredinin 300' e bölümü kadar buraya harcanır.
				</h5>
				<h2>
					<a target='_blank' href='/images/certificate/certificate.pdf'>
						<button className={`${userFromDB ? (userFromDB.isAdmin ? "hidden" : ""): "err"} ${userFromDB ? (userFromDB.credit != undefined ? (Math.floor(userFromDB.credit / 300) >= 1 ? Math.floor(userFromDB.credit / 300) : "hidden"): "hidden") : "hidden"} transition duration-500 ease-in-out inline-block cursor-pointer text-md px-4 py-2 leading-none bg-teal-600 border-2 rounded text-white border-teal-600 hover:text-teal-600 hover:bg-transparent mt-4`}
							onClick={decreaseCredit}
						>
								Sertifikanı indir!
						</button>
					</a>
				</h2>
				{/*
					<h2 className={`${userFromDB ? (userFromDB.isAdmin ? "hidden" : ""): "err"} text-gray-700 pt-4`}>
						Kişisel Token: {`${userFromDB ? (userFromDB.code != undefined ? userFromDB.code : "") : ""}`}
					</h2>
				*/}
				<h2 className={`${userFromDB ? (userFromDB.isAdmin ? "hidden" : ""): "pb-1"} text-gray-700 pt-1 mt-3`}>
					Karekodla Giriş için Kişisel Karekod'un: <br/>
					<QRComponent text={`${userFromDB ? (userFromDB.code != undefined ? userFromDB.code : "") : ""}`} />					  
				</h2>
				<AdminCreditManipulation isThisUserAdmin={userFromDB && userFromDB.isAdmin}/>
				<Reservations isThisUserAdmin={userFromDB && userFromDB.isAdmin}/>

				{/* <h2 className="text-green-600 pt-4">
                Rezervasyonları: {`${user ? ((user.reservations && Object.keys(user.reservations).length) ? 
				Object.keys(user.reservations).map((key, index)=>{
					return (
						"a"
					)
				}) +
                Object.keys(user.reservations).map((key, index)=>{
                  return user.reservations[key]["hotel_id"]
                }) + " id'li otele "+
                Object.keys(user.reservations).map((key, index)=>{
                  return user.reservations[key]["startDate"]
                })+ " tarihinde başlayıp "+
                Object.keys(user.reservations).map((key, index)=>{
                  return user.reservations[key]["endDate"]
                })+ " tarihinde biten bir rezervasyonunuz var." : " Henüz hiç rezervasyonunuz yok.") : ""}`}
            </h2> */}

			</main>
		</>
	)
}

export async function getServerSideProps(context) {
	const { client, db } = await connectToDatabase()


	const isConnected = await client.isConnected()
	const usersColection = db.collection("users");

	const users = await usersColection.find({}).toArray();
	const user = await usersColection.findOne({ _id: parseInt(context.query.user_id) })

	return {
		props: { userFromDB: JSON.parse(JSON.stringify(user)), users: JSON.parse(JSON.stringify(users)) },
	}
}
// -----------PDF SECTION-----------
// const getCertificate = async () => {
// 	  const url = `${server}/fonts/TimesNewRoman/TimesNewRoman.ttf`
//   	const fontBytes = await fetch(url).then(res => res.arrayBuffer())
// 		const pdfDoc = await PDFDocument.create()

// 	  pdfDoc.registerFontkit(fontkit)
// 		const customFont = await pdfDoc.embedFont(fontBytes)
// 	  const page = pdfDoc.addPage([600, 400])
	  
// 	  //   x: page.getWidth() / 2 page.setFont(timesRomanFont)
// 	  page.drawText('Bagis Sertifikasi', { x: 60, y: 360, size: 50 })
// 	  page.drawText(`Merhaba ${userFromDB.name +' '+ userFromDB.surname}.`,
// 	   { x: 125,
// 			 y: 330,
// 			 size: 17,
// 			 font: customFont
// 		 })
// 	  page.drawText(`Öncelikle tebrikler! Hem tasarrufda bulundun ve kaynaklari hor kullanmadin ${userFromDB.name}.`,
// 	   { x: 125,
// 	     y: 330,
// 	     size: 17,
// 	     font: customFont
// 	   })
// 	  page.drawText('Simdi ise topladigin tasarruf kredileriyle ise Çocuk Esirgeme Kurumuna bagista bulunuyorsun.',
// 	   { x: 125,
// 	     y: 320,
// 	     size: 17,
// 	     font: customFont,
// 	   })

// 	  // page.drawImage(jpgImage, - jpgDims.width / 2,
// 	  //   y: page.getHeight() / 2 - jpgDims.height / 2 + 250,
// 	  //   width: jpgDims.width,
// 	  //   height: jpgDims.height,
// 	  // })

// 	  // Set metadata of files :)
// 	  // Note that these fields are visible in the "Document Properties" section of 
// 	  // most PDF readers.
// 	  pdfDoc.setTitle('Ödül ve Bagis Sertifikaniz')
// 	  pdfDoc.setAuthor('Yigit GÜMÜS')
// 	  pdfDoc.setSubject('Sen çok tasarruflu ve ayni zamanda yufka yürekli bir insansin :)')
// 	  pdfDoc.setKeywords(['tasarruf', 'bagis', 'çocuk esirgeme kurumu', 'iyilik', 'devrialem', 'teknofest'])
// 	  pdfDoc.setProducer('YG')
// 	  pdfDoc.setCreator('pdf-lib (https://github.com/Hopding/pdf-lib)')
// 	  pdfDoc.setCreationDate(new Date())
// 	  pdfDoc.setModificationDate(new Date())

// 	  const pdfBytes = await pdfDoc.save();
// 	  writeFile(`${userFromDB ? userFromDB.username: "err"}_certificate.pdf`);
// 	}