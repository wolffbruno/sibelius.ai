"use client";

import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { useMediaRecorder } from "@/utils/audio.util";
import { formatTime } from "@/utils/date.util";
import {
	PlayIcon
} from "@heroicons/react/20/solid";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

export default function Home() {
	const router = useRouter();
	const [apiToken, setApiToken] = useState("");
	const [classSubject, setClassSubject] = useState("");
	
	const {
		isRecording,
		startRecording,
		stopRecording,
		analyser: audioAnalyser,
		currentTime,
audioURL
	} = useMediaRecorder();
	const animationFrameRef = useRef(0);

	const [frequencies, setFrequencies] = useState([0, 0, 0]);

	const drawBars = useCallback(() => {
		animationFrameRef.current = requestAnimationFrame(drawBars);
		const bufferLength = audioAnalyser?.frequencyBinCount || 0;

		const dataArray = new Uint8Array(bufferLength);

		audioAnalyser?.getByteFrequencyData(dataArray);

		if (isRecording && dataArray.length > 0) {
			const b = [15, 10, 30];

			setFrequencies(
				[dataArray[b[0]], dataArray[b[1]], dataArray[b[2]]].map(
					(x) => (x * 70) / 256,
				),
			);
		} else {
			setFrequencies([0, 0, 0]);
			cancelAnimationFrame(animationFrameRef.current);
		}
	}, [audioAnalyser, isRecording]);

	useEffect(() => {
		drawBars();

		return () => cancelAnimationFrame(animationFrameRef.current);
	}, [drawBars]);

	useEffect(() => {
		if (audioURL) {
			router.push(`/transcription/${audioURL}?api_token=${apiToken}&class_subject=${classSubject}`);
		}
	}, [audioURL, router, apiToken, classSubject]);

	return (
		<main className="w-[96%] sm:w-[500px] flex flex-col gap-24">
			<section className="flex flex-col gap-12">
				<section className="leading-normal border-b border-gray-6 pb-4">
					<h1 className="text-xl">Sibelius</h1>
					<p className="text-gray-11">
						Convert any class recording into summarized notes with the
						<span className="whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-tr from-primary-11 to-primary-11/90">
							{" "}
							magic of GPT3
						</span>
					</p>
				</section>
				<div className="flex flex-col gap-2">
					<Input
						label="OpenAI API Token"
						onChange={(e) => setApiToken(e.target.value)}
						name="api_token"
						autoComplete="off"
						spellCheck={false}
						placeholder="XXX-XXX-XXX-XXX-XXX"
						className="font-mono"
					/>
				</div>
				<div className="w-full flex gap-x-4">
					<div className="flex flex-col gap-2 relative w-full">
						<label
							htmlFor="class_subject"
							className="absolute -top-[2em] text-gray-11 text-sm"
						>
							Class subject
						</label>
						<input
							type="text"
							onChange={(e) => setClassSubject(e.target.value)}
							name="class_subject"
							spellCheck={false}
							autoComplete="off"
							placeholder="Computer science?"
							className="placeholder:text-gray-9 bg-gray-3 border border-gray-7 text-gray-12 px-4 py-2 rounded-md focus:outline focus:outline-primary-7 w-full"
						/>
						<Link href={`/transcription/${audioURL}?api_token=${apiToken}&class_subject=${classSubject}`}>123</Link>
					</div>{" "}
					{!isRecording ? (
						<Button onClick={startRecording} disabled={!(classSubject && apiToken)}>
							<PlayIcon className="w-[1em] h-[1em]" />
							Start recording
						</Button>
					) : (
						<Button
							onClick={stopRecording}
							className="bg-red-3 border-red-7 focus:outline-red-7 hover:bg-red-4 hover:border-red-8"
						>
							<div className="w-[1em] h-[1em] rounded-full bg-red-9 animate-pulse" />
							Recording...
						</Button>
					)}
				</div>
			</section>
			<section className="h-16">
				{isRecording && (
					<motion.section className="flex flex-col text-sm gap-y-4 items-center" initial={{ opacity: 0, scale: 0.9}} animate={{ opacity: 1, scale: 1 }}>
						<div className="flex gap-x-1 items-center h-12 overflow-hidden">
							{frequencies.map((f, i) => (
								<motion.div
									key={i}
									transition={{ duration: 0.1 }}
									className="bg-primary-11 h-2 w-1 rounded-full max-h-full"
									animate={{ height: `${f}px`, minHeight: "0.5rem" }}
								/>
							))}
						</div>
						<span className="text-gray-12">{formatTime(currentTime)}</span>
					</motion.section>
				)}
			</section>
		</main>
	);
}
