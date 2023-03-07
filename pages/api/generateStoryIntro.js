import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const introPromptOne = "Generate an introduction to the story '";
// + user selected title
const intoPromptTwo =  "'. The introduction should give a character introduction and provide some backstory for the adventure. "
// + user input childs name
const intoPromptThree = " is the main character of the story and also the reader. Give a vivid description for the back story. The story will be a choose your own adventure story so finish the introduction with two distinct and detailed options for the reader to go on. Do not include any references to books when creating the story options. Only list the story options. Do not add anything additional past the two options. Only number the option and do not use the word 'Option' for each choice. Make sure each option starts on a new line."
const generateStoryIntroAction = async (req, res) => {
  // Run first prompt
  //console.log(`API: ${basePromptPrefix}${req.body.userInput}`)
  console.log(`API: ${introPromptOne}${req.body.selection}${intoPromptTwo}${req.body.userInput_ChildName}${intoPromptThree}`)

  let message = introPromptOne + req.body.selection + intoPromptTwo + req.body.userInput_ChildName + intoPromptThree;
  const baseCompletion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
          //{"role": "system", "content": "You are childrens adventure story introduction generator. This part of your task is to generate an introduction to the story for a given title. The introduction should give a heros introduction and breief setup for the adventure. Do not write more than the introduction. End the introduction with two unique selections are are detailed but no longer than one sentence."},
          {'role': 'user', 'content': message}
      ]
    })
  /*co nst baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${introPromptOne}${req.body.selection}${intoPromptTwo}${req.body.userInput_ChildName}${intoPromptThree}\n`,
    temperature: 0.9,
    max_tokens: 512,
  }); */
  
  //const basePromptOutput = baseCompletion.data.choices.pop();
  const basePromptOutput = baseCompletion.data.choices[0].message;

  res.status(200).json({ output: basePromptOutput });
};

export default generateStoryIntroAction;