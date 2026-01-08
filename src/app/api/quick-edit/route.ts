import { z } from "zod";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const quickEditSchema = z.object({
  editedCode: z
    .string()
    .describe(
      "The edited version of the selected code based on the instruction"
    ),
});

const URL_REGEX = /https?:\/\/[^\s>)\]]+/g;

const QUICK_EDIT_PROMPT = `You are a code editing assistant. Edit the selected code based on the user's instruction.

<context>
<selected_code>
{selectedCode}
</selected_code>
<full_code_context>
{fullCode}
</full_code_context>
</context>

{documentation}

<instruction>
{instruction}
</instruction>

<instructions>
Return ONLY the edited version of the selected code.
Maintain the same indentation level as the original.
Do not include any explanations or comments unless requested.
If the instruction is unclear or cannot be applied, return the original code unchanged.
Return the result as JSON: { "editedCode": "your edited code here" }
</instructions>`;

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    const { selectedCode, fullCode, instruction } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 400 }
      );
    }

    if (!selectedCode) {
      return NextResponse.json(
        { error: "Selected code is required" },
        { status: 400 }
      );
    }

    if (!instruction) {
      return NextResponse.json(
        { error: "Instruction is required" },
        { status: 400 }
      );
    }

    const urls: string[] = instruction.match(URL_REGEX) || [];
    let documentationContext = "";

    // Note: Firecrawl integration removed - will need to be implemented separately if needed
    if (urls.length > 0) {
      documentationContext = `\n\nDocumentation URLs referenced: ${urls.join(", ")}`;
    }

    const prompt = QUICK_EDIT_PROMPT
      .replace("{selectedCode}", selectedCode)
      .replace("{fullCode}", fullCode || "")
      .replace("{instruction}", instruction)
      .replace("{documentation}", documentationContext);

    // Call Kortex API
    const response = await fetch("https://uj1o2lxj--chat.functions.blink.new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "aries_img123rd_789ftyu"
      },
      body: JSON.stringify({
        message: prompt
      })
    });

    const result = await response.json();
    
    if (result.success && result.response) {
      try {
        const parsed = quickEditSchema.parse(JSON.parse(result.response));
        return NextResponse.json({ editedCode: parsed.editedCode });
      } catch (parseError) {
        // If parsing fails, try to extract edited code from the response
        const editedCodeMatch = result.response.match(/"editedCode"\s*:\s*"([^"]+)"/);
        if (editedCodeMatch) {
          return NextResponse.json({ editedCode: editedCodeMatch[1] });
        }
        return NextResponse.json({ editedCode: result.response });
      }
    } else {
      console.error("Edit error:", result.error);
      return NextResponse.json(
        { error: "Failed to generate edit" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Edit error:", error);
    return NextResponse.json(
      { error: "Failed to generate edit" },
      { status: 500 }
    );
  }
}