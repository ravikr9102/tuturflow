import React, { useEffect, useState, useCallback } from "react";
import { Bot, Mic, MicOff } from "lucide-react";
import { useAuthContext } from "../context/AuthContext";
import { useCredits } from "../hooks/useCredits";
import { deductCredits } from "../services/credits.service";
import { CALL_MINUTE_COST } from "../types/credits";
import { SynthFlowService } from "../services/synthflow.service";

interface VoiceWidgetProps {
  apiKey?: string;
}

export const VoiceWidget: React.FC<VoiceWidgetProps> = ({
  apiKey = import.meta.env.VITE_SYNTHFLOW_API_KEY,
}) => {
  const [widgetUrl, setWidgetUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callStartTime, setCallStartTime] = useState<number | null>(null);
  const [callTimer, setCallTimer] = useState<NodeJS.Timeout | null>(null);
  const { user } = useAuthContext();
  const { credits } = useCredits(user?.uid || null);

  const handleCallStart = useCallback(async () => {
    if (!user || !credits || credits.callMinutes < CALL_MINUTE_COST) {
      setError("Insufficient credits to start the call");
      return false;
    }

    try {
      const success = await deductCredits(
        user.uid,
        CALL_MINUTE_COST,
        "call",
        "Voice interaction with AI tutor"
      );

      if (!success) {
        setError("Failed to deduct credits");
        return false;
      }

      setIsCallActive(true);
      setCallStartTime(Date.now());

      const timer = setInterval(async () => {
        if (!user || !credits || credits.callMinutes < CALL_MINUTE_COST) {
          clearInterval(timer);
          setIsCallActive(false);
          setCallStartTime(null);
          setError("Insufficient credits to continue the call");
          return;
        }

        try {
          const success = await deductCredits(
            user.uid,
            CALL_MINUTE_COST,
            "call",
            "Voice interaction with AI tutor"
          );

          if (!success) {
            clearInterval(timer);
            setIsCallActive(false);
            setCallStartTime(null);
            setError("Failed to deduct credits");
          }
        } catch (error) {
          console.error("Error deducting credits:", error);
          clearInterval(timer);
          setIsCallActive(false);
          setCallStartTime(null);
          setError("Failed to deduct credits");
        }
      }, 60000);

      setCallTimer(timer);
      return true;
    } catch (error) {
      console.error("Error starting call:", error);
      setError("Failed to start call");
      return false;
    }
  }, [user, credits]);

  const handleCallEnd = useCallback(() => {
    if (callTimer) {
      clearInterval(callTimer);
      setCallTimer(null);
    }
    setIsCallActive(false);
    setCallStartTime(null);
    setError(null);
  }, [callTimer]);

  useEffect(() => {
    if (apiKey) {
      try {
        const synthFlow = new SynthFlowService(apiKey);
        setWidgetUrl(synthFlow.getWidgetUrl());
        setError(null);

        const cleanup = synthFlow.setupMessageListener(
          handleCallStart,
          handleCallEnd
        );

        return () => {
          cleanup();
          if (callTimer) {
            clearInterval(callTimer);
          }
        };
      } catch (err) {
        setError("Failed to initialize voice widget");
        console.error("Voice widget initialization error:", err);
      }
    }
  }, [apiKey, handleCallStart, handleCallEnd, callTimer]);

  if (!apiKey) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Voice widget configuration is missing</p>
      </div>
    );
  }

  const canMakeCall =
    user && credits && credits.callMinutes >= CALL_MINUTE_COST;
  const callDuration = callStartTime
    ? Math.floor((Date.now() - callStartTime) / 1000)
    : 0;

  return (
    <div className="max-w-3xl mx-auto h-full">
      <div className="flex items-start space-x-4 mb-6">
        <div className="flex-shrink-0">
          <Bot className="h-8 w-8 text-indigo-600" />
        </div>
        <div className="flex-grow">
          <p className="text-gray-700">
            Hello! I'm your AI tutor. How can I help you with your studies
            today?
          </p>
          {user && (
            <div className="flex items-center gap-4 mt-2">
              <p className="text-sm text-gray-500">
                Available call minutes: {credits?.callMinutes || 0}
              </p>
              {isCallActive && (
                <p className="text-sm text-indigo-600">
                  Call duration: {Math.floor(callDuration / 60)}:
                  {(callDuration % 60).toString().padStart(2, "0")}
                </p>
              )}
            </div>
          )}
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </div>
      </div>
      <div className="h-[calc(100%-80px)] relative">
        {!canMakeCall && (
          <div className="absolute inset-0 bg-gray-50/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="mb-4">
                <MicOff className="h-12 w-12 text-gray-400 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {!user ? "Voice Chat Locked" : "Insufficient Credits"}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {!user
                  ? "Log in to start voice interaction with your AI tutor"
                  : "Please purchase more credits to continue using voice chat"}
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Mic className="h-4 w-4" />
                <span>
                  {!user
                    ? "Voice interaction available after login"
                    : `${CALL_MINUTE_COST} credits per minute`}
                </span>
              </div>
            </div>
          </div>
        )}
        <div className="relative flex justify-center h-full overflow-y-scroll">
          {widgetUrl && (
            <iframe
              id="audio_iframe"
              src={widgetUrl}
              allow="microphone"
              style={{
                width: "100%",
                height: "160%",
                border: "none",
                background: "transparent",
                borderRadius: "0.5rem",
                pointerEvents: canMakeCall ? "auto" : "none",
              }}
            />
          )}
        </div>
      </div>

      <style>{`
        #audio_iframe {
          position: relative;
        }
        #audio_iframe::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 30px;
          background: white;
          z-index: 1000;
        }
        /* Hide Synthflow branding */
        #audio_iframe + div {
          display: none !important;
        }
        [class*="powered-by"] {
          display: none !important;
        }
      `}</style>
    </div>
  );
};
