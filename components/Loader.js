import "tailwindcss/tailwind.css";

export default function Loader() {
    return (
        <div className="fixed h-screen w-screen flex flex-col items-center justify-center bg-black bg-opacity-20 z-10">
            <img src="/loading.gif"></img>
        </div>
    )
}