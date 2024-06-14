export class ImageAttributes
{
    // this object does not store a reference to the dom
    // element that is created because react wants us to
    // clone the state object for every update, and cloning
    // dom elements causes instance-reference errors. So we
    // throw away the element, and just keep the image data

    path: string;
    width: number;
    height: number;

    constructor(path: string, width: number, height: number)
    {
        this.path = path;
        this.width = width;
        this.height = height;
    }

    static fromPath(path: string)
    {
        const result = new Promise<ImageAttributes|null>((resolve, reject) =>
        {
            const image = new Image();

            image.addEventListener('load', () =>
            {
                resolve(new ImageAttributes(path, image.naturalWidth, image.naturalHeight));
            }, { once: true });
            image.onerror = (error) => 
            {
                reject(error);
            }
            image.src = path;
        });
        return result;
    }
}

export class PreloadedImageAttributes { [key: string]: ImageAttributes }