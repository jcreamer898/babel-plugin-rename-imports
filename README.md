# babel-plugin-rename-imports

> updates an import variable from a specific import

## Configuration

**Example:**

```json
{
    // source patch matches the "from" part
    "source": "@foo/path-utils",
    // current exported name
    "findName": "join",
    // new exported name to replace current
    "replaceName": "joinPath"
}
```

## Running

The codemod will change all matches files of the path passed in.

**NOTE: it is recommended you commit prior to running this to keep working
changes limited to just the codemod.**
