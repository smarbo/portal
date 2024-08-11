'use client';

import { useState, useEffect, useRef } from "react";
import Content from "./components/Content.tsx";
import TaskBar from "./components/TaskBar.tsx";
import Window from "./components/Window.tsx";
import { Props } from "react-rnd";
import App, { classicApp, webApp } from "./types/App.tsx";
import Browser from "./components/apps/Browser.tsx";
import Loading from "./components/Loading.tsx";
import dynamic from "next/dynamic";
const XTerm = dynamic(()=>import("./components/XTerm.tsx"));

export type WindowData = {
	id: number;
	title: string;
	default: Props["default"];
	content: React.ReactNode;
	maximized: boolean;
	minimized: boolean;
	zIndex: number;
	isOpening: boolean;
	iconURL: string;
	state?: {
		x: number;
		y: number;
		width: number;
		height: number;
	}
}

export default function Home() {
	const [windows, setWindows] = useState<WindowData[]>([]);
	const [loaded, setLoaded] = useState<boolean>(false);

	useEffect(() => {
		const threeScript = document.createElement("script");
		const vantaScript = document.createElement("script");
		const backgroundScript = document.createElement("script");

		threeScript.src = "/three.js";
		threeScript.type = "module";
		threeScript.onload = () => {
			vantaScript.src = "/waves.js";
			vantaScript.type = "module";
			vantaScript.onload = () => {
				backgroundScript.src = "/vantaSetup.js"
				document.head.appendChild(backgroundScript);
				setLoaded(true);
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

	const createWindow = (windowData: Omit<WindowData, "id" | "zIndex" | "maximized" | "minimized" | "isOpening">): number => {
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
			title: app.title, iconURL: app.iconURL, default: {
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
	const munchboxApp = webApp("Munchbox", "https://munchbox.vercel.app");
	const wikiApp = webApp("Wikipedia", "https://en.wikipedia.org");
	const doomApp = webApp("Doom", "/doom/index.html", "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/i/efd55d2f-11a4-4df1-9bf7-1eccd3ebb813/d3hsp3f-094f83e1-40a9-4d57-a31d-31a74c7cac89.png");
	const eternityApp = Browser("Eternity"); 
	const terminalApp = classicApp("Terminal", (
		<XTerm />
	))

	const menuShortcuts = [
		rorApp,
		doomApp,
		eternityApp,
		wikiApp,
	]; // maximum 4;

	return (
		<>
			{
				(() => {
					if(!loaded){
						return (
							<Loading />
						)
					}
				})()
			}
			<div className="VANTA absolute w-[100vw] h-[100dvh] bg-no-repeat bg-center bg-cover">
				<Content>
					<h1>Welcome to PortalOS</h1>
					<button onClick={() => {launchApp(terminalApp); }}>
						Launch Terminal
					</button><br />
					<button onClick={() => launchApp(eternityApp)}>
						Launch Browser
					</button><br />
					<button onClick={() => launchApp(munchboxApp)}>
						Launch Munchbox
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


				</Content>
				<TaskBar browser={eternityApp} shortcuts={menuShortcuts} launchApp={launchApp} minimize={minimizeWindow} windows={windows} />
			</div>
		</>
	);
}
