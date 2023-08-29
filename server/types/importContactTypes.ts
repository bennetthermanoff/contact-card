export interface ContactBase{
    id:string|undefined;
    name:string|undefined;
    pronouns:string|undefined;
    year:string|undefined,
    description:string|undefined;
    majors:string|undefined;
}
export interface PhotoNameContact extends ContactBase{
    photoName:string|undefined;
}
export interface PhotoBinaryContact extends ContactBase{
    photoBinary:string|undefined;
    photoType:string|undefined;
}