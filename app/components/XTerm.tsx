"use client";
import { FitAddon } from "@xterm/addon-fit";
import { Terminal } from "@xterm/xterm";
import { useRef, useEffect } from "react";
import { Ubuntu_Mono } from "next/font/google";
const mono = Ubuntu_Mono({weight: "700",subsets: ["latin"]});

export default function XTerm() {
	const termRef = useRef<HTMLDivElement>(null);
	const fitAddonRef = useRef<FitAddon | null>(null);
	const initialised = useRef(false);

	useEffect(() => {
		if(termRef.current && !initialised.current) {
			const term = new Terminal({
				theme: {
					background: "#222236",
					foreground: "#ffffff",
				},
				fontFamily: mono.style.fontFamily
			});

			fitAddonRef.current = new FitAddon();
			term.loadAddon(fitAddonRef.current);
			term.open(termRef.current);

			term.write("Welcome To Portal OS v0.1 beta");
			term.onKey(evv => {
				let e = evv.domEvent;
				if (e.key === "Enter") {
					term.write("\r\n");
				} else if (e.key === "Backspace") {
					term.write("\b \b");
				} else {
					term.write(e.key);
				}

			})

			fitAddonRef.current.fit();

			initialised.current = true;
		}

		}, [])

	return (
		<div ref={termRef} className="w-full h-full"></div>
	)
}
