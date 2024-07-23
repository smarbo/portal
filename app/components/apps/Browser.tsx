import { useState } from "react";
import { FaArrowRotateRight, FaHouse, FaArrowLeft } from "react-icons/fa6";
import WebFrame from "../WebFrame";
import App, { classicApp } from "@/app/types/App";

function isURL(string: string): boolean {
	try {
		new URL(string);
		return true;
	} catch(e) {
		return false;
	}
}

function BrowserNode() {
	const homeURL = "https://www.google.com/webhp?igu=1";
	const [inputValue, setInputValue] = useState("");
	const [history, setHistory] = useState([homeURL]);
	const [currentURL, setCurrentURL] = useState(homeURL);
	const [key, setKey] = useState(0);

	function handleChange (e: any) {
		setInputValue(e.target.value);
	}

	function loadPage (url: string) {
		if(isURL(url)) {
			setCurrentURL(url);
			setHistory(prev => [...prev, url]);
			reload();
		} else{
			const searchURL = `https://www.google.com/search?q=${url}&igu=1`;
			setCurrentURL(searchURL);
			setHistory(prev => [...prev, searchURL]);
			reload();
		}
	}

	function reload() {
		setKey(prev => prev + 1);
	}

	function home() {
		setCurrentURL(homeURL);
		setHistory([homeURL]);
		reload();
	}

	function undo() {
		if(history.length > 1) {
			let newHistory = [...history];
			newHistory.pop();
			setCurrentURL(newHistory[newHistory.length - 1]);
			setHistory(newHistory);
			reload();
		}
	}

	return (
		<div className="w-full h-full flex flex-col">
			<div className="SEARCH px-4 space-x-2 bg-gradient-to-t from-gray-700 to-gray-400 w-full h-[48px] flex items-center">
				<button className={`w-[32px] h-[32px] ${history.length > 1 ? "cursor-pointer" : "cursor-default"}`} onClick={() => undo()}><FaArrowLeft className={history.length > 1 ? "text-white" : "text-gray-700"} /></button>
				<button className="w-[32px] h-[32px]" onClick={() => home()}><FaHouse color="white" /></button>
				<button className="w-[32px] h-[32px]" onClick={() => reload()}><FaArrowRotateRight color="white" /></button>
				<input className={`
					grow rounded-md border-none
					min-w-1
					focus:outline-none shadow-lg px-6 mx-8
					whitespace-nowrap overflow-ellipsis`} 
					placeholder="Search or visit a URL..."
					value={inputValue}
					prefix="A"
					onChange={handleChange}
					onKeyDown={(e) => { if(e.key === "Enter") loadPage(inputValue) }}
				/>
			</div>
			<div className="bg-gradient-to-b from-gray-700 to-gray-500 w-full h-[32px] flex flex-row items-center pl-4 space-x-2">
				<ToolbarShortcut setURL={loadPage} domain="https://en.wikipedia.org"/>
				<ToolbarShortcut setURL={loadPage} domain="https://www.google.com" suffix="/webhp?igu=1" />
				<ToolbarShortcut setURL={loadPage} domain="https://archive.org" />
				<ToolbarShortcut setURL={loadPage} domain="https://dustinbrett.com" />
			</div>
			<WebFrame key={key} src={currentURL} />
		</div>
	);
}

function ToolbarShortcut({ domain, suffix, setURL }: { domain: string, suffix?: string, setURL: Function }) {
	return (
		<button onClick={() => {setURL(`${domain}${suffix || ""}`)}} style={{backgroundImage: `url(${domain}/favicon.ico)`}} className={`bg-cover rounded-[50%] w-[20px] h-[20px]`}></button>
	)
}

export default function Browser(title: string): App {
	return classicApp(title, <BrowserNode />);
}
