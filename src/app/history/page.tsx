"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type AnalyzeStatus = "queued" | "running" | "completed" | "failed";

type AnalyzeListItem = {
  id: string;
  url: string;
  status: AnalyzeStatus;
  progress: number;
  overallScore?: number | null;
  scores?: {
    performance?: number;
    ux?: number;
    security?: number;
    seo?: number;
    accessibility?: number;
  } | null;
  isFallback?: boolean;
  createdAt: string;
};

type AnalyzeListResponse = {
  items?: AnalyzeListItem[];
  message?: string;
};

export default function HistoryPage() {
  const router = useRouter();

  const [jobs, setJobs] = useState<AnalyzeListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionJobId, setActionJobId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | AnalyzeStatus>(
    "all",
  );

  async function fetchJobs() {
    try {
      const response = await fetch("/api/analyze", {
        cache: "no-store",
      });

      const data = (await response.json()) as AnalyzeListResponse;

      if (!response.ok) {
        throw new Error(data.message || "Analiz geçmişi alınamadı.");
      }

      setJobs(Array.isArray(data.items) ? data.items : []);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteJob(jobId: string) {
    const confirmed = window.confirm("Bu analiz kaydı silinsin mi?");

    if (!confirmed) return;

    try {
      setActionJobId(jobId);

      const response = await fetch(`/api/analyze/${jobId}`, {
        method: "DELETE",
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "Analiz silinemedi.");
      }

      setJobs((currentJobs) => {
        return currentJobs.filter((job) => job.id !== jobId);
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Analiz silinemedi.");
    } finally {
      setActionJobId("");
    }
  }

  async function handleRerunJob(url: string) {
    try {
      setActionJobId(url);

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Analiz tekrar başlatılamadı.");
      }

      router.push(`/loading?jobId=${data.jobId}`);
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "Analiz tekrar başlatılamadı.",
      );
    } finally {
      setActionJobId("");
    }
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const searchValue = searchTerm.trim().toLowerCase();

    const matchesSearch =
      !searchValue ||
      job.url.toLowerCase().includes(searchValue) ||
      job.id.toLowerCase().includes(searchValue);

    const matchesStatus = statusFilter === "all" || job.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  function handleExportCsv() {
    if (!filteredJobs.length) {
      alert("Dışa aktarılacak kayıt bulunamadı.");
      return;
    }

    const headers = [
      "Rapor ID",
      "URL",
      "Durum",
      "Skor",
      "Performans",
      "UX",
      "SEO",
      "Erişilebilirlik",
      "Güvenlik",
      "Fallback",
      "Tarih",
    ];

    const rows = filteredJobs.map((job) => [
      job.id,
      job.url,
      getStatusLabel(job.status),
      job.overallScore ?? "-",
      job.scores?.performance ?? "-",
      job.scores?.ux ?? "-",
      job.scores?.seo ?? "-",
      job.scores?.accessibility ?? "-",
      job.scores?.security ?? "-",
      job.isFallback ? "Evet" : "Hayır",
      formatDate(job.createdAt),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map(escapeCsvValue).join(";"))
      .join("\n");

    const blob = new Blob(["\ufeff" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `aetheranalytics-history-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-[#050707] text-[#dce8e7]">
      <section className="px-8 py-8 max-md:px-4">
        <div className="mx-auto max-w-360">
          <div className="mb-8 flex items-end justify-between gap-5 max-md:flex-col max-md:items-start">
            <div>
              <p className="font-mono text-[12px] font-bold tracking-[1.4px] text-[#70f8ff]">
                AETHERANALYTICS
              </p>

              <h1 className="mt-3 text-[44px] font-bold tracking-[-2px] text-[#f0eeee] max-md:text-[34px]">
                Analiz Geçmişi
              </h1>

              <p className="mt-4 max-w-170 text-[16px] font-medium leading-normal text-[#aab4b3]">
                Daha önce çalıştırılan tüm web analizlerini buradan
                görüntüleyebilir, tekrar analiz edebilir veya silebilirsin.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="flex h-9 items-center justify-center rounded-xs border border-white/15 px-5 text-[12px] font-bold text-white transition hover:bg-white/5"
              >
                Dashboard
              </Link>

              <Link
                href="/scanner"
                className="flex h-9 items-center justify-center rounded-xs bg-[#15dbe8] px-5 text-[12px] font-bold text-[#042f32] transition hover:bg-[#77faff]"
              >
                Yeni Analiz
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-md border border-white/10 bg-[#070808]">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4 max-lg:flex-col max-lg:items-start">
              <div>
                <h2 className="font-mono text-[12px] font-bold tracking-[1.2px] text-[#c2cbca]">
                  TÜM KAYITLAR
                </h2>

                <p className="mt-1 font-mono text-[10px] font-bold text-[#636b6a]">
                  {filteredJobs.length} kayıt gösteriliyor / toplam{" "}
                  {jobs.length}
                </p>
              </div>

              <div className="flex items-center gap-3 max-md:w-full max-md:flex-col">
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="URL veya rapor ID ara..."
                  className="h-9 w-70 rounded-xs border border-white/10 bg-[#050707] px-3 font-mono text-[11px] font-bold text-[#dce8e7] outline-none transition placeholder:text-[#596160] focus:border-[#18dce9] max-md:w-full"
                />

                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value as "all" | AnalyzeStatus)
                  }
                  className="h-9 rounded-xs border border-white/10 bg-[#050707] px-3 font-mono text-[11px] font-bold text-[#dce8e7] outline-none transition focus:border-[#18dce9] max-md:w-full"
                >
                  <option value="all">Tüm durumlar</option>
                  <option value="completed">Tamamlandı</option>
                  <option value="running">Devam ediyor</option>
                  <option value="queued">Sırada</option>
                  <option value="failed">Başarısız</option>
                </select>

                <button
                  type="button"
                  onClick={handleExportCsv}
                  className="h-9 rounded-xs border border-[#18dce9]/30 bg-[#12393b] px-4 font-mono text-[10px] font-bold text-[#70f8ff] transition hover:bg-[#16494d] max-md:w-full"
                >
                  CSV İndir
                </button>

                <button
                  type="button"
                  onClick={fetchJobs}
                  className="h-9 rounded-xs border border-white/10 px-4 font-mono text-[10px] font-bold text-[#70f8ff] transition hover:bg-white/5 max-md:w-full"
                >
                  Yenile
                </button>
              </div>
            </div>

            {isLoading && (
              <div className="px-5 py-10 text-center font-mono text-[12px] font-bold text-[#76807f]">
                Analiz geçmişi yükleniyor...
              </div>
            )}

            {!isLoading && error && (
              <div className="px-5 py-10 text-center font-mono text-[12px] font-bold text-[#ffaaa4]">
                {error}
              </div>
            )}

            {!isLoading && !error && filteredJobs.length === 0 && (
              <div className="px-5 py-10 text-center font-mono text-[12px] font-bold text-[#76807f]">
                {jobs.length === 0
                  ? "Henüz analiz kaydı yok."
                  : "Filtreye uygun analiz kaydı bulunamadı."}
              </div>
            )}

            {!isLoading && !error && filteredJobs.length > 0 && (
              <div className="overflow-auto">
                <table className="w-full min-w-300 text-left">
                  <thead className="bg-[#111313] font-mono text-[11px] font-bold tracking-[0.7px] text-[#8f9a99]">
                    <tr>
                      <th className="px-4 py-4">URL</th>
                      <th className="px-4 py-4">DURUM</th>
                      <th className="px-4 py-4">SKOR</th>
                      <th className="px-4 py-4">PERF</th>
                      <th className="px-4 py-4">UX</th>
                      <th className="px-4 py-4">SEO</th>
                      <th className="px-4 py-4">ERİŞ.</th>
                      <th className="px-4 py-4">TARİH</th>
                      <th className="px-4 py-4 text-right">İŞLEM</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredJobs.map((job) => {
                      const isCompleted = job.status === "completed";
                      const isBusy =
                        actionJobId === job.id || actionJobId === job.url;

                      return (
                        <tr
                          key={job.id}
                          className="border-t border-white/6 text-[13px] font-bold text-[#aeb8b7]"
                        >
                          <td className="max-w-80 px-4 py-5">
                            <div className="truncate text-[#dce8e7]">
                              {job.url}
                            </div>

                            {job.isFallback && (
                              <span className="mt-2 inline-flex rounded-xs border border-[#18dce9]/30 bg-[#12393b] px-2 py-1 font-mono text-[9px] font-bold tracking-[0.5px] text-[#18dce9]">
                                FALLBACK
                              </span>
                            )}
                          </td>

                          <td className="px-4 py-5">
                            <StatusBadge job={job} />
                          </td>

                          <td className="px-4 py-5">
                            <ScoreBadge value={job.overallScore} />
                          </td>

                          <td className="px-4 py-5">
                            <ScoreBadge value={job.scores?.performance} />
                          </td>

                          <td className="px-4 py-5">
                            <ScoreBadge value={job.scores?.ux} />
                          </td>

                          <td className="px-4 py-5">
                            <ScoreBadge value={job.scores?.seo} />
                          </td>

                          <td className="px-4 py-5">
                            <ScoreBadge value={job.scores?.accessibility} />
                          </td>

                          <td className="px-4 py-5 font-mono text-[11px] text-[#7d8786]">
                            {formatDate(job.createdAt)}
                          </td>

                          <td className="px-4 py-5">
                            <div className="flex justify-end gap-2">
                              {isCompleted ? (
                                <Link
                                  href={`/report?jobId=${job.id}`}
                                  className="rounded-xs border border-[#18dce9]/30 px-3 py-2 font-mono text-[10px] font-bold text-[#18dce9] transition hover:bg-[#12393b]"
                                >
                                  Rapor
                                </Link>
                              ) : (
                                <Link
                                  href={`/loading?jobId=${job.id}`}
                                  className="rounded-xs border border-[#b997ff]/30 px-3 py-2 font-mono text-[10px] font-bold text-[#b997ff] transition hover:bg-[#24113e]"
                                >
                                  İzle
                                </Link>
                              )}

                              <button
                                type="button"
                                disabled={isBusy}
                                onClick={() => handleRerunJob(job.url)}
                                className="rounded-xs border border-white/10 px-3 py-2 font-mono text-[10px] font-bold text-[#bfc9c8] transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {isBusy && actionJobId === job.url
                                  ? "Başlıyor..."
                                  : "Tekrar"}
                              </button>

                              <button
                                type="button"
                                disabled={isBusy}
                                onClick={() => handleDeleteJob(job.id)}
                                className="rounded-xs border border-[#4a1515] px-3 py-2 font-mono text-[10px] font-bold text-[#ffaaa4] transition hover:bg-[#4a1515]/40 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {isBusy && actionJobId === job.id
                                  ? "Siliniyor..."
                                  : "Sil"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function StatusBadge({ job }: { job: AnalyzeListItem }) {
  if (job.status === "completed") {
    return (
      <span className="rounded-xs bg-[#143923] px-3 py-2 font-mono text-[10px] font-bold text-[#5df6a8]">
        TAMAMLANDI
      </span>
    );
  }

  if (job.status === "failed") {
    return (
      <span className="rounded-xs bg-[#4a1515] px-3 py-2 font-mono text-[10px] font-bold text-[#ffaaa4]">
        BAŞARISIZ
      </span>
    );
  }

  return (
    <span className="rounded-xs bg-[#24113e] px-3 py-2 font-mono text-[10px] font-bold text-[#b997ff]">
      {job.progress}% DEVAM
    </span>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function escapeCsvValue(value: string | number | null | undefined) {
  const text = String(value ?? "");

  if (/[;"\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
}

function getStatusLabel(status: AnalyzeStatus) {
  if (status === "completed") return "Tamamlandı";
  if (status === "running") return "Devam Ediyor";
  if (status === "queued") return "Sırada";
  if (status === "failed") return "Başarısız";

  return status;
}

function ScoreBadge({ value }: { value?: number | null }) {
  if (value === null || value === undefined) {
    return <span className="font-mono text-[#6d7675]">-</span>;
  }

  const className =
    value >= 90
      ? "bg-[#143923] text-[#5df6a8]"
      : value >= 70
        ? "bg-[#12393b] text-[#18dce9]"
        : value >= 50
          ? "bg-[#4a3515] text-[#ffd27a]"
          : "bg-[#4a1515] text-[#ffaaa4]";

  return (
    <span
      className={`inline-flex min-w-10 justify-center rounded-xs px-2 py-1.5 font-mono text-[11px] font-bold ${className}`}
    >
      {value}
    </span>
  );
}
