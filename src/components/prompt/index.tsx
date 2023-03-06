import { useMemo } from "react";

export function Prompt(props: PromptProps) {
	const message = useMemo(() => props.message || "", [props.message]);

	const nonListContent = useMemo(() => {
		const regex = /.*?(?=(^-|\n-|$))/;

		const result = message.match(regex);

		return result?.[0] || "";
	}, [message]);

	const listContent = useMemo(() => {
		const messageWithoutNonListContent = message.replace(nonListContent, "");

		return messageWithoutNonListContent
			.trim()
			.split("\n-")
			.flatMap((x) => x.split(/^-/))
			.map((x) => x.trim())
			.filter((x) => x);
	}, [message, nonListContent]);

	return (
		<span>
			<span className="mb-2 block text-justify indent-8">{nonListContent}</span>
			<ul className="list-disc list-inside ml-8">
				{listContent.map((item, i) => (
					<li key={i}>{item}</li>
				))}
			</ul>
		</span>
	);
}

type PromptProps = {
	message?: string;
};