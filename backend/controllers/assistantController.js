exports.askAssistant = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message is required",
            });
        }

        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({
                success: false,
                message: "OPENAI_API_KEY is not configured",
            });
        }

        const response = await fetch(
            "https://api.openai.com/v1/responses",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model:
                        process.env.OPENAI_MODEL ||
                        "gpt-5.6",
                    instructions:
                        "You are SentinelAI, a cybersecurity assistant. Give clear, practical security guidance. Do not claim to have performed actions you did not perform. For dangerous or destructive security actions, explain the safe approach instead.",
                    input: message.trim(),
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error(
                "OpenAI API Error:",
                data
            );

            return res.status(
                response.status
            ).json({
                success: false,
                message:
                    data?.error?.message ||
                    "AI request failed",
            });
        }

        const output =
            data.output
                ?.flatMap(
                    (item) =>
                        item.content || []
                )
                ?.filter(
                    (item) =>
                        item.type ===
                        "output_text"
                )
                ?.map(
                    (item) =>
                        item.text
                )
                ?.join("\n") || "";

        if (!output) {
            return res.status(500).json({
                success: false,
                message:
                    "AI returned an empty response",
            });
        }

        return res.status(200).json({
            success: true,
            message: output,
        });
    } catch (err) {
        console.error(
            "Assistant Error:",
            err
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to contact AI assistant",
        });
    }
};