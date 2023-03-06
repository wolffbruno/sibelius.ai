const MINUTES_IN_HOUR = 60;
const SECONDS_IN_HOUR = 3600;
const SECONDS_IN_MINUTE = 60;

function formatTime(timestampInSeconds: number = 0) {
	const hours = Math.floor(timestampInSeconds / SECONDS_IN_HOUR);
	const minutes = Math.floor(
		(timestampInSeconds - hours * SECONDS_IN_HOUR) / MINUTES_IN_HOUR,
	);
	const seconds =
		timestampInSeconds - hours * SECONDS_IN_HOUR - minutes * SECONDS_IN_MINUTE;

	const formatDataUnit = (unit: number) => unit.toString().padStart(2, "0");

	return [hours, minutes, seconds].map(formatDataUnit).join(":");
}

export { formatTime };