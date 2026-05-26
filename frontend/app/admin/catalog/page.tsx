"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Sidebar } from "@/src/components/SideBar";
import Link from "next/link";
import React from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
function Carousel({ fotos, alt, apiUrl }: { fotos: { id: number; url: string }[]; alt?: string; apiUrl: string }) {
	const [index, setIndex] = React.useState(0);
	const [paused, setPaused] = React.useState(false);

	React.useEffect(() => {
		if (!fotos || fotos.length <= 1) return;
		const id = setInterval(() => {
			if (!paused) setIndex((i) => (i + 1) % fotos.length);
		}, 3000);
		return () => clearInterval(id);
	}, [fotos, paused]);

	if (!fotos || fotos.length === 0) return <div className="h-full w-full" />;

	return (
		<div className="relative h-full w-full overflow-hidden" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
			<img src={`${apiUrl}/${fotos[index].url}`} alt={alt} className="h-full w-full object-cover transition-transform duration-500" />
			{fotos.length > 1 && (
				<div className="absolute left-2 top-1/2 -translate-y-1/2">
					<button onClick={() => setIndex((i) => (i - 1 + fotos.length) % fotos.length)} className="bg-black/40 text-white rounded-full p-1">◀</button>
				</div>
			)}
			{fotos.length > 1 && (
				<div className="absolute right-2 top-1/2 -translate-y-1/2">
					<button onClick={() => setIndex((i) => (i + 1) % fotos.length)} className="bg-black/40 text-white rounded-full p-1">▶</button>
				</div>
			)}
			{fotos.length > 1 && (
				<div className="absolute left-1/2 bottom-2 -translate-x-1/2 flex gap-2">
					{fotos.map((_, i) => (
						<button key={i} onClick={() => setIndex(i)} className={`h-2 w-8 rounded ${i === index ? 'bg-white' : 'bg-white/40'}`} />
					))}
				</div>
			)}
		</div>
	);
}

type Foto = {
	id: number;
	url: string;
};

type Mobil = {
	id: number;
	nama: string;
	deskripsi: string;
	fotos: Foto[];
};

function CatalogContent() {
	const [mobils, setMobils] = useState<Mobil[]>([]);
	const [currentPage, setCurrentPage] = useState("katalog");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const searchParams = useSearchParams();
	const refreshKey = searchParams?.get("r") || null;

	useEffect(() => {
		const marker = window.localStorage.getItem("mobil_updated_at");
		if (marker) {
			window.localStorage.removeItem("mobil_updated_at");
		}
	}, []);

	useEffect(() => {
		async function load() {
			setLoading(true);
			setError(null);
			try {
				const res = await fetch(`${API_URL}/mobil?t=${refreshKey || Date.now()}`, {
					cache: "no-store",
				});
				if (!res.ok) throw new Error(`HTTP ${res.status}`);
				const body = await res.json();
				setMobils(body.data || []);
			} catch (err: any) {
				setError(err.message || "Gagal mengambil data");
			} finally {
				setLoading(false);
			}
		}
		load();
	}, [refreshKey]);

	const handleNavigate = (page: string) => {
		setCurrentPage(page);

		if (page === "dashboard") {
			window.scrollTo({ top: 0, behavior: "smooth" });
			return;
		}

		const target = document.getElementById(page);

		if (target) {
			target.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	};

	return (
		<main className="min-h-screen w-full overflow-x-hidden bg-[#edf2f8] text-[#1e3a5f]">
			<div className="min-h-screen w-full px-3 py-3 lg:px-4 lg:py-4">
				<aside>
				<Sidebar currentPage={currentPage} onNavigate={handleNavigate} />
				</aside>

				<div className="min-w-0 space-y-5 lg:ml-[17.5rem]">
					<div className="rounded-3xl bg-white/92 p-6 shadow-[0_12px_40px_rgba(30,58,95,0.08)] ring-1 ring-[#d8e1ee]/70 backdrop-blur">
						<div className="mb-4 flex items-center justify-between">
							<div>
								<h1 className="text-2xl font-semibold text-[#1e3a5f]">Kelola Katalog Mobil</h1>
								<p className="text-sm text-[#64748b]">Kelola data mobil: tambah, lihat detail, edit, atau hapus.</p>
							</div>

							<div>
								<Link href="/admin/catalog/tambah" className="inline-flex items-center gap-2 rounded-xl bg-[#1e3a5f] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#27466f]">
									Tambah Mobil
								</Link>
							</div>
						</div>

						{loading && <p className="text-sm text-[#64748b]">Memuat daftar mobil...</p>}
						{error && <p className="text-sm text-red-600">{error}</p>}

						{!loading && !error && (
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-4">
								{mobils.map((m) => (
									<div key={m.id} className="rounded-2xl overflow-hidden bg-[#f8f9fb] ring-1 ring-[#d8e1ee]/60">
										<div className="h-44 bg-[#dbe6f3] md:h-48">
											{m.fotos && m.fotos.length > 0 ? (
												<Carousel fotos={m.fotos} alt={m.nama} apiUrl={API_URL} />
											) : (
												<div className="flex h-full items-center justify-center text-[#9ca3af]">Tidak ada foto</div>
											)}
										</div>

										<div className="p-4">
											<h3 className="text-lg font-semibold text-[#1e3a5f]">{m.nama}</h3>
											<p className="mt-2 text-sm leading-6 text-[#64748b] min-h-[3rem]">{m.deskripsi}</p>

											<div className="mt-4 flex items-center gap-3">
												<Link href={`/admin/catalog/${m.id}`} className="rounded-lg bg-white/90 px-3 py-1 text-sm text-[#1e3a5f] ring-1 ring-[#d8e1ee]/60 hover:bg-white">Detail</Link>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</main>
	);
}

export default function CatalogPage() {
	return (
		<Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
			<CatalogContent />
		</Suspense>
	);
}