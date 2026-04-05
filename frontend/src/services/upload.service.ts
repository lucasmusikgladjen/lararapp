/**
 * GOOGLE FIREBASE STORAGE
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
            const response = await fetch(uri);
            const blob = await response.blob();

            const fileExtension = uri.split(".").pop() || "jpg";

            // 👇 BEST PRACTICE: Vi skapar en undermapp för varje användare!
            // Exempel: "documents/rec123456789/17123456789.pdf"
            const fileName = `${folder}/${userId}/${Date.now()}.${fileExtension}`;

            const storageRef = ref(storage, fileName);

            await uploadBytes(storageRef, blob);

            const downloadUrl = await getDownloadURL(storageRef);
            return downloadUrl;
        } catch (error) {
            console.error("Fel vid uppladdning till Firebase:", error);
            throw new Error("Kunde inte ladda upp filen.");
        }
    },
};
