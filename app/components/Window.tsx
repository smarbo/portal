'use client';

import { useState } from "react";
import { Props, Rnd } from "react-rnd";

type WindowProps = {
	default?: Props["default"];
	className?: Props["className"];
	children?: Props["children"];
	maximize: Function;
	minimize: Function;
	title: string;
	zIndex: number;
	bringFront: Function;
	close: Function;
	//openAnim: Function;
};

export default function Window({
	title: title, maximize: maximize,
	minimize: minimize, default: defaultProps,
	className: className, children: children,
	close: close, bringFront: bringFront, zIndex: zIndex,
	//openAnim: openAnim
}: WindowProps) {
	const [isClosing, setIsClosing] = useState<boolean>(false);
	const [maximized, setMaximized] = useState<boolean>(false);

	const handleClose = () => {
		setIsClosing(true);
		setTimeout(
			() => {
				close();
			}
			, 280
		);
	}

	const handleMax = () => {
		setMaximized(!maximized);
		maximize();
	}

	const handleMini = () => {
		minimize();
	}

	let defaultStyle = `
		rounded-2xl shadow-2xl bg-gray-500 bg-clip-padding
		backdrop-filter backdrop-blur-md bg-opacity-40 border
		border-gray-100`;
	return (
		<Rnd default={defaultProps || {
			x: 100,
			y: 100,
			width: 400,
			height: 200,
		}} dragHandleClassName="HANDLE"
			minHeight={200} minWidth={200}
			bounds="parent" className={`${defaultStyle} ${className || ""} ${maximized ? 'maximized' : ''} ${isClosing ? 'closing-animation' : ''}`}
			style={{ zIndex }}
			onMouseDown={() => {
				bringFront();
			}}
		>
			<div className="HANDLE w-full h-[30px] bg-gradient-to-r from-purple-600 to-orange-600 rounded-t-2xl flex items-center">
				<div className="flex z-10 items-center space-x-1 pl-2">
					<button onMouseDown={handleClose} onTouchStart={handleClose} className="CLOSE cursor-pointer rounded-[50%] bg-red-500 w-[18px] h-[18px]"></button>
					<button onMouseDown={handleMini} onTouchStart={handleMini} className="MINIMIZE cursor-pointer rounded-[50%] bg-yellow-500 w-[18px] h-[18px]"></button>
					<button onMouseDown={handleMax} onTouchStart={handleMax} className="MAXIMIZE cursor-pointer rounded-[50%] bg-green-500 w-[18px] h-[18px]"></button>
				</div>
				<h1 className="text-white absolute w-full text-center select-none">{title}</h1>
			</div>
			{children}
		</Rnd>
	);
}
