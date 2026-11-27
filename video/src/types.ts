// Alle Felder, die ein Agent in stories/<name>.json setzen darf. Nur Daten, kein Code.
// Neue Felder sind optional: alte Stories (v0) laufen weiter.

export type Light = "day" | "golden" | "night" | "grey" | "dawn" | "dusk" | "storm" | "lamp";
export type SetName =
  | "field" | "village" | "sea" | "forest" | "snow" | "city" | "desert" | "mountain"
  | "harbor" | "room" | "street" | "station" | "river" | "ruins" | "farm" | "void";

export type Expr =
  | "neutral" | "sad" | "happy" | "shock" | "worried" | "angry" | "cry" | "laugh"
  | "sleepy" | "love" | "scared" | "determined" | "smirk";
export type Who =
  | "man" | "woman" | "kid" | "teen" | "oldman" | "oldwoman" | "baby"
  | "dog" | "cat" | "horse" | "bird";
export type Pose =
  | "stand" | "wave" | "point" | "armsup" | "hug" | "think" | "facepalm" | "hold"
  | "sit" | "kneel" | "salute" | "reach" | "cross" | "pocket" | "lie";
export type Act = "walk" | "still" | "bounce" | "run" | "shiver" | "nod" | "fly" | "breathe";
export type Outfit = "shirt" | "coat" | "dress" | "uniform" | "overalls" | "suit" | "sweater" | "apron" | "hoodie" | "robe";
export type Hair = "short" | "long" | "bun" | "bald" | "curly" | "ponytail" | "spiky" | "none";
export type Hat = "none" | "cap" | "brimhat" | "helmet" | "beanie" | "headscarf" | "beret" | "hood";
export type Extra = "glasses" | "beard" | "mustache" | "bag" | "cane" | "bandage" | "freckles" | "medal" | "scarf" | "collar";
export type Build = "slim" | "normal" | "broad";
export type Breed = "floppy" | "pointy" | "spotted" | "pup" | "tabby" | "black" | "white" | "brown";
export type Look = "left" | "right" | "up" | "down" | "camera";
export type Enter = "none" | "left" | "right" | "pop" | "fall" | "fade";

export type Char = {
  who: Who; x: number; scale?: number; expr?: Expr; color?: string; color2?: string; flip?: boolean; act?: Act;
  z?: number;          // Tiefe 0 = vorne (Standard) … 1 = hinten am Horizont (kleiner)
  pose?: Pose; look?: Look; outfit?: Outfit; hair?: Hair; hairColor?: string; hat?: Hat; hatColor?: string;
  extra?: Extra[]; skin?: number; build?: Build; breed?: Breed;
  hold?: PropKind;     // Requisite in der Hand (mit pose "hold"/"reach"/"wave")
  say?: string;        // kurze Sprechblase (1–3 Wörter), erscheint nach 0,3 s
  think?: string;      // Gedankenblase
  enter?: Enter;       // Auftritt am Szenenanfang
  exprAt?: {t: number; expr: Expr}[]; // Gesicht wechselt nach t Sek. in der Szene
};

export type PropKind =
  | "tree" | "pine" | "palm" | "bush" | "rock" | "flowers" | "fence" | "lamp" | "bench" | "sign"
  | "house" | "tent" | "fire" | "car" | "boat" | "cart" | "well" | "crate" | "suitcase" | "letter"
  | "bone" | "ball" | "flag" | "bed" | "table" | "chair" | "window" | "door" | "clock" | "photo"
  | "train" | "plane" | "gravestone" | "mailbox" | "lantern" | "bowl" | "phone" | "cactus" | "barrel" | "kennel";
export type Layer = "back" | "mid" | "front";
export type Prop = {kind: PropKind; x: number; layer?: Layer; scale?: number; color?: string; flip?: boolean; label?: string};

export type Cam = "push" | "pull" | "left" | "right" | "up" | "down" | "shake" | "whip" | "drift" | "focus" | "dolly" | "still-ish";
export type Trans = "cut" | "flash" | "fade" | "iris" | "wipe" | "slide" | "whip" | "ink" | "zoom" | "blink";
export type Fx = "rain" | "snow" | "leaves" | "dust" | "fireflies" | "embers" | "hearts" | "sparkles" | "confetti" | "fog" | "lightning" | "smoke";

export type OverlayKind = "date" | "place" | "counter" | "question" | "title" | "circle" | "arrow" | "stamp" | "map" | "freeze" | "timer" | "label";
export type Overlay = {
  kind: OverlayKind; text?: string;
  x?: number; y?: number;   // 0..1 (für circle/arrow/label)
  from?: number; to?: number; // counter/timer
  sub?: string;             // zweite Zeile (z. B. bei freeze: "Er wusste es nicht.")
};

export type SplitSide = {set: SetName; light: Light; chars: Char[]; props?: Prop[]; label?: string};

export type Scene = {
  set: SetName; light: Light; cam: Cam; text: string; chars: Char[];
  props?: Prop[]; fx?: Fx[];
  in?: Trans;          // Übergang IN diese Szene (Standard kommt vom Szenenstil)
  flash?: boolean;     // v0-Kompatibilität (= in: "flash")
  focus?: number;      // Index der Figur für cam "focus"
  overlay?: Overlay | Overlay[];
  split?: SplitSide;   // Vorher/Nachher: rechte Bildhälfte zeigt eine zweite Szene
  label?: string;      // optionaler Text für Split links (z. B. "1944")
  seed?: number;       // anderer Zufall für Hügel/Wolken/Bäume
};

// ---- Variation (siehe variation.md / variation.json) ----
export type HookType = "question" | "shock-fact" | "in-medias-res" | "countdown" | "before-after" | "quote" | "mystery-object" | "date-place";
export type SceneStyle = "wide-epic" | "close-emotional" | "storybook" | "documentary" | "fast-cut";
export type LookName = "paper" | "pop" | "dusk" | "chalk" | "mono" | "pastel" | "ember";
export type Perspective = "narrator" | "first-person" | "second-person" | "witness" | "animal-pov";
export type Variant = {hook: HookType; length: 65 | 90; sceneStyle: SceneStyle; look: LookName; perspective: Perspective};

export type Story = {
  id: string; title: string; hookTypes?: string; wps?: number;
  created?: string;    // ISO-Datum, für den Ähnlichkeits-Check
  test?: boolean;      // Technik-Test: zählt nicht im Ähnlichkeits-Check
  variant?: Variant;   // Pflicht für echte Videos
  voice?: string;      // Datei in public/, z. B. "voice.wav"
  voiceName?: string; speed?: number; // für scripts/voice.py (Kokoro-Stimme, Tempo)
  words?: {w: string; t: number}[]; // Wortzeiten (Sek), überschreibt die Auto-Zeiten
  music?: string; scenes: Scene[];
};
