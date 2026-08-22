import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  X,
  Loader2,
  ScanLine,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import {
  useRef,
  useState,
} from "react";

import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/Button";
import { useToast } from "@/components/Toast";

interface UploadedFile {
  name: string;
  size: number;
  type: string;
}

interface AnalysisResult {
  totalLines: number;
  threats: number;
  anomalies: number;
  clean: number;
  threatLevel:
  | "Critical"
  | "Suspicious"
  | "Clean";
}

interface LogAnalysisResponse {
  success: boolean;
  message: string;
  file: {
    filename: string;
    fileSize: number;
    fileType: string;
  };
  analysis: AnalysisResult;
}

type Phase =
  | "idle"
  | "uploading"
  | "analyzing"
  | "complete"
  | "error";

const supported = [
  ".txt",
  ".csv",
  ".json",
  ".log",
];

const MAX_FILE_SIZE =
  500 * 1024 * 1024;

export function UploadLogs() {
  const toast = useToast();

  const inputRef =
    useRef<HTMLInputElement>(null);

  const [dragging, setDragging] =
    useState(false);

  const [file, setFile] =
    useState<UploadedFile | null>(null);

  const [progress, setProgress] =
    useState(0);

  const [phase, setPhase] =
    useState<Phase>("idle");

  const [result, setResult] =
    useState<AnalysisResult | null>(null);

  const [error, setError] =
    useState("");

  const [abortController, setAbortController] =
    useState<AbortController | null>(
      null
    );

  const getExtension = (
    filename: string
  ) => {
    const parts =
      filename.toLowerCase().split(".");

    if (parts.length < 2) {
      return "";
    }

    return `.${parts.pop()}`;
  };

  const formatFileSize = (
    bytes: number
  ) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(
        bytes / 1024
      ).toFixed(1)} KB`;
    }

    if (
      bytes <
      1024 * 1024 * 1024
    ) {
      return `${(
        bytes /
        (1024 * 1024)
      ).toFixed(1)} MB`;
    }

    return `${(
      bytes /
      (1024 * 1024 * 1024)
    ).toFixed(2)} GB`;
  };

  const reset = () => {
    if (abortController) {
      abortController.abort();
    }

    setAbortController(null);
    setFile(null);
    setProgress(0);
    setPhase("idle");
    setResult(null);
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const uploadAndAnalyze = async (
    selectedFile: File
  ) => {
    const controller =
      new AbortController();

    setAbortController(controller);

    setPhase("uploading");
    setProgress(0);
    setResult(null);
    setError("");

    const formData = new FormData();

    formData.append(
      "file",
      selectedFile
    );

    try {
      /*
       * Use XMLHttpRequest so the UI can display
       * REAL upload progress instead of fake timers.
       */
      const response =
        await new Promise<{
          status: number;
          body: string;
        }>((resolve, reject) => {
          const xhr =
            new XMLHttpRequest();

          xhr.open(
            "POST",
            "/api/logs/analyze"
          );

          xhr.responseType = "text";

          xhr.upload.onprogress = (
            event
          ) => {
            if (event.lengthComputable) {
              const percentage =
                Math.round(
                  (event.loaded /
                    event.total) *
                  100
                );

              setProgress(
                percentage
              );
            }
          };

          xhr.upload.onload = () => {
            setProgress(100);
            setPhase("analyzing");
          };

          xhr.onload = () => {
            resolve({
              status:
                xhr.status,
              body:
                xhr.responseText,
            });
          };

          xhr.onerror = () => {
            reject(
              new Error(
                "Network error while uploading the log file."
              )
            );
          };

          xhr.onabort = () => {
            reject(
              new DOMException(
                "Upload cancelled",
                "AbortError"
              )
            );
          };

          controller.signal.addEventListener(
            "abort",
            () => {
              xhr.abort();
            }
          );

          xhr.send(formData);
        });

      let data:
        | LogAnalysisResponse
        | null = null;

      try {
        data = JSON.parse(
          response.body
        );
      } catch {
        throw new Error(
          "The server returned an invalid response."
        );
      }

      if (
        response.status < 200 ||
        response.status >= 300 ||
        !data?.success
      ) {
        throw new Error(
          data?.message ||
          "Log analysis failed."
        );
      }

      setResult(
        data.analysis
      );

      setPhase("complete");

      toast(
        `Analysis complete · ${data.analysis.threats} critical threats detected`,
        data.analysis.threatLevel ===
          "Critical"
          ? "error"
          : "success"
      );
    } catch (err) {
      if (
        err instanceof DOMException &&
        err.name === "AbortError"
      ) {
        return;
      }

      console.error(
        "Log Upload Error:",
        err
      );

      const message =
        err instanceof Error
          ? err.message
          : "Unable to analyze log file.";

      setError(message);
      setPhase("error");

      toast(
        message,
        "error"
      );
    } finally {
      setAbortController(null);
    }
  };

  const handleFile = (
    selectedFile: File
  ) => {
    const extension =
      getExtension(
        selectedFile.name
      );

    if (
      !supported.includes(
        extension
      )
    ) {
      toast(
        "Unsupported file type. Use txt, csv, json, or log.",
        "error"
      );

      return;
    }

    if (
      selectedFile.size >
      MAX_FILE_SIZE
    ) {
      toast(
        "File is larger than the 500 MB limit.",
        "error"
      );

      return;
    }

    if (selectedFile.size === 0) {
      toast(
        "The selected file is empty.",
        "error"
      );

      return;
    }

    setFile({
      name: selectedFile.name,
      size: selectedFile.size,
      type: extension,
    });

    setProgress(0);
    setResult(null);
    setError("");

    uploadAndAnalyze(
      selectedFile
    );
  };

  const onDrop = (
    event: React.DragEvent
  ) => {
    event.preventDefault();
    setDragging(false);

    const droppedFile =
      event.dataTransfer.files[0];

    if (droppedFile) {
      handleFile(droppedFile);
    }
  };

  const analysisSteps = [
    "Parsing log structure…",
    "Checking suspicious patterns…",
    "Analyzing authentication events…",
    "Calculating threat indicators…",
    "Scoring results…",
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-white">
          Upload Logs
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Upload log files for real backend
          analysis and threat detection.
        </p>
      </div>

      {/* Hidden input */}
      <input
        ref={inputRef}
        type="file"
        accept={supported.join(",")}
        className="hidden"
        onChange={(event) => {
          const selected =
            event.target.files?.[0];

          if (selected) {
            handleFile(selected);
          }
        }}
      />

      <AnimatePresence mode="wait">
        {/* Idle */}
        {phase === "idle" && (
          <motion.div
            key="dropzone"
            initial={{
              opacity: 0,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 0.98,
            }}
            onClick={() =>
              inputRef.current?.click()
            }
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() =>
              setDragging(false)
            }
            onDrop={onDrop}
            className={`relative cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed p-12 text-center transition-all ${dragging
                ? "border-accent-cyan bg-accent-cyan/5 shadow-glow-cyan"
                : "border-white/10 bg-white/[0.02] hover:border-accent-blue/40 hover:bg-white/[0.03]"
              }`}
          >
            <div className="absolute inset-0 bg-grid-pattern bg-[size:32px_32px] opacity-30" />

            <motion.div
              animate={{
                y: dragging ? -6 : 0,
              }}
              className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-blue/20 to-accent-cyan/20 ring-1 ring-accent-cyan/30"
            >
              <UploadCloud className="h-10 w-10 text-accent-cyan" />

              <div className="absolute inset-0 rounded-2xl bg-accent-cyan/20 blur-xl" />
            </motion.div>

            <h3 className="relative text-lg font-semibold text-white">
              {dragging
                ? "Drop to upload"
                : "Drag & drop your log files"}
            </h3>

            <p className="relative mt-1 text-sm text-slate-400">
              or{" "}
              <span className="font-medium text-accent-cyan">
                browse files
              </span>{" "}
              from your computer
            </p>

            <div className="relative mt-5 flex flex-wrap items-center justify-center gap-2">
              {supported.map(
                (extension) => (
                  <span
                    key={extension}
                    className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-2.5 py-1 font-mono text-xs text-slate-300"
                  >
                    {extension}
                  </span>
                )
              )}
            </div>
          </motion.div>
        )}

        {/* Processing / complete / error */}
        {phase !== "idle" && (
          <motion.div
            key="processing"
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="space-y-4"
          >
            <GlassCard
              hover={false}
              className="relative"
            >
              {/* File header */}
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent-blue to-accent-cyan">
                  <FileText className="h-6 w-6 text-white" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-white">
                    {file?.name}
                  </p>

                  <p className="text-xs text-slate-500">
                    {file
                      ? formatFileSize(
                        file.size
                      )
                      : "—"}{" "}
                    · {file?.type} ·{" "}
                    {phase === "complete"
                      ? "Analysis complete"
                      : phase ===
                        "error"
                        ? "Analysis failed"
                        : phase ===
                          "analyzing"
                          ? "Analyzing…"
                          : "Uploading…"}
                  </p>
                </div>

                {phase ===
                  "complete" ? (
                  <CheckCircle2 className="h-6 w-6 shrink-0 text-accent-emerald" />
                ) : phase ===
                  "error" ? (
                  <AlertTriangle className="h-6 w-6 shrink-0 text-accent-red" />
                ) : (
                  <button
                    onClick={reset}
                    className="text-slate-500 hover:text-white"
                    title="Cancel"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Real upload progress */}
              {phase ===
                "uploading" && (
                  <div className="mt-4">
                    <div className="mb-1.5 flex justify-between text-xs">
                      <span className="text-slate-400">
                        Uploading…
                      </span>

                      <span className="font-mono text-accent-cyan">
                        {progress}%
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-white/[0.05]">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-accent-blue to-accent-cyan"
                        animate={{
                          width: `${progress}%`,
                        }}
                        transition={{
                          duration: 0.15,
                        }}
                      />
                    </div>
                  </div>
                )}

              {/* Analysis */}
              {phase ===
                "analyzing" && (
                  <div className="mt-4 space-y-2.5">
                    {analysisSteps.map(
                      (
                        step,
                        index
                      ) => (
                        <motion.div
                          key={step}
                          initial={{
                            opacity: 0,
                            x: -10,
                          }}
                          animate={{
                            opacity: 1,
                            x: 0,
                          }}
                          transition={{
                            delay:
                              index *
                              0.15,
                          }}
                          className="flex items-center gap-3 text-sm"
                        >
                          <Loader2 className="h-4 w-4 animate-spin text-accent-cyan" />

                          <span className="text-slate-300">
                            {step}
                          </span>
                        </motion.div>
                      )
                    )}

                    <div className="relative mt-2 h-1 overflow-hidden rounded-full bg-white/[0.04]">
                      <div className="absolute inset-0 animate-scan bg-gradient-to-r from-transparent via-accent-cyan to-transparent" />
                    </div>
                  </div>
                )}

              {/* Error */}
              {phase === "error" && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="mt-4 space-y-4"
                >
                  <div className="flex items-start gap-3 rounded-xl border border-accent-red/20 bg-accent-red/5 p-3">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-accent-red" />

                    <div>
                      <p className="text-sm font-semibold text-white">
                        Analysis failed
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {error}
                      </p>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    icon={
                      <RefreshCw className="h-3.5 w-3.5" />
                    }
                    onClick={() => {
                      if (
                        inputRef.current
                      ) {
                        inputRef.current.click();
                      }
                    }}
                  >
                    Try Another File
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={reset}
                  >
                    Reset
                  </Button>
                </motion.div>
              )}

              {/* Real results */}
              {phase ===
                "complete" &&
                result && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="mt-4 space-y-3"
                  >
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3 text-center">
                        <p className="font-mono text-xl font-bold text-accent-red">
                          {result.threats}
                        </p>

                        <p className="text-[10px] text-slate-500">
                          Critical
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3 text-center">
                        <p className="font-mono text-xl font-bold text-accent-amber">
                          {result.anomalies}
                        </p>

                        <p className="text-[10px] text-slate-500">
                          Suspicious
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3 text-center">
                        <p className="font-mono text-xl font-bold text-accent-emerald">
                          {result.clean}
                        </p>

                        <p className="text-[10px] text-slate-500">
                          Clean
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3 text-center">
                        <p className="font-mono text-xl font-bold text-accent-cyan">
                          {result.totalLines}
                        </p>

                        <p className="text-[10px] text-slate-500">
                          Log Lines
                        </p>
                      </div>
                    </div>

                    <div
                      className={`flex items-center gap-2 rounded-xl border p-3 ${result.threatLevel ===
                          "Critical"
                          ? "border-accent-red/20 bg-accent-red/5"
                          : result.threatLevel ===
                            "Suspicious"
                            ? "border-accent-amber/20 bg-accent-amber/5"
                            : "border-accent-emerald/20 bg-accent-emerald/5"
                        }`}
                    >
                      {result.threatLevel ===
                        "Clean" ? (
                        <ShieldCheck className="h-5 w-5 text-accent-emerald" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-accent-amber" />
                      )}

                      <span className="text-sm text-slate-200">
                        Analysis complete. Overall
                        status:{" "}
                        <strong>
                          {
                            result.threatLevel
                          }
                        </strong>
                        .
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        icon={
                          <ScanLine className="h-3.5 w-3.5" />
                        }
                        onClick={() =>
                          toast(
                            "Detailed report generation will be connected next.",
                            "info"
                          )
                        }
                      >
                        View Report
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={reset}
                      >
                        Upload Another
                      </Button>
                    </div>
                  </motion.div>
                )}
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            title: "Max file size",
            val: "500 MB",
            icon: FileText,
          },
          {
            title: "Analysis",
            val: "Real-time",
            icon: Loader2,
          },
          {
            title: "Detection",
            val: "Pattern based",
            icon: ShieldCheck,
          },
        ].map((card) => (
          <GlassCard
            key={card.title}
            delay={0.1}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.03] ring-1 ring-white/10">
              <card.icon className="h-5 w-5 text-accent-cyan" />
            </div>

            <div>
              <p className="text-xs text-slate-500">
                {card.title}
              </p>

              <p className="font-mono text-sm font-semibold text-white">
                {card.val}
              </p>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}