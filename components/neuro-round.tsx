'use client';
import {useEffect,useRef,useState} from 'react';
import {Brain,Check,ArrowRight} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {RadioGroup,RadioGroupItem} from '@/components/ui/radio-group';
import {Label} from '@/components/ui/label';
import type {Question} from '@/lib/neuroscience';
export function NeuroRound({questions,attempt,hidden,onAnswer,onFinish}:{questions:Question[];attempt:number;hidden:boolean;onAnswer:(index:number,correct:boolean)=>boolean;onFinish:()=>void}){
  const [index,setIndex]=useState(0),[selected,setSelected]=useState(''),[locked,setLocked]=useState(false),[correctCount,setCorrectCount]=useState(0),[hint,setHint]=useState(false);
  const submitted=useRef(false),heading=useRef<HTMLHeadingElement>(null),nextButton=useRef<HTMLButtonElement>(null);
  const q=questions[index],order=[0,1,2,3].map(i=>(i+attempt-1)%4),correct=Number(selected)===q.correct;
  useEffect(()=>{if(!hidden){if(locked)nextButton.current?.focus({preventScroll:true});else heading.current?.focus({preventScroll:true});}},[hidden,index,locked]);
  const submit=()=>{if(hidden||submitted.current||!selected)return;submitted.current=true;const success=Number(selected)===q.correct;if(!onAnswer(index,success)){submitted.current=false;return;}if(success)setCorrectCount(n=>n+1);setLocked(true);};
  const next=()=>{if(!locked||hidden||!submitted.current)return;submitted.current=false;if(index===questions.length-1){onFinish();return;}setIndex(n=>n+1);setSelected('');setLocked(false);setHint(false);submitted.current=false;};
  return <div className="quiz-panel" hidden={hidden}>
    <div className="quiz-topline"><span><Brain size={18}/> BRAIN BREAK</span><span>{index+1} / {questions.length}</span></div>
    <div className="quiz-progress" aria-label={`${correctCount} correct answers; 3 needed to pass`}><strong>{correctCount} correct</strong><span>3 to pass · no timer</span></div>
    <h2 ref={heading} tabIndex={-1} id="neuro-question">{q.question}</h2>
    <RadioGroup className="quiz-options" value={selected} onValueChange={setSelected} disabled={locked||hidden} aria-labelledby="neuro-question">
      {order.map((option,i)=><Label key={option} className={`quiz-option ${selected===String(option)?'selected':''} ${locked&&option===q.correct?'correct':''} ${locked&&selected===String(option)&&!correct?'incorrect':''}`} htmlFor={`answer-${q.id}-${option}`}><RadioGroupItem value={String(option)} id={`answer-${q.id}-${option}`}/><span className="option-letter">{'ABCD'[i]}</span><span>{q.options[option]}</span>{locked&&option===q.correct&&<Check size={18}/>}</Label>)}
    </RadioGroup>
    {!locked?<div className="quiz-actions"><Button className="play-button" disabled={selected===''} onClick={submit}>Lock it in<Check size={18}/></Button><Button className="quiet-button" variant="ghost" onClick={()=>setHint(v=>!v)} aria-expanded={hint}>{hint?'Hide hint':'Tiny hint?'}</Button>{hint&&<p className="quiz-hint">{q.hint}</p>}</div>:<><div className={`quiz-feedback ${correct?'is-correct':''}`} role="status"><strong>{correct?'Neat. That’s it.':'Not quite. A new connection, though.'}</strong><p>{!correct&&<>{q.feedback[Number(selected)]} The answer is <b>{q.options[q.correct]}</b>. </>}{q.explanation}</p><a href={q.source} target="_blank" rel="noreferrer">{q.sourceLabel} ↗</a></div><Button ref={nextButton} className="play-button quiz-next" onClick={next}>{index===questions.length-1?'See how we did':'Next question'}<ArrowRight size={18}/></Button></>}
  </div>;
}
