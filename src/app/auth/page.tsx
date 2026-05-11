import { Suspense } from 'react'
import PageComponent from "@/pages/Auth";

export default function Page() {
  return (
    <Suspense>
      <PageComponent />
    </Suspense>
  );
}
