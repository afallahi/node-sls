"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCodeHeader = exports.isExportedDeclaration = exports.toLocation = exports.tsStripOptionalType = exports.generateCode = exports.makeGenericComment = exports.wrapAnnotations = exports.safeName = exports.tsUnknownTypeAnnotation = void 0;
const ts = require("typescript");
const core_types_1 = require("core-types");
const { factory } = ts;
function tsUnknownTypeAnnotation() {
    return factory.createToken(ts.SyntaxKind.UnknownKeyword);
}
exports.tsUnknownTypeAnnotation = tsUnknownTypeAnnotation;
function safeName(name) {
    if (name.match(/^[a-zA-Z$][a-zA-Z0-9_$]*$/))
        return factory.createIdentifier(name);
    return factory.createStringLiteral(name);
}
exports.safeName = safeName;
function wrapAnnotations(tsNode, node, blockComment = true) {
    const comment = (0, core_types_1.stringifyAnnotations)(node, { formatWhitespace: blockComment })
        .trim();
    if (!comment)
        return tsNode;
    if (blockComment)
        return ts.addSyntheticLeadingComment(tsNode, ts.SyntaxKind.MultiLineCommentTrivia, comment.includes("\n")
            // A multi-line comment need a last extra line
            ? `${comment}\n `
            // A single-line comment need an initial star to make to two
            // stars, and therefore a JSDoc comment.
            : `* ${comment} `, true);
    return comment.split("\n")
        .reduce((node, line) => ts.addSyntheticLeadingComment(node, ts.SyntaxKind.SingleLineCommentTrivia, ` ${line}`, true), tsNode);
}
exports.wrapAnnotations = wrapAnnotations;
function makeGenericComment(text, bodyOnly = false) {
    const lines = Array.isArray(text) ? text : text.trim().split("\n");
    const enwrap = (comment) => bodyOnly ? comment : `/*${comment}*/`;
    return lines.length === 1 && lines[0] === ''
        ? undefined
        : enwrap(`*\n${starBefore(lines)}\n `);
}
exports.makeGenericComment = makeGenericComment;
function starBefore(lines) {
    return lines.map(line => ` * ${line}`).join("\n");
}
function generateCode(node) {
    const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
    const resultFile = ts.createSourceFile("output.ts", "", ts.ScriptTarget.ES2017, false, // setParentNodes
    ts.ScriptKind.TS);
    const s = printer.printNode(ts.EmitHint.Unspecified, node, resultFile);
    return s;
}
exports.generateCode = generateCode;
function tsStripOptionalType(node) {
    return ts.isOptionalTypeNode(node) ? node.type : node;
}
exports.tsStripOptionalType = tsStripOptionalType;
function toLocation(node) {
    return {
        start: node.pos,
        ...(node == null ? {} : { end: node.end }),
    };
}
exports.toLocation = toLocation;
function isExportedDeclaration(node) {
    var _a;
    return !!((_a = node.modifiers) === null || _a === void 0 ? void 0 : _a.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword));
}
exports.isExportedDeclaration = isExportedDeclaration;
function createCodeHeader({ filename, sourceFilename, userPackage, userPackageUrl, noDisableLintHeader = false, noDescriptiveHeader = false, createdByPackage, createdByUrl, }) {
    if (noDisableLintHeader && noDescriptiveHeader)
        return '';
    const lintHeader = "/* tslint:disable */\n/* eslint-disable */";
    const descriptiveHeader = () => {
        const theFile = !filename ? 'This file' : `The file ${filename}`;
        const source = !sourceFilename ? '' : ` from ${sourceFilename}`;
        const onbehalf = userPackage ? ` on behalf of ${userPackage}` : '';
        const link = userPackageUrl ? ` - {@link ${userPackageUrl}}` : '';
        return makeGenericComment(([
            `${theFile} is generated${source} by ` +
                `${createdByPackage}${onbehalf}, ` +
                'DO NOT EDIT.',
            "For more information, see:",
            ` - {@link ${createdByUrl}}`,
            ...(link ? [link] : []),
        ]));
    };
    return [
        noDisableLintHeader ? '' : lintHeader,
        noDescriptiveHeader ? '' : descriptiveHeader(),
    ].join("\n") + "\n\n";
}
exports.createCodeHeader = createCodeHeader;
