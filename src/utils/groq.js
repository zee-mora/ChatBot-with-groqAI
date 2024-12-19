import { Groq } from "groq-sdk";

const GROQ_API = import.meta.env.VITE_API_KEY_GROQAI;

const groq = new Groq({
  apiKey: GROQ_API,
  dangerouslyAllowBrowser: true,
});

export const requestToGroq = async (content) => {
  try {
    const res = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content,
        },
      ],
      model: "llama3-70b-8192",
    });
    return res.choices[0].message.content;
  } catch (error) {
    console.error("Error making request to Groq:", error);
    throw error;
  }
};