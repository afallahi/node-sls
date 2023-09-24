import { NodeDocument, ConversionResult } from 'core-types';
import { FromTsOptions } from './types';
export declare function convertTypeScriptToCoreTypes(sourceCode: string, options?: FromTsOptions): ConversionResult<NodeDocument>;
