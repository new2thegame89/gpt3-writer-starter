import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const introPromptOne = "Write me the introduction to a children'"+"s story based on the title “";
// + user selected title
const intoPromptTwo =  "”. Give "
// + user input childs name
const intoPromptThree = " a hero's background introduction. End the introduction with two specific choices for the reader to pick in a choose your own adventure style\nFormat: Have each choice numbered in its own paragraph.\nStory:"
const generateStoryIntroAction = async (req, res) => {
  // Run first prompt
  //console.log(`API: ${basePromptPrefix}${req.body.userInput}`)
  console.log(`API: ${introPromptOne}${req.body.selection}${intoPromptTwo}${req.body.userInput_ChildName}${intoPromptThree}`)

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${introPromptOne}${req.body.selection}${intoPromptTwo}${req.body.userInput_ChildName}${intoPromptThree}\n`,
    temperature: 0.9,
    max_tokens: 512,
  });
  
  const basePromptOutput = baseCompletion.data.choices.pop();

  res.status(200).json({ output: basePromptOutput });
};

export default generateStoryIntroAction;