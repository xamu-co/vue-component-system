/**
 * input listeners/events object
 */
export interface iInputEvent extends Omit<Event, "target"> {
	target: HTMLInputElement;
}
export interface iDropEvent extends DragEvent {
	originalEvent: { dataTransfer: DataTransfer };
}

export interface iEvent extends Omit<Event, "target"> {
	target: HTMLInputElement;
}
export type tInputEvents = Record<string, (e: iInputEvent) => void>;
