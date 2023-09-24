"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decorateNode = void 0;
const ts = require("typescript");
const core_types_1 = require("core-types");
function extractDescription(text) {
    if (!text)
        return {};
    return { description: text };
}
function extractTitle(node) {
    const hasParentWhileUnnamed = (node) => node.parent &&
        (ts.isArrayTypeNode(node.parent)
            ||
                ts.isTupleTypeNode(node.parent)
            ||
                ts.isOptionalTypeNode(node.parent)
            ||
                ts.isRestTypeNode(node.parent)
            ||
                ts.isUnionTypeNode(node.parent));
    const recurseTypeChain = (node, child) => {
        if (!node)
            return [];
        else if (ts.isArrayTypeNode(node)
            &&
                node.parent
            &&
                ts.isRestTypeNode(node.parent))
            return recurseTypeChain(node.parent, node);
        else if (ts.isRestTypeNode(node))
            return recurseTypeChain(node.parent, node);
        else if (ts.isOptionalTypeNode(node))
            return recurseTypeChain(node.parent, node);
        else if (ts.isUnionTypeNode(node))
            return recurseTypeChain(node.parent, node);
        else if (ts.isParenthesizedTypeNode(node))
            return recurseTypeChain(node.parent, node);
        else if (ts.isTypeLiteralNode(node))
            return recurseTypeChain(node.parent, node);
        else if (ts.isArrayTypeNode(node))
            return ['[]', ...recurseTypeChain(node.parent, node)];
        else if (ts.isTupleTypeNode(node)) {
            const pos = node.elements.indexOf(child);
            return [
                ...(pos === -1 ? [] : [`${pos}`]),
                ...recurseTypeChain(node.parent, node)
            ];
        }
        const isTypeDeclaration = ts.isTypeAliasDeclaration(node) ||
            ts.isInterfaceDeclaration(node) ||
            ts.isPropertySignature(node);
        const name = isTypeDeclaration ? node.name.getText() : '';
        return name
            ? [name, ...recurseTypeChain(node.parent, node)]
            : hasParentWhileUnnamed(node)
                ? recurseTypeChain(node.parent, node)
                : [];
    };
    const typeNames = recurseTypeChain(node, undefined);
    if (!typeNames.length)
        return {};
    return { title: typeNames.reverse().join('.') };
}
function stringifyDoc(text) {
    if (typeof text === 'undefined' || typeof text === 'string')
        return text;
    return text.map(({ text }) => text).join(' ');
}
function extractTags(tags) {
    const descriptions = [];
    const examples = [];
    const _default = [];
    const see = [];
    const extractSee = (tag) => {
        var _a, _b, _c;
        return (_c = (tag.name ? (((_a = tag.name) === null || _a === void 0 ? void 0 : _a.getText()) + ' ') : '') +
            ((_b = stringifyDoc(tag.comment)) === null || _b === void 0 ? void 0 : _b.trim())) !== null && _c !== void 0 ? _c : '';
    };
    tags.forEach(tag => {
        var _a, _b, _c, _d, _e, _f;
        if (!tag.comment)
            return;
        if (tag.tagName.text === 'example')
            examples.push((_b = (_a = stringifyDoc(tag.comment)) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : '');
        else if (tag.tagName.text === 'default')
            _default.push((_d = (_c = stringifyDoc(tag.comment)) === null || _c === void 0 ? void 0 : _c.trim()) !== null && _d !== void 0 ? _d : '');
        else if (tag.tagName.text === 'see')
            see.push(extractSee(tag));
        else {
            const text = (_f = (_e = stringifyDoc(tag.comment)) === null || _e === void 0 ? void 0 : _e.trim()) !== null && _f !== void 0 ? _f : '';
            descriptions.push(`@${tag.tagName.text} ${text}`);
        }
    });
    return {
        ...(descriptions.length === 0 ? {} :
            { description: descriptions.join("\n") }),
        ...(examples.length === 0 ? {} : { examples }),
        ...(_default.length === 0 ? {} :
            { default: _default.join("\n") }),
        ...(see.length === 0 ? {} : { see }),
    };
}
function decorateNode(node) {
    var _a;
    const { jsDoc } = node;
    const titleAnnotation = extractTitle(node);
    if (jsDoc && jsDoc.length) {
        // TODO: Analyze when this can be larger than 1 and why
        const first = jsDoc[0];
        return (0, core_types_1.mergeAnnotations)([
            extractDescription(stringifyDoc(first.comment)),
            titleAnnotation,
            extractTags((_a = first.tags) !== null && _a !== void 0 ? _a : []),
        ]);
    }
    return titleAnnotation;
}
exports.decorateNode = decorateNode;
