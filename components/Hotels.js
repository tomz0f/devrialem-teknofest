// import { completeTodo, deleteTodo } from "@lib/crud";
import Link from "next/link"
import "tailwindcss/tailwind.css";

const Hotels = ({ allHotels, setAllHotels }) => {
    
    return (

        <ul className="pt-8 w-full">
            <li className="flex border-b-4 border-gray-500 font-bold" key="hotelsListHeader"><h1 className={"flex-none w-3/12 m-2 p-2 text-left truncate"} key="hotelsListHeader1">Otel</h1><h1 className={"flex-none w-2/12 my-2 py-2 text-left truncate"} key="hotelsListHeader2">ID</h1><h1 className={"flex-none w-2/12 my-2 py-2 text-left truncate"} key="hotelsListHeader3">Fiyat</h1><h1 className={"flex-none w-5/12 my-2 py-2 text-left truncate"} key="hotelsListHeader4">Açıklama</h1></li>
            {allHotels.map((hotel) => {
				return (
                <Link href={`/otel/${hotel._id}`} key={`${hotel._id}_link`}>
                    <li className={"transition duration-500 ease-in-out flex items-center border-t-2 border-b-2 border-gray-300 ring-inset ring-teal-500 hover:ring-4 transform hover:scale-102 cursor-pointer"} key={hotel._id}>

                        <a className="flex-none w-3/12  m-2 my-4 p-2 py-3 truncate" key={`${hotel._id}_name`}>
                            {hotel.name}
                        </a>

                        <p className={`flex-none w-2/12 mr-6 pr-6 text-gray-500 truncate`} key={`${hotel._id}_id`}>
                            {hotel._id}
                        </p>

						<p className={`flex-none w-2/12 mr-6 pr-6 -ml-6 -pl-6 text-gray-500 truncate`} key={`${hotel.price}_price`}>
                            {hotel.price}
                        </p>

                        <p className="flex-none w-5/12 -ml-6 -pl-6 mr-6 pr-6 text-red-500 truncate" key={`${hotel._id}_description`}>
                            {hotel.description}
                        </p>

                    </li>
                </Link>
				)
            })}
        </ul>
    );
};

export default Hotels;

// {<table className={"pt-8 w-full justify-center items-center"}>{/* w-full */}
// <tbody className={""}>
//     <tr><th className={"m-4 p-4 text-left"}>Otel</th><th className={"m-4 p-4 text-left"}>ID</th><th className={"m-4 p-4 text-left"}>Açıklama</th></tr>
    
    
//     {allHotels.map((hotel) => (
        
//         <tr key={hotel._id} className={"bg-gray-100 border-2 rounded-lg border-gray-300"}>
//             <td
//                 className={"m-4 p-4"}
//             >
//                 {/* {href = } */}
//                 <Link href={`/hotel/${hotel._id}`}>
//                     <a className="">
//                         {hotel.Name}
//                     </a>
//                 </Link>
            
//             </td>
//             <td
//                 className={"m-4 p-4"}
//             >
//             {hotel._id}
//             </td>
//             <td
//                 className={"m-4 p-4"}
//             >
//             {hotel.Description}
//             </td>
//         </tr>
        
        
//     ))}
    
// </tbody>
// </table>}