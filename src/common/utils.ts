export const GetValidURL = (url: string) => {
    if (url.length == 0) throw new Error('Empty URL is not valid!');
    if (!url.match('^(http|https)://')) {
        return `https://${url}`;
    }
    return url;
};

