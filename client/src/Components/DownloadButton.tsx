import axios from "axios";
import { VcardJson } from "../types/Vcard";

export const DownloadButton = ({ contactId }: { contactId: string }) => {
    const download =  () => {
        const data = axios.get(`/api/vcard/${contactId}`, { responseType: "blob" }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", `${contactId}.vcf`);
                document.body.appendChild(link);
                link.click();
            }).catch((error) => {
                console.log(error);
            });
    };
    return <button onClick={download}>Download</button>;
    }