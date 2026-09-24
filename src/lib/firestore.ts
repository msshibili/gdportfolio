import { db } from "./firebase";
import { doc, setDoc, deleteDoc, collection, getDocs } from "firebase/firestore";
import { db as prismaDb } from "./db";

/**
 * Sync a single record to Firebase Firestore.
 */
export async function syncToFirestore(collectionName: string, id: string, data: Record<string, any>) {
  try {
    const formattedData: Record<string, any> = {};
    for (const key of Object.keys(data)) {
      const val = data[key];
      if (val instanceof Date) {
        formattedData[key] = val.toISOString();
      } else if (val !== undefined) {
        formattedData[key] = val;
      }
    }
    const docRef = doc(db, collectionName, id);
    await setDoc(docRef, formattedData, { merge: true });
    console.log(`[Firebase Firestore Sync] Saved ${collectionName}/${id}`);
  } catch (error) {
    console.error(`[Firebase Firestore Sync Error] ${collectionName}/${id}:`, error);
  }
}

/**
 * Delete a document from Firebase Firestore.
 */
export async function deleteFromFirestore(collectionName: string, id: string) {
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
    console.log(`[Firebase Firestore Sync] Deleted ${collectionName}/${id}`);
  } catch (error) {
    console.error(`[Firebase Firestore Delete Error] ${collectionName}/${id}:`, error);
  }
}

/**
 * Sync all current database entities (Projects, Stories, Categories, Media, Settings) to Firebase Firestore.
 */
export async function syncAllToFirestore() {
  try {
    console.log("[Firebase Firestore Sync] Starting full sync...");

    // 1. Sync Projects
    const projects = await prismaDb.project.findMany();
    for (const p of projects) {
      await syncToFirestore("projects", p.id, p);
    }

    // 2. Sync Stories
    const stories = await prismaDb.story.findMany();
    for (const s of stories) {
      await syncToFirestore("stories", s.id, s);
    }

    // 3. Sync Categories
    const categories = await prismaDb.category.findMany();
    for (const c of categories) {
      await syncToFirestore("categories", c.id, c);
    }

    // 4. Sync Media
    const mediaList = await prismaDb.media.findMany();
    for (const m of mediaList) {
      await syncToFirestore("media", m.id, m);
    }

    // 5. Sync Settings
    const settings = await prismaDb.settings.findUnique({ where: { id: "default" } });
    if (settings) {
      await syncToFirestore("settings", settings.id, settings);
    }

    console.log("[Firebase Firestore Sync] Full sync completed successfully!");
    return { success: true, count: { projects: projects.length, stories: stories.length, categories: categories.length, media: mediaList.length } };
  } catch (error) {
    console.error("[Firebase Firestore Sync] Error during full sync:", error);
    return { success: false, error: String(error) };
  }
}
