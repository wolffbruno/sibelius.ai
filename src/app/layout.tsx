
import "./globals.css";
import { JetBrains_Mono } from "next/font/google";

const jetbrainsMono = JetBrains_Mono({subsets: ["latin"], variable: "--jetbrains-mono"});

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {

	return (
		<html lang="en" className={jetbrainsMono.variable}>
			<body>{children}</body>
		</html>
	);
}
