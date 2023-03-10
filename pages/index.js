import Head from 'next/head';
import Image from 'next/image';
import dreamtrainLogo from '../assets/Dream_Train-removebg-preview.png';
import buildspaceLogo from '../assets/buildspace-logo.png';
import { useEffect, useState , useRef } from 'react';
import generateAction from './api/generate';
import generateStoryIntroAction from './api/generateStoryIntro';
import generateStoryP2Action from './api/generateStoryP2';
import generateStoryP3Action from './api/generateStoryP3';

let savedSelections = 'tmp'

const Home = () => {
  // Set up story character based on user input
  const [userInput_ChildName, setUserInput_ChildName] = useState('')
  const [userInput_Gender, setUserInput_Gender] = useState('')
  // Original Build Space 
  const [userInput, setUserInput] = useState('')
  const [apiOutput, setApiOutput] = useState('')
  const [apiIntroOutput, setApiIntroOutput] = useState('')
  const ApiIntroOutputRef = useRef('');
  const [apiP2Output, setApiP2Output] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isIntroGenerating, setIsIntroGenerating] = useState(false)
  const [isP2Generating, setIsP2Generating] = useState(false)
  const [isIntro, setIsIntro] = useState(false)
  const [isTitleGenerated, setTitleGenerated] = useState(false)
  const [selectedTitle, setSelectedTitle] = useState('')
  const selectedTitleRef = useRef('')
  const selectedOptionRef = useRef('')
  const [selectedIntro, setSelectedIntro] = useState('')
  const [generatedIntro, setGeneratedIntro] = useState('')
  const [generatedP2, setGeneratedP2] = useState('')
  const [generatedP3, setGeneratedP3] = useState('')
  const [isP3Generating, setIsP3Generating] = useState(false)
  const [selectedP2, setSelectedP2] = useState('')
  const [apiP3Output, setApiP3Output] = useState('')

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
        button.className = 'button-holder loading'
        //button.className = 'loader'
        // capture the index and content of the selection
        const selection = element; //{ index, content: element };
        console.log('selection:', selection)
        // save the selection (how you save the selection is up to you)
        
        const done = saveSelection(selection,element_id);

        if (enableGen) {
          if ((element_id === 'choose-title-container') && done ){
              // Call the intro generator
              callStoryIntroEndpoint(selectedTitleRef.current)
          } else if ((element_id === 'choose-one-button-container') && done ){
            console.log('success')
            // Call the part 2 generator
            callStoryPart2Endpoint(selectedTitleRef.current,selection,ApiIntroOutputRef.current)
          } else if ((element_id === 'choose-two-button-container') && done ){ // should always be current step minus 1
            // call the part 3 generator
            console.log('hi mom')
            callStoryPart3Endpoint(selection)
          }
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
      selectedTitleRef.current = savedSelections;
      setSelectedTitle(prev => savedSelections);
    } else if (element_id === 'choose-one-button-container') {
      setSelectedIntro(prev => savedSelections);
    } else if (element_id === 'choose-two-button-container') {
      selectedOptionRef.current = savedSelections;
      setSelectedP2(prev => savedSelections);
    }
    return 1
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
    console.log("OpenAI replied...", output.content)

    setApiOutput(`${output.content}`);
    console.log("------")
    console.log(output.content.split(/(\d+)/))
    console.log("------")
    console.log(output.content.split(/\r?\n|\r|\n/g))
    const GeneratedTitles = output.content.split(/\r?\n|\r|\n/g)
    makeButtons('choose-title-container',GeneratedTitles.slice(2),1)
    setIsGenerating(false);
    //setSelectedTitle(false);
  }

  function timeout(delay) {
    return new Promise( res => setTimeout(res, delay) );
}

  const callStoryIntroEndpoint = async (selection) => {
    setHasBeenCalled(false);
    setIsIntroGenerating(true);
    //setTitleGenerated(true);
    //await timeout(1000);

    console.log("Calling OpenAI to generate intro...") 
    console.log(selection)
    const response = await fetch('/api/generateStoryIntro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ selection, userInput_ChildName }),
      //body: JSON.stringify({ userInput }),
    });

    const data = await response.json();
    const { output } = data;
    console.log("OpenAI replied with an intro...", output.content)

    //setApiIntroOutput(`${output.text}`);
    console.log('here i am')
    //console.log(output.text.split(' '))
    const GeneratedIntro = output.content.split(/\r?\n|\r|\n/g)
    //setApiIntroOutput(GeneratedIntro);
    console.log(GeneratedIntro[3])
    
    // find the index to option 1 and 2
    let idx1 = []
    let idx2 = []
    for (let i=0; i < GeneratedIntro.length; i++) {
      if (GeneratedIntro[i] == ''){
        GeneratedIntro[i] = '\n\n';
      }
      if ((GeneratedIntro[i][0] === '1') || (GeneratedIntro[i][7] === '1')){
        idx1 = i;
        console.log(GeneratedIntro.slice(0,idx1))
        setGeneratedIntro(GeneratedIntro.slice(0,idx1))
      }
      if ((GeneratedIntro[i][0] === '2') || (GeneratedIntro[i][7] === '2')){
        idx2 = i;
      }
    }
    setApiIntroOutput(GeneratedIntro.slice(1,idx1));
    ApiIntroOutputRef.current = GeneratedIntro.slice(1,idx1);
    console.log(GeneratedIntro.slice(1,idx1));
    console.log(GeneratedIntro[idx1])
    console.log(GeneratedIntro[idx2])
    makeButtons('choose-one-button-container',[GeneratedIntro[idx1],GeneratedIntro[idx2]],1)
    setIsIntroGenerating(false);
    //setSelectedTitle(true);
    setHasBeenCalled(false);
    console.log("has been called? ",hasBeenCalled)
  }

  const callStoryPart2Endpoint = async (selectedTitle,selection,apiIntroOutput) => {
    setHasBeenCalled(false);
    setIsP2Generating(true); //setIsIntroGenerating(true);

    console.log("Calling OpenAI to generate P2...") 
    const selectionToUse = selection.replace(/[0-9.]/g, "");
    const response = await fetch('/api/generateStoryP2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ selectedTitle, selectionToUse, userInput_ChildName , apiIntroOutput}), // do i need to include the api output from the previous step here to build off of?
      //body: JSON.stringify({ userInput }),
    });

    const data = await response.json();
    const { output } = data;
    console.log("OpenAI replied with Part2...", output.content)

    const GeneratedP2 = output.content.split(/\r?\n|\r|\n/g)
    //setApiIntroOutput(GeneratedIntro);
    
    // find the index to option 1 and 2
    let idx1 = []
    let idx2 = []
    for (let i=0; i < GeneratedP2.length; i++) {
      if (GeneratedP2[i] == ''){
        GeneratedP2[i] = '\n\n';
      }
      if ((GeneratedP2[i][0] === '1') || (GeneratedP2[i][7] === '1')){
        idx1 = i;
        console.log(GeneratedP2.slice(0,idx1))
        setGeneratedP2(GeneratedP2.slice(0,idx1))
      }
      if ((GeneratedP2[i][0] === '2') || (GeneratedP2[i][7] === '2')){
        idx2 = i;
      }
    }
    setApiP2Output(GeneratedP2.slice(0,idx1)); //setApiIntroOutput(GeneratedIntro.slice(0,idx1));
    makeButtons('choose-two-button-container',[GeneratedP2[idx1],GeneratedP2[idx2]],1)
    setIsP2Generating(false);
    //setSelectedTitle(true);
    setHasBeenCalled(false);
  }

  const callStoryPart3Endpoint = async (selection) => {
    setHasBeenCalled(false);
    setIsP3Generating(true); //setIsIntroGenerating(true);

    console.log("Calling OpenAI to generate P3...") 
    const selectionToUse = selection.replace(/[0-9.]/g, "");
    const response = await fetch('/api/generateStoryP3', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ selectionToUse, userInput_ChildName }), // do i need to include the api output from the previous step here to build off of?
      //body: JSON.stringify({ userInput }),
    });

    const data = await response.json();
    const { output } = data;
    console.log("OpenAI replied with Part3...", output.content)

    const GeneratedP3 = output.content.split(/\r?\n|\r|\n/g)
    //setApiIntroOutput(GeneratedIntro);
    
    // find the index to option 1 and 2
    let idx1 = []
    let idx2 = []
    for (let i=0; i < GeneratedP3.length; i++) {
      if (GeneratedP3[i] == ''){
        GeneratedP3[i] = '\n\n';
      }
      if ((GeneratedP3[i][0] === '1') || (GeneratedP3[i][7] === '1')){
        idx1 = i;
        console.log(GeneratedP3.slice(0,idx1))
        setGeneratedP2(GeneratedP3.slice(0,idx1))
      }
      if ((GeneratedP3[i][0] === '2') || (GeneratedP3[i][7] === '2')){
        idx2 = i;
      }
    }
    setApiP3Output(GeneratedP3.slice(0,idx1)); //setApiIntroOutput(GeneratedIntro.slice(0,idx1));
    makeButtons('choose-three-button-container',[GeneratedP3[idx1],GeneratedP3[idx2]],0)
    setIsP3Generating(false);
    //setSelectedTitle(true);
    setHasBeenCalled(false);
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
      <div className='logo'>
        <Image src={dreamtrainLogo} alt="dream-train-logo"/>
      </div>
      <div className="container">
        <div className="header">
          <div className="header-title">
            
            <h1>Choose your own adventure bedtime story generator</h1>
          </div>
          <div className="header-subtitle">
            <h2>Generate a custom bedtime story every night</h2>
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
              <h3>Thanks for that. Now, click below to see the titles of some adventures we can go on.</h3>
            </div>
          </div>
        </div>
        <div className='prompt-buttons'>
            <a className={isGenerating ? 'generate-button loading' : 'generate-button'} onClick={callGenerateEndpoint}>
              <div className="generate">
                {/*{isGenerating ? <span class="loader"></span> : <p>Let's see some titles!</p>}*/}
                <p>Let's see some titles!</p>
              </div> 
            </a>
          </div>
          <div className="generate">
              {isGenerating ? <span class="loader"></span> : <p></p>}
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
                  <h3>Dream Train Studios presents:</h3>
                  <div className='output-content'>
                    <h3> {selectedTitle} </h3>
                      <div className='output-content'>
                        <p>{apiIntroOutput}</p>
                        <div id="choose-one-button-container">
                          <div className="generate">
                            {isIntroGenerating ? <span class="loader"></span> : <p></p>}
                          </div>
                        </div>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ok great, now lets work on step 5, using the selected story path from the intro to generate the next step of the story*/}
        {selectedIntro && (
          <div>
            <div className='generate-title'>
              <div className='generate-title-header-container'>
                <div className='output-header'>
                  <h3>Awesome choice! Let's continue our adventure.  </h3>
                  <div className='output-content'>
                      <div className='output-content'>
                        <p>{apiP2Output}</p>
                        <div id="choose-two-button-container">
                        </div>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* ok great, now lets work on step 6, using the selected story path from the last part to generate the next step of the story*/}
        {selectedP2 && (
          <div>
            <div className='generate-title'>
              <div className='generate-title-header-container'>
                <div className='output-header'>
                  <h3>Awesome choice! Let's continue Part 3 of our adventure.  </h3>
                  <div className='output-content'>
                      <div className='output-content'>
                        <p>{apiP3Output}</p>
                        <div id="choose-three-button-container">
                        </div>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* {/* This is the bit of code for the text entry box
        <div className="prompt-container">
          <textarea
            className="prompt-box"
            placeholder='start typing here'
            value={userInput}
            onChange={onUserChangedText} />
          {/* This is for the generate button 
          <div className='prompt-buttons'>
            <a className={isGenerating ? 'generate-button loading' : 'generate-button'} onClick={callGenerateEndpoint}>
              <div className="generate">
              {isGenerating ? <span class="loader"></span> : <p>Generate</p>}
              </div>
            </a>
          </div>
          {/* Display OpenAI response to message box
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
        </div>  */}
      </div>
      
    </div>
  );
};

export default Home;
