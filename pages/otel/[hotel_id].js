// pages/hotel.js
import Head from 'next/head'
import Link from "next/link"
import Router from "next/router";
import Image from "next/image";
import React from "react";
import { useSession } from 'next-auth/react';

import 'chart.js/auto';
import { Doughnut } from 'react-chartjs-2';

import "tailwindcss/tailwind.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Radio, Space } from "antd";


import { useRouter } from 'next/router'
import { useState, useEffect, useRef, forwardRef } from 'react';
import { readHotel, updateUserProperties, updateMenuChoices } from "@lib/crud";
import { connectToDatabase } from '@lib/mongodb'

import Loader from "@components/Loader";
// import styles from '../styles/About.module.css'

export default function Hotel({ isConnected, theHotel, loading, setLoading }) {
	// registerLocale("tr", tr);
	// setDefaultLocale('tr');

	// const ImageEditor = (props) => {
	//   return (
	//     <Image
 //      		src={props.src}
 //      		alt={props.alt}
	// 		width={props.width}
	// 		height={props.height}
	// 	/>
	//     )
	// };


	// const [loading, setLoading] = useState(false);

	const router = useRouter();
	const { hotel_id } = router.query;
	// const [ theHotel, setTheHotel ] = useState({});
	const [dateError, setDateError] = useState(false);
	const [reservationStatus, setReservationStatus] = useState(false);
	const [menuChoice, setMenuChoice] = useState("meat");
	const componentMounted = useRef(true);
	const { data: session } = useSession();


	let todayDate = new Date();
	const [dateRange, setDateRange] = useState([new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate()), new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() + 1)]);
	const [startDate, endDate] = dateRange;
	// const [startDate, setStartDate] = useState(new Date(todayDate.getFullYear(),todayDate.getMonth(),todayDate.getDate()));
	// const [endDate, setEndDate] = useState(new Date(todayDate.getFullYear(),todayDate.getMonth(),todayDate.getDate() + 1));
	// const onDateChange = (dates) => {
	//   const [start, end] = dates;
	//   setStartDate(start);
	//   setEndDate(end);
	// };
	const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
		<button className="transition duration-300 ease-in-out bg-teal-600  text-white  hover:bg-teal-500 text-white font-bold py-2 px-4 rounded" onClick={onClick} ref={ref}>
			{value}
		</button>
	));


	const graph = {
		labels: [
		    'ET ÜRÜNLERİ',
		    'VEJETARYAN MENÜ',
		    'DENİZ ÜRÜNLERİ',
		    'GLUTENSİZ (ÇÖLYAK HASTALARI İÇİN)'
		],
		datasets: [{
		  data: [theHotel.menu_choices.meat, theHotel.menu_choices.veg, theHotel.menu_choices.sea, theHotel.menu_choices.glfree],
		  backgroundColor: [
		  '#FF6384',
		  '#36A2EB',
		  '#FFCE56',
		  '#DCDCDC'
		  ],
		  hoverBackgroundColor: [
		  '#FF6384',
		  '#36A2EB',
		  '#FFCE56',
		  '#DCDCDC'
		  ]
		}]
	};



	// useEffect(async () => {
	// 	if (componentMounted.current) {
	// 		console.log("theHotel: ", theHotel);
	// 		if (theHotel == null || theHotel == undefined) {
	// 			router.push("/")
	// 		}
	// 	}
	// 	return () => {
	// 		componentMounted.current = false;
	// 	}
	// }, []);
	// ******************** YILDILZ ********************
	// console.log(hotel_id);
	// console.log(theHotel.menu_choices);


	function reserve(_startDate, _endDate) {
		let credAmount;
		switch (menuChoice) {
			case "meat":
				credAmount = 20;
				break;
			case "veg":
				credAmount = 30;
				break;
			case "glfree":
				credAmount = 40;
				break;
			case "sea":
				credAmount = 50;
				break;
			default:
				credAmount = 0;
				break;
		}

		
		if (!_startDate || !_endDate) {
			setDateError(true);
		}
		else { // Successful reservation
			updateUserProperties({ usrname: session.user.username, newReservation: { hotel_id: hotel_id, hotel_name: theHotel.name, startDate: _startDate.getTime(), endDate: _endDate.getTime() }, creditAmount: credAmount }).then((result) => {
				session.user.reservations = { ...result.reservations };
				session.user.credit = result.userCredit;
			})
			updateMenuChoices({ hotelID: hotel_id, newChoiceChange: { which: menuChoice, count: 1 } }).then((result) => {
				// session.user.reservations = { ...result.reservations };
			})
			setReservationStatus(true);
		}
	}


	// theHotel = theHotel.hotel;
	return (
		// <div className="flex justify-center bg-green-600 min-h-screen">
		<>
			<Head>
				<title>Devrialem | {`${theHotel.name ? theHotel.name : "Otel sayfası"}`}</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className="container bg-white rounded shadow p-6 m-4 w-full lg:w-3/4">
				<h1 className="text-2xl font-bold text-grey-darkest">
					{`${theHotel.name ? theHotel.name : "ㅤ"}`}
				</h1>
				<h2 className="text-green-600 pt-4">
					{`${theHotel.description ? theHotel.description : "ㅤ"}`}
				</h2>
				<h2>
					<Image
						width={200}
						height={200}
						src={`/images/oteller/${theHotel.name.toLowerCase().replace(' ', '-')}.jpg`}
					/>
				</h2>

				{/* <Link href="/">
            <a className="">s
                <h2>Home &rarr;</h2>
            </a>
            </Link> */}


				<div className={"justify-items-center"}>
					<DatePicker
						// dateFormat="dd/MM/yyyy"
						todayButton="Bugün"
						dateFormat="PP"
						onChange={(update) => {
							if (update[0] && update[1]) {
								setDateError(false);
							}
							setDateRange(update);
						}}
						startDate={startDate}
						endDate={endDate}
						minDate={new Date()}
						maxDate={new Date(todayDate.getFullYear(), todayDate.getMonth() + 12, todayDate.getDate())}
						selectsRange={true}
						// showMonthYearDropdown
						showPopperArrow={false}
						monthsShown={2}
						calendarClassName={"w-full"}


						customInput={<ExampleCustomInput/>}
					/>
					<div style={{fontSize: '20px'}}>
						MENÜLER:
					</div>
					<Radio.Group
						onChange={(e) => {
							console.log(e.target.value);
							setMenuChoice(e.target.value);
						}}
						// optionType="button"
						// buttonStyle="solid"
						defaultValue={menuChoice}
						buttonStyle="solid">
						<div style={{display: "flex", alignItems: "center"}}>
							<div  style={{margin: 5}}><Radio.Button value="meat">ET</Radio.Button><br/><span><Image height={100} width={100} src="/images/et.jpg" /></span><br/><span>+20 Kredi</span></div>
							<div  style={{margin: 5}}><Radio.Button value="veg">VEGAN</Radio.Button><br/><span><Image height={100} width={100} src="/images/vegan.jpg"/></span><br/><span>+30 Kredi</span></div>
							<div  style={{margin: 5}}><Radio.Button value="glfree">GLUTENSİZ</Radio.Button><br/><span><Image height={100} width={100} src="/images/glutensiz.jpg"/></span><br/><span>+40 Kredi</span></div>
							<div  style={{margin: 5}}><Radio.Button value="sea">DENİZ</Radio.Button><br/><span><Image height={100} width={100} src= "/images/deniz-urunleri.jpg"/></span><br/><span>+50 Kredi</span></div>
							{/* <Radio.Button value="white">B</Radio.Button>
							<Radio.Button value="veg">C</Radio.Button> */}
						</div>

					</Radio.Group>
				</div>				<h2 className={`${dateError ? "" : "hidden"} text-red-600 pt-4`}>
					{`Geçerli bir tarih aralığı giriniz!`}
				</h2>
				<h2 className={`${reservationStatus ? "" : "hidden"} text-teal-600 pt-4`}>
					{`Rezervasyon başarılı!`}
				</h2>
				<a onClick={() => { reserve(startDate, endDate) }} className={`${session ? "" : "hidden"} transition duration-500 ease-in-out inline-block cursor-pointer text-md px-4 py-2 leading-none bg-teal-600 border-2 rounded text-white border-teal-600 hover:text-teal-600 hover:bg-transparent mt-4`}>Rezervasyon yap</a>
				<br/><br/>
				<h2>Eğer seçmekte zorlandıysan diğer insanların seçimine bir bak</h2>
				<h1>Menü seçimleri:</h1>
				<div width="400" height="400">
					<Doughnut 
						data={graph}
						width="400"
						height="400"
						options={{ maintainAspectRatio: false }}
					/>
				</div>
			</main>
		</>
		//  </div> 
	)
}



export async function getServerSideProps(context) {
	const { client, db } = await connectToDatabase()

	const isConnected = await client.isConnected()
	// const todoCollection = db.collection("todos");
	const hotelsColection = db.collection("hotels");

	// const todos = await todoCollection.find({}).toArray();
	const hotels = await hotelsColection.find({}).toArray();
	const { hotel: theHotel } = await readHotel(context.query.hotel_id);


	if (!theHotel) {
		return {
		  redirect: {
			destination: '/',
			permanent: false,
		  },
		}
	  }


	return {
		props: { isConnected, theHotel: JSON.parse(JSON.stringify(theHotel)) },
	}
}