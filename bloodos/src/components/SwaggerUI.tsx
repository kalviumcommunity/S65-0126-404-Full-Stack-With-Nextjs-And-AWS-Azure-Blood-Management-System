'use client';

import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

export default function SwaggerDocUI({ spec }: { spec: Record<string, any> }) {
  return <SwaggerUI spec={spec} />;
}
