import { ReactNode } from "react";
import WebFrame from "../components/WebFrame";

type App = {
	content: ReactNode,
	title: string,
	iconURL: string,
}

export function webApp(title: string, url: string, iconURL?: string): App {
	let newApp: App = {
		title,
		content: (
			<WebFrame src={url} />
		),
		iconURL: iconURL || "https://www.svgrepo.com/show/321236/portal.svg"
	}

	return newApp;
}

export function classicApp(title: string, content: ReactNode, iconURL?: string): App {
	let newApp: App = {
		title,
		content: (
			<div className="w-full h-full rounded-[inherit]">
				{content}
			</div>	
		),
		iconURL: iconURL || "https://www.svgrepo.com/show/321236/portal.svg"
	}

	return newApp;
}

export default App;

