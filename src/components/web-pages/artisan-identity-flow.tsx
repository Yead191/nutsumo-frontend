"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Camera,
  RotateCcw,
  Check,
  ImageIcon,
  RefreshCw,
  Loader2,
  AlertOctagon,
  Hourglass,
  CheckCircle2,
  ArrowRight,
  SwitchCamera,
} from "lucide-react";
import { toast } from "sonner";
import { submitArtisanIdentity, getIdentityStatus } from "@/helpers/next-fetch/apiActions/authActions";
import { getMyProfile } from "@/helpers/next-fetch/apiActions/profileActions";

type StepType =
  | "front_capture"
  | "front_confirm"
  | "back_capture"
  | "back_confirm"
  | "selfie_capture"
  | "selfie_confirm"
  | "submitting"
  | "under_review"
  | "verified"
  | "needs_update";

interface CapturedFiles {
  nidFront: File | null;
  nidFrontUrl: string | null;
  nidBack: File | null;
  nidBackUrl: string | null;
  selfie: File | null;
  selfieUrl: string | null;
}

export function ArtisanIdentityFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const [step, setStep] = React.useState<StepType>("front_capture");
  const [email, setEmail] = React.useState(emailParam);
  const [rejectionReason, setRejectionReason] = React.useState<string>("");
  const [isCheckingStatus, setIsCheckingStatus] = React.useState(true);

  // Captured files state
  const [files, setFiles] = React.useState<CapturedFiles>({
    nidFront: null,
    nidFrontUrl: null,
    nidBack: null,
    nidBackUrl: null,
    selfie: null,
    selfieUrl: null,
  });

  // Camera stream state
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = React.useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = React.useState(false);
  const [facingMode, setFacingMode] = React.useState<"user" | "environment">("environment");
  const [cameraError, setCameraError] = React.useState<string | null>(null);

  // Hidden file input refs
  const frontInputRef = React.useRef<HTMLInputElement | null>(null);
  const backInputRef = React.useRef<HTMLInputElement | null>(null);
  const selfieCameraInputRef = React.useRef<HTMLInputElement | null>(null);

  // 1. Initial Identity Status Check & Email Recovery
  React.useEffect(() => {
    async function init() {
      let activeEmail = emailParam;

      if (!activeEmail) {
        try {
          const profileRes = await getMyProfile();
          if (profileRes?.data?.email) {
            activeEmail = profileRes.data.email;
            setEmail(activeEmail);
          }
        } catch {
          // ignore
        }
      }

      if (!activeEmail) {
        setIsCheckingStatus(false);
        return;
      }

      try {
        const res = await getIdentityStatus(activeEmail);
        if (res?.success && res.data) {
          const status = res.data.identityStatus;
          if (status === "pending") {
            setStep("under_review");
          } else if (status === "verified") {
            setStep("verified");
          } else if (status === "needs_update") {
            setRejectionReason(
              res.data.identityRejectionReason ||
                "Our team has identified that your license / ID details are incorrect. Please correct them and resubmit your application with the updated documents."
            );
            setStep("needs_update");
          }
        }
      } catch (err) {
        console.error("Failed to check identity status:", err);
      } finally {
        setIsCheckingStatus(false);
      }
    }
    init();
  }, [emailParam]);

  // 2. Camera Handling
  const stopCamera = React.useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  }, [stream]);

  const startCamera = React.useCallback(
    async (mode: "user" | "environment") => {
      stopCamera();
      setCameraError(null);
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError(
          step.startsWith("selfie")
            ? "Live camera is required for selfie verification. Please use a device with a front camera."
            : "Camera not supported on this browser. Please upload from gallery."
        );
        return;
      }
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: mode,
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
        setStream(newStream);
        setCameraActive(true);
        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
        }
      } catch (err: any) {
        console.warn("Camera start error:", err);
        setCameraError(
          step.startsWith("selfie")
            ? "Camera permission denied or camera unavailable. Live selfie must be captured via camera."
            : "Camera permission denied or camera unavailable. Please upload a photo."
        );
        setCameraActive(false);
      }
    },
    [stopCamera, step]
  );

  // Auto start camera when entering a capture step
  React.useEffect(() => {
    if (
      step === "front_capture" ||
      step === "back_capture" ||
      step === "selfie_capture"
    ) {
      const mode = step === "selfie_capture" ? "user" : "environment";
      startCamera(mode);
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  // When video attaches, bind stream
  React.useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Toggle Camera
  const toggleCameraFacing = () => {
    const nextMode = facingMode === "environment" ? "user" : "environment";
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  // Snap photo from video stream
  const capturePhoto = (target: "nidFront" | "nidBack" | "selfie") => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (step.startsWith("selfie") || facingMode === "user") {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          toast.error("Failed to capture photo");
          return;
        }
        const file = new File([blob], target + "_" + Date.now() + ".jpg", { type: "image/jpeg" });
        const url = URL.createObjectURL(blob);

        if (target === "nidFront") {
          setFiles((prev) => ({ ...prev, nidFront: file, nidFrontUrl: url }));
          setStep("front_confirm");
        } else if (target === "nidBack") {
          setFiles((prev) => ({ ...prev, nidBack: file, nidBackUrl: url }));
          setStep("back_confirm");
        } else {
          setFiles((prev) => ({ ...prev, selfie: file, selfieUrl: url }));
          setStep("selfie_confirm");
        }
        stopCamera();
      },
      "image/jpeg",
      0.92
    );
  };

  // Handle file chosen from gallery/picker (ONLY for NID Front and NID Back)
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    target: "nidFront" | "nidBack"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPG, PNG, WebP).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image file size must be less than 10MB.");
      return;
    }

    const url = URL.createObjectURL(file);
    if (target === "nidFront") {
      setFiles((prev) => ({ ...prev, nidFront: file, nidFrontUrl: url }));
      setStep("front_confirm");
    } else {
      setFiles((prev) => ({ ...prev, nidBack: file, nidBackUrl: url }));
      setStep("back_confirm");
    }
    stopCamera();
  };

  // Direct camera capture fallback for mobile browsers on selfie
  const handleSelfieCameraOnly = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setFiles((prev) => ({ ...prev, selfie: file, selfieUrl: url }));
    setStep("selfie_confirm");
    stopCamera();
  };

  // Submit all 3 documents to the backend
  const handleSubmitAll = async () => {
    if (!files.nidFront || !files.nidBack || !files.selfie) {
      toast.error("Please provide Front ID, Back ID, and your Live Selfie.");
      return;
    }

    setStep("submitting");

    try {
      const formData = new FormData();
      formData.append("nidFront", files.nidFront);
      formData.append("nidBack", files.nidBack);
      formData.append("selfie", files.selfie);
      if (email) {
        formData.append("email", email);
      }

      const res = await submitArtisanIdentity(formData);
      if (res?.success) {
        toast.success(
          res.message || "Identity documents submitted! Your application is now under review."
        );
        setStep("under_review");
      } else {
        toast.error(res?.message || "Failed to submit verification. Please try again.");
        setStep("selfie_confirm");
      }
    } catch (err: any) {
      console.error("submitArtisanIdentity error:", err);
      toast.error(err?.message || "An unexpected error occurred during submission.");
      setStep("selfie_confirm");
    }
  };

  if (isCheckingStatus) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#FE375D] mb-4" />
        <p className="text-sm font-semibold text-slate-700">Verifying identity session...</p>
      </div>
    );
  }

  // SCREEN 9: APPLICATION SUBMITTED / UNDER REVIEW
  if (step === "under_review") {
    return (
      <div className="w-full max-w-sm mx-auto text-center py-8 px-4 flex flex-col items-center animate-in fade-in duration-300">
        <div className="relative mb-8 mt-4">
          <div className="w-28 h-28 rounded-full border-4 border-dashed border-[#FE375D] flex items-center justify-center animate-[spin_12s_linear_infinite]"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-[#FE375D]/10 flex items-center justify-center text-[#FE375D]">
              <Hourglass className="w-8 h-8 stroke-[2.5] animate-pulse" />
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold font-display text-[#FE375D] mb-3">
          Application Submitted!
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xs mb-8">
          Your request is now under review by the admin. Once the admin approves it, you will receive a notification.
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold mb-8">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          Status: Verification In Progress
        </div>

        <div className="w-full space-y-3">
          <button
            type="button"
            onClick={async () => {
              if (!email) return;
              toast.info("Checking updated verification status...");
              const res = await getIdentityStatus(email);
              if (res?.data?.identityStatus === "verified") {
                setStep("verified");
              } else if (res?.data?.identityStatus === "needs_update") {
                setRejectionReason(res?.data?.identityRejectionReason || "");
                setStep("needs_update");
              } else {
                toast.info("Your application is still under review by the admin.");
              }
            }}
            className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Check Review Status</span>
          </button>

          <Link
            href="/"
            className="inline-block text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors pt-2"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  // SCREEN 10: SUCCESSFUL VERIFICATION
  if (step === "verified") {
    return (
      <div className="w-full max-w-sm mx-auto text-center py-8 px-4 flex flex-col items-center animate-in zoom-in-95 duration-300">
        <div className="w-full bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_12px_40px_rgba(0,0,0,0.06)] flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-[#FE375D] text-white flex items-center justify-center shadow-lg shadow-[#FE375D]/30 mb-5">
            <Check className="w-8 h-8 stroke-[3]" />
          </div>

          <h2 className="text-2xl font-bold font-display text-slate-900 mb-2">
            Successful!
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6">
            Your Artisan&apos;s account has been created successfully. You&apos;re all set to connect with trusted clients and get started.
          </p>

          <Link
            href="/pro"
            className="w-full h-12 rounded-xl bg-[#FE375D] hover:bg-[#e0284e] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(254,55,93,0.3)] transition-all group cursor-pointer"
          >
            <span>Get Started</span>
            <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-[#FE375D] transition-transform group-hover:translate-x-0.5">
              <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
            </span>
          </Link>
        </div>
      </div>
    );
  }

  // SCREEN 11: ALERT MESSAGE / UPDATE NEEDED
  if (step === "needs_update") {
    return (
      <div className="w-full max-w-sm mx-auto text-center py-8 px-4 flex flex-col items-center animate-in shake duration-300">
        <div className="w-20 h-20 rounded-2xl bg-[#FE375D]/10 text-[#FE375D] flex items-center justify-center mb-5">
          <AlertOctagon className="w-12 h-12 stroke-[2.2]" />
        </div>

        <h2 className="text-2xl font-bold font-display text-[#FE375D] mb-3">
          Update Needed!
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
          {rejectionReason ||
            "Our team has identified that your license / ID details are incorrect. Please correct them and resubmit your application with the updated documents."}
        </p>

        <div className="w-full mt-6">
          <button
            type="button"
            onClick={() => {
              setFiles({
                nidFront: null,
                nidFrontUrl: null,
                nidBack: null,
                nidBackUrl: null,
                selfie: null,
                selfieUrl: null,
              });
              setStep("front_capture");
            }}
            className="w-full h-12 rounded-xl bg-[#FE375D] hover:bg-[#e0284e] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(254,55,93,0.3)] transition-all group cursor-pointer"
          >
            <span>Update Now</span>
            <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-[#FE375D] transition-transform group-hover:translate-x-0.5">
              <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
            </span>
          </button>
        </div>
      </div>
    );
  }

  // SUBMITTING LOADER SCREEN
  if (step === "submitting") {
    return (
      <div className="w-full max-w-sm mx-auto text-center py-16 px-4 flex flex-col items-center">
        <Loader2 className="w-12 h-12 text-[#FE375D] animate-spin mb-4" />
        <h3 className="text-lg font-bold text-slate-900 mb-2">Uploading Documents...</h3>
        <p className="text-xs text-slate-500">
          Encrypting and submitting your ID Card and Live Selfie securely for admin review.
        </p>
      </div>
    );
  }

  // MULTI-STEP CAPTURE & CONFIRMATION
  const isSelfieStep = step.startsWith("selfie");
  let stepTitle = "Take Your National ID Card front side photo";
  let stepBadge = "STEP 1 OF 3 • FRONT ID";
  let isConfirmStep = false;
  let previewUrl: string | null = null;
  let currentTarget: "nidFront" | "nidBack" | "selfie" = "nidFront";

  if (step === "front_capture") {
    stepTitle = "Take Your National ID Card front side photo";
    stepBadge = "STEP 1 OF 3 • FRONT ID";
    currentTarget = "nidFront";
  } else if (step === "front_confirm") {
    stepTitle = "Take Your National ID Card front side photo";
    stepBadge = "CONFIRM FRONT ID";
    isConfirmStep = true;
    previewUrl = files.nidFrontUrl;
    currentTarget = "nidFront";
  } else if (step === "back_capture") {
    stepTitle = "Take Your ID Card back side photo";
    stepBadge = "STEP 2 OF 3 • BACK ID";
    currentTarget = "nidBack";
  } else if (step === "back_confirm") {
    stepTitle = "Take Your ID Card back side photo";
    stepBadge = "CONFIRM BACK ID";
    isConfirmStep = true;
    previewUrl = files.nidBackUrl;
    currentTarget = "nidBack";
  } else if (step === "selfie_capture") {
    stepTitle = "Take a Live Selfie";
    stepBadge = "STEP 3 OF 3 • CAMERA ONLY";
    currentTarget = "selfie";
  } else if (step === "selfie_confirm") {
    stepTitle = "Verify Your Live Selfie";
    stepBadge = "CONFIRM LIVE SELFIE";
    isConfirmStep = true;
    previewUrl = files.selfieUrl;
    currentTarget = "selfie";
  }

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col select-none">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-bold text-slate-900 tracking-tight">Nutsumo</p>
        <span className="text-[10px] font-bold tracking-wider uppercase text-[#FE375D] bg-[#FE375D]/10 px-2.5 py-0.5 rounded-full">
          {stepBadge}
        </span>
      </div>

      <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 leading-snug mb-1">
        {stepTitle}
      </h2>

      <p className="text-xs text-slate-500 mb-4">
        {isSelfieStep
          ? "Live camera verification only. Gallery upload is disabled for security."
          : "Position your ID card clearly within the viewfinder frame."}
      </p>

      <div className="relative w-full aspect-[4/5] bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 shadow-inner flex flex-col items-center justify-center">
        {isConfirmStep && previewUrl ? (
          <div className="relative w-full h-full bg-slate-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Verification Preview"
              className="w-full h-full object-contain"
            />
            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-medium text-white flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Captured</span>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full bg-slate-900 flex items-center justify-center">
            {cameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={"w-full h-full object-cover " + (isSelfieStep || facingMode === "user" ? "-scale-x-100" : "")}
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-center text-white/70">
                <Camera className="w-12 h-12 text-slate-400 mb-3" />
                <p className="text-xs font-medium text-white mb-1">
                  {isSelfieStep ? "Live Camera Required" : "Camera is initializing or disabled"}
                </p>
                <p className="text-[11px] text-slate-400 mb-4 max-w-xs">
                  {cameraError ||
                    (isSelfieStep
                      ? "To protect your identity, selfies must be taken live using your device camera."
                      : "You can allow browser camera access or upload an image directly from your gallery.")}
                </p>

                {isSelfieStep ? (
                  <button
                    type="button"
                    onClick={() => selfieCameraInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl bg-[#FE375D] hover:bg-[#e0284e] text-white text-xs font-semibold shadow-md flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Open Camera Directly</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (currentTarget === "nidFront") frontInputRef.current?.click();
                      else backInputRef.current?.click();
                    }}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-sm border border-white/20 flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Choose from Gallery</span>
                  </button>
                )}
              </div>
            )}

            {isSelfieStep ? (
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                <div className="w-48 h-64 border-2 border-dashed border-[#FE375D] rounded-[50%] shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" />
                <p className="mt-3 text-[11px] font-medium text-white/90 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full">
                  Align your face within the frame
                </p>
              </div>
            ) : (
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6">
                <div className="relative w-full aspect-[1.58/1] rounded-2xl border-2 border-dashed border-white/60 shadow-[0_0_0_9999px_rgba(0,0,0,0.35)] flex items-center justify-center">
                  <span className="absolute -top-1 -left-1 w-5 h-5 border-t-3 border-l-3 border-[#FE375D] rounded-tl-lg" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 border-t-3 border-r-3 border-[#FE375D] rounded-tr-lg" />
                  <span className="absolute -bottom-1 -left-1 w-5 h-5 border-b-3 border-l-3 border-[#FE375D] rounded-bl-lg" />
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 border-b-3 border-r-3 border-[#FE375D] rounded-br-lg" />
                </div>
                <p className="mt-3 text-[11px] font-medium text-white/90 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full">
                  Keep all 4 corners visible & clear
                </p>
              </div>
            )}

            {cameraActive && (
              <button
                type="button"
                onClick={toggleCameraFacing}
                title="Switch Camera"
                className="absolute top-3 right-3 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md transition-colors cursor-pointer"
              >
                <SwitchCamera className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      <input
        ref={frontInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileUpload(e, "nidFront")}
      />
      <input
        ref={backInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileUpload(e, "nidBack")}
      />
      <input
        ref={selfieCameraInputRef}
        type="file"
        accept="image/*"
        capture="user"
        className="hidden"
        onChange={handleSelfieCameraOnly}
      />

      <div className="mt-6 flex items-center justify-center gap-6 sm:gap-8">
        {isConfirmStep ? (
          <>
            {!isSelfieStep ? (
              <button
                type="button"
                onClick={() => {
                  if (currentTarget === "nidFront") frontInputRef.current?.click();
                  else backInputRef.current?.click();
                }}
                title="Pick from gallery"
                className="w-12 h-12 rounded-full border border-[#FE375D]/40 text-[#FE375D] hover:bg-[#FE375D]/10 flex items-center justify-center transition-all cursor-pointer"
              >
                <ImageIcon className="w-5 h-5" />
              </button>
            ) : null}

            <button
              type="button"
              onClick={() => {
                if (step === "front_confirm") {
                  setStep("back_capture");
                } else if (step === "back_confirm") {
                  setStep("selfie_capture");
                } else if (step === "selfie_confirm") {
                  handleSubmitAll();
                }
              }}
              title="Confirm and proceed"
              className="w-16 h-16 rounded-full bg-[#FE375D] hover:bg-[#e0284e] text-white flex items-center justify-center shadow-[0_8px_20px_rgba(254,55,93,0.35)] transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Check className="w-8 h-8 stroke-[3]" />
            </button>

            <button
              type="button"
              onClick={() => {
                if (step === "front_confirm") setStep("front_capture");
                else if (step === "back_confirm") setStep("back_capture");
                else setStep("selfie_capture");
              }}
              title="Retake photo"
              className="w-12 h-12 rounded-full border border-[#FE375D]/40 text-[#FE375D] hover:bg-[#FE375D]/10 flex items-center justify-center transition-all cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </>
        ) : (
          <div className="flex items-center gap-6">
            {!isSelfieStep ? (
              <button
                type="button"
                onClick={() => {
                  if (currentTarget === "nidFront") frontInputRef.current?.click();
                  else backInputRef.current?.click();
                }}
                title="Pick from gallery"
                className="w-12 h-12 rounded-full border border-slate-200 text-slate-600 hover:text-[#FE375D] hover:border-[#FE375D]/40 hover:bg-[#FE375D]/5 flex items-center justify-center transition-all cursor-pointer"
              >
                <ImageIcon className="w-5 h-5" />
              </button>
            ) : null}

            <button
              type="button"
              onClick={() => {
                if (cameraActive) {
                  capturePhoto(currentTarget);
                } else {
                  if (isSelfieStep) {
                    selfieCameraInputRef.current?.click();
                  } else {
                    if (currentTarget === "nidFront") frontInputRef.current?.click();
                    else backInputRef.current?.click();
                  }
                }
              }}
              title="Take photo"
              className="w-18 h-18 rounded-full bg-[#FE375D] hover:bg-[#e0284e] text-white flex items-center justify-center shadow-[0_8px_24px_rgba(254,55,93,0.4)] transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Camera className="w-8 h-8" />
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 flex items-center justify-center gap-2">
        <span
          className={"h-1.5 rounded-full transition-all " + (step.startsWith("front") ? "w-6 bg-[#FE375D]" : "w-1.5 bg-slate-300")}
        />
        <span
          className={"h-1.5 rounded-full transition-all " + (step.startsWith("back") ? "w-6 bg-[#FE375D]" : "w-1.5 bg-slate-300")}
        />
        <span
          className={"h-1.5 rounded-full transition-all " + (step.startsWith("selfie") ? "w-6 bg-[#FE375D]" : "w-1.5 bg-slate-300")}
        />
      </div>
    </div>
  );
}
