"use client";
import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

const Agent = ({ userName, userId, type }: AgentProps) => {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);

  const lastMessage = messages[messages.length - 1];
  const router = useRouter();

  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd = () => setCallStatus(CallStatus.FINISHED);

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };

        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    };

    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);
    const onError = (error: Error) => {
      console.error("Call error: ", error);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  useEffect(() => {
    if (callStatus === CallStatus.FINISHED) {
      router.push("/");
    }
  }, [messages, callStatus, type, userId]);

  const handleCall = async () => {
    if (callStatus === CallStatus.INACTIVE) {
      setCallStatus(CallStatus.CONNECTING);
    }
    await vapi.start(
      undefined, // Pass 'undefined' for the 'assistant' argument
      undefined, // Pass 'undefined' for the 'assistantOverrides' argument
      undefined, // Pass 'undefined' for the 'squad' argument
      process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, // Pass the Workflow ID here (Argument 3)
      {
        // Pass workflowOverrides here (Argument 4)
        variableValues: {
          username: userName,
          userid: userId,
        },
      },
    );

    //  try {
    //   const response = await fetch('/api/start-call', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       username: userName, // Use your state variables here
    //       userId: userId,     // Use your state variables here
    //     }),
    //   });

    //   console.log(response)

    //   if (!response.ok) {
    //     throw new Error('Failed to start Vapi call via backend API');
    //   }

    //   // 2. Get the session details from your API response
    //   const callSession = await response.json();

    //   console.log(callSession)
    //   // 3. The Vapi SDK should automatically pick up the session details
    //   // You may need to ensure your Vapi client instance is listening correctly.
    //   // In many Vapi implementations, once the call is initiated on the backend,
    //   // the web SDK connects automatically if listeners are set up correctly.

    //   // If needed, you can explicitly initiate connection using the returned sessionId
    //   // await vapi.start({ sessionId: callSession.id }); // Use this if automatic connection fails

    // } catch (error) {
    //   console.error("Error during call initiation:", error);
    //   setCallStatus(CallStatus.INACTIVE);
    // }
  };

  const handleDisconnect = async () => {
    if (callStatus === CallStatus.ACTIVE) {
      await vapi.stop();
    }
  };

  const latestMessage = messages[messages.length - 1]?.content;
  const isCallInactiveOrFinished =
    callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;

  return (
    <>
      <div className="call-view">
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              src={"/ai-avatar.png"}
              alt="vapi"
              width={65}
              height={54}
              className="object-cover"
            />
            {isSpeaking && <span className="animate-speak"></span>}
          </div>
          <h3>AI Interviewer</h3>
        </div>

        <div className="card-border">
          <div className="card-content">
            <Image
              src={"/user-avatar.png"}
              alt="user avatar"
              width={540}
              height={540}
              className="rounded-full object-cover size-[120px]"
            />

            <h3>{userName}</h3>
          </div>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p
              key={latestMessage}
              className={cn(
                "transition-opacity duration-500 opacity-0",
                "animate-fadeIn opacity-100",
              )}
            >
              {latestMessage}
            </p>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center">
        {callStatus !== "ACTIVE" ? (
          <button className="relative btn-call" onClick={handleCall}>
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75",
                callStatus !== "CONNECTING" && "hidden",
              )}
            />
            <span>{isCallInactiveOrFinished ? "Call" : "..."}</span>
          </button>
        ) : (
          <button className="btn-disconnect" onClick={handleDisconnect}>
            <span>End</span>
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;
