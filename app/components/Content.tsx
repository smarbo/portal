import { PropsWithChildren } from "react";

export default function Content (props: PropsWithChildren) {
	return (
		<div className="w-full h-[calc(100vh-32px)]">
			{props.children}
		</div>
	)
}
