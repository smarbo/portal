import { useState } from "react";
import { WindowData } from "../page.tsx";
import { CgMenuRound } from "react-icons/cg";

type TaskBarProps = {
	windows: Array<WindowData>;
	minimize: Function;
}

export default function TaskBar(props: TaskBarProps) {
	const [menuOpen, setMenuOpen] = useState(false);

	let barStyle = `
		w-full h-[32px] absolute bottom-0 
		bg-[rgba(0,0,0,0.5)]
	`;

	return (
		<div className={`${barStyle} flex items-center `}>
			<div className={`${menuOpen ? "opacity-1" : "opacity-0"} bg-gray-300 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10 hover:bg-opacity-30 border border-gray-100 bottom-[42px] rounded-xl left-[10px] absolute MENU w-[300px] h-[400px] `}></div>
					<button onClick={() => {setMenuOpen(!menuOpen)}} className="focus:outline-none hover:text-blue-400 text-white transition-all hover:bg-[rgba(255,255,255,0.25)] w-[32px] h-[32px] p-[2px]"><CgMenuRound className="w-full h-full" /></button>
				{
				props.windows.map((window) => (
					<button style={{ backgroundImage: `url(${window.iconURL})`}} className="rounded-lg m-[2px] bg-cover transition-all hover:bg-[rgba(255,255,255,0.25)] bg-center bg-no-repeat w-[28px] h-[28px]" key={window.id} onClick={() => { props.minimize(window.id) }}></button>
				))
			}
		</div>
	)
}
