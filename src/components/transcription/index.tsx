"use client";

import { Prompt } from "@/components/prompt";
import Spinner from "@/components/spinner";
import { useSummarizing, useTranscription } from "@/utils/gpt3.util";
import { ArrowUturnLeftIcon, CheckIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type TranscriptionProps = {
	apiToken: string;
	classSubject: string;
	blob: Blob;
	onClickBack: () => void;
};

export default function Transcription({
	apiToken,
	classSubject,
	blob,
	onClickBack,
}: TranscriptionProps) {
	const { isTranscribing, transcription } = useTranscription(apiToken, blob);
	const { isSummarizing, summary } = useSummarizing(
		apiToken,
		classSubject,
		isTranscribing ? "" : transcription,
	);

	const isLoading = useMemo(
		() => isTranscribing || isSummarizing,
		[isTranscribing, isSummarizing],
	);

	return (
		<main className="w-[96%] sm:w-[500px] min-h-screen h-fit relative">
			<section className="flex flex-col gap-4 sticky top-0 bg-gradient-to-b py-4 from-gray-1 to-gray-1/50 backdrop-blur-md rounded-md">
				<div className="flex justify-between border-b border-gray-8 pb-4 mt-8">
					<span
						onClick={onClickBack}
						className="text-sm flex gap-x-2 items-center cursor-pointer select-none hover:text-gray-11 transition-colors"
					>
						<ArrowUturnLeftIcon className="w-[1em] h-[1em]" />
						Back to home
					</span>
					<span className="text-sm flex gap-x-2 items-center pointer-events-none select-none transition-colors">
						{isTranscribing || isSummarizing ? (
							<Spinner />
						) : (
							<CheckIcon className="w-[1em] h-[1em]" />
						)}
						{isTranscribing && "Transcripting..."}
						{isSummarizing && "Summarizing..."}
					</span>
				</div>

				<h1 className="mb-2">
					{classSubject} (
					{new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(
						new Date(),
					)}
					)
				</h1>
			</section>

			<section className="text-gray-11 pb-4">
				<h2 className="text-gray-12">Transcription:</h2>

				{isTranscribing ? (
					<div className="mt-2 h-4 w-[80%] bg-gray-3 animate-pulse rounded-sm ml-4" />
				) : (
					<Prompt message={transcription} />
				)}

				{transcription && (
					<>
						<br />
						<h2 className="text-gray-12">Anotations:</h2>
						{isLoading ? (
							<ul className="mt-2 list-inside text-gray-11 ml-4 flex flex-col gap-y-2">
								{/* skeleton loading */}
								<li className="h-4 w-[80%] bg-gray-3 animate-pulse rounded-sm" />
								<li className="h-4 w-[80%] bg-gray-3 animate-pulse rounded-sm" />
								<li className="h-4 w-[80%] bg-gray-3 animate-pulse rounded-sm" />
								<li className="h-4 w-[80%] bg-gray-3 animate-pulse rounded-sm" />
							</ul>
						) : (
							<Prompt message={summary} />
						)}
					</>
				)}
			</section>
		</main>
	);
}