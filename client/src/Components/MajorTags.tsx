import { VcardJson, getEntry } from '../types/Vcard';
import './MajorTags.css';
export const MajorTags = ({ contact }:{contact:VcardJson})=>{
    const rawMajors = getEntry(contact, 'ORG') as string;
    const majors = rawMajors ? rawMajors.split(',') : [];
    //change colors every 5 seconds
    setInterval(()=>{
        const tags = document.getElementsByClassName('major-tag');
        for (let i = 0; i < tags.length; i++){
            const tag = tags[i] as HTMLElement;
            tag.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 90%)`;
        }
    }, 4000);
    
    return (
        <div className="major-tags">
            {majors.map((major, index)=>{
                return <span style={{ backgroundColor: `hsl(${Math.random() * 360}, 100%, 90%)` }}
                    key={index} className="major-tag">{major.trim()}</span>;
            })}
        </div>
    );
    
};