export interface Schema {
  tables: Table[];
  relationships: Relationship[];
}

export interface Table {
  id: string; // Internal name/key
  name: string; // Display name (Logical name)
  conceptual?: {
    description?: string;
    tags?: string[]; // BEAM* tags (WHO, WHAT, WHEN, etc.)
    businessDefinitions?: Record<string, string>;
  };
  columns: Column[];
  sampleData?: SampleData;
}

export interface Column {
  id: string; // Logical ID (unique per table)
  logical: {
    name: string;
    type: string;
    description?: string;
    isPrimaryKey?: boolean;
    isForeignKey?: boolean;
  };
  physical?: {
    name?: string;
    type?: string;
    constraints?: string[];
  };
}

export interface SampleData {
  name?: string;
  columns: string[]; // List of column IDs
  rows: any[][];
}

export interface Relationship {
  from: {
    table: string;
    column: string;
  };
  to: {
    table: string;
    column: string;
  };
  type?: 'one-to-one' | 'one-to-many' | 'many-to-many';
}
