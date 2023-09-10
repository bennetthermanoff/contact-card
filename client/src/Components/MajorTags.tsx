import { VcardJson, getEntry } from '../types/Vcard';
import './MajorTags.css';
export const MajorTags = ({ contact, pdf }:{contact:VcardJson, pdf?:boolean})=>{
    const rawMajors = getEntry(contact, 'ORG') as string;
    //split by , & and
    const majors = rawMajors ? rawMajors.split(/,|&/) : [];
    //change colors every 5 seconds
    return (
        <div className={!pdf ? 'major-tags' : 'major-tags-pdf'}>
            {majors.map((major, index)=>{
                const h = index % 2 === 0 ? 47 : 7;
                return <span style={!pdf ? { backgroundColor: `hsl(${h}, 90%, 80%)` } : {}}
                    key={index} className={!pdf ? 'major-tag' : 'major-tag-pdf'}>
                    {major.trim().split('\\')}
                </span>;
            })}
        </div>
    );
};