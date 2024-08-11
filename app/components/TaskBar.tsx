import { useEffect, useRef, useState } from "react";
import { WindowData } from "../page.tsx";
import { TbHexagon3D as Icon } from "react-icons/tb";
import { Ubuntu_Mono } from "next/font/google";
import App from "../types/App.tsx";
import { IoCog, IoPower, IoEarth, IoLogoGithub, IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa6";
import { PiDotsThreeCircleVertical } from "react-icons/pi";

const mono = Ubuntu_Mono({ weight: "700", subsets: ["latin"]});

type TaskBarProps = {
	windows: Array<WindowData>;
	launchApp: (app: App) => void;
	shortcuts: Array<App>;
	browser: App;
	minimize: Function;
}

type MenuProps = {
	open: boolean;
	shortcuts: Array<App>;
	launchApp: (app: App) => void;
	closeMenu: Function;
	browser: App;
	taskbarRef: React.RefObject<HTMLDivElement>;
}

function TaskbarMenu(props: MenuProps) {
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClick = (e: any) => {
			if (
				menuRef.current &&
				props.taskbarRef.current &&
				!menuRef.current.contains(e.target) &&
				!props.taskbarRef.current.contains(e.target)
			) {
				props.closeMenu();
			}
		}
		
		window.addEventListener("mousedown", handleClick)

		return () => {
			window.removeEventListener("mousedown", handleClick)
		}
	}, []);

	let menuStyle = `${props.open ? "menuopen" : "menuclose"}
				bg-gray-300 bg-clip-padding backdrop-filter
				backdrop-blur-md bottom-[42px] bg-opacity-10 hover:bg-opacity-30
				border rounded-lg border-gray-100 flex-col py-4 rounded-x5l left-[10px] absolute MENU w-[300px] h-[400px] `
	return (
		<div className={menuStyle} ref={menuRef}>
			<div className="text-center text-white w-full h-[20%]">
				Welcome,  
				<span className={`${mono.className} text-pink-400`}> @</span>
				<span className={`${mono.className} text-green-400`}>eddie</span>
				<div className="w-[85%] bg-white h-[1px] left-[50%] translate-x-[-50%] relative bottom-[-12px]"></div>
			</div>
			<h1 className="pl-4 text-white">Recommended Apps</h1>
			<div className="overflow-hidden py-2 px-2 space-x-2 flex max-w-full h-[110px]">
				{
					props.shortcuts.map((s,i) => 
						<MenuShortcut key={i} launcher={() => {props.launchApp(s)}} title={s.title} iconURL={s.iconURL} />
					)
				}
			</div>
			<div className="flex absolute text-white text-xl items-center bg-gray-400 border-solid border-[1px] border-white bg-opacity-20 left-[50%] translate-x-[-50%] rounded-[inherit] bottom-[10px] w-[calc(100%-20px)] h-[40px]">
				<div className="flex space-x-4 pl-2 items-center">
					<button onClick={()=>window.close()}><IoPower /></button>
					<button><IoCog /></button>
					<button><IoNotifications /></button>
				</div>
				<div className="left-[50%] -translate-x-[50%] flex absolute justify-center items-center">
					<button><FaUser size={25}/></button>
				</div>
				<div className="left-[50%] translate-x-[33%] space-x-4 flex absolute justify-end pr-2 items-center">
					<button onClick={()=>{window.open("https://github.com/smarbo/portal", "_blank")}}><IoLogoGithub /></button>
					<button onClick={()=>props.launchApp(props.browser)}><IoEarth /></button>
					<button><PiDotsThreeCircleVertical size={25}/></button>
				</div>
			</div>
		</div>
	)
}

type ShortcutProps = {
	title: string;
	iconURL: string;
	launcher: Function;
}

function MenuShortcut(props: ShortcutProps) {
	return (
		<div onClick={() => props.launcher()} className=" rounded-lg bg-gray-400 bg-opacity-50 flex flex-col justify-center items-center w-[74px] h-full">
			<div style={{ backgroundImage: `url(${props.iconURL})`}}
				className="w-[64px] h-[54px] bg-contain bg-no-repeat bg-center"
			></div>
			<h1 className={"text-white font-bold text-[12px] text-center line-clamp-2"}>{props.title}</h1>
		</div>
	)
}

function timeString(): string {
	let date = new Date();
	let hn = date.getHours();
	//if (hn > 12) hn -= 12; // 12hr
	let hh, mm, ss = "";
	let mn = date.getMinutes();
	let sn = date.getSeconds();
	//hh = hn.toString(); // 12hr
	hh = (hn < 10 ? '0' : '') + hn.toString();// 24hr
	mm = (mn < 10 ? '0' : '') + mn.toString();
	ss = (sn < 10 ? '0' : '') + sn.toString();
	return `${hh}:${mm}:${ss}`;
}

export default function TaskBar(props: TaskBarProps) {
	const [menuOpen, setMenuOpen] = useState(false);
	const [dateStr, setDateStr] = useState("");
	const taskbarRef = useRef<HTMLDivElement>(null);

	setInterval(() => {
		setDateStr(timeString());
	}, 1000);

	let barStyle = `
		w-full h-[32px] absolute bottom-0
		flex items-center space-x-4
	`;

	let subBarStyle = `
		bg-[rgba(0,0,0,0.25)]
		h-full
		rounded-t-2xl
	`

	return (
		<div className={`${barStyle}`} ref={taskbarRef}>
			<div className={`${subBarStyle} rounded-tl-none flex items-center min-w-fit`}>
				<TaskbarMenu browser={props.browser} taskbarRef={taskbarRef} closeMenu={() => {setMenuOpen(false)}} shortcuts={props.shortcuts} launchApp={props.launchApp} open={menuOpen} />
				<button onClick={() => {setMenuOpen(!menuOpen)}} className="rounded-2xl focus:outline-none hover:text-blue-400 text-white transition-all hover:bg-[rgba(255,255,255,0.25)] w-[32px] h-[32px] p-[2px]">
					<Icon className="w-full h-full" />
				</button>
				<h1 className={`${mono.className} px-2 grow text-white text-center`}>{dateStr}</h1>
			</div>
			<div className={`${subBarStyle}
				overflow-x-auto
				overflow-y-hidden grow 
				flex justify-center items-center
				whitespace-nowrap
				`}>
					{
				props.windows.map((window) => (
					<button style={{ backgroundImage: `url(${window.iconURL})`}} className="rounded-lg m-[2px] bg-cover transition-all hover:bg-[rgba(255,255,255,0.25)] bg-center bg-no-repeat min-w-[28px] min-h-[28px]" key={window.id} onClick={() => { props.minimize(window.id) }}></button>
				))
			}
			
			</div>
			<div className={`${subBarStyle} rounded-tr-none flex justify-center items-center px-2 overflow-ellipsis max-w-[25%] min-w-fit`}>
				<h1 className={`${mono.className} text-center text-pink-400 overflow-hidden overflow-ellipsis`}>
					<span className="text-green-400">eddie</span>@
					<span className="text-blue-400">portal.local</span></h1>
			</div>
		</div>
	)
}
