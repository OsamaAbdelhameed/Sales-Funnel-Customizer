"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Video, Download, Square, ArrowRight, Sparkles } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import GlobeBackground from "@/components/Marketing/GlobeBackground";
import { Features } from "@/components/Marketing/Features";
import { Sponsors } from "@/components/Sponsors";
import Link from "next/link";

function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export default function LandingPage() {
	const [isRecording, setIsRecording] = useState(false);
	const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const chunksRef = useRef<Blob[]>([]);

	const startRecording = useCallback(() => {
		const canvas = document.querySelector("canvas");
		if (!canvas) return;

		const stream = (canvas as any).captureStream(60);
		const recorder = new MediaRecorder(stream, {
			mimeType: "video/webm;codecs=vp9",
		});

		recorder.ondataavailable = (e) => {
			if (e.data.size > 0) {
				chunksRef.current.push(e.data);
			}
		};

		recorder.onstop = () => {
			const blob = new Blob(chunksRef.current, { type: "video/webm" });
			const url = URL.createObjectURL(blob);
			setRecordedUrl(url);
			chunksRef.current = [];
		};

		chunksRef.current = [];
		recorder.start();
		mediaRecorderRef.current = recorder;
		setIsRecording(true);

		setTimeout(() => {
			if (recorder.state === "recording") {
				stopRecording();
			}
		}, 10000);
	}, []);

	const stopRecording = useCallback(() => {
		if (
			mediaRecorderRef.current &&
			mediaRecorderRef.current.state === "recording"
		) {
			mediaRecorderRef.current.stop();
			setIsRecording(false);
		}
	}, []);

	return (
		<div className="bg-[#050510] text-slate-100 overflow-x-hidden font-sans">
			{/* HERO SECTION WITH GLOBE */}
			<section className="relative w-full h-screen min-h-[800px] overflow-hidden">
				{/* Background Layer */}
				<div className="absolute inset-0 z-0">
					<GlobeBackground />
				</div>

				{/* UI Overlay */}
				<div className="absolute inset-0 z-10 flex flex-col pointer-events-none">
					{/* Main Content Area */}
					<main className="flex-1 flex flex-col items-center justify-center p-8 gap-12">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							className="max-w-4xl text-center space-y-8 pointer-events-auto"
						>
							<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-sm font-medium mb-4 text-cyan-400">
								<Sparkles className="w-4 h-4" />
								<span>Next-Gen Sales Funnel Platform</span>
							</div>

							<h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white leading-none">
								Animate your <br />
								<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-orange-400">
									Sales Presence.
								</span>
							</h1>

							<p className="text-slate-400 text-xl leading-relaxed max-w-2xl mx-auto">
								Build stunning websites, dynamic PDFs, and interactive
								questionnaires. Experience the first sales engine that feels as
								good as it performs.
							</p>

							<div className="flex flex-wrap justify-center gap-6 pt-4">
								<Link
									href="/dashboard"
									className="px-10 py-5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-black font-bold transition-all flex items-center gap-3 group shadow-[0_0_30px_rgba(6,182,212,0.3)]"
								>
									Launch Dashboard
									<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
								</Link>
								<button className="px-10 py-5 rounded-2xl bg-white/5 hover:bg-white/10 font-bold transition-all border border-white/10 backdrop-blur-md">
									View Components
								</button>
							</div>
						</motion.div>

						{/* Recorder Controls Bar */}
						<div className="flex flex-col items-center gap-6 pointer-events-auto">
							<div className="flex items-center gap-6 p-4 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-2xl shadow-2xl">
								<button
									onClick={isRecording ? stopRecording : startRecording}
									className={cn(
										"relative group flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all overflow-hidden",
										isRecording
											? "bg-red-500 text-white shadow-[0_0_30px_rgba(239,68,68,0.4)]"
											: "bg-white/10 text-white hover:bg-white/20 border border-white/10",
									)}
								>
									{isRecording ? (
										<>
											<Square className="w-5 h-5 fill-current" />
											<span>Stop Sample (Auto in 10s)</span>
										</>
									) : (
										<>
											<Video className="w-5 h-5 text-cyan-400" />
											<span>Capture Page Concept</span>
										</>
									)}
								</button>

								{recordedUrl && (
									<a
										href={recordedUrl}
										download="funnel-concept.webm"
										className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-cyan-500 text-black hover:bg-cyan-400 transition-all font-bold"
									>
										<Download className="w-5 h-5" />
										<span>Download WebM</span>
									</a>
								)}
							</div>

							<AnimatePresence>
								{isRecording && (
									<motion.div
										initial={{ opacity: 0, scale: 0.9 }}
										animate={{ opacity: 1, scale: 1 }}
										exit={{ opacity: 0, scale: 0.9 }}
										className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full text-xs font-mono"
									>
										<span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
										REC: CAPTURING SALES CONCEPT
									</motion.div>
								)}
							</AnimatePresence>
						</div>
					</main>
				</div>

				{/* Decorative Gradients */}
				<div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-cyan-500/20 blur-[120px] rounded-full pointer-events-none" />
				<div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />
			</section>

			{/* FEATURES SECTION */}
			<Features />

			{/* SPONSORS SECTION */}
			<section className="py-32 bg-white">
				<div className="container mx-auto px-6 text-center">
					<h2 className="text-3xl font-bold mb-16 text-black">
						Trusted by the Future
					</h2>
					<Sponsors />
				</div>
			</section>

			{/* FINAL CTA */}
			<section className="py-32 bg-indigo-600 relative overflow-hidden">
				<div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
				<div className="container mx-auto px-6 text-center text-white relative z-10">
					<h2 className="text-5xl font-bold mb-8 italic tracking-tighter">
						Ready to dominate the market?
					</h2>
					<p className="text-2xl mb-12 text-indigo-100 max-w-2xl mx-auto">
						Take control of your entire customer journey from a single, unified
						visual dashboard.
					</p>
					<div className="flex justify-center gap-6">
						<Link
							href="/dashboard"
							className="px-12 py-6 rounded-2xl bg-white text-indigo-600 font-bold text-xl hover:scale-105 transition-transform shadow-2xl"
						>
							Get Started Now
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
}
