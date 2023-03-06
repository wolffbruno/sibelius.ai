export function Button(props: ButtonProps) {
	return (
		<button
			type="button"
			{...props}
			className={`flex items-center gap-x-2 bg-gray-3 select-none transition-colors border border-gray-7 text-gray-12 px-4 py-2 rounded-md w-fit whitespace-nowrap focus:outline-none focus:ring-1 focus:ring-offset-0 focus:ring-primary-7 focus:border-primary-7 hover:bg-gray-4 hover:border-gray-8 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-7 disabled:hover:bg-gray-3 ${props.className}`}
		>
			{props.children || props.label}
		</button>
	);
}

type ButtonProps = {
	label?: string;
} & React.ComponentProps<"button">;