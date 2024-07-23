import Image from "next/image";
import App, { webApp } from "../types/App.tsx";

type TaskBarProps = {
	launchApp: (app: App) => void;
}

type ShortcutProps = {
	launchApp: (app: App) => void;
	app: App;	
}

function Shortcut(props: ShortcutProps) {
	return (
			<button onClick={() => props.launchApp(props.app)}
				className="h-full w-[48px] flex items-center justify-center transition-colors duration-300 hover:bg-[rgba(255,255,255,0.25)]"><Image alt="Logo" src={props.app.iconURL} width={42} height={1}/></button>
	)
}

export default function TaskBar(props: TaskBarProps) {
	let barStyle = `
		w-full h-[48px] absolute bottom-0 
		bg-[rgba(0,0,0,0.5)]
	`;
	let apps: Array<App> = [
		webApp("PC App 123", "https://munchbox.vercel.app")
	]

	return (
		<div className={`${barStyle} flex items-center space-x-2`}>
			<Shortcut app={apps[0]} launchApp={props.launchApp} />
		</div>
	)
}
