export interface IPost {
    id?:string;
    title: string;
    content: string;
    image?: File,
    imagePath?: string;
    createdBy: string;
}