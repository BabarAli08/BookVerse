export interface author{
    name:string,
    birth_year:number,
    death_year:number

}

export interface book{
    
  id?: string,
  title?: string,
  authors?: [author],
  summaries?:string[],
  translators?: string[],
  subjects?: string[],
  bookshelves?: string[],
  languages?: string[],
  copyright?: boolean,
  media_type?: string,
  formats?: {
    [key: string]: string;
  },
  download_count?: number,

}