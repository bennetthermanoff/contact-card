import { VcardJson, getEntry } from '../types/Vcard';
import './MajorTags.css';
export const MajorTags = ({ contact }:{contact:VcardJson})=>{
    const rawMajors = getEntry(contact, 'ORG') as string;
    const majors = rawMajors ? rawMajors.split(',') : [];
    //change colors every 5 seconds
    return (
        <div className="major-tags">
            {majors.map((major, index)=>{
                const h = index === 1 ? 47 : 7;
                return <span style={{ backgroundColor: `hsl(${h}, 90%, 80%)` }}
                    key={index} className="major-tag">{major.trim().split('\\')}</span>;
            })}
        </div>
    );
};