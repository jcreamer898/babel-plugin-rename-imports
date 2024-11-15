export default function (babel) {
    const { types: t } = babel;

    return {
        name: 'rename-imports', // not required
        visitor: {
            Program: {
                enter(path, { opts }) {
                    const { source, findName, replaceName } = opts;

                    if (!source || !findName || !replaceName) {
                        throw new Error(
                            'Error: babel-plugin-rename-imports - missing options',
                        );
                    }
                },
            },
            ImportDeclaration(path, { opts }) {
                const { source, findName, replaceName } = opts;
                // access node directly
                if (path.node.source.value === source) {
                    // get give us the path wrapper of the node
                    for (const specifierPath of path.get('specifiers')) {
                        // matches for `import {thing}` or `import {thing as something}`
                        // specifierPath.node.type === "ImportSpecifier"
                        if (
                            t.isImportSpecifier(specifierPath) &&
                            specifierPath.node.imported.name === findName
                        ) {
                            // we could use this, but it would leave the old local name which is ugly
                            // specifierPath.scope.rename(exportOrginialName, exportNewName);
                            specifierPath.scope.rename(
                                specifierPath.node.local.name,
                                replaceName,
                            );
                            specifierPath.node.imported.name = replaceName;
                        }
                        // matches `import * as things`
                        if (t.isImportNamespaceSpecifier(specifierPath)) {
                            // we need to look into the larger scope and find the binding
                            // the binding is what connects the identifier to its references
                            const specifierBinding =
                                specifierPath.scope.bindings[
                                    specifierPath.node.local.name
                                ];
                            // from the binding we can pull all references
                            for (const refPath of specifierBinding.referencePaths) {
                                // matches `things.foo`
                                // also verify the property on the express is our find value
                                if (
                                    t.isMemberExpression(refPath.container) &&
                                    refPath.container.property.name === findName
                                ) {
                                    // update the node directly
                                    refPath.container.property.name = replaceName;
                                }
                            }
                        }
                    }
                }
            },
        },
    };
}
