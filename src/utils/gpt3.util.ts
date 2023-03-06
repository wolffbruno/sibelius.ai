import useSWR from "swr";

/* function Profile () {
  const { data, error, isLoading } = useSWR('/api/user/123', fetcher)
 
  if (error) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>
 
  // render data
  return <div>hello {data.name}!</div>
}
 */

const TRANSCRIPTION_URL = "https://api.openai.com/v1/audio/transcriptions";
const SUMMARIZING_URL = "https://api.openai.com/v1/chat/completions";

function useTranscription(apiToken: string, audio?: Blob) {
	const file = new File(audio ? [audio] : [], "audio.webm", {
		type: "audio/webm; codecs=opus",
	});

	const formData = new FormData();
	formData.append("file", file);
	formData.append("model", "whisper-1");

	const headers = {
		Authorization: `Bearer ${apiToken}`,
	};

	const { data, error, mutate, isLoading, isValidating } = useSWR(
		audio ? TRANSCRIPTION_URL : "",
		() =>
			fetch(TRANSCRIPTION_URL, {
				body: formData,
				method: "POST",
				headers,
			})
				.then((res) => res.json())
				.then((data) => data?.text as string),
		{
			revalidateOnReconnect: false,
			revalidateOnFocus: false,
			refreshWhenOffline: false,
		},
	);

	return {
		transcription: data,
		error,
		isTranscribing: isLoading || isValidating,
	};
}

function useSummarizing(
	apiToken: string,
	subject?: string,
	transcription?: string,
) {
	const messages = [
		{
			role: "system",
			content:
				"Você é um assistente que auxilia alunos a tomarem notas de aulas. Não faz comentários extras, apenas lista as anotações em formato de tópicos, se limitando ao que foi dito na trascrição. Não escreve títulos ou tópicos introdutórios, ex: 'Anotações sobre tal assunto:'.",
		},
		{
			role: "user",
			content: `Anotações referentes à aula de ${subject}. Transcrição da aula: ${transcription}`,
		},
	];

	const headers = {
		Authorization: `Bearer ${apiToken}`,
		"Content-Type": "application/json",
	};

	const body = JSON.stringify({
		model: "gpt-3.5-turbo",
		messages,
	});

	const { data, error, mutate, isLoading, isValidating } = useSWR(
		subject && transcription && SUMMARIZING_URL,
		() =>
			fetch(SUMMARIZING_URL, {
				body,
				headers,
				method: "POST",
			})
				.then((res) => res.json())
				.then((data) => data?.choices[0]?.message?.content as string),
		{
			revalidateOnReconnect: false,
			revalidateOnFocus: false,
			refreshWhenOffline: false,
		},
	);

	return {
		summary: data,
		error,
		isSummarizing: isLoading || isValidating,
	};
}

export { useTranscription, useSummarizing };