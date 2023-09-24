"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertSingleCoreTypeToTypeScriptAst = exports.convertCoreTypesToTypeScript = void 0;
const core_types_1 = require("core-types");
const ts = require("typescript");
const ts_helpers_1 = require("./ts-helpers");
const { factory } = ts;
const createdByPackage = 'core-types-ts';
const createdByUrl = 'https://github.com/grantila/core-types-ts';
function throwUnsupported(msg, node, meta) {
    throw new core_types_1.UnsupportedError(msg, { loc: node.loc, ...meta });
}
function convertCoreTypesToTypeScript(doc, opts = {}) {
    const { version, types } = doc;
    if (version !== 1)
        throw new core_types_1.UnsupportedError(`core-types version ${version} not supported`);
    const convertedTypes = [];
    const sourceCode = types
        .map(node => {
        const { name } = node;
        const tsNode = convertSingleCoreTypeToTypeScriptAst(node, opts);
        convertedTypes.push(name);
        return tsNode;
    })
        .map(tsNode => (0, ts_helpers_1.generateCode)(tsNode))
        .join("\n\n");
    const header = (0, ts_helpers_1.createCodeHeader)({
        ...opts,
        createdByPackage,
        createdByUrl,
    });
    return {
        data: header +
            sourceCode +
            (sourceCode.endsWith("\n") ? "" : "\n"),
        convertedTypes,
        notConvertedTypes: [],
    };
}
exports.convertCoreTypesToTypeScript = convertCoreTypesToTypeScript;
function convertSingleCoreTypeToTypeScriptAst(node, opts = {}) {
    const { useUnknown = false, declaration = false, } = opts;
    const ctx = {
        useUnknown,
    };
    const { name } = node;
    const ret = tsType(ctx, node);
    const doExport = (tsNode) => (0, ts_helpers_1.wrapAnnotations)(tsNode, node);
    const typeDeclaration = ret.type === 'flow-type'
        ? declareType(declaration, name, ret.node)
        : declareInterface(declaration, name, ret.properties);
    return doExport(typeDeclaration);
}
exports.convertSingleCoreTypeToTypeScriptAst = convertSingleCoreTypeToTypeScriptAst;
function createExportModifier(declaration) {
    return factory.createModifiersFromModifierFlags(declaration
        ? ts.ModifierFlags.Export | ts.ModifierFlags.Ambient
        : ts.ModifierFlags.Export);
}
function declareType(declaration, name, node) {
    return factory.createTypeAliasDeclaration(undefined, // decorators
    createExportModifier(declaration), // modifiers
    factory.createIdentifier(name), undefined, // type parameters
    node);
}
function declareInterface(declaration, name, nodes) {
    return factory.createInterfaceDeclaration(undefined, // decorators
    createExportModifier(declaration), // modifiers
    factory.createIdentifier(name), undefined, // type parameters
    undefined, // heritage
    nodes);
}
function tsTypeUnion(ctx, node) {
    return factory.createUnionTypeNode(node.or.map(elem => (0, ts_helpers_1.wrapAnnotations)(tsTypeAndOrSchema(ctx, elem), elem)));
}
function tsTypeIntersection(ctx, node) {
    return factory.createIntersectionTypeNode(node.and.map(elem => (0, ts_helpers_1.wrapAnnotations)(tsTypeAndOrSchema(ctx, elem), elem)));
}
function tsTypeAndOrSchema(ctx, node) {
    if (node.type === 'and' || node.type === 'or')
        return tsTypeAndOr(ctx, node);
    else
        return tsType(ctx, node).node;
}
function tsTypeAndOr(ctx, andOr) {
    if (andOr.type === 'and')
        return tsTypeIntersection(ctx, andOr);
    else
        return tsTypeUnion(ctx, andOr);
}
function tsAny(ctx) {
    return ctx.useUnknown
        ? (0, ts_helpers_1.tsUnknownTypeAnnotation)()
        : factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword);
}
function tsType(ctx, node) {
    if (node.type === 'and' || node.type === 'or')
        return { type: 'flow-type', node: tsTypeAndOr(ctx, node) };
    if (node.type === 'null')
        return { type: 'flow-type', node: tsPrimitiveType(node) };
    const { const: _const, enum: _enum } = node;
    if (_const)
        return {
            type: 'flow-type',
            node: tsConstType(ctx, node, _const),
        };
    else if (_enum)
        return {
            type: 'flow-type',
            node: factory.createUnionTypeNode(_enum
                .map(elem => tsConstType(ctx, node, elem)))
        };
    if ((0, core_types_1.isPrimitiveType)(node))
        return { type: 'flow-type', node: tsPrimitiveType(node) };
    if (node.type === 'any')
        return {
            type: 'flow-type',
            node: tsAny(ctx),
        };
    if (node.type === 'ref')
        return { type: 'flow-type', node: tsRefType(node) };
    if (node.type === 'object')
        return { type: 'object', ...tsObjectType(ctx, node) };
    if (node.type === 'array' || node.type === 'tuple')
        return { type: 'flow-type', node: tsArrayType(ctx, node) };
    throwUnsupported(`Type ${node.type} not supported`, node);
}
function tsNullType() {
    return factory.createLiteralTypeNode(factory.createToken(ts.SyntaxKind.NullKeyword));
}
const primitiveTypeMap = {
    string: ts.SyntaxKind.StringKeyword,
    number: ts.SyntaxKind.NumberKeyword,
    integer: ts.SyntaxKind.NumberKeyword,
    boolean: ts.SyntaxKind.BooleanKeyword,
};
function tsPrimitiveType(node) {
    const { type } = node;
    if (type === "null")
        return tsNullType();
    else if (primitiveTypeMap[type])
        return factory.createKeywordTypeNode(primitiveTypeMap[type]);
    throwUnsupported(`Invalid primitive type: ${type}`, node);
}
function tsConstType(ctx, node, value) {
    return value === "null"
        ? tsNullType()
        : typeof value === "string"
            ? factory.createStringLiteral(value)
            : typeof value === "number"
                ? factory.createNumericLiteral(value)
                : typeof value === "boolean"
                    ? value ? factory.createTrue() : factory.createFalse()
                    : typeof value === "object"
                        ? Array.isArray(value)
                            ? tsArrayConstExpression(ctx, node, value)
                            : tsObjectType(ctx, value).node
                        : (() => {
                            throwUnsupported(`Invalid const value: "${value}"`, node, { blob: value });
                        })();
}
function tsArrayConstExpression(ctx, node, value) {
    return factory.createTupleTypeNode(value.map(elem => tsConstType(ctx, node, elem)));
}
function createAdditionalMembers(ctx, type) {
    if (type === true)
        return createAdditionalMembers(ctx, { type: 'any' });
    return factory.createIndexSignature(undefined, // decorators
    undefined, // modifiers
    [
        factory.createParameterDeclaration(undefined, // decorators
        undefined, // modifiers
        undefined, // dotdotdot token
        'key', undefined, // question token
        tsType(ctx, { type: 'string' }).node)
    ], tsType(ctx, type).node);
}
function tsObjectType(ctx, node) {
    const { properties, additionalProperties = false, } = node;
    const additionalEntry = additionalProperties === false ? []
        : [createAdditionalMembers(ctx, additionalProperties)];
    const createQuestionmark = (required) => required
        ? undefined
        : factory.createToken(ts.SyntaxKind.QuestionToken);
    const propertyNodes = [
        ...Object
            .keys(properties)
            .map(name => ({ name, ...properties[name] }))
            .map(({ name, node, required }) => (0, ts_helpers_1.wrapAnnotations)(factory.createPropertySignature(undefined, // modifiers
        (0, ts_helpers_1.safeName)(name), createQuestionmark(required), tsType(ctx, node).node), properties[name].node)),
        ...additionalEntry,
    ];
    const objectAsNode = factory.createTypeLiteralNode(propertyNodes);
    return { properties: propertyNodes, node: objectAsNode };
}
function tsSpreadType(ctx, node) {
    return factory.createArrayTypeNode(factory.createRestTypeNode(tsType(ctx, node).node));
}
function tsArrayType(ctx, node) {
    // TODO: Add support for minItems (making rest arguments optional)
    // TODO: Maybe add support for maxItems (turning an array into a tuple of
    //       some "good" max size)
    // Both are tricky for merged (anyOf, allOf, if-then-else) conditionals
    // if the types come from json schema...
    if (node.type === 'tuple')
        return factory.createTupleTypeNode([
            ...node.elementTypes.map(elem => tsType(ctx, elem).node),
            ...(!node.additionalItems
                ? []
                : node.additionalItems === true
                    ? [tsSpreadType(ctx, { type: 'any' })]
                    : [tsSpreadType(ctx, node.additionalItems)])
        ]);
    else
        return factory.createArrayTypeNode(tsType(ctx, node.elementType).node);
}
function tsRefType(node) {
    return factory.createTypeReferenceNode(node.ref);
}
