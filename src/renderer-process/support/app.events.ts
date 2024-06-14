export const AppEventChannel = {
    'modal': 'modal',
    'downloadProgress': 'downloadProgress',
    'processProgress': 'processProgress',
 } as const;

export class AppEvent
{
    static #listeners: Map<(event: CustomEvent) => void, (event: Event|CustomEvent) => void> = new Map<(event: CustomEvent) => void, (event: Event|CustomEvent) => void>();
    static subscribe(channel: string, handler: (event: CustomEvent) => void) 
    {
        const wrappedHandler = (event: Event|CustomEvent) => { handler(event as CustomEvent); }
        AppEvent.#listeners.set(handler, wrappedHandler);
        document.addEventListener(channel, wrappedHandler);
    }
    
    static unsubscribe(channel: string, listener: (event: CustomEvent) => void) 
    {
        const wrappedHandler = AppEvent.#listeners.get(listener);
        if(wrappedHandler == null)
        {
            throw new Error("Cannot unsubscribe with unknown listener function. This error often occurs when trying to unsubscribe with an anonymous function.")
        }
        document.removeEventListener(channel, wrappedHandler);
        AppEvent.#listeners.delete(listener);
    }
    
    static publish(channel: string, data: any) 
    {
        const event = new CustomEvent(channel, { detail: data });
        document.dispatchEvent(event);
    }
}