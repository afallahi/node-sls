"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertTypeScriptToCoreTypes = void 0;
const ts = require("typescript");
const core_types_1 = require("core-types");
const ts_helpers_1 = require("./ts-helpers");
const ts_annotations_1 = require("./ts-annotations");
const anyType = { type: 'any' };
const defaultWarn = (sourceCode) => (msg, meta) => {
    var _a, _b, _c;
    const extra = ((_a = meta === null || meta === void 0 ? void 0 : meta.loc) === null || _a === void 0 ? void 0 : _a.start)
        ? [
            meta.loc,
            sourceCode.slice((0, core_types_1.getPositionOffset)((_b = meta.loc) === null || _b === void 0 ? void 0 : _b.start), (0, core_types_1.getPositionOffset)((_c = meta.loc) === null || _c === void 0 ? void 0 : _c.end))
        ]
        : [];
    console.warn(msg, ...extra);
};
function convertTypeScriptToCoreTypes(sourceCode, options) {
    const { warn = defaultWarn(sourceCode), nonExported = 'include-if-referenced', unsupported = 'ignore', } = options !== null && options !== void 0 ? options : {};
    const sourceFile = ts.createSourceFile("filename.ts", sourceCode, ts.ScriptTarget.Latest, 
    /*setParentNodes */ true);
    const declarations = sourceFile.statements
        .filter((statement) => ts.isTypeAliasDeclaration(statement)
        ||
            ts.isInterfaceDeclaration(statement));
    const ctx = {
        options: {
            warn,
            nonExported,
            unsupported,
        },
        typeMap: new Map(declarations.map(declaration => [
            declaration.name.getText(),
            {
                declaration,
                exported: (0, ts_helpers_1.isExportedDeclaration)(declaration),
            },
        ])),
        includeExtra: new Set(),
        cyclicState: new Set(),
        getUnsupportedError(message, node) {
            const loc = (0, core_types_1.locationToLineColumn)(sourceCode, (0, ts_helpers_1.toLocation)(node));
            return new core_types_1.UnsupportedError(message, {
                blob: node,
                loc,
                source: sourceCode,
            });
        },
        handleError(err) {
            if (ctx.options.unsupported === 'warn')
                ctx.options.warn(err.message, err);
            else if (ctx.options.unsupported === 'error')
                throw err;
            return undefined;
        }
    };
    if (ctx.options.nonExported === 'fail')
        declarations
            .filter(declaration => !(0, ts_helpers_1.isExportedDeclaration)(declaration))
            .forEach(declaration => {
            throw new core_types_1.MalformedTypeError(`Found non-exported type when 'nonExported' is 'fail'`, {
                blob: declaration,
                path: [declaration.name.getText()],
                loc: (0, ts_helpers_1.toLocation)(declaration),
            });
        });
    const notConvertedTypes = new Set();
    const convertTopLevel = (statement) => {
        ctx.cyclicState = new Set();
        const type = fromTsTopLevelNode(statement, ctx);
        if (!type)
            notConvertedTypes.add(statement.name.getText());
        return type;
    };
    const types = declarations
        .filter(declaration => ctx.options.nonExported === 'include'
        ||
            (0, ts_helpers_1.isExportedDeclaration)(declaration))
        .map(statement => convertTopLevel(statement))
        .filter((v) => !!v);
    types.push(...[...ctx.includeExtra.values()]
        .map(name => {
        const statement = ctx.typeMap.get(name);
        if (!statement)
            throw new Error("Internal error on exporting non-exported type");
        return convertTopLevel(statement.declaration);
    })
        .filter((v) => !!v));
    return {
        data: { version: 1, types },
        convertedTypes: types.map(({ name }) => name),
        notConvertedTypes: [...notConvertedTypes],
    };
}
exports.convertTypeScriptToCoreTypes = convertTypeScriptToCoreTypes;
function isGenericType(node) {
    var _a, _b;
    return !!(((_a = node.typeArguments) === null || _a === void 0 ? void 0 : _a.length)
        ||
            ((_b = node.typeParameters) === null || _b === void 0 ? void 0 : _b.length));
}
function handleGeneric(node, ctx) {
    return ctx.handleError(ctx.getUnsupportedError(`Generic types are not supported`, node));
}
function fromTsTopLevelNode(node, ctx) {
    var _a;
    if (isGenericType(node))
        return handleGeneric(node, ctx);
    if (ts.isTypeAliasDeclaration(node)) {
        return {
            name: node.name.getText(),
            ...(0, ts_annotations_1.decorateNode)(node),
            ...((_a = fromTsTypeNode(node.type, ctx)) !== null && _a !== void 0 ? _a : anyType),
        };
    }
    else if (ts.isInterfaceDeclaration(node)) {
        return {
            name: node.name.getText(),
            type: 'object',
            ...fromTsObjectMembers(node, ctx),
            ...(0, ts_annotations_1.decorateNode)(node),
        };
    }
    else
        throw new Error("Internal error");
}
function isOptionalProperty(node) {
    var _a;
    return ((_a = node.questionToken) === null || _a === void 0 ? void 0 : _a.kind) === ts.SyntaxKind.QuestionToken;
}
function fromTsObjectMembers(node, ctx) {
    const ret = {
        properties: {},
        additionalProperties: false,
    };
    node.members.forEach(member => {
        var _a, _b, _c;
        if (ts.isPropertySignature(member) && member.type) {
            const name = member.name.getText();
            ret.properties[name] = {
                required: !isOptionalProperty(member),
                node: {
                    ...((_a = fromTsTypeNode(member.type, ctx)) !== null && _a !== void 0 ? _a : anyType),
                    ...(0, ts_annotations_1.decorateNode)(member),
                },
            };
        }
        else if (ts.isIndexSignatureDeclaration(member)) {
            const param = member.parameters[0];
            if (((_b = param.type) === null || _b === void 0 ? void 0 : _b.kind) !== ts.SyntaxKind.StringKeyword) {
                ctx.options.warn(`Will not convert non-string index signature`, {
                    blob: param,
                    loc: (0, ts_helpers_1.toLocation)(param),
                });
                return;
            }
            ret.additionalProperties =
                (_c = fromTsTypeNode(member.type, ctx)) !== null && _c !== void 0 ? _c : anyType;
        }
    });
    return ret;
}
function fromTsTypeNode(node, ctx) {
    var _a, _b, _c, _d;
    if (ts.isUnionTypeNode(node))
        return {
            type: 'or',
            or: node.types
                .map(child => fromTsTypeNode(child, ctx))
                .filter(core_types_1.isNonNullable),
            ...(0, ts_annotations_1.decorateNode)(node),
        };
    else if (ts.isIntersectionTypeNode(node))
        return {
            type: 'and',
            and: node.types
                .map(child => fromTsTypeNode(child, ctx))
                .filter(core_types_1.isNonNullable),
            ...(0, ts_annotations_1.decorateNode)(node),
        };
    else if (ts.isParenthesizedTypeNode(node)) {
        const children = [...node.getChildren()];
        if (((_a = children[0]) === null || _a === void 0 ? void 0 : _a.kind) === ts.SyntaxKind.OpenParenToken)
            children.shift();
        if (((_b = children[children.length - 1]) === null || _b === void 0 ? void 0 : _b.kind) ===
            ts.SyntaxKind.CloseParenToken)
            children.pop();
        if (children.length !== 1 || !ts.isTypeNode(children[0]))
            return ctx.handleError(ctx.getUnsupportedError(`Parenthesis type not understood`, node));
        return fromTsTypeNode(children[0], ctx);
    }
    else if (node.kind === ts.SyntaxKind.AnyKeyword)
        return { type: 'any', ...(0, ts_annotations_1.decorateNode)(node) };
    else if (node.kind === ts.SyntaxKind.UnknownKeyword)
        return { type: 'any', ...(0, ts_annotations_1.decorateNode)(node) };
    else if (node.kind === ts.SyntaxKind.StringKeyword)
        return { type: 'string', ...(0, ts_annotations_1.decorateNode)(node) };
    else if (node.kind === ts.SyntaxKind.NumberKeyword)
        return { type: 'number', ...(0, ts_annotations_1.decorateNode)(node) };
    else if (node.kind === ts.SyntaxKind.BooleanKeyword)
        return { type: 'boolean', ...(0, ts_annotations_1.decorateNode)(node) };
    else if (node.kind === ts.SyntaxKind.ObjectKeyword)
        return {
            type: 'object',
            properties: {},
            additionalProperties: true,
            ...(0, ts_annotations_1.decorateNode)(node)
        };
    else if (ts.isArrayTypeNode(node))
        return {
            type: 'array',
            elementType: (_c = fromTsTypeNode(node.elementType, ctx)) !== null && _c !== void 0 ? _c : anyType,
            ...(0, ts_annotations_1.decorateNode)(node),
        };
    else if (ts.isTypeReferenceNode(node)) {
        if (node.typeName.kind === ts.SyntaxKind.QualifiedName)
            // TODO: Add option to allow (not fail) this by renaming
            return ctx.handleError(ctx.getUnsupportedError(`Qualified reference names not supported`, node));
        if (node.typeName.text === 'Array') {
            const typeArgs = node.typeArguments;
            return {
                type: 'array',
                elementType: typeArgs
                    ? (_d = fromTsTypeNode(typeArgs[0], ctx)) !== null && _d !== void 0 ? _d : anyType
                    : anyType,
                ...(0, ts_annotations_1.decorateNode)(node),
            };
        }
        if (isGenericType(node))
            return handleGeneric(node, ctx);
        const ref = node.typeName.text;
        // TODO: Handle (reconstruct) generics
        const typeInfo = ctx.typeMap.get(ref);
        if (typeInfo && !typeInfo.exported) {
            if (ctx.options.nonExported === 'include-if-referenced')
                ctx.includeExtra.add(ref);
            else if (ctx.options.nonExported === 'inline') {
                if (ctx.cyclicState.has(ref))
                    throw new core_types_1.MalformedTypeError(`Cyclic type found when trying to inline type ${ref}`, {
                        blob: node,
                        loc: (0, ts_helpers_1.toLocation)(node),
                    });
                ctx.cyclicState.add(ref);
                return fromTsTopLevelNode(typeInfo.declaration, ctx);
            }
        }
        return { type: 'ref', ref, ...(0, ts_annotations_1.decorateNode)(node) };
    }
    else if (ts.isTupleTypeNode(node))
        return {
            type: 'tuple',
            ...fromTsTuple(node, ctx),
            ...(0, ts_annotations_1.decorateNode)(node)
        };
    else if (ts.isLiteralTypeNode(node)) {
        if (ts.isNumericLiteral(node.literal))
            return {
                type: 'number',
                const: Number(node.literal.text),
                ...(0, ts_annotations_1.decorateNode)(node),
            };
        else if (ts.isStringLiteral(node.literal))
            return {
                type: 'string',
                const: node.literal.text,
                ...(0, ts_annotations_1.decorateNode)(node),
            };
        else if (node.literal.kind === ts.SyntaxKind.TrueKeyword)
            return {
                type: 'boolean',
                const: true,
                ...(0, ts_annotations_1.decorateNode)(node),
            };
        else if (node.literal.kind === ts.SyntaxKind.FalseKeyword)
            return {
                type: 'boolean',
                const: false,
                ...(0, ts_annotations_1.decorateNode)(node),
            };
        else if (node.literal.kind === ts.SyntaxKind.NullKeyword)
            return { type: 'null', ...(0, ts_annotations_1.decorateNode)(node) };
        else if (node.literal.kind === ts.SyntaxKind.PrefixUnaryExpression)
            return ctx.handleError(ctx.getUnsupportedError("Prefix unary expressions not supported", node.literal));
        return ctx.handleError(ctx.getUnsupportedError("Literal type not understood", node.literal));
    }
    else if (ts.isTypeLiteralNode(node)) {
        return {
            type: 'object',
            ...fromTsObjectMembers(node, ctx),
            ...(0, ts_annotations_1.decorateNode)(node),
        };
    }
    else {
        return ctx.handleError(ctx.getUnsupportedError(`Unimplemented type (kind=${node.kind})`, node));
    }
}
function fromTsTuple(node, ctx) {
    var _a;
    if (node.elements.length === 0)
        return { elementTypes: [], additionalItems: false, minItems: 0 };
    const hasRest = ts.isRestTypeNode(node.elements[node.elements.length - 1]);
    const [elements, rest] = hasRest
        ? [
            node.elements.slice(0, node.elements.length - 1),
            node.elements[node.elements.length - 1],
        ]
        : [[...node.elements], undefined];
    const elementTypes = elements
        .map(node => { var _a; return (_a = fromTsTypeNode((0, ts_helpers_1.tsStripOptionalType)(node), ctx)) !== null && _a !== void 0 ? _a : anyType; });
    const additionalItems = rest
        ? ((_a = fromTsTypeNode(rest.type.elementType, ctx)) !== null && _a !== void 0 ? _a : anyType)
        : false;
    const firstOptional = elements.findIndex(node => ts.isOptionalTypeNode(node));
    const minItems = firstOptional === -1 ? elements.length : firstOptional;
    return {
        elementTypes,
        ...(additionalItems && additionalItems.type === 'any'
            ? { additionalItems: true }
            : { additionalItems }),
        minItems,
    };
}
