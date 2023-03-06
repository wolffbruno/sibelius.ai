import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
	// You can add any UI inside Loading, including a Skeleton.
	return <div className="flex gap-x-4">Layout! {children}</div>;
}