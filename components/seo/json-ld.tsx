type JsonLdProps = {
  schema: object | object[];
};

// dangerouslySetInnerHTML is the correct pattern for JSON-LD script tags.
// Data originates from server-controlled content files, never user input.
export function JsonLd({ schema }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
