import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const P2PromptOne = "“Continue the story of ";
// + user selected title
const P2PromptTwo =  " and continue the story given the choice to "
// + user selected CYOA
const P2PromptThree = ". End this section of the story with another choose your own adventure style action choice. Present another character that "
// + Child Name
const P2PromptFour = " can interact with in vivid detail.\nFormat: Have each choice numbered in its own paragraph.\n Here is the backstory: "
const finalPrompt = "\n Continue the story here: "
const generateStoryP2Action = async (req, res) => {
  // Run first prompt
  //console.log(`API: ${basePromptPrefix}${req.body.userInput}`)
  console.log(`API: ${P2PromptOne}${req.body.selectedTitle}${P2PromptTwo}${req.body.selectionToUse}${P2PromptThree}${req.body.userInput_ChildName}${P2PromptFour}${req.body.apiIntroOutput}${finalPrompt}`)

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${P2PromptOne}${req.body.selectedTitle}${P2PromptTwo}${req.body.selectionToUse}${P2PromptThree}${req.body.userInput_ChildName}${P2PromptFour}${req.body.apiIntroOutput}${finalPrompt}\n`,
    temperature: 0.9,
    max_tokens: 750,
  });
  
  const basePromptOutput = baseCompletion.data.choices.pop();

  res.status(200).json({ output: basePromptOutput });
};

export default generateStoryP2Action;