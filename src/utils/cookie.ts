import { AES, enc } from "crypto-js";

const PREFIX = "; path=/; SameSite=Strict; Secure";

const ERREUR_DECHIFFREMENT = "Impossible de déchiffrer les informations locales.";
const ERREUR_LECTURE = "Impossible de lire les informations locales.";

const importer = (nom: string) => {
    return document.cookie
        .split('; ')
        .find(e => e.startsWith(nom + "="))
        ?.split('=')[1];
};

const exporter = (nom: string, data: string) => {
    document.cookie = nom + "=" + data + PREFIX;
};

const chiffer = async (valeur: object, mdp: string) => {
    return AES.encrypt(JSON.stringify(valeur), mdp).toString();
};

const dechiffrer = async (data: string, mdp: string) => {
    try
    {
        return JSON.parse(
            AES.decrypt(data, mdp).toString(enc.Utf8)
        ) as object;
    }
    catch (error) {
        throw new Error(ERREUR_DECHIFFREMENT, {
            cause: error
        });
    }
};

export const existe = (nom: string) => !!importer(nom);

export const lire = async (nom: string, mdp: string) => {
    const data = importer(nom);
    if (typeof data === "string")
        return dechiffrer(data, mdp);
    throw new Error(ERREUR_LECTURE);
};

export const ecrire = async (nom: string, valeur: object, mdp: string) => chiffer(valeur, mdp).then(data => exporter(nom, data));

export const supprimer = async (nom: string) => exporter(nom, "");