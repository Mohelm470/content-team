export type Light = "day" | "golden" | "night" | "grey";
export type SetName = "field" | "village" | "sea" | "forest" | "snow" | "city";
export type Expr = "neutral" | "sad" | "happy" | "shock" | "worried";
export type Who = "man" | "woman" | "kid" | "dog";
export type Cam = "push" | "pull" | "left" | "right";
export type Char = {who: Who; x: number; scale?: number; expr?: Expr; color?: string; flip?: boolean; act?: "walk" | "still" | "bounce"};
export type Scene = {set: SetName; light: Light; cam: Cam; text: string; chars: Char[]; flash?: boolean};
export type Story = {
  id: string; title: string; hookTypes?: string; wps?: number;
  voice?: string; // Datei in public/, z. B. "voice.wav"
  voiceName?: string; speed?: number; // für scripts/voice.py (Kokoro-Stimme, Tempo)
  words?: {w: string; t: number}[]; // Wortzeiten (Sek), überschreibt die Auto-Zeiten
  music?: string; scenes: Scene[];
};
