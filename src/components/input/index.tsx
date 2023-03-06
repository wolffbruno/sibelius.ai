export function Input(props: InputProps) {
	return (
		<div className="flex flex-col gap-2 relative w-full">
			<div className="flex w-full items-center absolute -top-[2em] justify-between">
				<label htmlFor="api_token" className="text-gray-11 text-sm">
					{props.label}
				</label>
			</div>
			<input
				{...props}
				className={`placeholder:text-gray-9 bg-gray-3 border border-gray-7 text-gray-12 px-4 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-offset-0 focus:ring-primary-7 focus:border-primary-7 w-full ${props.className}`}
			/>
		</div>
	);
}

type InputProps = {
	label: string;
} & JSX.IntrinsicElements["input"];