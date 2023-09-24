import { NodeDocument, ConversionResult, NamedType } from "core-types";
import * as ts from 'typescript';
import { ToTsOptions } from "./types";
export declare function convertCoreTypesToTypeScript(doc: NodeDocument, opts?: ToTsOptions): ConversionResult;
export declare function convertSingleCoreTypeToTypeScriptAst(node: NamedType, opts?: Pick<ToTsOptions, 'useUnknown' | 'declaration'>): ts.Declaration;
