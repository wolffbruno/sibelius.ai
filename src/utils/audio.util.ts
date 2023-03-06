import { useCallback, useEffect, useState } from "react";

function useMediaRecorder() {
	const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
	const [isRecording, setIsRecording] = useState(false);
	const [audioURL, setAudioURL] = useState<string | null>(null);
	const [stream, setStream] = useState<MediaStream | null>(null);
	const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
	const [currentTime, setCurrentTime] = useState(0);

	// on start, update currentime each second
	useEffect(() => {
		if (!isRecording) return;

		const interval = setInterval(() => {
			setCurrentTime((currentTime) => currentTime + 1);
		}, 1000);

		return () => clearInterval(interval);
	}, [isRecording]);

	const createRecorder = useCallback(async () => {
		const stream = await navigator.mediaDevices.getUserMedia({
			audio: true,
		});

		const mediaRecorder = new MediaRecorder(stream);
		setRecorder(mediaRecorder);
		setStream(stream);

		return mediaRecorder;
	}, []);

	const onDataAvailable = useCallback(
		(e: BlobEvent) => {
			const audioBlob = new Blob([e.data], { type: "audio/webm; codecs=opus" });
			const objectURL = URL.createObjectURL(audioBlob);

			setAudioURL(objectURL.split("/")[objectURL.split("/").length - 1]);
		},
		[setAudioURL],
	);

	const onRecordingStopped = useCallback(() => {
		if (recorder) {
			recorder.stream.getTracks().forEach((track) => track.stop());
		}
	}, [recorder]);

	useEffect(() => {
		if (recorder) {
			recorder.addEventListener("dataavailable", onDataAvailable);
			recorder.addEventListener("stop", onRecordingStopped);
		}

		return () => {
			if (recorder) {
				recorder.removeEventListener("dataavailable", onDataAvailable);
				recorder.removeEventListener("stop", onRecordingStopped);
			}
		};
	}, [onDataAvailable, onRecordingStopped, recorder]);

	useEffect(() => {
		if (!stream) return;

		const audioContext = new AudioContext();
		const mediaStreamSource = audioContext.createMediaStreamSource(stream);

		const audioAnalyser = audioContext.createAnalyser();

		mediaStreamSource.connect(audioAnalyser);
		audioAnalyser.fftSize = 256;

		setAnalyser(audioAnalyser);
	}, [stream]);

	const startRecording = useCallback(async () => {
		const recorder = await createRecorder();

		if (recorder) {
			recorder.start();
			setIsRecording(true);
		}
	}, [createRecorder]);

	const stopRecording = useCallback(() => {
		if (recorder) {
			recorder.stop();
			setIsRecording(false);
			setCurrentTime(0);
		}
	}, [recorder]);

	return {
		isRecording,
		startRecording,
		stopRecording,
		analyser,
		currentTime,
		audioURL,
	};
}

export { useMediaRecorder };
