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
    sub_type?: string; // Generic sub-classification (e.g. transaction, periodic, etc.)
    scd?: string; // History tracking (e.g. type0, type1, type2, etc.)
    layer?: 'source' | 'staging' | 'intermediate' | 'mart' | string;
    icon?: string;
    color?: string;
  };
  conceptual?: {
    description?: string;
    tags?: string[]; // BEAM* tags (WHO, WHAT, WHEN, etc.)
    businessDefinitions?: Record<string, string>;
  };
  lineage?: {
    upstream?: string[]; // IDs of upstream tables
  };
  physical?: { // Optional Table-level physical info
    name?: string;
    schema?: string;
  };
  columns?: Column[]; // Optional
  sampleData?: any[][]; // New simplified format: 2D array
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
    additivity?: 'fully' | 'semi' | 'non'; // For Measures
    isMetadata?: boolean; // For Audit/SCD metadata columns
  };
  physical?: { // Optional
    name?: string;
    type?: string;
    constraints?: string[];
  };
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
  type?: 'one-to-one' | 'one-to-many' | 'many-to-one' | 'many-to-many';
}
