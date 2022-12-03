import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix = `
I talk to a famous psychologist who is also the my best  friend.
I am a women 47 years old, live alone, have some times a depression.
I ask the friend to advise me how to recover after a particular situation
Give me the answer of my friend in 1st person, in informal way about the following situation, 
Situation: 
`;

const generateAction = async (req, res) => {
  console.log(`API: ${basePromptPrefix}${req.body.userInput}`);

  const baseCompletion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `${basePromptPrefix}${req.body.userInput}`,
    temperature: 0.8,
    max_tokens: 250,
  });

  const basePromptOutput = baseCompletion.data.choices.pop();

  // I build Prompt #2.
  const secondPrompt = `
  I talk to a famous psychologist who is also the my best  friend.
  I am a women 47 years old, live alone, have some times a depression.
  I ask the friend to advise me how to recover after a particular situation
  Situation: ${req.body.userInput}

  I know that I should do ${basePromptOutput.text}
  Give me the answer of my friend in 1st person, be precise and give practical plan with steps.
  
  Frend:
  `;

  // I call the OpenAI API a second time with Prompt #2
  const secondPromptCompletion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `${secondPrompt}`,
    // I set a higher temperature for this one. Up to you!
    temperature: 0.85,
    // I also increase max_tokens.
    max_tokens: 1250,
  });

  // Get the output
  const secondPromptOutput = secondPromptCompletion.data.choices.pop();

  // Send over the Prompt #2's output to our UI instead of Prompt #1's.
  res.status(200).json({ output: secondPromptOutput });
};

export default generateAction;
