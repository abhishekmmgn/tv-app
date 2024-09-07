import { db } from "@/firebase-config";
import { getDoc, setDoc, doc } from "firebase/firestore";
import { arrayUnion } from "firebase/firestore";

export async function isInWatchlist(id: number, userId: string) {
  const userDocRef = doc(db, "users", userId);
  const userDoc = await getDoc(userDocRef);
  if (userDoc.exists()) {
    const userData = userDoc.data();
    return userData?.watchlist?.some((item: any) => item.id === id);
  }
  return false;
}

export async function addToWatchlist(
  id: number,
  userId: string,
  isAShow: boolean
) {
  const userDocRef = doc(db, "users", userId);
  await setDoc(
    userDocRef,
    {
      watchlist: arrayUnion({
        id,
        isAShow,
      }),
    },
    { merge: true }
  );
}
