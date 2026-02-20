import { getApiDocs } from '@/lib/swagger';
import SwaggerDocUI from '@/components/SwaggerUI';

export default async function IndexPage() {
  const spec = await getApiDocs();
  
  return (
    <section className="container bg-white min-h-screen">
      <div className="pt-10 max-w-7xl mx-auto">
        <SwaggerDocUI spec={spec} />
      </div>
    </section>
  );
}
