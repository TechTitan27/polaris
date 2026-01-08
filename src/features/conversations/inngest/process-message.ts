import { inngest } from "@/inngest/client";
import { Id } from "../../../../convex/_generated/dataModel";
import { NonRetriableError } from "inngest";
import { convex } from "@/lib/convex-client";
import { api } from "../../../../convex/_generated/api";

interface MessageEvent {
  messageId: Id<"messages">;
}

export const processMessage = inngest.createFunction(
  {
    id: "process-message",
    cancelOn: [
      {
        event: "message/cancel",
        if: "event.data.messageId == async.data.messageId",
      },
    ],
    onFailure: async ({ event, step }) => {
      const { messageId } = event.data.event.data as MessageEvent;
      const internalKey = process.env.POLARIS_CONVEX_INTERNAL_KEY;

      // Update the message with error content
      if (internalKey) {
        await step.run("update-message-on-failure", async () => {
          await convex.mutation(api.system.updateMessageContent, {
            internalKey,
            messageId,
            content:
              "My apologies, I encountered an error while processing your request. Let me know if you need anything else!",
          });
        });
      }
    }
  },
  {
    event: "message/sent",
  },
  async ({ event, step }) => {
    const { messageId } = event.data as MessageEvent;

    const internalKey = process.env.POLARIS_CONVEX_INTERNAL_KEY; 

    if (!internalKey) {
      throw new NonRetriableError("POLARIS_CONVEX_INTERNAL_KEY is not configured");
    }

    await step.run("update-assistant-message", async () => {
      // Call Kortex API to get AI response
      try {
        const response = await fetch("https://uj1o2lxj--chat.functions.blink.new", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "aries_img123rd_789ftyu"
          },
          body: JSON.stringify({
            message: "Please provide a helpful response to the user's message. You are a coding assistant helping with code-related questions and tasks."
          })
        });

        const result = await response.json();
        
        let aiResponse = "I'm here to help with your coding questions. How can I assist you today?";
        
        if (result.success && result.response) {
          aiResponse = result.response;
        }

        // Update the message with AI response
        await convex.mutation(api.system.updateMessageContent, {
          internalKey,
          messageId,
          content: aiResponse
        });
      } catch (error) {
        console.error("Error calling Kortex API:", error);
        // Update with fallback message
        await convex.mutation(api.system.updateMessageContent, {
          internalKey,
          messageId,
          content: "I apologize, but I encountered an issue processing your message. Please try again."
        });
      }
    });
  }
);