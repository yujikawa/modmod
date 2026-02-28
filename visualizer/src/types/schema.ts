export interface Schema {
  tables: Table[];
  relationships: Relationship[];
  domains?: Domain[]; // Optional
  layout?: Record<string, { x: number; y: number; width?: number; height?: number }>;
}

export interface Domain {
  id: string;
  name: string;
  description?: string;
  tables: string[]; // List of table IDs
  color?: string;
}

export interface Table {
  id: string; // Internal name/key
  name: string; // Display name (Logical name)
  appearance?: {
    type?: 'fact' | 'dimension' | 'hub' | 'link' | 'satellite';
    icon?: string;
    color?: string;
  };
  conceptual?: {
    description?: string;
    tags?: string[]; // BEAM* tags (WHO, WHAT, WHEN, etc.)
    businessDefinitions?: Record<string, string>;
  };
  columns?: Column[]; // Optional
  sampleData?: SampleData;
}

export interface Column {
  id: string; // Logical ID (unique per table)
  logical?: { // Optional
    name: string;
    type: string;
    description?: string;
    isPrimaryKey?: boolean;
    isForeignKey?: boolean;
    isPartitionKey?: boolean;
  };
  physical?: { // Optional
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
    column?: string; // Optional
  };
  to: {
    table: string;
    column?: string; // Optional
  };
  type?: 'one-to-one' | 'one-to-many' | 'many-to-many';
}
