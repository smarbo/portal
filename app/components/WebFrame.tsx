import React from "react";

interface WebFrameProps {
	src: string;
	width?: string;
	height?: string;
}

export default function WebFrame({src, width="100%", height="100%"}: WebFrameProps) {
	/*
	useEffect(() => {
		let script = document.createElement("script");
		script.src = "/bypass.js";
		script.type = "module";
		script.async = true;
		document.body.appendChild(script);

		return () => {
			document.body.removeChild(script);
		}
	}, [src]);
	*/


	return (
		<iframe
			src={`${src}`}
			width={width}
			height={height}
			style={{ border: "none" }}
			allowFullScreen
		></iframe>
	)
}
