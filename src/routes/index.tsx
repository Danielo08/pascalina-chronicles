import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Pascalina — A primeira calculadora mecânica do mundo" },
      {
        name: "description",
        content:
          "Conheça a Pascalina, a primeira calculadora mecânica do mundo, inventada por Blaise Pascal no século XVII.",
      },
    ],
  }),
});

function toEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (u.hostname === "youtu.be") {
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    }
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
    return null;
  } catch {
    return null;
  }
}

function Index() {
  const [history, setHistory] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [submittedUrl, setSubmittedUrl] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (fileUrl) URL.revokeObjectURL(fileUrl);
    };
  }, [fileUrl]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (fileUrl) URL.revokeObjectURL(fileUrl);
    setFileUrl(URL.createObjectURL(f));
    setSubmittedUrl(null);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl.trim()) return;
    setSubmittedUrl(videoUrl.trim());
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
      setFileUrl(null);
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  const embedUrl = submittedUrl ? toEmbedUrl(submittedUrl) : null;
  const isDirectVideo =
    submittedUrl && /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(submittedUrl);

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="mb-6 text-sm uppercase tracking-[0.4em] text-muted-foreground">
          1642 · Blaise Pascal
        </p>
        <h1 className="text-[18vw] font-bold leading-none tracking-tighter md:text-[14vw] lg:text-[12rem]">
          Pascalina
        </h1>
        <p className="mt-8 max-w-xl text-base text-muted-foreground md:text-lg">
          A primeira calculadora mecânica do mundo.
        </p>
        <div className="mt-16 animate-bounce text-muted-foreground">↓</div>
      </section>

      {/* History */}
      <section className="border-t border-border px-6 py-24 md:py-32">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-10 text-4xl font-semibold tracking-tight md:text-5xl">
            A história da invenção
          </h2>
          <textarea
            value={history}
            onChange={(e) => setHistory(e.target.value)}
            placeholder="Escreva aqui a história da Pascalina..."
            className="min-h-[300px] w-full resize-y rounded-lg border border-input bg-card p-6 text-base leading-relaxed text-card-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
          />
        </div>
      </section>

      {/* Video */}
      <section className="border-t border-border px-6 py-24 md:py-32">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-10 text-4xl font-semibold tracking-tight md:text-5xl">
            Vídeo
          </h2>

          <form onSubmit={handleUrlSubmit} className="flex flex-col gap-3 sm:flex-row">
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Cole o link do vídeo (YouTube, Vimeo ou .mp4)"
              className="flex-1 rounded-md border border-input bg-card px-4 py-3 text-card-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
            />
            <button
              type="submit"
              className="rounded-md bg-primary px-6 py-3 font-medium text-primary-foreground transition hover:bg-primary/90"
            >
              Carregar
            </button>
          </form>

          <div className="my-6 flex items-center gap-4 text-sm text-muted-foreground">
            <div className="h-px flex-1 bg-border" />
            ou
            <div className="h-px flex-1 bg-border" />
          </div>

          <label className="block">
            <span className="mb-2 block text-sm text-muted-foreground">
              Envie um arquivo de vídeo
            </span>
            <input
              ref={fileRef}
              type="file"
              accept="video/*"
              onChange={handleFile}
              className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-md file:border-0 file:bg-secondary file:px-4 file:py-2 file:font-medium file:text-secondary-foreground hover:file:bg-secondary/80"
            />
          </label>

          {(fileUrl || submittedUrl) && (
            <div className="mt-10 overflow-hidden rounded-lg border border-border bg-card">
              <div className="aspect-video w-full">
                {fileUrl ? (
                  <video src={fileUrl} controls className="h-full w-full" />
                ) : embedUrl ? (
                  <iframe
                    src={embedUrl}
                    title="Vídeo da Pascalina"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                  />
                ) : isDirectVideo ? (
                  <video src={submittedUrl!} controls className="h-full w-full" />
                ) : (
                  <div className="flex h-full items-center justify-center p-6 text-center text-sm text-muted-foreground">
                    Não foi possível reproduzir este link. Tente um link do YouTube,
                    Vimeo ou um arquivo .mp4.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <footer className="border-t border-border px-6 py-10 text-center text-sm text-muted-foreground">
        Pascalina · Blaise Pascal, 1642
      </footer>
    </main>
  );
}
