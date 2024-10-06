import { database } from "@/lib/firebase";
import { ref, get } from "firebase/database";
import { redirect } from 'next/navigation';

export default async function ShortUrlRedirect({ params }: { params: { code: string } }) {
  const { code } = params;

  console.log("Code:", code);
  
  const shortUrlRef = ref(database, `shortUrls/${code}`);
  const snapshot = await get(shortUrlRef);
  
  if (snapshot.exists()) {
    const { linkId } = snapshot.val();
    console.log("Link ID:", linkId);
    redirect(`/track?id=${linkId}`);
    return <div>Redirecting...</div>;
  } else {
    // redirect('/404'); // or wherever you want to redirect for invalid short URLs
    console.log("Short URL not found:", code);
    return <div>404</div>;
  }
}