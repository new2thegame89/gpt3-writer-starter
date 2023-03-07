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

let promptCombo = 'Continue the story but building off the selection of SELECTION. Introduce another character for CHILD_NAME to interact with. There should be some perception of danger but nothing too scary. This is a continuation of the choose your own adventure story so finish this next part with two distinct and detailed options for the reader to go on. Do not include any references to books, only the story options. Do not add anything additional past the two options. Do not onclude the word "options" in the output';
const generateStoryP2Action = async (req, res) => {
  let message = promptCombo + '\n' + 'SELECTION: ' + req.body.selectionToUse + '\n' + 'CHILD_NAME: ' + req.body.userInput_ChildName;
  const baseCompletion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
          //{"role": "system", "content": "You are childrens adventure story introduction generator. This part of your task is to generate an introduction to the story for a given title. The introduction should give a heros introduction and breief setup for the adventure. Do not write more than the introduction. End the introduction with two unique selections are are detailed but no longer than one sentence."},
          {'role': 'user', 'content': message}
      ]
    })

    const basePromptOutput = baseCompletion.data.choices[0].message;
  // Run first prompt
  //console.log(`API: ${basePromptPrefix}${req.body.userInput}`)
  /* console.log(`API: ${P2PromptOne}${req.body.selectedTitle}${P2PromptTwo}${req.body.selectionToUse}${P2PromptThree}${req.body.userInput_ChildName}${P2PromptFour}${req.body.apiIntroOutput}${finalPrompt}`)

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${P2PromptOne}${req.body.selectedTitle}${P2PromptTwo}${req.body.selectionToUse}${P2PromptThree}${req.body.userInput_ChildName}${P2PromptFour}${req.body.apiIntroOutput}${finalPrompt}\n`,
    temperature: 0.9,
    max_tokens: 750,
  });
  
  const basePromptOutput = baseComple tion.data.choices.pop(); */

  res.status(200).json({ output: basePromptOutput });
};

export default generateStoryP2Action;