// payloads.ts
export interface CatalogPayload {
	catalog: unknown[];
}

export interface CartPayload {
	ids: string[];
}

export interface OrderPayload {
	form: Record<string, unknown>;
}
