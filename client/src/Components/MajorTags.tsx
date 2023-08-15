import { VcardJson, getEntry } from '../types/Vcard';
import './MajorTags.css';
export const MajorTags = ({ contact }:{contact:VcardJson})=>{
    const rawMajors = getEntry(contact, 'ORG') as string;
    const majors = rawMajors ? rawMajors.split(',') : [];
    return (
        <div className="major-tags">
            {majors.map((major, index)=>{
                return <span style={{ backgroundColor: `hsl(${Math.random() * 360}, 100%, 90%)` }}
                    key={index} className="major-tag">{major.trim()}</span>;
            })}
        </div>
    );
    
};