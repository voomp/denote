import { useEffect, useState } from 'react';
import Content from './components/Content';
import icon from './arrow-back-circle-outline.svg';
import { Link, useParams } from 'react-router-dom';
import noteData from './data/notes.json';
import regeneratorRuntime from "regenerator-runtime";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
const ClassNotes = () => {
	const [currNotes, setNotes] = useState<any>({});
	const params = useParams();
	const noteClass = params.class;

	const [notesValue, setNotesVal] = useState('');
	const [connValue, setConnections] = useState('');
	const [summaryValue, setSummary] = useState('');

	const {
		transcript,
		listening,
		resetTranscript,
		browserSupportsSpeechRecognition
	} = useSpeechRecognition();
	
	useEffect(() => {
		const val = localStorage.getItem('notes');
		setNotes((!!val) ? JSON.parse(val) : noteData);
		if (!val) localStorage.setItem('notes', JSON.stringify(noteData));
	}, [noteClass]);

	const saveChanges = () => {
		if(!noteClass) return;
		const newNotes = {...currNotes};
		newNotes[noteClass].notes = notesValue;
		newNotes[noteClass].connections = connValue;
		newNotes[noteClass].summary = summaryValue;
		setNotes(newNotes);
	}

	useEffect(() => {
		if(Object.keys(currNotes).length === 0) return;
		localStorage.setItem('notes', JSON.stringify(currNotes));
		console.log(currNotes);
		if(!noteClass) return;
		const tempData: any = {...currNotes};
		console.log(tempData[noteClass]);
		setNotesVal(tempData[noteClass].notes);
		setConnections(tempData[noteClass].connections);
		setSummary(tempData[noteClass].summary);
	}, [currNotes, noteClass])

	if (!browserSupportsSpeechRecognition) {
		return <span>Browser doesn't support speech recognition.</span>;
	}

	if(!noteClass) return <></>;


	return (
		<Content>
			<div className="flex border-b-[#E5E5E5] border-b-[3px]">
				<div className="flex flex-col border-r-[#E5E5E5] w-[800px] mb-10 border-r-[3px]">
					<Link to="/">
						<div className="mb-5 max-h-[50px] w-[150px] flex items-center space-x-[8px] cursor-pointer">
							<img src={icon} className="h-[40px]" alt="icon" />
							<div className="text-[#F43F5E] text-[36px] font-medium">Connections</div>
						</div>
					</Link>	
					<textarea className="min-h-[500px] w-full bg-[#262626] text-[20px] text-[#E5E5E5]" value={connValue} onChange={(e) => setConnections(e.target.value)} />
				</div>

				<div className="px-10 w-full">
					<div className="text-[36px] text-brand font-medium">
						{noteClass} Notes
					</div>
					<div className="flex space-x-5 my-5 items-center">
						<p>Microphone: {listening ? 'on' : 'off'}</p>
						<button onClick={() => {
							SpeechRecognition.startListening({ continuous: true })
						}} className="px-5 py-2 bg-brand rounded flex justify-center items-center">Start recording</button>
						<button onClick={() => {
							setNotesVal(`${notesValue} ${transcript}`)
							SpeechRecognition.stopListening()
						}} className="px-5 py-2 bg-brand rounded flex justify-center items-center">Stop recording</button>
						<button onClick={resetTranscript}>Reset</button>
					</div>
					{/* <p>{transcript}</p> */}
					<textarea className="min-h-[500px] w-full bg-[#262626] text-[#E5E5E5] text-[20px] pt-5" value={notesValue} onChange={(e) => setNotesVal(e.target.value)} />
				</div>
			</div>
			<div>
				<div className="text-[36px] text-brand font-medium">
					Summary
				</div>
				<textarea className="min-h-[180px] w-full bg-[#262626] text-[#E5E5E5] text-[20px]" value={summaryValue} onChange={(e) => setSummary(e.target.value)} />
			</div>
			<button className="px-5 py-2 bg-brand rounded flex justify-center items-center my-[50px]" onClick={saveChanges} >Save</button>

		</Content>
	)
}

export default ClassNotes