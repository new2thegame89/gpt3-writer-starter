import Head from 'next/head';
import Image from 'next/image';
import buildspaceLogo from '../assets/buildspace-logo.png';
import { useState } from 'react';
import generateAction from './api/generate';
import generateStoryIntroAction from './api/generateStoryIntro';

let savedSelections = 'tmp'

const Home = () => {
  // Set up story character based on user input
  const [userInput_ChildName, setUserInput_ChildName] = useState('')
  const [userInput_Gender, setUserInput_Gender] = useState('')
  // Original Build Space 
  const [userInput, setUserInput] = useState('')
  const [apiOutput, setApiOutput] = useState('')
  const [apiIntroOutput, setApiIntroOutput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isIntroGenerating, setIsIntroGenerating] = useState(false)
  const [isIntro, setIsIntro] = useState(false)
  const [isTitleGenerated, setTitleGenerated] = useState(false)
  const [selectedTitle, setSelectedTitle] = useState('')
  const [generatedIntro, setGeneratedIntro] = useState('')

  const [hasBeenCalled, setHasBeenCalled] = useState('');

  function makeButtons(element_id,inputArray,enableGen) {
    // create a new array starting at the second element of the input array
    const buttonsArray = inputArray//.slice(1);
    //console.log('here is buttonArray....')
    //console.log(buttonsArray)
    // create a container element to hold the buttons
    const container = document.createElement('div');
    container.id = element_id;
    //console.log('here is container....')
    //console.log(container)
  
    // create a button for each element in the input array
    buttonsArray.forEach((element) => {
      const button = document.createElement('button');
      button.id = element_id;
      button.innerHTML = element;
      button.className = 'button-holder'
  
      // attach an onclick event handler to the button
      button.onclick = async () => {
        // capture the index and content of the selection
        const selection = element; //{ index, content: element };
        console.log('selection:', selection)
        // save the selection (how you save the selection is up to you)
        
        saveSelection(selection,element_id);

        if (enableGen) {
          // Call the intro generator
          callStoryIntroEndpoint()
        }
      };
  
      // add the button to the container element
      container.appendChild(button);
    });
    
    // append the container element to the DOM
    document.getElementById(element_id).appendChild(container);
  }

  function saveSelection(selection,element_id) {
    selection = selection.replace(/[0-9.]/g, "");
    savedSelections=selection;
    if (element_id === 'choose-title-container') {
      setSelectedTitle(savedSelections);
    } else if (element_id === 'choose-one-button-container') {
      console.log('success')
    }
    
  }

  const callGenerateEndpoint = async () => {
    setIsGenerating(true);
    setTitleGenerated(true);

    console.log("Calling OpenAI...")
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInput_Gender, userInput_ChildName }),
      //body: JSON.stringify({ userInput }),
    });

    const data = await response.json();
    const { output } = data;
    console.log("OpenAI replied...", output.text)

    setApiOutput(`${output.text}`);
    console.log("------")
    console.log(output.text.split(/(\d+)/))
    console.log("------")
    console.log(output.text.split(/\r?\n|\r|\n/g))
    const GeneratedTitles = output.text.split(/\r?\n|\r|\n/g)
    makeButtons('choose-title-container',GeneratedTitles.slice(1),1)
    setIsGenerating(false);
    //setSelectedTitle(false);
  }

  function timeout(delay) {
    return new Promise( res => setTimeout(res, delay) );
}

  const callStoryIntroEndpoint = async () => {
    setHasBeenCalled(false);
    setIsIntroGenerating(true);
    //setTitleGenerated(true);
    //await timeout(1000);

    console.log("Calling OpenAI to generate intro...") 
    const response = await fetch('/api/generateStoryIntro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ selectedTitle, userInput_ChildName }),
      //body: JSON.stringify({ userInput }),
    });

    const data = await response.json();
    const { output } = data;
    console.log("OpenAI replied with an intro...", output.text)

    //setApiIntroOutput(`${output.text}`);
    console.log('here i am')
    //console.log(output.text.split(' '))
    const GeneratedIntro = output.text.split(/\r?\n|\r|\n/g)
    //setApiIntroOutput(GeneratedIntro);
    
    // find the index to option 1 and 2
    let idx1 = []
    let idx2 = []
    for (let i=0; i < GeneratedIntro.length; i++) {
      if (GeneratedIntro[i][0] === '1'){
        idx1 = i;
        console.log(GeneratedIntro.slice(0,idx1))
        setGeneratedIntro(GeneratedIntro.slice(0,idx1))
      }
      if (GeneratedIntro[i][0] === '2'){
        idx2 = i;
      }
    }
    setApiIntroOutput(GeneratedIntro.slice(0,idx1));
    console.log(GeneratedIntro.slice(0,idx1));
    console.log(GeneratedIntro[idx1])
    console.log(GeneratedIntro[idx2])
    makeButtons('choose-one-button-container',[GeneratedIntro[idx1],GeneratedIntro[idx2]],0)
    setIsIntroGenerating(false);
    //setSelectedTitle(true);
    setHasBeenCalled(false);
    console.log("has been called? ",hasBeenCalled)
  }

  const onUserChangedText = (event) => {
    setUserInput(event.target.value);
  }

  const onUserChangedNameText = (event) => {
    setUserInput_ChildName(event.target.value);
  }

  const onUserChangedGenderText = (event) => {
    setUserInput_Gender(event.target.value);
  }

  

  return (
    <div className="root">
      <Head>
        <title>Dream Train Studios</title>
        {/*<script src="http://code.jquery.com/jquery-1.11.0.min.js"></script>*/}
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>Choose your own adventure bedtime story generator</h1>
          </div>
          <div className="header-subtitle">
            <h2>Generate a custom bedtime story unique to your little one every night</h2>
          </div>
        </div>
        {/* This is my attempt to layout the CYOA flow */}
        {/* Step 1: Create a few text boxes for childs name, gender, etc.*/}
        {/* Make text and container for step 1 */}
        <div className='child-name'>
          <div className='child-header-container'>
            <div className='output-header'>
              <h3>Step 1: Input your childs name</h3>
            </div>
          </div>
        </div>
        <div className="prompt-container">
          <textarea
            className="prompt-box"
            placeholder='Enter your childs first name'
            value={userInput_ChildName}
            onChange={onUserChangedNameText} />
        </div>
        {/* Make text and container for step 2 */}
        <div className='child-gender'>
          <div className='child-gender-header-container'>
            <div className='output-header'>
              <h3>Step 2: Input your childs gender (boy / girl)</h3>
            </div>
          </div>
        </div>
        <div className="prompt-container">
          <textarea
            className="prompt-box"
            placeholder='Enter your childs gender'
            value={userInput_Gender}
            onChange={onUserChangedGenderText} />
        </div>
        {/* Make text to describe step 3 and have generate OpenAI button */}
        <div className='generate-title'>
          <div className='generate-title-header-container'>
            <div className='output-header'>
              <h3>Thanks for that. Now, click below to see some title of adventures we can go on.</h3>
            </div>
          </div>
        </div>
        <div className='prompt-buttons'>
            <a className={isGenerating ? 'generate-button loading' : 'generate-button'} onClick={callGenerateEndpoint}>
              <div className="generate">
              {isGenerating ? <span class="loader"></span> : <p>Let's see some titles!</p>}
              </div>
            </a>
          </div>
        {/* Attempt to print out generated titles into unique buttons */}
        {isTitleGenerated && (
          <div className='generate-title'>
            <div className='generate-title-header-container'>
              <div className='output-header'>
                <h3>Here are some adventures we can go on. Click one to begin the adventure!</h3>
              </div>
            </div>
            <div id="choose-title-container">
            </div>
          </div>
        ) }
        {/* ok great, now lets work on step 4, using the selected title to generate the beingging of the story*/}
        {selectedTitle && (
          <div>
            <div className='generate-title'>
              <div className='generate-title-header-container'>
                <div className='output-header'>
                  <h3>Awesome choice! Let's start our adventure.  </h3>
                  <h3>Dream Cloud Studios presents:</h3>
                  <div className='output-content'>
                    <h3> {selectedTitle} </h3>
                      <div className='output-content'>
                        <p>{apiIntroOutput}</p>
                        <div id="choose-one-button-container">
                        </div>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* let's see if it works better by having it's own section to print the first part of the story
        {apiIntroOutput && (
          <div className='output-content'>
            <p>{apiIntroOutput}</p>
            <div id='choose-one-button-container'>
            </div>
          </div>
        )} */}
        
        {/* This is the bit of code for the text entry box*/}
        <div className="prompt-container">
          <textarea
            className="prompt-box"
            placeholder='start typing here'
            value={userInput}
            onChange={onUserChangedText} />
          {/* This is for the generate button */}
          <div className='prompt-buttons'>
            <a className={isGenerating ? 'generate-button loading' : 'generate-button'} onClick={callGenerateEndpoint}>
              <div className="generate">
              {isGenerating ? <span class="loader"></span> : <p>Generate</p>}
              </div>
            </a>
          </div>
          {/* Display OpenAI response to message box*/}
          {apiOutput && (
            <div className='output'>
              <div className='output-header-container'>
                <div className='output-header'>
                  <h3>Output</h3>
                </div>
              </div>
            <div className='output-content'>
              <p>{apiOutput}</p>
            </div>
          </div>
          )}
        </div>
      </div>
      <div className="badge-container grow">
        <a
          href="https://buildspace.so/builds/ai-writer"
          target="_blank"
          rel="noreferrer"
        >
          <div className="badge">
            <Image src={buildspaceLogo} alt="buildspace logo" />
            <p>build with buildspace</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Home;
