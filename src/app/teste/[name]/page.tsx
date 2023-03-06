function sleep(): Promise<string> {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve("Hello");
		}, 10000);
	});
}

export default async function NamePage() {
	const greetings = await sleep();

	return (
		<div>
			<h1>{greetings}</h1>
		</div>
	);
}