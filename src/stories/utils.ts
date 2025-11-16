export type iconVariants =
    'home'
    | 'paper-plane'
    | 'person-add'
    | 'megaphone'
    | 'heart'
    | 'chatbox'
    | 'chatbubbles'
    | 'share-social'
    | 'duplicate'
    | 'repeat'
    | 'search'
    | 'person'
    | 'newspaper'
    | 'create'
    | 'bookmark'
    | 'close'
    | 'settings'
    | 'chevron-back'
    | 'add'
    | 'chevron-down'
    | 'image'
    | 'exit';

export const fontFamily : string = 'Inter-Regular, sans-serif';

export type Ministere =
    | "écologie"
    | "agriculture"
    | "transports"
    | "santé"
    | "éducation"
    | "économie"
    | "finances"
    | "industrie"
    | "intérieur"
    | "sécurité"
    | "justice"
    | "culture"
    | "défense"
    | "travail"
    | "recherche"
    | "enseignement supérieur"
    | "logement"
    | "territoires"
    | "numérique"
    | "outre-mer"
    | "affaires étrangères"
    | "europe";

export const ministereDomainColors: Record<Ministere, string> = {
    "écologie": "#A8E6CF",
    "agriculture": "#91D18B",
    "transports": "#FF8B94",
    "santé": "#A0CED9",
    "éducation": "#AED9E0",
    "économie": "#C9A0DC",
    "finances": "#C3B091",
    "industrie": "#B2B7FF",
    "intérieur": "#9AC3FF",
    "sécurité": "#7FA6E6",
    "justice": "#B0BEC5",
    "culture": "#D7A9E3",
    "défense": "#B0B7C3",
    "travail": "#FFBC99",
    "recherche": "#C7B5E6",
    "enseignement supérieur": "#B7C6F6",
    "logement": "#D0B8A8",
    "territoires": "#A7E3DD",
    "numérique": "#9FE3E8",
    "outre-mer": "#9DD7E0",
    "affaires étrangères": "#9EBBE6",
    "europe": "#A7B8E9"
}