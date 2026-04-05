/**
 * GOOGLE FIRESTORE
 *
 * Vi behöver en hjälpfunktion i frontend som tar en bild från telefonen, gör om den till ett format
 * som Firebase förstår (en "Blob"), laddar upp den, och ger oss den offentliga länken tillbaka.
 */

import { storage } from "../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const uploadService = {
    /**
     * Laddar upp en lokal fil (URI) till Firebase Storage och returnerar den publika URL:en.
     * @param uri Den lokala sökvägen på telefonen (från ImagePicker eller DocumentPicker)
     * @param folder Mappen i Firebase (t.ex. "avatars" eller "documents")
     * @param userId Lärarens ID (används för att skapa ett unikt filnamn)
     */
    uploadFile: async (uri: string, folder: string, userId: string): Promise<string> => {
        try {
            // 1. Gör om filen till en "Blob" (Binär data) som Firebase kan ta emot
            const response = await fetch(uri);
            const blob = await response.blob();

            // 2. Skapa ett unikt filnamn (t.ex. avatars/rec123_1678900000.jpg)
            const fileExtension = uri.split(".").pop() || "jpg";
            const fileName = `${folder}/${userId}_${Date.now()}.${fileExtension}`;

            // 3. Skapa en referens till platsen i Firebase
            const storageRef = ref(storage, fileName);

            // 4. Ladda upp filen
            await uploadBytes(storageRef, blob);

            // 5. Hämta och returnera den publika URL:en
            const downloadUrl = await getDownloadURL(storageRef);
            return downloadUrl;
        } catch (error) {
            console.error("Fel vid uppladdning till Firebase:", error);
            throw new Error("Kunde inte ladda upp filen.");
        }
    },
};
