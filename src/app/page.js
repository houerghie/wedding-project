import { Suspense } from "react";
import Invitation from "../components/Invitation";

export default function Page() {
  return (
    <main className="wrap">
      <Suspense fallback={null}>
        <Invitation />
      </Suspense>
    </main>
  );
}
