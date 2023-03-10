import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const titlePromptOne = 'Generate 10 titles for a childrens bedtime story for a ';
// + user input gender
const titlePromptTwo =  ' named '
// + user input childs name
const titlePromptThree = 'The titles should be adventure themed and sound exciting. Do not return anything other than the titles';
const generateAction = async (req, res) => {
  // Run first prompt
  //console.log(`API: ${basePromptPrefix}${req.body.userInput}`)
  console.log(`API: ${titlePromptOne}${req.body.userInput_Gender}${titlePromptTwo}${req.body.userInput_ChildName}${titlePromptThree}`)
  let message = titlePromptOne + req.body.userInput_Gender + titlePromptTwo + req.body.userInput_ChildName + titlePromptThree;
  const baseCompletion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
          //{"role": "system", "content": "You are childrens adventure story generator. This part of your task is to generate titles for the bedtime story. 10 titles should be generated"},
          {'role': 'user', 'content': message}
      ]
    })
  /* const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${titlePromptOne}${req.body.userInput_Gender}${titlePromptTwo}${req.body.userInput_ChildName}${titlePromptThree}${req.body.userInput_ChildName}${titlePromptFour}\n`,
    temperature: 0.9,
    max_tokens: 512,
  }); */
  
  const basePromptOutput = baseCompletion.data.choices[0].message;

  console.log(basePromptOutput)

  res.status(200).json({ output: basePromptOutput });
};

export default generateAction;