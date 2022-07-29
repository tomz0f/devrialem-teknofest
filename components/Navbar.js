import Link from "next/link"
import "tailwindcss/tailwind.css";
import tailwindConfig from "tailwind.config";
import { signOut, useSession } from "next-auth/react"

import { useRouter } from "next/router";

export default function Navbar() {
    const { data: session } = useSession();

    const router = useRouter();
    /*
     <div className="block lg:hidden">
     <button className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white">
     <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
     </button>
     </div>
    */
    //{//text-white border-b-4 border-transparent transform hover:-translate-y-1 hover:border-teal-600 mr-4 | OTELLER BUTTON}

    return (

        <nav className={"flex items-center justify-between flex-wrap bg-teal-500 p-6 z-20"}>{/*w-full lg:w-3/4*/}

            <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
                <div className="text-md lg:flex-grow">
                    <Link href="/"><a className={"transition duration-500 ease-in-out block mt-4 lg:inline-block lg:mt-0 transition duration-500 ease-in-out inline-block cursor-pointer text-md px-4 mr-4 mt-2 py-2 leading-none border-2 rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0"}>Oteller</a></Link>
                </div>
                <div className={`${session ? "hidden" : ""}`}>
                    <Link href="/auth/qrlogin"><a className={"transition duration-500 ease-in-out inline-block cursor-pointer text-md px-4 mr-4 mt-2 py-2 leading-none border-2 rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0"}>Karekodla giriş</a></Link>
                </div>
                <div className={`${session ? "hidden" : ""}`}>
                    <Link href="/auth/kayitol"><a className={"transition duration-500 ease-in-out inline-block cursor-pointer text-md px-4 mr-4 mt-2 py-2 leading-none border-2 rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0"}>Kayıt Ol</a></Link>
                </div>
                
                <div>
                    <div className={`${session ? "" : "hidden"} inline-block`}>
                        <Link href={`${session ? (session.user ? "/kullanici/" + session.user.id  : "") : "/"}`}><a className={`transition duration-500 ease-in-out inline-block cursor-pointer ${session ? "" : "hidden"} text-md px-4 py-2 leading-none  text-white border-2 rounded-lg border-teal-500 hover:border-white hover:text-teal-500 hover:bg-white mt-4 mr-4 lg:mt-0`}>{`${session ? (session.user ? session.user.name + " " + session.user.surname : "") : ""}`}</a></Link>
                    </div>

                    <div className={`${session ? "hidden" : ""} inline-block`}>
                        <Link href="/auth/giris"><a className={"transition duration-500 ease-in-out inline-block cursor-pointer text-md px-4 py-2 leading-none border-2 rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0"}>{session ? "Çıkış" : "Giriş"}</a></Link>
                    </div>
                    <a onClick={() => {signOut({callbackUrl: "/"})}} className={`${session ? "" : "hidden"} transition duration-500 ease-in-out inline-block cursor-pointer text-md px-4 py-2 leading-none border-2 rounded text-white border-red-600 hover:border-transparent  hover:bg-red-600 mt-4 lg:mt-0`}>{session ? "Çıkış" : "Giriş"}</a>
                </div>
            </div>

        </nav>

    )
}