'use client';

import { useState, useEffect, useRef } from "react";
import Content from "./components/Content.tsx";
import TaskBar from "./components/TaskBar.tsx";
import Window from "./components/Window.tsx";
import { Props } from "react-rnd";
import App, { webApp } from "./types/App.tsx";
import Browser from "./components/apps/Browser.tsx";

type WindowData = {
	id: number;
	title: string;
	default: Props["default"];
	content: React.ReactNode;
	maximized: boolean;
	minimized: boolean;
	zIndex: number;
	isOpening: boolean;
	state?: {
		x: number;
		y: number;
		width: number;
		height: number;
	}
}

export default function Home() {
	const [windows, setWindows] = useState<WindowData[]>([]);

	useEffect(() => {
		const threeScript = document.createElement("script");
		const vantaScript = document.createElement("script");
		const backgroundScript = document.createElement("script");

		threeScript.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
		threeScript.type = "module";
		threeScript.onload = () => {
			vantaScript.src = "https://cdn.jsdelivr.net/npm/vanta/dist/vanta.waves.min.js";
			vantaScript.type = "module";
			vantaScript.onload = () => {
				backgroundScript.type = "text/javascript";
				backgroundScript.text = `
					VANTA.WAVES({
						el: ".VANTA",
					  mouseControls: false,
					  touchControls: false,
					  gyroControls: false,
					  minHeight: 200.00,
					  minWidth: 200.00,
					  scale: 1.00,
					  scaleMobile: 1.00,
					  color: 0x421c72,
					  shininess: 45.00,
					  waveHeight: 23.50,
					  waveSpeed: 0.80,
					})
				`;
				document.head.appendChild(backgroundScript);
			};
			document.head.appendChild(vantaScript);
		};
		document.head.appendChild(threeScript);

		return () => {
			if(threeScript) threeScript.remove();
			if(vantaScript) vantaScript.remove();
			if(backgroundScript) backgroundScript.remove();
		}
	}, []);
	const bringToFront = (id: number) => {
		setWindows((prevWindows) => {
			let max = topZ(prevWindows);
			return prevWindows.map(win => win.id === id ? { ...win, zIndex: win.zIndex === max ? max : max + 1 } : win);
		})
	}

	const topZ = (wins: WindowData[]): number => {
		let x = Number.MIN_VALUE;
		for (let win of wins) {
			if (win.zIndex > x) x = win.zIndex
		}

		return x;
	}

	const createWindow = (windowData: Omit<WindowData, "id" | "zIndex" | "maximized" | "minimized" | "isOpening" >): number => {
		const id = Date.now();
		setWindows((prevWindows) => {
			const newWindow: WindowData = { ...windowData, zIndex: topZ(windows) + 1, id, maximized: false, minimized: false, isOpening: false };
			return [...prevWindows, newWindow];
		});
		return id;
	}

	const closeWindow = (id: number) => {
		setWindows((prevWindows) => [...prevWindows.filter(w => w.id !== id)]);
	}

	const maximizeWindow = (id: number) => {
		setWindows((prevWindows) => prevWindows.map(win =>
			win.id === id ? { ...win, maximized: !win.maximized } : win
		));
		openAnim(id);
	}

	const minimizeWindow = (id: number) => {
		setWindows((prevWindows) => prevWindows.map(win => 
			win.id === id ? { ...win, minimized: !win.minimized} : win
		));
		openAnim(id);
	}

	const openAnim = (id: number) => {
		setWindows((prevWindows) => prevWindows.map(win => 
			win.id === id ? { ...win, isOpening: true }: win
		))
		setTimeout(() => {
			setWindows((prevWindows) => prevWindows.map(win => 
				win.id === id ? { ...win, isOpening: false }: win
			));
		}, 280)
	}

	const launchApp = (app: App) => {
		let id = createWindow({
			title: app.title, default: {
				x: 100,
				y: 100,
				width: window.innerWidth/2,
				height: window.innerHeight/4*3,
			}, content: (
				<div className="w-full h-[calc(100%-30px)] rounded-[inherit] rounded-t-none overflow-hidden">
					{app.content}
				</div>
			)
		});
		openAnim(id);
	}

	const rorApp = webApp("Realm of Riches", "https://realmofriches.org");
	const browserApp = Browser("Eternity Browser"); 

	return (
		<div className="VANTA w-[100vw] h-[100vh] bg-no-repeat bg-center bg-cover">
			<Content>
				<h1>Welcome to PortalOS</h1>
				<button onClick={() => {launchApp(rorApp); }}>
					Launch ROR
				</button><br />
				<button onClick={() => launchApp(browserApp)}>
					Launch Browser
				</button>
				{windows.map((window) => (
					<Window
						title={window.title}
						key={window.id}
						default={window.maximized ? { x: 0, y: 0, width: "100vw", height: "100vh" } : { ...window.default, ...window.state! } || window.default}
						zIndex={window.zIndex}
						className={`${window.minimized ?  'minimized' : window.isOpening ? "opening" : ""}`}
						maximize={() => maximizeWindow(window.id)}
						bringFront={() => { bringToFront(window.id) }}
						close={() => closeWindow(window.id)}
						minimize={() => { minimizeWindow(window.id); openAnim(window.id) }}
					>
						{window.content}
					</Window>
				))}

				{windows.map((window) => window.minimized && (
					<button key={window.id} onClick={() => { minimizeWindow(window.id) }}>{window.title}</button>
				))}
			</Content>
			<TaskBar apps={windows.filter(win => win.minimized)} launchApp={() => launchApp(webApp("PortalOS", "https://example.com"))}/>
		</div>
	);
}
