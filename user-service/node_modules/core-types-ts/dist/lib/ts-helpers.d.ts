import * as ts from "typescript";
import { CoreTypeAnnotations, Location } from "core-types";
import { ToTsOptions } from './types';
export declare function tsUnknownTypeAnnotation(): ts.KeywordTypeNode<ts.SyntaxKind.UnknownKeyword>;
export declare function safeName(name: string): ts.StringLiteral | ts.Identifier;
export declare function wrapAnnotations<T extends ts.Node>(tsNode: T, node: CoreTypeAnnotations, blockComment?: boolean): T;
export declare function makeGenericComment(text: string | Array<string>, bodyOnly?: boolean): string | undefined;
export declare function generateCode(node: ts.Node): string;
export declare function tsStripOptionalType(node: ts.TypeNode): ts.TypeNode;
export declare function toLocation(node: ts.Node): Location;
export declare function isExportedDeclaration(node: ts.Statement): boolean;
export declare type HeaderOptions = Pick<ToTsOptions, 'filename' | 'sourceFilename' | 'userPackage' | 'userPackageUrl' | 'noDisableLintHeader' | 'noDescriptiveHeader'> & {
    createdByPackage: string;
    createdByUrl: string;
};
export declare function createCodeHeader({ filename, sourceFilename, userPackage, userPackageUrl, noDisableLintHeader, noDescriptiveHeader, createdByPackage, createdByUrl, }: HeaderOptions): string;
