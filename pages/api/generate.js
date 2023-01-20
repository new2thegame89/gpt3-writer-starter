import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const titlePromptOne = 'Give me titles of children bedtime stories where the main character is a ';
// + user input gender
const titlePromptTwo =  ' named '
// + user input childs name
const titlePromptThree = '. The titles should give different types of adventures that ';
// + user input childs name
const titlePromptFour = ' could go on.';
const generateAction = async (req, res) => {
  // Run first prompt
  //console.log(`API: ${basePromptPrefix}${req.body.userInput}`)
  console.log(`API: ${titlePromptOne}${req.body.userInput_Gender}${titlePromptTwo}${req.body.userInput_ChildName}${titlePromptThree}${req.body.userInput_ChildName}${titlePromptFour}`)

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${titlePromptOne}${req.body.userInput_Gender}${titlePromptTwo}${req.body.userInput_ChildName}${titlePromptThree}${req.body.userInput_ChildName}${titlePromptFour}\n`,
    temperature: 0.9,
    max_tokens: 512,
  });
  
  const basePromptOutput = baseCompletion.data.choices.pop();

  res.status(200).json({ output: basePromptOutput });
};

export default generateAction;